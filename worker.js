import { AI_LIMITS, localRecommend, normalizeAiPayload } from "./ai-client.js";
import { enrichProducts } from "./catalog.js";
import { rawProducts } from "./data/products.js";

const DEFAULT_ALLOWED_ORIGIN = "https://niuzipai-gif.github.io";
const CHAT_ENDPOINT = "https://api.minimaxi.com/v1/chat/completions";
const SEARCH_ENDPOINT = "https://api.minimaxi.com/anthropic/v1/messages";
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const ALLOWED_MODES = new Set(["recommend", "vision", "search"]);
const BASE_SYSTEM_PROMPT = `
你是“煙草羅盤”的成人日本旅行信息助手，只服务年满20岁的用户。
你只能根据用户提供的目录给出目录内匹配，不得宣称实时库存，不得把烟草描述为健康或更安全，
不得为 purchaseAllowed=false 的条目提供购买地点、推荐或替代购买建议。
价格、热度和可得性都必须写成参考信息。返回纯 JSON，不要 Markdown、代码围栏或额外字段。
JSON 结构：{"answer":"简短中文答复","matches":[{"id":"目录商品ID","reason":"匹配理由"}],"sources":[]}
`.trim();
const ALL_CANONICAL_PRODUCTS = Object.freeze(enrichProducts(rawProducts));
const CANONICAL_CATALOG = Object.freeze(
  ALL_CANONICAL_PRODUCTS
    .filter((item) => item.purchaseAllowed)
    .map((item) =>
      Object.freeze({
        id: cleanText(item.id, 100),
        jp: cleanText(item.jp, 160),
        cn: cleanText(item.cn, 160),
        brand: cleanText(item.brand, 100),
        type: cleanText(item.type, 40),
        flavor: cleanText(item.flavor, 40),
        strength: cleanText(item.strength, 40),
        jpy: Number.isFinite(Number(item.jpy)) ? Number(item.jpy) : null,
        availability: cleanText(item.availability, 40),
        compatibility: cleanText(item.compatibility, 220),
        purchaseAllowed: true,
        searchText: cleanText(
          [
            item.searchText,
            item.jp,
            item.cn,
            item.brand,
            item.relatedExactJp?.join(" "),
            item.cartonSearchQuery,
            item.cartonNote,
            item.variantNote,
          ].join(" "),
          1200,
        ),
        cartonStatus: cleanText(item.cartonStatus, 40),
        cartonSearchQuery: cleanText(item.cartonSearchQuery, 240),
        cartonNote: cleanText(item.cartonNote, 500),
        variantNote: cleanText(item.variantNote, 360),
        relatedExactJp: Array.isArray(item.relatedExactJp)
          ? item.relatedExactJp.map((jp) => cleanText(jp, 160)).filter(Boolean).slice(0, 8)
          : [],
      }),
    ),
);
const ALLOWED_PRODUCT_IDS = new Set(CANONICAL_CATALOG.map((item) => item.id));
const RECOMMEND_GATE_CATALOG = Object.freeze(
  CANONICAL_CATALOG.map((item) =>
    Object.freeze({
      ...item,
      searchText: cleanText(
        [
          item.jp,
          item.cn,
          item.brand,
          item.flavor,
          item.strength,
          item.relatedExactJp?.join(" "),
          item.cartonSearchQuery,
          item.variantNote,
        ].join(" "),
        900,
      ),
    }),
  ),
);
const RESTRICTED_QUERY_MARKERS = Object.freeze([
  "电子烟",
  "電子煙",
  "電子たばこ",
  "電子タバコ",
  "烟弹",
  "煙彈",
  "ポッド",
  "pod",
  "vape",
  "vaping",
  "e-cig",
  "ecig",
  "electroniccigarette",
]);
const RESTRICTED_PRODUCT_TERMS = Object.freeze(
  [
    ...ALL_CANONICAL_PRODUCTS
      .filter((item) => !item.purchaseAllowed)
      .flatMap((item) => [item.brand, item.jp, item.cn]),
    "RELX",
    "Infinity",
    "Artisan",
    "ELFBAR",
    "MOTI",
    "VAPORESSO",
    "XROS",
    "Uwell",
    "Caliburn",
    "Voopoo",
    "Argus",
  ]
    .map(compactLookupText)
    .filter((value, index, values) => value.length >= 3 && values.indexOf(value) === index),
);
const TOBACCO_SOURCE_DOMAINS = Object.freeze([
  "jti.co.jp",
  "clubjt.jp",
  "iqos.com",
  "myglo.com",
  "discoverglo.jp",
  "prtimes.jp",
  "mhlw.go.jp",
  "mof.go.jp",
  "anadf.com",
  "kixdutyfree.jp",
  "rakuten.co.jp",
  "mercari.com",
  "paypayfleamarket.yahoo.co.jp",
  "monolog.r-n-i.jp",
]);
const BLOCKED_SEARCH_SOURCE_DOMAINS = Object.freeze([
  "youdao.com",
  "dict.youdao.com",
  "dictionary.cambridge.org",
  "collinsdictionary.com",
  "wiktionary.org",
]);
const TOBACCO_RELEVANCE_TERMS = Object.freeze([
  "たばこ",
  "タバコ",
  "煙草",
  "香烟",
  "烟草",
  "cigarette",
  "cigar",
  "tobacco",
  "carton",
  "カートン",
  "一条",
  "20本",
  "10箱",
  "iqos",
  "terea",
  "sentia",
  "ploom",
  "mevius",
  "seven stars",
  "marlboro",
  "camel",
  "lark",
  "winston",
  "kool",
  "cigaronne",
  "glo",
  "virto",
  "ヴァルト",
]);

