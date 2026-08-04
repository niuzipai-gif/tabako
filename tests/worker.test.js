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
  assert.match(response.headers.get("access-control-allow-methods"), /GET/);
});

test("proxy health check is no-cost and does not leak the server-side key", async () => {
  let called = false;
  const worker = createWorker({
    fetchImpl: async () => {
      called = true;
      return new Response("{}");
    },
  });

  const response = await worker.fetch(
    new Request("https://proxy.example.test/health", {
      method: "GET",
      headers: { origin: ALLOWED_ORIGIN },
    }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), ALLOWED_ORIGIN);
  assert.equal(payload.ok, true);
  assert.equal(payload.service, "tabako-ai");
  assert.equal(payload.keyConfigured, true);
  assert.equal(JSON.stringify(payload).includes(ENV.MINIMAX_API_KEY), false);
  assert.equal(called, false);
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

test("proxy treats rate limiting as optional and returns 429 only when exhausted", async () => {
  let called = false;
  const worker = createWorker({ fetchImpl: async () => new Response("{}") });

  const missingLimiter = await worker.fetch(
    post({ mode: "recommend", query: "七星" }),
    { MINIMAX_API_KEY: "test-secret", ALLOWED_ORIGIN },
  );
  assert.equal(missingLimiter.status, 502);

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

  const callable = createWorker({
    fetchImpl: async () => {
      called = true;
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ answer: "ok", matches: [] }) } }],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });
  const withoutLimiter = await callable.fetch(
    post({ mode: "recommend", query: "七星" }),
    { MINIMAX_API_KEY: "test-secret", ALLOWED_ORIGIN },
  );
  assert.equal(withoutLimiter.status, 200);
  assert.equal(called, true);
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

test("recommendations constrain glo Hilo queries to the Hilo/virto platform", async () => {
  const hiloDevice = canonicalCatalog.find((item) => item.jp === "glo Hilo Plus");
  const virto = canonicalCatalog.find((item) => item.jp === "ヴァルト・ダーク・タバコ");
  const hyperDevice = canonicalCatalog.find((item) => item.jp === "glo HYPER pro+");
  const hyperStick = canonicalCatalog.find((item) => item.jp === "ネオ・ブリリアント・ベリー・hyper用");
  assert.ok(hiloDevice);
  assert.ok(virto);
  assert.ok(hyperDevice);
  assert.ok(hyperStick);

  let upstreamBody;
  const worker = createWorker({
    fetchImpl: async (_url, init) => {
      upstreamBody = JSON.parse(init.body);
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "Hilo 只应返回 virto 平台。",
                  matches: [
                    { id: hyperStick.id, reason: "不应返回 HYPER 烟弹" },
                    { id: virto.id, reason: "Hilo 对应 virto" },
                  ],
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
    post({ mode: "recommend", query: "glo Hilo Plus" }),
    ENV,
  );
  const payload = await response.json();
  const promptText = upstreamBody.messages[1].content;

  assert.equal(response.status, 200);
  assert.match(promptText, /glo Hilo Plus/);
  assert.match(promptText, /ヴァルト・ダーク・タバコ/);
  assert.doesNotMatch(promptText, /glo HYPER pro\+/);
  assert.doesNotMatch(promptText, /ネオ・ブリリアント・ベリー・hyper用/);
  assert.deepEqual(payload.matches.map((match) => match.id), [virto.id]);
  assert.match(payload.matches[0].reason, /ヴァルト・ダーク・タバコ/);
  assert.match(payload.matches[0].reason, /glo Hilo/);
  assert.doesNotMatch(payload.matches[0].reason, /HYPER pro\+/);
});

test("recommendations rewrite Cigaronne reasons from catalog facts", async () => {
  const royalMenthol = canonicalCatalog.find(
    (item) => item.jp === "シガローネ・ロイヤルスリム・メンソール",
  );
  assert.ok(royalMenthol);

  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "候选。",
                  matches: [
                    { id: royalMenthol.id, reason: "错误地写成 Legend" },
                  ],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "cigaronee royal black" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload.matches.map((match) => match.id), [royalMenthol.id]);
  assert.match(payload.matches[0].reason, /シガローネ・ロイヤルスリム・メンソール/);
  assert.doesNotMatch(payload.matches[0].reason, /Legend/);
});

test("recommendations do not call MiniMax or hallucinate matches when the catalog has no evidence", async () => {
  let called = false;
  const worker = createWorker({
    fetchImpl: async () => {
      called = true;
      return new Response("{}");
    },
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "Neutrino Invest" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(called, false);
  assert.deepEqual(payload.matches, []);
  assert.match(payload.answer, /本地目录没有足够接近的候选|联网补充/);
});

test("recommendations promote exact verified SKUs when MiniMax returns a generic alias", async () => {
  const generic = canonicalCatalog.find((item) => item.jp === "Ploom X キャメル スムース");
  const exact = canonicalCatalog.find((item) => item.jp === "キャメル・スムース・プルーム用");
  assert.ok(generic);
  assert.ok(exact);

  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "柔和口味候选。",
                  matches: [{ id: generic.id, reason: "名称匹配 Ploom X Camel Smooth" }],
                  sources: [],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "Ploom X キャメル スムース" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(
    payload.matches.map((match) => match.id).slice(0, 2),
    [exact.id, generic.id],
  );
  assert.match(payload.matches[0].reason, /更准确的核验 SKU/);
});

test("recommendations discard model-provided sources before UI fallback", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  answer: "没有目录候选。",
                  matches: [],
                  sources: [
                    {
                      title: "Unrelated source",
                      url: "https://example.com/noisy",
                      snippet: "Model-provided source should not pass through recommend mode.",
                    },
                  ],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(post({ mode: "recommend", query: "蓝色七星" }), ENV);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload.sources, []);
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
                  title: "セブンスター ブルー系パッケージ メーカー商品情報",
                  url: "https://www.jti.co.jp/tobacco/products/example/",
                  content: "蓝色七星 / Seven Stars の商品信息摘要。たばこ包装の核对线索。",
                },
                {
                  type: "web_search_result",
                  title: "蓝色七星 日本 香烟 视频",
                  url: "https://www.bilibili.com/video/BV1dV4y1t76h/",
                  content: "蓝色七星 日本 香烟 たばこ 包装。",
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
      title: "セブンスター ブルー系パッケージ メーカー商品情報",
      url: "https://www.jti.co.jp/tobacco/products/example/",
      snippet: "蓝色七星 / Seven Stars の商品信息摘要。たばこ包装の核对线索。",
    },
  ]);
});

