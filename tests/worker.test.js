import test from "node:test";
import assert from "node:assert/strict";
import { createWorker } from "../worker.js";
import { rawProducts } from "../data/products.js";
import { enrichProducts } from "../catalog.js";

const ALLOWED_ORIGIN = "https://niuzipai-gif.github.io";
const canonicalCatalog = enrichProducts(rawProducts);
const allowedProduct = canonicalCatalog.find((item) => item.purchaseAllowed);
const restrictedProduct = canonicalCatalog.find((item) => !item.purchaseAllowed);
const ENV = {
  MINIMAX_API_KEY: "test-secret",
  ALLOWED_ORIGIN,
  AI_RATE_LIMITER: {
    limit: async () => ({ success: true }),
  },
};

function post(body, { origin = ALLOWED_ORIGIN, headers = {} } = {}) {
  return new Request("https://proxy.example.test/api", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "cf-connecting-ip": "203.0.113.7",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("proxy rejects untrusted origins before calling MiniMax", async () => {
  let called = false;
  const worker = createWorker({
    fetchImpl: async () => {
      called = true;
      return new Response("{}");
    },
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "七星" }, { origin: "https://evil.example" }),
    ENV,
  );

  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.equal(called, false);
});

test("proxy exposes a bounded CORS preflight only to the allowed origin", async () => {
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });
  const response = await worker.fetch(
    new Request("https://proxy.example.test/api", {
      method: "OPTIONS",
      headers: { origin: ALLOWED_ORIGIN },
    }),
    ENV,
  );

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), ALLOWED_ORIGIN);
  assert.match(response.headers.get("access-control-allow-methods"), /POST/);
});

test("proxy requires a server-side key and an allow-listed mode", async () => {
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });

  const missingKey = await worker.fetch(
    post({ mode: "recommend", query: "七星" }),
    { ALLOWED_ORIGIN },
  );
  assert.equal(missingKey.status, 503);

  const unknownMode = await worker.fetch(
    post({ mode: "delete-everything", query: "七星" }),
    ENV,
  );
  assert.equal(unknownMode.status, 400);
});

test("proxy fails closed without rate limiting and returns 429 when exhausted", async () => {
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });

  const missingLimiter = await worker.fetch(
    post({ mode: "recommend", query: "七星" }),
    { MINIMAX_API_KEY: "test-secret", ALLOWED_ORIGIN },
  );
  assert.equal(missingLimiter.status, 503);

  const limited = await worker.fetch(
    post({ mode: "recommend", query: "七星" }),
    {
      ...ENV,
      AI_RATE_LIMITER: {
        limit: async () => ({ success: false }),
      },
    },
  );
  assert.equal(limited.status, 429);
});

test("proxy rejects the Japanese purchase mode instead of trusting arbitrary client text", async () => {
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });
  const response = await worker.fetch(
    post({ mode: "japanese", query: `${restrictedProduct.jp} を買いたい` }),
    ENV,
  );
  assert.equal(response.status, 400);
});

test("proxy rejects oversized declared bodies", async () => {
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });
  const response = await worker.fetch(
    post(
      { mode: "recommend", query: "七星" },
      { headers: { "content-length": String(6 * 1024 * 1024) } },
    ),
    ENV,
  );

  assert.equal(response.status, 413);
});