function cleanText(value, limit) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, limit);
}

function compactLookupText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function tokenizeSearchQuery(query) {
  return cleanText(query, 240)
    .toLocaleLowerCase()
    .split(/[^\p{Letter}\p{Number}]+/gu)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !/^\d+$/.test(token))
    .slice(0, 12);
}

function getHostname(url) {
  try {
    return new URL(url).hostname.toLocaleLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isRelevantSearchSource(source, query) {
  const url = String(source?.url ?? "");
  const hostname = getHostname(url);
  if (BLOCKED_SEARCH_SOURCE_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
    return false;
  }
  const haystack = [source?.title, source?.content, source?.snippet, url]
    .map((value) => cleanText(value, 1200).toLocaleLowerCase())
    .join(" ");
  const compactHaystack = compactLookupText(haystack);
  const isTrustedDomain = TOBACCO_SOURCE_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
  const hasTobaccoContext = TOBACCO_RELEVANCE_TERMS.some((term) => {
    const normalized = term.toLocaleLowerCase();
    return haystack.includes(normalized) || compactHaystack.includes(compactLookupText(normalized));
  });
  const hasQueryOverlap = tokenizeSearchQuery(query).some(
    (token) => haystack.includes(token) || compactHaystack.includes(compactLookupText(token)),
  );

  if (isTrustedDomain && (hasQueryOverlap || hasTobaccoContext)) return true;
  return hasQueryOverlap && hasTobaccoContext;
}

function isRestrictedSearch(query) {
  const compact = compactLookupText(query);
  return (
    RESTRICTED_QUERY_MARKERS.some((marker) => compact.includes(compactLookupText(marker))) ||
    RESTRICTED_PRODUCT_TERMS.some((term) => compact.includes(term))
  );
}

function isSafeUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function corsHeaders(requestOrigin, allowedOrigin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    vary: "Origin",
  };
  if (requestOrigin && requestOrigin === allowedOrigin) {
    headers["access-control-allow-origin"] = requestOrigin;
    headers["access-control-allow-methods"] = "GET, POST, OPTIONS";
    headers["access-control-allow-headers"] = "Content-Type";
    headers["access-control-max-age"] = "86400";
  }
  return headers;
}

function jsonResponse(payload, status, requestOrigin, allowedOrigin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(requestOrigin, allowedOrigin),
  });
}

function errorResponse(message, status, requestOrigin, allowedOrigin, extra = {}) {
  return jsonResponse({ error: message, ...extra }, status, requestOrigin, allowedOrigin);
}

