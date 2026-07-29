import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_LIMITS,
  buildExternalSearchLinks,
  buildJapaneseRequest,
  createAiClient,
  localRecommend,
  normalizeAiPayload,
} from "../ai-client.js";

test("external search links preserve and encode the exact query", () => {
  const links = buildExternalSearchLinks("蓝色 七星");

  assert.match(links.images, /%E8%93%9D%E8%89%B2/);
  assert.match(links.web, /%E4%B8%83%E6%98%9F/);
  assert.match(links.official, /site%3Ajti\.co\.jp/);
});

test("Japanese request card works without a network", () => {
  assert.equal(
    buildJapaneseRequest("セブンスター"),
    "「セブンスター」はありますか？ 一箱お願いします。",
  );
});

test("Japanese request rejects empty and unbounded product names", () => {
  assert.throws(() => buildJapaneseRequest(""), /商品名/);
  assert.throws(() => buildJapaneseRequest("あ".repeat(121)), /商品名/);
});

test("local recommendation returns deterministic catalog IDs", () => {
  const matches = localRecommend("清凉 薄荷", [
    {
      id: "regular",
      jp: "レギュラー",
      cn: "经典原味",
      brand: "A",
      flavor: "tobacco",
      strength: "medium",
      jpy: 500,
      jpScore: 4,
      cnScore: 4,
      searchText: "经典 原味",
      purchaseAllowed: true,
    },
    {
      id: "menthol",
      jp: "メンソール",
      cn: "清凉薄荷",
      brand: "B",
      flavor: "menthol",
      strength: "medium",
      jpy: 540,
      jpScore: 4.5,
      cnScore: 4.2,
      searchText: "薄荷 清凉 menthol",
      purchaseAllowed: true,
    },
  ]);

  assert.equal(matches[0].id, "menthol");
  assert.match(matches[0].reason, /薄荷|清凉/);
});

test("local recommendation never promotes purchase-restricted products", () => {
  const matches = localRecommend("薄荷", [
    {
      id: "restricted",
      jp: "POD",
      cn: "电子烟弹 薄荷",
      brand: "POD",
      flavor: "menthol",
      strength: "not-applicable",
      jpy: 900,
      jpScore: 5,
      cnScore: 5,
      searchText: "薄荷",
      purchaseAllowed: false,
    },
  ]);

  assert.deepEqual(matches, []);
});

test("local recommendation understands that '不要太浓' means a lighter profile", () => {
  const matches = localRecommend("薄荷清凉，不要太浓", [
    {
      id: "strong",
      jp: "ブラックメンソール",
      cn: "黑薄荷",
      flavor: "menthol",
      strength: "strong",
      purchaseAllowed: true,
    },
    {
      id: "light",
      jp: "ライト メンソール",
      cn: "轻柔薄荷",
      flavor: "menthol",
      strength: "light",
      purchaseAllowed: true,
    },
  ]);

  assert.equal(matches[0].id, "light");
  assert.match(matches[0].reason, /轻柔/);
});

test("unconfigured AI client reports offline without fetching", async () => {
  let called = false;
  const client = createAiClient({
    endpoint: "",
    fetchImpl: async () => {
      called = true;
    },
  });

  assert.equal(client.configured, false);
  await assert.rejects(client.ask({ mode: "recommend", query: "七星" }), /未配置/);
  assert.equal(called, false);
});

test("configured AI client sends bounded requests and normalizes output", async () => {
  let request;
  const client = createAiClient({
    endpoint: "https://ai.example.test/api",
    fetchImpl: async (url, init) => {
      request = { url, init };
      return new Response(
        JSON.stringify({
          answer: "<b>推荐</b>",
          matches: [{ id: "p-1", reason: "接近你的描述" }],
          sources: [
            { title: "官方", url: "https://www.jti.co.jp/example", snippet: "资料" },
            { title: "危险", url: "javascript:alert(1)", snippet: "忽略" },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });

  const result = await client.ask({
    mode: "recommend",
    query: "七星",
    catalog: [{ id: "p-1", jp: "セブンスター" }],
  });

  assert.equal(request.url, "https://ai.example.test/api");
  assert.equal(request.init.method, "POST");
  assert.equal(JSON.parse(request.init.body).query, "七星");
  assert.equal(result.answer, "<b>推荐</b>");
  assert.deepEqual(result.sources.map((source) => source.url), [
    "https://www.jti.co.jp/example",
  ]);
});

test("AI client blocks unsupported modes and oversized input", async () => {
  const client = createAiClient({
    endpoint: "https://ai.example.test/api",
    fetchImpl: async () => new Response("{}"),
  });

  await assert.rejects(client.ask({ mode: "unknown", query: "七星" }), /模式/);
  await assert.rejects(
    client.ask({ mode: "recommend", query: "烟".repeat(AI_LIMITS.query + 1) }),
    /过长/,
  );
});

test("normalizer accepts text and links but drops unsafe URLs and unknown fields", () => {
  assert.deepEqual(
    normalizeAiPayload({
      answer: "结果",
      matches: [{ id: "p-1", reason: "匹配" }, { nope: true }],
      sources: [
        { title: "A", url: "https://example.com/a", snippet: "说明" },
        { title: "B", url: "data:text/html,boom", snippet: "危险" },
      ],
      secret: "ignored",
    }),
    {
      answer: "结果",
      matches: [{ id: "p-1", reason: "匹配" }],
      sources: [{ title: "A", url: "https://example.com/a", snippet: "说明" }],
    },
  );
});