test("online search prioritizes Japanese official sources for exact TEREA queries", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          content: [
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "TEREA Bright Menthol overseas carton listing",
                  url: "https://world-tobacco.example/terea-bright-menthol-carton",
                  content: "IQOS TEREA Bright Menthol tobacco carton information for an overseas market.",
                },
                {
                  type: "web_search_result",
                  title: "テリア ブライト メンソール | IQOS 日本公式",
                  url: "https://jp.iqos.com/products/terea-bright-menthol",
                  content: "テリア ブライト メンソール TEREA Bright Menthol の日本公式たばこ製品情報。",
                },
                {
                  type: "web_search_result",
                  title: "TEREA Bright Menthol video",
                  url: "https://www.bilibili.com/video/BV1dV4y1t76h/",
                  content: "TEREA Bright Menthol tobacco package video.",
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "search", query: "IQOS TEREA Bright Menthol" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.sources[0].url, "https://jp.iqos.com/products/terea-bright-menthol");
  assert.deepEqual(
    payload.sources.map((source) => source.url),
    [
      "https://jp.iqos.com/products/terea-bright-menthol",
      "https://world-tobacco.example/terea-bright-menthol-carton",
    ],
  );
});

test("online search injects local exact catalog source when upstream misses Japanese official source", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          content: [
            { type: "text", text: "找到了一个跨市场页面，请核对。" },
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "TEREA Bright Menthol overseas carton listing",
                  url: "https://world-tobacco.example/terea-bright-menthol-carton",
                  content: "IQOS TEREA Bright Menthol tobacco carton information for an overseas market.",
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "search", query: "IQOS TEREA Bright Menthol" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(
    payload.sources.map((source) => source.url),
    [
      "https://jp.iqos.com/products/terea-bright-menthol",
      "https://world-tobacco.example/terea-bright-menthol-carton",
    ],
  );
  assert.match(payload.sources[0].title, /テリア ブライト メンソール|TEREA Bright Menthol/);
  assert.match(payload.sources[0].snippet, /本地目录记录的官方\/产品来源/);
  assert.match(payload.sources[0].snippet, /不代表实时库存/);
});