class UpstreamError extends Error {
  constructor(message, { code, upstreamStatus, clientStatus = 502 } = {}) {
    super(message);
    this.name = "UpstreamError";
    this.code = code;
    this.upstreamStatus = upstreamStatus;
    this.clientStatus = clientStatus;
  }
}

async function throwUpstreamError(upstream) {
  const upstreamStatus = upstream.status;
  const rawBody = await upstream.text().catch(() => "");
  const hint = cleanText(rawBody, 1200).toLocaleLowerCase();

  if (upstreamStatus === 401 || upstreamStatus === 403) {
    throw new UpstreamError("MiniMax 密钥无效或没有接口权限，请检查服务端密钥", {
      code: "minimax_auth_failed",
      upstreamStatus,
      clientStatus: 502,
    });
  }
  if (
    upstreamStatus === 402 ||
    upstreamStatus === 429 ||
    /token\s*plan|quota|insufficient|balance|余额|额度|套餐/.test(hint)
  ) {
    throw new UpstreamError("MiniMax 额度不足或请求过于频繁，请检查 Token Plan、余额或稍后重试", {
      code: "minimax_quota_or_rate_limited",
      upstreamStatus,
      clientStatus: 429,
    });
  }
  if (upstreamStatus >= 500) {
    throw new UpstreamError("MiniMax 上游服务暂不可用，请稍后重试", {
      code: "minimax_upstream_unavailable",
      upstreamStatus,
      clientStatus: 502,
    });
  }

  throw new UpstreamError("MiniMax 上游返回异常，请检查代理配置后重试", {
    code: "minimax_upstream_error",
    upstreamStatus,
    clientStatus: 502,
  });
}

function normalizeQuery(value, { required = true } = {}) {
  const query = cleanText(value, AI_LIMITS.query + 1);
  if (required && !query) throw new TypeError("请输入查询内容");
  if (query.length > AI_LIMITS.query) throw new RangeError("查询内容过长");
  return query;
}

function validateImage(value) {
  const image = String(value ?? "");
  const match = image.match(/^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new TypeError("图片必须是 JPG、PNG 或 WebP");
  if (Math.floor((match[1].length * 3) / 4) > AI_LIMITS.imageBytes) {
    throw new RangeError("图片超过 4 MB");
  }
  return image;
}

function extractJsonObject(value) {
  const text = String(value ?? "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI 返回格式不可解析");
  return JSON.parse(text.slice(start, end + 1));
}

function boostRelatedExactMatches(matches, catalog) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const byJp = new Map(catalog.map((item) => [item.jp, item]));
  const originalById = new Map(matches.map((match) => [match.id, match]));
  const boosted = [];
  const seen = new Set();

  const push = (match) => {
    if (!match?.id || seen.has(match.id) || !ALLOWED_PRODUCT_IDS.has(match.id)) return;
    seen.add(match.id);
    boosted.push(match);
  };

  for (const match of matches) {
    const item = byId.get(match.id);
    if (Array.isArray(item?.relatedExactJp) && item.relatedExactJp.length) {
      for (const jp of item.relatedExactJp) {
        const exact = byJp.get(jp);
        if (!exact) continue;
        push(
          originalById.get(exact.id) ?? {
            id: exact.id,
            reason: "已拆分到更准确的核验 SKU",
          },
        );
      }
    }
    push(match);
  }

  return boosted.slice(0, 6);
}

function platformIntent(query) {
  const text = String(query ?? "").normalize("NFKC");
  if (/Hilo|virto|ヴァルト/i.test(text)) return "glo-hilo";
  if (/(?:glo\s*hyper|hyper用|HYPER|ネオ|neo|ラッキー・ストライク|Lucky Strike|ケント|KENT)/i.test(text)) {
    return "glo-hyper";
  }
  return "";
}

function productPlatform(item) {
  const text = `${item?.jp ?? ""} ${item?.cn ?? ""}`.normalize("NFKC");
  if (/Hilo|virto|ヴァルト/i.test(text)) return "glo-hilo";
  if (/(?:glo\s*hyper|hyper用|HYPER|ネオ|neo|ラッキー・ストライク|Lucky Strike|ケント|KENT)/i.test(text)) {
    return "glo-hyper";
  }
  return "";
}

