import test from "node:test";
import assert from "node:assert/strict";
import { createWorker } from "../worker.js";

const ALLOWED_ORIGIN = "https://niuzipai-gif.github.io";
const ENV = {
  MINIMAX_API_KEY: "test-secret",
  ALLOWED_ORIGIN,
};

function post(body, { origin = ALLOWED_ORIGIN, headers = {} } = {}) {
  return new Request("https://proxy.example.test/api", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
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
                  matches: [{ id: "p-seven", reason: "名称和风格匹配" }],
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
          id: "p-seven",
          jp: "セブンスター",
          cn: "七星",
          flavor: "tobacco",
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
  assert.deepEqual(payload.matches, [{ id: "p-seven", reason: "名称和风格匹配" }]);
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
                content: '{"answer":"可能是七星。","matches":[{"id":"p-seven","reason":"包装文字可见"}],"sources":[]}',
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
      catalog: [{ id: "p-seven", jp: "セブンスター", cn: "七星" }],
    }),
    ENV,
  );

  assert.equal(response.status, 200);
  assert.equal(body.messages[1].content[1].type, "image_url");
  assert.equal(
    body.messages[1].content[1].image_url.url,
    "data:image/jpeg;base64,SGVsbG8=",
  );
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