test("online search answer acknowledges injected exact catalog sources", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          content: [
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "Unrelated blog",
                  url: "https://example.com/unrelated-blog",
                  content: "General article without matching tobacco product evidence.",
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "search", query: "IQOS TEREA Bright Menthol" }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.sources[0].url, "https://jp.iqos.com/products/terea-bright-menthol");
  assert.doesNotMatch(payload.answer, /没有留下足够相关来源|没有留下足够相关的烟草\/包装来源|没有找到/);
  assert.match(payload.answer, /已找到|官方来源|核对来源/);
});

test("online search does not duplicate an upstream source that matches the exact local catalog URL", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          content: [
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "テリア ブライト メンソール | IQOS 日本公式",
                  url: "https://jp.iqos.com/products/terea-bright-menthol",
                  content: "テリア ブライト メンソール TEREA Bright Menthol の日本公式たばこ製品情報。",
                },
                {
                  type: "web_search_result",
                  title: "TEREA Bright Menthol overseas carton listing",
                  url: "https://world-tobacco.example/terea-bright-menthol-carton",
                  content: "IQOS TEREA Bright Menthol tobacco carton information for an overseas market.",
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
  });

  const response = await worker.fetch(
    post({ mode: "search", query: "IQOS TEREA Bright Menthol" }),
    ENV,
  );
  const payload = await response.json();
  const urls = payload.sources.map((source) => source.url);

  assert.equal(response.status, 200);
  assert.equal(urls[0], "https://jp.iqos.com/products/terea-bright-menthol");
  assert.equal(
    urls.filter((url) => url === "https://jp.iqos.com/products/terea-bright-menthol").length,
    1,
  );
});

test("online search drops unrelated web results instead of showing noisy fallback sources", async () => {
  let called = false;
  const worker = createWorker({
    fetchImpl: async () => {
      called = true;
      return (
      new Response(
        JSON.stringify({
          content: [
            { type: "text", text: "搜索完成。" },
            {
              type: "web_search_tool_result",
              content: [
                {
                  type: "web_search_result",
                  title: "Nintendo Switch game listing",
                  url: "https://example.com/game/qxzvnonexistent987",
                  content: "A game and candy bundle with no adult product information.",
                },
                {
                  type: "web_search_result",
                  title: "Market report",
                  url: "https://example.org/report",
                  content: "Generic market research with no product evidence.",
                },
                {
                  type: "web_search_result",
                  title: "Japan Tobacco - Youdao dictionary",
                  url: "https://dict.youdao.com/result?word=Japan%20Tobacco&lang=en",
                  content: "Dictionary translation for Japan Tobacco.",
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      )
      );
    },
  });

  const response = await worker.fetch(post({ mode: "search", query: "qxzvnonexistent987" }), ENV);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(called, false);
  assert.deepEqual(payload.sources, []);
  assert.match(payload.answer, /没有识别到品牌、烟草、包装或目录线索/);
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
    "XROS 日本哪里买",
    "Argus 日本哪里买",
    "Infinity 日本哪里买",
    "電子たばこ 日本 店",
    "電子タバコ 日本 店",
  ]) {
    const response = await worker.fetch(post({ mode: "search", query }), ENV);
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /法规|受限/);
  }
  assert.equal(called, false);
});

test("upstream auth failures are explained without credential leakage", async () => {
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
  assert.equal(payload.code, "minimax_auth_failed");
  assert.equal(payload.upstreamStatus, 401);
  assert.match(payload.error, /密钥|权限/);
});

test("upstream quota and Token Plan failures are surfaced as actionable 429", async () => {
  const worker = createWorker({
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { message: "Token Plan quota exhausted" } }), {
        status: 429,
        headers: { "content-type": "application/json" },
      }),
  });

  const response = await worker.fetch(
    post({ mode: "recommend", query: "七星", catalog: [] }),
    ENV,
  );
  const payload = await response.json();

  assert.equal(response.status, 429);
  assert.equal(payload.code, "minimax_quota_or_rate_limited");
  assert.equal(payload.upstreamStatus, 429);
  assert.match(payload.error, /额度|Token Plan|稍后/);
  assert.equal(JSON.stringify(payload).includes("test-secret"), false);
});