function catalogForQuery(query, catalog) {
  const intent = platformIntent(query);
  if (!intent) return catalog;
  const filtered = catalog.filter((item) => productPlatform(item) === intent);
  return filtered.length ? filtered : catalog;
}

function buildChatRequest({ mode, query, catalog, image }) {
  const catalogJson = JSON.stringify(catalog);
  const instructions = BASE_SYSTEM_PROMPT;

  const userText =
    mode === "vision"
      ? `识别烟盒上可见的品牌、日文商品名、颜色和包装线索，再从以下目录找最多3个候选。不要猜测看不清的文字。\n目录：${catalogJson}`
      : `用户偏好：${query}\n只从以下目录找最多3个候选，并说明口味、强度、参考价或兼容性为何匹配。\n目录：${catalogJson}`;

  return {
    model: "MiniMax-M3",
    thinking: { type: "disabled" },
    stream: false,
    max_completion_tokens: 1200,
    temperature: 0.2,
    messages: [
      { role: "system", content: instructions },
      {
        role: "user",
        content:
          mode === "vision"
            ? [
                { type: "text", text: userText },
                { type: "image_url", image_url: { url: image } },
              ]
            : userText,
      },
    ],
  };
}

async function callChat(fetchImpl, key, input) {
  const upstream = await fetchImpl(CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildChatRequest(input)),
  });
  if (!upstream.ok) await throwUpstreamError(upstream);

  const payload = await upstream.json();
  const content = payload?.choices?.[0]?.message?.content;
  const result = normalizeAiPayload(extractJsonObject(content));
  const inputCatalogIds = new Set(input.catalog.map((item) => item.id));
  return {
    ...result,
    matches: boostRelatedExactMatches(
      result.matches.filter((match) => ALLOWED_PRODUCT_IDS.has(match.id) && inputCatalogIds.has(match.id)),
      input.catalog,
    ),
  };
}

