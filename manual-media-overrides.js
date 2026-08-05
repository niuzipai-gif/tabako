export const MANUAL_MEDIA_BACKUP_VERSION = 1;
export const MANUAL_MEDIA_NOTE =
  "本机手动上传覆盖：仅保存在当前浏览器，不会上传到 GitHub Pages 或服务器；不会标记 verified。";
export const STATIC_SITE_WARNING =
  "GitHub Pages 是静态站，前端不能直接把图片写回 GitHub 仓库，也不会上传到 GitHub。请导出 JSON/patch 后由维护者提交。";

const ALLOWED_KINDS = new Set(["pack", "carton"]);

export function manualOverrideKey(productId, kind = "pack") {
  return `${productId}:${kind}`;
}

function hasVerifiedForgery(record = {}) {
  return [record.status, record.imageStatus, record.cartonStatus].some(
    (value) => typeof value === "string" && value.toLowerCase().includes("verified"),
  );
}

function isDataImage(value) {
  return /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(String(value ?? ""));
}

function safeIso(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

export function normalizeManualOverride(input, allowedIds = null) {
  const productId = String(input?.productId ?? input?.id ?? "").trim();
  const kind = String(input?.kind ?? "pack").trim();

  if (!productId) throw new Error("manual media override missing productId");
  if (allowedIds && !allowedIds.has(productId)) {
    throw new Error(`manual media override productId is not in catalog: ${productId}`);
  }
  if (!ALLOWED_KINDS.has(kind)) {
    throw new Error(`manual media override kind must be pack or carton: ${kind}`);
  }
  if (hasVerifiedForgery(input)) {
    throw new Error("manual media import cannot contain verified evidence fields");
  }
  if (!isDataImage(input?.dataUrl)) {
    throw new Error("manual media override requires a data:image base64 dataUrl");
  }

  return {
    id: productId,
    productId,
    kind,
    dataUrl: input.dataUrl,
    mime: String(input.mime ?? input.dataUrl.match(/^data:([^;]+)/i)?.[1] ?? "image/webp"),
    width: Math.max(0, Number(input.width) || 0),
    height: Math.max(0, Number(input.height) || 0),
    bytes: Math.max(0, Number(input.bytes) || 0),
    updatedAt: safeIso(input.updatedAt),
  };
}

export function normalizeManualMediaBackup(payload, allowedIds = null) {
  const overrides = Array.isArray(payload?.overrides) ? payload.overrides : [];
  return new Map(
    overrides.map((record) => {
      const normalized = normalizeManualOverride(record, allowedIds);
      return [manualOverrideKey(normalized.productId, normalized.kind), normalized];
    }),
  );
}

export function applyManualMediaOverrides(products, overrides) {
  return products.map((product) => {
    const legacyOverride = overrides.get(product.id);
    const packOverride =
      overrides.get(manualOverrideKey(product.id, "pack")) ??
      (legacyOverride?.kind === "pack" ? legacyOverride : null);
    const cartonOverride =
      overrides.get(manualOverrideKey(product.id, "carton")) ??
      (legacyOverride?.kind === "carton" ? legacyOverride : null);
    if (!packOverride && !cartonOverride) return product;

    let updated = product;
    if (packOverride) {
      updated = {
        ...updated,
        manualMediaOverride: packOverride,
        image: packOverride.dataUrl,
        imageStatus: "manual-local",
        imageSource: "",
        imageNote: `${MANUAL_MEDIA_NOTE} 当前浏览器覆盖了目录默认单包图。`,
      };
    }
    if (cartonOverride) {
      updated = {
        ...updated,
        manualCartonOverride: cartonOverride,
        cartonImage: cartonOverride.dataUrl,
        cartonStatus: "manual-local-reference",
        cartonSource: "",
        cartonNote: `${MANUAL_MEDIA_NOTE} 这是一条/整条图的本机参考，不会标记 verified。`,
      };
    }
    return updated;
  });
}

export function buildManualMediaPatch(records) {
  const body = JSON.stringify(
    {
      version: MANUAL_MEDIA_BACKUP_VERSION,
      note: "Manual media overrides are local/operator supplied. Treat carton images as reference until code owner verifies exact SKU and quantity evidence.",
      overrides: records.map((record) => ({
        productId: record.productId,
        kind: record.kind,
        imageStatus: record.kind === "carton" ? "manual-local-reference" : "manual-local",
        imageNote: MANUAL_MEDIA_NOTE,
        dataUrl: record.dataUrl,
        width: record.width,
        height: record.height,
        bytes: record.bytes,
        updatedAt: record.updatedAt,
      })),
    },
    null,
    2,
  );
  return `// Suggested static-site update package.\n// Save as data/manual-media-overrides.json after human review.\n${body}\n`;
}

export function buildManualMediaBackup({ products = [], overrides = new Map(), now = new Date() } = {}) {
  const productById = new Map(products.map((product) => [product.id, product]));
  const records = [...overrides.values()].map((record) => {
    const product = productById.get(record.productId ?? record.id);
    const normalized = normalizeManualOverride(record, productById.size ? new Set(productById.keys()) : null);
    return {
      productId: normalized.productId,
      kind: normalized.kind,
      jp: product?.jp ?? "",
      cn: product?.cn ?? "",
      dataUrl: normalized.dataUrl,
      mime: normalized.mime,
      width: normalized.width,
      height: normalized.height,
      bytes: normalized.bytes,
      updatedAt: normalized.updatedAt,
    };
  });

  return {
    version: MANUAL_MEDIA_BACKUP_VERSION,
    exportedAt: now.toISOString(),
    warning: STATIC_SITE_WARNING,
    commitInstructions:
      "把 patchText 保存为 data/manual-media-overrides.json，人工核对后再在 data/products.js 或 product-media.js 中做正式媒体替换；不要凭本机上传图把 cartonStatus 改成 verified。",
    overrides: records,
    patchText: buildManualMediaPatch(records),
  };
}
