export const AI_LIMITS = Object.freeze({
  query: 240,
  imageBytes: 4 * 1024 * 1024,
  catalogItems: 160,
  answer: 6000,
  sources: 8,
});

const AI_MODES = new Set(["recommend", "vision", "search"]);
const SAFE_PROTOCOLS = new Set(["http:", "https:"]);
const FLAVOR_HINTS = Object.freeze({
  tobacco: ["原味", "烟草", "经典", "醇厚", "regular", "tobacco", "レギュラー"],
  menthol: ["薄荷", "清凉", "冰", "凉", "menthol", "mint", "メンソール", "ミント"],
  fruit: ["爆珠", "果味", "水果", "莓", "葡萄", "蜜桃", "fruit", "berry", "フルーツ"],
});
const STRENGTH_HINTS = Object.freeze({
  light: ["淡", "柔", "轻", "低焦", "light", "smooth", "ライト"],
  medium: ["适中", "中等", "medium", "标准"],
  strong: ["浓", "重", "劲", "强", "strong", "rich", "ブラック"],
});

function cleanText(value, limit) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, limit);
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value));
    return SAFE_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function normalizeQuery(query, { required = true } = {}) {
  const value = cleanText(query, AI_LIMITS.query + 1);
  if (required && !value) throw new Error("请输入想找的烟款或偏好");
  if (value.length > AI_LIMITS.query) throw new Error("输入过长，请控制在 240 字以内");
  return value;
}

function tokenize(value) {
  const normalized = String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const compact = normalized.replace(/\s+/g, "");
  if (compact.length >= 2 && compact.length <= 12) tokens.push(compact);
  return [...new Set(tokens)];
}

function inferHint(query, hints) {
  const text = query.toLocaleLowerCase();
  return Object.entries(hints).find(([, aliases]) =>
    aliases.some((alias) => text.includes(alias.toLocaleLowerCase())),
  )?.[0];
}

function priceTarget(query) {
  const match = query.match(/(?:¥|￥|日元|円)?\s*(\d{3,4})/);
  return match ? Number(match[1]) : null;
}

export function buildJapaneseRequest(jpName, quantity = "一箱") {
  const name = cleanText(jpName, 121);
  if (!name) throw new Error("需要商品名才能生成沟通卡");
  if (name.length > 120) throw new Error("商品名过长");

  const safeQuantity = ["一箱", "二箱", "一カートン"].includes(quantity)
    ? quantity
    : "一箱";
  return `「${name}」はありますか？ ${safeQuantity}お願いします。`;
}

export function buildExternalSearchLinks(query) {
  const value = normalizeQuery(query);
  const phrase = `${value} 日本 たばこ`;
  return {
    images: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(phrase)}`,
    web: `https://www.google.com/search?q=${encodeURIComponent(phrase)}`,
    official: `https://www.google.com/search?q=${encodeURIComponent(
      `site:jti.co.jp ${phrase}`,
    )}`,
  };
}

export function localRecommend(query, catalog = [], limit = 3) {
  const value = normalizeQuery(query);
  const tokens = tokenize(value);
  const flavor = inferHint(value, FLAVOR_HINTS);
  const strength = /不要太?浓|别太浓|不太浓|淡一点|柔和一点/.test(value)
    ? "light"
    : inferHint(value, STRENGTH_HINTS);
  const targetPrice = priceTarget(value);

  return catalog
    .filter((item) => item?.id && item.purchaseAllowed !== false)
    .map((item, index) => {
      const haystack = [
        item.searchText,
        item.jp,
        item.cn,
        item.brand,
        item.flavor,
        item.strength,
      ]
        .join(" ")
        .normalize("NFKC")
        .toLocaleLowerCase();
      const compactHaystack = haystack.replace(/\s+/g, "");
      let score = 0;
      const reasons = [];

      for (const token of tokens) {
        if (token.length < 2) continue;
        if (haystack.includes(token) || compactHaystack.includes(token.replace(/\s+/g, ""))) {
          score += token.length >= 4 ? 8 : 5;
        }
      }

      if (flavor && item.flavor === flavor) {
        score += 10;
        reasons.push(
          flavor === "menthol"
            ? "符合薄荷清凉方向"
            : flavor === "fruit"
              ? "符合果香或爆珠方向"
              : "符合经典烟草方向",
        );
      }
      if (strength && item.strength === strength) {
        score += 7;
        reasons.push(`强度更接近${strength === "light" ? "轻柔" : strength === "strong" ? "偏强" : "适中"}`);
      }
      if (targetPrice && Number.isFinite(Number(item.jpy))) {
        const difference = Math.abs(Number(item.jpy) - targetPrice);
        if (difference <= 30) {
          score += 6;
          reasons.push("价格接近你的预算");
        } else if (difference <= 80) {
          score += 3;
        }
      }
      if (tokens.some((token) => token.length >= 2 && haystack.includes(token))) {
        reasons.unshift("名称或包装线索匹配");
      }

      score += Math.max(0, Number(item.jpScore ?? 0) + Number(item.cnScore ?? 0) - 7);
      return { item, index, score, reasons };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(1, Math.min(6, Number(limit) || 3)))
    .map(({ item, reasons }) => ({
      id: item.id,
      reason: reasons.slice(0, 2).join("，") || "与输入线索最接近",
    }));
}

export function normalizeAiPayload(payload) {
  const answer = cleanText(payload?.answer, AI_LIMITS.answer);
  const matches = Array.isArray(payload?.matches)
    ? payload.matches
        .map((match) => ({
          id: cleanText(match?.id, 100),
          reason: cleanText(match?.reason, 300),
        }))
        .filter((match) => match.id)
        .slice(0, 6)
    : [];
  const sources = Array.isArray(payload?.sources)
    ? payload.sources
        .map((source) => ({
          title: cleanText(source?.title, 180) || "查看来源",
          url: safeHttpUrl(source?.url),
          snippet: cleanText(source?.snippet, 500),
        }))
        .filter((source) => source.url)
        .slice(0, AI_LIMITS.sources)
    : [];

  return { answer, matches, sources };
}

function validateImage(image) {
  if (!image) return "";
  const value = String(image);
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("请上传 JPG、PNG 或 WebP 图片");
  const estimatedBytes = Math.floor((match[2].length * 3) / 4);
  if (estimatedBytes > AI_LIMITS.imageBytes) {
    throw new Error("图片超过 4 MB，请压缩后再试");
  }
  return value;
}

export function createAiClient({
  endpoint = "",
  fetchImpl = globalThis.fetch,
  timeoutMs = 25_000,
} = {}) {
  const publicEndpoint = safeHttpUrl(endpoint);

  return Object.freeze({
    configured: Boolean(publicEndpoint),
    async ask({ mode, query = "", image = "" } = {}) {
      if (!publicEndpoint) throw new Error("AI 服务尚未配置安全代理");
      if (!AI_MODES.has(mode)) throw new Error("不支持的 AI 模式");

      const normalizedQuery = normalizeQuery(query, { required: mode !== "vision" });
      const normalizedImage = validateImage(image);
      if (mode === "vision" && !normalizedImage) throw new Error("请先选择烟盒图片");

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(publicEndpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mode,
            query: normalizedQuery,
            ...(normalizedImage ? { image: normalizedImage } : {}),
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(cleanText(payload?.error, 240) || `AI 服务暂不可用（${response.status}）`);
        }
        return normalizeAiPayload(await response.json());
      } catch (error) {
        if (error?.name === "AbortError") throw new Error("AI 响应超时，请稍后重试");
        throw error;
      } finally {
        clearTimeout(timer);
      }
    },
  });
}