async function callSearch(fetchImpl, key, query) {
  const upstream = await fetchImpl(SEARCH_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "MiniMax-M3",
      max_tokens: 1800,
      system:
        "你是日本烟草包装与产品信息检索助手。只返回识别和核对线索，不宣称实时库存，不给健康建议。不得为电子烟、烟弹或法规状态不明商品提供购买地点、店铺、购买话术或替代购买建议。优先厂商、政府和可信资料，并提醒用户核对日期。",
      messages: [
        {
          role: "user",
          content: `联网查询“${query}”在日本可能对应的烟草产品、包装、当前参考价或厂商资料。`,
        },
      ],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  if (!upstream.ok) await throwUpstreamError(upstream);

  const payload = await upstream.json();
  const textBlocks = [];
  const sources = [];
  for (const block of Array.isArray(payload?.content) ? payload.content : []) {
    if (block?.type === "text" && cleanText(block.text, AI_LIMITS.answer)) {
      textBlocks.push(cleanText(block.text, AI_LIMITS.answer));
    }
    if (block?.type !== "web_search_tool_result" || !Array.isArray(block.content)) continue;
    for (const result of block.content) {
      if (result?.type !== "web_search_result" || !isSafeUrl(result.url)) continue;
      if (!isRelevantSearchSource(result, query)) continue;
      sources.push({
        title: cleanText(result.title, 180) || "查看来源",
        url: String(result.url),
        snippet: cleanText(result.content, 500),
      });
    }
  }

  return normalizeAiPayload({
    answer: sources.length
      ? textBlocks.at(-1) || "已找到一些可能相关的网页线索，请打开来源核对。"
      : "联网搜索没有留下足够相关的烟草/包装来源；请换成品牌、日文名或包装文字再试。",
    matches: [],
    sources,
  });
}

export function createWorker({ fetchImpl = globalThis.fetch } = {}) {
  return Object.freeze({
    async fetch(request, env = {}) {
      const allowedOrigin = cleanText(env.ALLOWED_ORIGIN, 300) || DEFAULT_ALLOWED_ORIGIN;
      const requestOrigin = request.headers.get("origin") || "";

      if (requestOrigin !== allowedOrigin) {
        return errorResponse("不允许的来源", 403, requestOrigin, allowedOrigin);
      }
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(requestOrigin, allowedOrigin),
        });
      }
      if (request.method === "GET") {
        return jsonResponse(
          {
            ok: true,
            service: "tabako-ai",
            keyConfigured: Boolean(env.MINIMAX_API_KEY),
          },
          200,
          requestOrigin,
          allowedOrigin,
        );
      }
      if (request.method !== "POST") {
        return errorResponse("只支持 POST", 405, requestOrigin, allowedOrigin);
      }
      if (!env.MINIMAX_API_KEY) {
        return errorResponse("AI 服务尚未配置", 503, requestOrigin, allowedOrigin);
      }
      if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
        return errorResponse("请求格式必须是 JSON", 415, requestOrigin, allowedOrigin);
      }

      const declaredLength = Number(request.headers.get("content-length") || 0);
      if (declaredLength >= MAX_BODY_BYTES) {
        return errorResponse("请求体过大", 413, requestOrigin, allowedOrigin);
      }

      let body;
      try {
        const text = await request.text();
        if (new TextEncoder().encode(text).byteLength >= MAX_BODY_BYTES) {
          return errorResponse("请求体过大", 413, requestOrigin, allowedOrigin);
        }
        body = JSON.parse(text);
      } catch {
        return errorResponse("JSON 无法解析", 400, requestOrigin, allowedOrigin);
      }

      const mode = cleanText(body?.mode, 40);
      if (!ALLOWED_MODES.has(mode)) {
        return errorResponse("不支持的 AI 模式", 400, requestOrigin, allowedOrigin);
      }

      try {
        const query = normalizeQuery(body?.query, { required: mode !== "vision" });
        if (mode === "search" && isRestrictedSearch(query)) {
          return errorResponse(
            "法规状态不明或购买权限受限的电子烟条目不提供联网购买检索",
            400,
            requestOrigin,
            allowedOrigin,
          );
        }
        if (env.AI_RATE_LIMITER?.limit) {
          const clientAddress = cleanText(request.headers.get("cf-connecting-ip"), 80);
          if (!clientAddress) {
            return errorResponse("无法验证请求来源", 400, requestOrigin, allowedOrigin);
          }
          const rateLimit = await env.AI_RATE_LIMITER.limit({ key: clientAddress });
          if (!rateLimit?.success) {
            return errorResponse("请求过于频繁，请稍后重试", 429, requestOrigin, allowedOrigin);
          }
        }

        const image = mode === "vision" ? validateImage(body?.image) : "";
        if (mode === "recommend" && localRecommend(query, RECOMMEND_GATE_CATALOG, 1).length === 0) {
          return jsonResponse(
            normalizeAiPayload({
              answer: "本地目录没有足够接近的候选；已准备进入联网补充。联网结果只作为核对线索，不会自动写入目录或宣称库存。",
              matches: [],
              sources: [],
            }),
            200,
            requestOrigin,
            allowedOrigin,
          );
        }
        const recommendCatalog = mode === "recommend" ? catalogForQuery(query, CANONICAL_CATALOG) : CANONICAL_CATALOG;
        const result =
          mode === "search"
            ? await callSearch(fetchImpl, env.MINIMAX_API_KEY, query)
            : await callChat(fetchImpl, env.MINIMAX_API_KEY, {
                mode,
                query,
                catalog: recommendCatalog,
                image,
              });
        return jsonResponse(result, 200, requestOrigin, allowedOrigin);
      } catch (error) {
        if (error instanceof TypeError || error instanceof RangeError) {
          return errorResponse(error.message, 400, requestOrigin, allowedOrigin);
        }
        if (error instanceof UpstreamError) {
          return errorResponse(error.message, error.clientStatus, requestOrigin, allowedOrigin, {
            code: error.code,
            upstreamStatus: error.upstreamStatus,
          });
        }
        return errorResponse("AI 服务暂不可用，请稍后重试", 502, requestOrigin, allowedOrigin, {
          code: "proxy_internal_error",
        });
      }
    },
  });
}

const worker = createWorker();

export default {
  fetch(request, env) {
    return worker.fetch(request, env);
  },
};