test("recommendations use MiniMax-M3 chat completions and normalize JSON", async () => {
  let upstream;
  const worker = createWorker({
    fetchImpl: async (url, init) => {
      upstream = { url, init, body: JSON.parse(init.body) };
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "更接近经典烟草感。",
                  matches: [
                    { id: allowedProduct.id, reason: "名称和风格匹配" },
                    { id: restrictedProduct.id, reason: "不应返回" },
                  ],
                  sources: [],
                  ignored: "not returned",
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });

  const response = await worker.fetch(
    post({
      mode: "recommend",
      query: "经典浓一点",
      catalog: [
        {
          id: restrictedProduct.id,
          jp: restrictedProduct.jp,
          cn: restrictedProduct.cn,
          type: "cigarette",
          purchaseAllowed: true,
        },
      ],
    }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(upstream.url, "https://api.minimaxi.com/v1/chat/completions");
  assert.equal(upstream.init.headers.Authorization, "Bearer test-secret");
  assert.equal(upstream.body.model, "MiniMax-M3");
  assert.deepEqual(upstream.body.thinking, { type: "disabled" });
  assert.equal(payload.answer, "更接近经典烟草感。");
  assert.deepEqual(payload.matches, [
    { id: allowedProduct.id, reason: "名称和风格匹配" },
  ]);
  assert.equal(upstream.body.messages[1].content.includes(restrictedProduct.jp), false);
  assert.equal(upstream.body.messages[1].content.includes(allowedProduct.jp), true);
  assert.equal(JSON.stringify(payload).includes("test-secret"), false);
});

test("vision mode sends only supported image data to chat completions", async () => {
  let body;
  const worker = createWorker({
    fetchImpl: async (_url, init) => {
      body = JSON.parse(init.body);
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "可能是七星。",
                  matches: [
                    { id: allowedProduct.id, reason: "包装文字可见" },
                    { id: restrictedProduct.id, reason: "不应返回" },
                  ],
                  sources: [],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });

  const response = await worker.fetch(
    post({
      mode: "vision",
      query: "",
      image: "data:image/jpeg;base64,SGVsbG8=",
      catalog: [{ id: restrictedProduct.id, purchaseAllowed: true }],
    }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.messages[1].content[1].type, "image_url");
  assert.equal(
    body.messages[1].content[1].image_url.url,
    "data:image/jpeg;base64,SGVsbG8=",
  );
  assert.equal(body.messages[1].content[0].text.includes(restrictedProduct.jp), false);
  assert.deepEqual(payload.matches, [
    { id: allowedProduct.id, reason: "包装文字可见" },
  ]);
});

test("online search uses MiniMax web_search server tool and returns source leads", async () => {
  let upstream;
  const worker = createWorker({
    fetchImpl: async (url, init) => {
      upstream = { url, init, body: JSON.parse(init.body) };
      return new Response(
        JSON.stringify({
          content: [
            { type: "text", text: "我会查询当前资料。" },
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "メーカー商品情報",
                  url: "https://www.jti.co.jp/tobacco/products/example/",
                  content: "商品信息摘要",
                },
              ],
            },
            { type: "text", text: "找到了一个可能相关的厂商页面，请核对包装与价格日期。" },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });

  const response = await worker.fetch(
    post({ mode: "search", query: "蓝色七星 日本 香烟" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(upstream.url, "https://api.minimaxi.com/anthropic/v1/messages");
  assert.equal(upstream.init.headers["x-api-key"], "test-secret");
  assert.equal(upstream.body.tools[0].type, "web_search_20250305");
  assert.equal(
    payload.answer,
    "找到了一个可能相关的厂商页面，请核对包装与价格日期。",
  );
  assert.deepEqual(payload.sources, [
    {
      title: "メーカー商品情報",
      url: "https://www.jti.co.jp/tobacco/products/example/",
      snippet: "商品信息摘要",
    },
  ]);
});

test("online search blocks restricted electronic-product queries before calling MiniMax", async () => {
  let called = false;
  const worker = createWorker({
    fetchImpl: async () => {
      called = true;
      return new Response("{}");
    },
  });

  for (const query of [
    restrictedProduct.jp,
    restrictedProduct.cn,
    "日本哪里可以买 RELX 电子烟弹",
    "ELFBAR vape shop",
  ]) {
    const response = await worker.fetch(post({ mode: "search", query }), ENV);
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /法规|受限/);
  }
  assert.equal(called, false);
});

test("upstream failures become generic errors without credential leakage", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { message: "key test-secret rejected" } }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "七星", catalog: [] }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(JSON.stringify(payload).includes("test-secret"), false);
  assert.match(payload.error, /AI 服务/);
});
