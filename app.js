import { rawProducts } from "./data/products.js";
import {
  AI_LIMITS,
  buildExternalSearchLinks,
  buildJapaneseRequest,
  createAiClient,
  localRecommend,
} from "./ai-client.js";
import {
  catalogMeta,
  chainMapUrl,
  enrichProducts,
  filterProducts,
  mapSearchUrl,
  sortProducts,
  topDistinctBrands,
  yen,
  yuan,
} from "./catalog.js";

const products = enrichProducts(rawProducts);
const productById = new Map(products.map((item) => [item.id, item]));
const aiClient = createAiClient({
  endpoint: window.TABAKO_CONFIG?.aiProxyUrl ?? "",
});

const elements = {
  aiAnswer: document.querySelector("#aiAnswer"),
  aiDialog: document.querySelector("#aiDialog"),
  aiImageInput: document.querySelector("#aiImageInput"),
  aiImagePlaceholder: document.querySelector("#aiImagePlaceholder"),
  aiImagePreview: document.querySelector("#aiImagePreview"),
  aiJapaneseCopy: document.querySelector("#aiJapaneseCopy"),
  aiJapaneseExplain: document.querySelector("#aiJapaneseExplain"),
  aiJapaneseProductSelect: document.querySelector("#aiJapaneseProductSelect"),
  aiJapaneseQuantity: document.querySelector("#aiJapaneseQuantity"),
  aiJapaneseText: document.querySelector("#aiJapaneseText"),
  aiMatchList: document.querySelector("#aiMatchList"),
  aiEntryStatus: document.querySelector("#aiEntryStatus"),
  aiOpenButton: document.querySelector("#aiOpenButton"),
  aiProgress: document.querySelector("#aiProgress"),
  aiProgressBar: document.querySelector("#aiProgressBar"),
  aiProgressLabel: document.querySelector("#aiProgressLabel"),
  aiProgressPercent: document.querySelector("#aiProgressPercent"),
  aiProgressSteps: document.querySelector("#aiProgressSteps"),
  aiPrompt: document.querySelector("#aiPrompt"),
  aiRecommendSubmit: document.querySelector("#aiRecommendSubmit"),
  aiResultBadge: document.querySelector("#aiResultBadge"),
  aiResultActions: document.querySelector("#aiResultActions"),
  aiResultSection: document.querySelector("#aiResultSection"),
  aiServiceNote: document.querySelector("#aiServiceNote"),
  aiServiceStatus: document.querySelector("#aiServiceStatus"),
  aiSourceList: document.querySelector("#aiSourceList"),
  aiVisionSubmit: document.querySelector("#aiVisionSubmit"),
  cards: document.querySelector("#cards"),
  cardTemplate: document.querySelector("#cardTemplate"),
  emptyImagesLink: document.querySelector("#emptyImagesLink"),
  emptyOfficialLink: document.querySelector("#emptyOfficialLink"),
  emptyQuery: document.querySelector("#emptyQuery"),
  emptyState: document.querySelector("#emptyState"),
  emptyWebLink: document.querySelector("#emptyWebLink"),
  favoritesButton: document.querySelector("#favoritesButton"),
  filterApply: document.querySelector("#filterApply"),
  filterButton: document.querySelector("#filterButton"),
  filterCount: document.querySelector("#filterCount"),
  filterDialog: document.querySelector("#filterDialog"),
  filterReset: document.querySelector("#filterReset"),
  mapComplianceNotice: document.querySelector("#mapComplianceNotice"),
  methodDialog: document.querySelector("#methodDialog"),
  onlineImagesLink: document.querySelector("#onlineImagesLink"),
  onlineOfficialLink: document.querySelector("#onlineOfficialLink"),
  onlineResultList: document.querySelector("#onlineResultList"),
  onlineSearchButton: document.querySelector("#onlineSearchButton"),
  onlineSearchDialog: document.querySelector("#onlineSearchDialog"),
  onlineSearchQuery: document.querySelector("#onlineSearchQuery"),
  onlineSearchStatus: document.querySelector("#onlineSearchStatus"),
  onlineWebLink: document.querySelector("#onlineWebLink"),
  productDetail: document.querySelector("#productDetail"),
  productDialog: document.querySelector("#productDialog"),
  rankingList: document.querySelector("#rankingList"),
  rankingTemplate: document.querySelector("#rankingTemplate"),
  rateText: document.querySelector("#rateText"),
  resetFilters: document.querySelector("#resetFilters"),
  resultSummary: document.querySelector("#resultSummary"),
  searchClear: document.querySelector("#searchClear"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  toast: document.querySelector("#toast"),
  updatedText: document.querySelector("#updatedText"),
};

const FLAVOR_LABELS = {
  tobacco: "烟草原味 / レギュラー",
  menthol: "薄荷清凉 / メンソール",
  fruit: "果香爆珠 / フレーバー",
  vapor: "电子烟口味 / ベイプ",
  device: "设备本体 / デバイス",
};

const STRENGTH_LABELS = {
  light: "偏轻柔",
  medium: "适中",
  strong: "偏强",
  "not-applicable": "不适用",
};

const AVAILABILITY = {
  "widely-available": {
    short: "常见",
    title: "常见渠道覆盖较高",
    copy: "全国便利店与烟草店较容易询问到，但这里不连接门店实时库存。",
  },
  likely: {
    short: "较可能有",
    title: "有售可能性较高",
    copy: "品牌渠道较广，具体口味与包装仍会因地区、门店和到货节奏不同。",
  },
  specialist: {
    short: "需专门店",
    title: "更依赖专门店或品牌门店",
    copy: "便利店不一定常备，建议优先查看烟草专门店、品牌店或大型折扣店。",
  },
  restricted: {
    short: "法规待确认",
    title: "尼古丁状态未知，不提供购买引导",
    copy: "日本销售含尼古丁电子烟液需要许可；页面无法确认该商品成分，因此请勿把旧价格或图片当成日本在售证明。",
  },
  discontinued: {
    short: "旧款风险",
    title: "可能停产或仅有旧库存",
    copy: "该名称可能属于旧款、停产款或已更名商品，不建议把页面价格当成当前可购承诺。",
  },
};

const initialFavorites = (() => {
  try {
    const value = JSON.parse(localStorage.getItem("tabako:favorites") || "[]");
    return Array.isArray(value) ? value.filter((id) => productById.has(id)) : [];
  } catch {
    return [];
  }
})();

const state = {
  query: "",
  category: "all",
  flavor: "all",
  sort: "recommended",
  rankingAudience: "jp",
  favoritesOnly: false,
  favorites: new Set(initialFavorites),
  activeProductId: null,
  aiImageData: "",
  aiMode: "recommend",
  aiHealth: aiClient.configured
    ? { state: "unknown", ready: false, keyConfigured: false }
    : { state: "local-only", ready: false, keyConfigured: false },
  jpyToCny: 0.0415,
};

function aiHealthLabel(health = state.aiHealth) {
  if (!aiClient.configured || health.state === "local-only") {
    return "本地先匹配 · 在线代理未连接";
  }
  if (health.state === "proxy-ready") return "MiniMax 代理已验证 · 本地先匹配";
  if (health.state === "proxy-missing-key") return "在线代理缺少服务端密钥";
  if (health.state === "proxy-timeout") return "在线代理检查超时 · 本地先匹配";
  if (health.state === "proxy-unreachable") return "在线代理暂不可达 · 本地先匹配";
  return "正在检查 MiniMax 安全代理…";
}

function aiHealthDetail(health = state.aiHealth) {
  if (!aiClient.configured || health.state === "local-only") {
    return "本地匹配可用 · 在线 MiniMax 未连接，照片不会上传";
  }
  if (health.state === "proxy-ready") return "在线 MiniMax 代理已验证可用";
  if (health.state === "proxy-missing-key") return "在线代理未配置服务端密钥，照片不会上传";
  if (health.state === "proxy-timeout") return "在线代理检查超时，已切换本地匹配";
  if (health.state === "proxy-unreachable") return "在线代理暂不可达，已切换本地匹配";
  return "正在检查在线代理是否可用…";
}

function updateAiEntryStatus() {
  if (!elements.aiEntryStatus) return;
  elements.aiEntryStatus.textContent = aiHealthLabel();
}

let lastProductTrigger = null;
let toastTimer = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hydrateIcons(root = document) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({
      attrs: { "aria-hidden": "true" },
      nameAttr: "data-lucide",
      root,
    });
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 1800);
}

function describeAiFailure(error, { localPreserved = false } = {}) {
  const fallback = error?.message || "在线 AI 暂不可用";
  if (error?.code === "minimax_quota_or_rate_limited") {
    const preserved = localPreserved
      ? "本地匹配结果已保留，可先按本地候选继续查看。"
      : "当前在线增强未完成，可先改用描述偏好做本地匹配。";
    return {
      title: "MiniMax 额度/限流",
      progress:
        "代理已接通，但 MiniMax 上游返回额度不足或请求过于频繁；本地匹配已保留",
      detail:
        `代理已接通，但 MiniMax 上游返回额度不足或请求过于频繁（Token Plan、余额或限流）。${preserved}下一步：检查 MiniMax 控制台 Token Plan/余额，充值后重试，或稍后再试。`,
      toast: "MiniMax 额度或限流失败，本地结果已保留",
      service: "代理已接通；MiniMax 上游额度不足或请求过于频繁",
    };
  }
  if (error?.code === "minimax_auth_failed") {
    return {
      title: "MiniMax 密钥异常",
      progress: "代理已接通，但 MiniMax 密钥无效或没有接口权限",
      detail: "代理已接通，但 MiniMax 密钥无效或没有接口权限。下一步：检查服务端密钥与模型/API 权限。",
      toast: "MiniMax 密钥或权限异常",
      service: "代理已接通；MiniMax 密钥或权限异常",
    };
  }
  return {
    title: "在线未完成",
    progress: fallback,
    detail: fallback,
    toast: fallback,
    service: fallback,
  };
}

function showAiServiceFailure(feedback) {
  if (!elements.aiServiceNote || !elements.aiServiceStatus || !feedback?.service) return;
  elements.aiServiceNote.dataset.state = "local";
  elements.aiServiceStatus.textContent = feedback.service;
}

function flavorLabel(item) {
  return FLAVOR_LABELS[item.flavor] ?? FLAVOR_LABELS.tobacco;
}

function availabilityMeta(item) {
  return AVAILABILITY[item.availability] ?? AVAILABILITY.likely;
}

function marketStatusMeta(item) {
  if (item.type !== "device") return null;

  const meta = {
    "current-mainstream": {
      label: "现行主流",
      copy: "当前主力设备，优先按这个型号核对烟弹兼容。",
      tone: "current",
    },
    "current-limited": {
      label: "限定在售",
      copy: "限定或阶段性在售，遇到现货再核对颜色/套装。",
      tone: "limited",
    },
    legacy: {
      label: "旧款识别",
      copy: "适合认旧设备或存量用户，购买前确认是否仍有售。",
      tone: "legacy",
    },
    "discontinued-stock-only": {
      label: "旧款识别",
      copy: "通常只作旧款/库存识别，不按现行主推购买。",
      tone: "legacy",
    },
    discontinued: {
      label: "已停产",
      copy: "已停产或官方不再主推，只建议作为旅行认款参考。",
      tone: "discontinued",
    },
    "overseas-reference": {
      label: "海外参考",
      copy: "开放式电子烟设备，日本购买与尼古丁合规需另行确认。",
      tone: "overseas",
    },
  };

  return meta[item.marketStatus] ?? {
    label: "海外参考",
    copy: "设备状态仍需按官方来源核对。",
    tone: "overseas",
  };
}

function imageSourceLabel(item) {
  if (item.type === "device") return "查看设备图片来源";
  if (item.type === "pod") return "查看图片来源";
  return "查看单包图片来源";
}

function imageAuditStatus(status) {
  if (status === "verified") return { label: "已核验", tone: "verified" };
  if (status === "archive-reference") return { label: "旧版实拍", tone: "reference" };
  return { label: "待核对", tone: "review" };
}

function cartonAuditStatus(item) {
  if (item.cartonStatus === "verified" || item.cartonStatus === "archive-reference") {
    return { label: "已核验", tone: "verified" };
  }
  if (!item.cartonApplicable || item.cartonStatus === "not-applicable") {
    return { label: "不适用", tone: "reference" };
  }
  return { label: "未作为准确整条", tone: "review" };
}

function mediaStatusStrip(item) {
  const pack = imageAuditStatus(item.imageStatus);
  const carton = cartonAuditStatus(item);
  return `
    <a class="detail-media-status-strip" href="#packageIdentity" aria-label="查看一包图和一条图核验说明">
      <span data-status="${escapeHtml(pack.tone)}">
        <small>一包图</small>
        <strong>${escapeHtml(pack.label)}</strong>
      </span>
      <span data-status="${escapeHtml(carton.tone)}">
        <small>一条图</small>
        <strong>${escapeHtml(carton.label)}</strong>
      </span>
      <i data-lucide="chevron-down" aria-hidden="true"></i>
    </a>
  `;
}

function filtersActive() {
  return Boolean(
    state.query ||
    state.category !== "all" ||
    state.flavor !== "all" ||
    state.favoritesOnly,
  );
}

function activeFilterCount() {
  return [
    state.category !== "all",
    state.flavor !== "all",
    state.favoritesOnly,
  ].filter(Boolean).length;
}

function currentProducts() {
  const sort = state.category === "device" || state.category === "pod" ? "device" : state.sort;
  return sortProducts(
    filterProducts(products, {
      query: state.query,
      category: state.category,
      flavor: state.flavor,
      favoritesOnly: state.favoritesOnly,
      favorites: state.favorites,
    }),
    sort,
  );
}

function updateFilterUi() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-audience]").forEach((button) => {
    const active = button.dataset.audience === state.rankingAudience;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.favoritesButton.setAttribute("aria-pressed", String(state.favoritesOnly));
  elements.favoritesButton.setAttribute(
    "aria-label",
    state.favoritesOnly ? "显示全部烟款" : `只看收藏，已收藏 ${state.favorites.size} 款`,
  );

  elements.searchClear.hidden = !state.query;
  elements.resetFilters.hidden = !filtersActive();
  elements.sortSelect.value = state.sort;

  const count = activeFilterCount();
  elements.filterCount.hidden = count === 0;
  elements.filterCount.textContent = String(count);
}

function updateComplianceNotice() {
  if (!elements.mapComplianceNotice) return;
  const electronicSelected = state.category === "device" || state.category === "pod";
  elements.mapComplianceNotice.dataset.tone = electronicSelected ? "caution" : "default";
  elements.mapComplianceNotice.textContent = electronicSelected
    ? "设备/烟弹需先确认日本法规、尼古丁状态和门店实际销售；这里不提供误导性购买指引。"
    : "传统烟可用 Google 地图找烟草店；电子烟/烟弹需确认日本法规和门店实际销售，不把地图结果当作购买承诺。";
}

function setImageFallback(image) {
  image.addEventListener(
    "error",
    () => {
      image.classList.add("is-missing");
      image.removeAttribute("src");
    },
    { once: true },
  );
}

function currentSearchPhrase() {
  if (elements.searchInput.value.trim()) return elements.searchInput.value.trim();
  if (state.category !== "all") {
    return `${document.querySelector(`[data-category="${state.category}"]`)?.textContent?.trim() ?? ""} 日本`;
  }
  if (state.flavor !== "all") return FLAVOR_LABELS[state.flavor] ?? "日本香烟";
  if (state.favoritesOnly) return "日本热门香烟";
  return "日本香烟";
}

function applyExternalLinks(query, targets) {
  const links = buildExternalSearchLinks(query);
  targets.images.href = links.images;
  targets.web.href = links.web;
  targets.official.href = links.official;
}

function updateEmptyRecovery() {
  const phrase = currentSearchPhrase();
  elements.emptyQuery.textContent = phrase;
  applyExternalLinks(phrase, {
    images: elements.emptyImagesLink,
    web: elements.emptyWebLink,
    official: elements.emptyOfficialLink,
  });
}

function renderCatalog() {
  const visibleProducts = currentProducts();
  const fragment = document.createDocumentFragment();
  let currentBrandKey = "";
  elements.cards.replaceChildren();

  visibleProducts.forEach((item) => {
    const brandKey = `${item.type}:${item.brand}`;
    if (brandKey !== currentBrandKey) {
      currentBrandKey = brandKey;
      const brandCount = visibleProducts.filter(
        (product) => product.type === item.type && product.brand === item.brand,
      ).length;
      const heading = document.createElement("section");
      heading.className = "brand-section-card";
      heading.setAttribute("aria-label", `${item.brand} 分组`);
      heading.innerHTML = `
        <span>${escapeHtml(item.categoryLabel)}</span>
        <strong>${escapeHtml(item.brand)}</strong>
        <small>${brandCount} 款 · 按品牌/型号排序</small>
      `;
      fragment.appendChild(heading);
    }

    const card = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const openButton = card.querySelector(".product-open");
    const favoriteButton = card.querySelector(".favorite-toggle");
    const image = card.querySelector(".product-image");
    const availability = availabilityMeta(item);
    const marketStatus = marketStatusMeta(item);

    card.dataset.productId = item.id;
    card.dataset.category = item.type;
    openButton.setAttribute("aria-label", `查看 ${item.jp}，${item.cn} 的详情`);
    openButton.addEventListener("click", (event) => openProduct(item.id, event.currentTarget));

    image.src = item.image;
    image.alt = `${item.jp} / ${item.cn} 包装参考图`;
    setImageFallback(image);

    card.querySelector(".category-tag").textContent =
      `${item.categoryLabel} · ${item.packageFormat}`;
    card.querySelector(".brand-name").textContent = item.brand;
    const stockBadge = card.querySelector(".stock-badge");
    stockBadge.dataset.level = item.availability;
    stockBadge.textContent = availability.short;
    card.querySelector(".jp-name").textContent = item.jp;
    card.querySelector(".cn-name").textContent = item.cn;
    card.querySelector(".jpy-price").textContent = yen(item.jpy);
    card.querySelector(".cny-price").textContent = `约 ${yuan(item.jpy, state.jpyToCny)}`;
    const marketBadge = card.querySelector(".market-status-badge");
    if (marketStatus) {
      marketBadge.hidden = false;
      marketBadge.dataset.status = marketStatus.tone;
      marketBadge.textContent = marketStatus.label;
      marketBadge.setAttribute("aria-label", `设备状态：${marketStatus.label}`);
    } else {
      marketBadge.hidden = true;
      marketBadge.textContent = "";
      marketBadge.removeAttribute("data-status");
      marketBadge.removeAttribute("aria-label");
    }
    card.querySelector(".product-traits").textContent =
      `${flavorLabel(item)} · ${STRENGTH_LABELS[item.strength]}`;
    card.querySelector(".jp-score").textContent = `${item.jpScore.toFixed(1)} / 5`;
    card.querySelector(".cn-score").textContent = `${item.cnScore.toFixed(1)} / 5`;

    const isFavorite = state.favorites.has(item.id);
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.setAttribute(
      "aria-label",
      `${isFavorite ? "取消收藏" : "收藏"} ${item.jp}`,
    );
    favoriteButton.addEventListener("click", () => toggleFavorite(item.id));

    fragment.appendChild(card);
  });

  elements.cards.appendChild(fragment);
  elements.resultSummary.textContent =
    `当前 ${visibleProducts.length} 款 · 全库 ${products.length} 款`;
  elements.emptyState.hidden = visibleProducts.length > 0;
  if (visibleProducts.length === 0) updateEmptyRecovery();
  hydrateIcons(elements.cards);
}

function rankingPool() {
  return products.filter(
    (item) =>
      item.type !== "device" &&
      item.type !== "pod" &&
      item.availability !== "discontinued",
  );
}

function renderRankings() {
  const sort = state.rankingAudience === "jp" ? "jp" : "cn";
  const scoreKey = state.rankingAudience === "jp" ? "jpScore" : "cnScore";
  const ranked = topDistinctBrands(rankingPool(), sort, 4);
  const fragment = document.createDocumentFragment();
  elements.rankingList.replaceChildren();

  ranked.forEach((item, index) => {
    const card = elements.rankingTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");

    card.setAttribute("aria-label", `排行第 ${index + 1}，查看 ${item.jp}`);
    card.addEventListener("click", (event) => openProduct(item.id, event.currentTarget));
    card.querySelector(".rank-number").textContent = String(index + 1).padStart(2, "0");
    image.src = item.image;
    image.alt = `${item.jp} 包装参考图`;
    setImageFallback(image);
    card.querySelector(".ranking-brand").textContent = item.brand;
    card.querySelector(".ranking-name").textContent = item.jp;
    card.querySelector(".ranking-cn").textContent = item.cn;
    card.querySelector(".ranking-score").textContent = `${item[scoreKey].toFixed(1)} / 5`;
    fragment.appendChild(card);
  });

  elements.rankingList.appendChild(fragment);
}

function renderAll() {
  updateFilterUi();
  updateComplianceNotice();
  renderRankings();
  renderCatalog();
}

function toggleFavorite(productId) {
  const item = productById.get(productId);
  if (!item) return;

  const activeElement = document.activeElement;
  const restoreCatalogFocus =
    activeElement?.classList.contains("favorite-toggle") &&
    activeElement.closest(".product-card")?.dataset.productId === productId;
  const restoreDetailFocus =
    state.activeProductId === productId &&
    elements.productDialog.open &&
    activeElement?.classList.contains("detail-favorite");
  const isFavorite = state.favorites.has(productId);
  if (isFavorite) {
    state.favorites.delete(productId);
  } else {
    state.favorites.add(productId);
  }

  localStorage.setItem("tabako:favorites", JSON.stringify([...state.favorites]));
  renderAll();
  if (restoreCatalogFocus) {
    const replacement = elements.cards.querySelector(
      `.product-card[data-product-id="${productId}"] .favorite-toggle`,
    );
    (replacement ?? elements.favoritesButton).focus({ preventScroll: true });
  }
  if (state.activeProductId === productId && elements.productDialog.open) {
    renderProductDetail(item);
    if (restoreDetailFocus) {
      requestAnimationFrame(() => {
        elements.productDetail.querySelector(".detail-favorite")?.focus({ preventScroll: true });
      });
    }
  }
  showToast(isFavorite ? "已取消收藏" : "已保存到收藏");
}

function renderProductDetail(item) {
  const availability = availabilityMeta(item);
  const officialLabel = item.priceStatus === "official" ? "官方参考价" : "指导价";
  const sourceLabel = item.purchaseAllowed ? "查看厂商/品牌来源" : "查看日本官方法规说明";
  const marketStatus = marketStatusMeta(item);
  const detailMarketStatus = marketStatus
    ? `
      <span class="detail-market-status" data-status="${escapeHtml(marketStatus.tone)}">
        <i data-lucide="radio-tower" aria-hidden="true"></i>
        <strong>${escapeHtml(marketStatus.label)}</strong>
        <small>${escapeHtml(marketStatus.copy)}</small>
      </span>
    `
    : "";
  const sourceLink = item.source
    ? `<a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a>`
    : `<button class="footer-link" type="button" data-open-method>查看数据说明</button>`;
  const favorite = state.favorites.has(item.id);
  const jpWidth = `${Math.min(100, item.jpScore * 20)}%`;
  const cnWidth = `${Math.min(100, item.cnScore * 20)}%`;
  const imageStatus = {
    verified: "已核对",
    "archive-reference": "旧版实拍",
    "review-required": "图片待核对",
    reference: "包装参考",
  }[item.imageStatus] ?? "包装参考";
  const cartonStatus = {
    verified: "整条实拍已核对",
    "contents-reference": "10 包内容物参考",
    "multi-carton-reference": "多条装参考",
    "variant-reference": "近似 SKU 参考",
    "archive-reference": "历史整条外箱",
    "source-only": "数量来源已核对",
    "needs-review": "整条图片待核对",
    "not-applicable": "不适用",
  }[item.cartonStatus] ?? "整条图片待核对";
  const packageSource = item.imageSource
    ? `<a href="${escapeHtml(item.imageSource)}" target="_blank" rel="noopener noreferrer">${imageSourceLabel(item)}</a>`
    : "";
  const cartonSource = item.cartonSource
    ? `<a href="${escapeHtml(item.cartonSource)}" target="_blank" rel="noopener noreferrer">查看一カートン来源</a>`
    : "";
  const cartonAlt = {
    verified: `${item.jp} 一カートン整条外包装实拍`,
    "archive-reference": `${item.jp} 历史一カートン整条外包装参考`,
    "contents-reference": `${item.jp} 10 包内容物参考`,
    "multi-carton-reference": `${item.jp} 多条装外包装参考`,
    "variant-reference": `${item.jp} 近似 SKU 外包装参考`,
  }[item.cartonStatus] ?? `${item.jp} 一カートン包装参考`;
  const cartonVisual = item.cartonImage
    ? `
      <div class="package-media-visual carton-visual">
        <img src="${escapeHtml(item.cartonImage)}" alt="${escapeHtml(cartonAlt)}" />
      </div>
    `
    : item.cartonApplicable
      ? `
        <div class="package-media-review">
          <i data-lucide="scan-search" aria-hidden="true"></i>
          <strong>不展示未经核对的整条图</strong>
          <span>${
            Array.isArray(item.cartonGallery) && item.cartonGallery.length
              ? "下方有已标注来源的参考图；它们不会被当作完整一条核验图。"
              : `已生成精确检索词：${escapeHtml(item.cartonSearchQuery)}`
          }</span>
        </div>
      `
      : `
        <div class="package-media-review is-not-applicable">
          <i data-lucide="circle-slash-2" aria-hidden="true"></i>
          <strong>这类商品不按一カートン展示</strong>
          <span>${escapeHtml(item.cartonNote)}</span>
        </div>
      `;
  const isExactCarton = ["verified", "archive-reference"].includes(item.cartonStatus);
  const cartonIntegrityNotice =
    item.cartonApplicable && !isExactCarton
      ? `
        <div class="carton-integrity-warning" role="note">
          <i data-lucide="shield-alert" aria-hidden="true"></i>
          <div>
            <strong>这里还不是同 SKU 整条实拍</strong>
            <span>下方图片只作单包、多盒、近似 SKU 或来源页参考；没有 10 个同款外盒/一カートン文字证据前，不会标为“整条实拍已核对”。</span>
          </div>
        </div>
      `
      : "";
  const cartonGallery = Array.isArray(item.cartonGallery) && item.cartonGallery.length
    ? `
      <div class="carton-reference-gallery" aria-label="补充包装参考图">
        ${item.cartonGallery
          .map((entry) => {
            const title = entry.title || entry.label || "补充参考图";
            const note = entry.note || "";
            const source = entry.source
              ? `<a href="${escapeHtml(entry.source)}" target="_blank" rel="noopener noreferrer">来源</a>`
              : "";
            return `
              <figure>
                <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(`${item.jp} ${title}`)}" loading="lazy" />
                <figcaption>
                  ${!isExactCarton ? `<em>非整条实拍</em>` : ""}
                  <strong>${escapeHtml(title)}</strong>
                  ${note ? `<span>${escapeHtml(note)}</span>` : ""}
                  ${source}
                </figcaption>
              </figure>
            `;
          })
          .join("")}
      </div>
    `
    : "";
  const cartonPrice = item.cartonApplicable
    ? `<strong>${escapeHtml(String(item.cartonPackCount))} 包 · ${escapeHtml(
        String(item.cartonStickCount),
      )} 支 · 参考合计 ${escapeHtml(yen(item.jpy * item.cartonPackCount))}</strong>`
    : `<strong>不使用一カートン规格</strong>`;
  const identityKicker = item.cartonApplicable ? "Pack vs. carton" : "Product identity";
  const variantNote = item.variantNote
    ? `<p class="variant-note"><i data-lucide="split" aria-hidden="true"></i>${escapeHtml(item.variantNote)}</p>`
    : "";
  const purchaseSection = item.purchaseAllowed
    ? `
      <section class="detail-block">
        <h3>去哪里找</h3>
        <p>先用商品的日文名在附近搜索；如果结果少，再改用通用“たばこ 販売店”搜索。</p>
        <div class="map-actions">
          <a
            class="primary-button"
            href="${escapeHtml(mapSearchUrl(item))}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i data-lucide="map-pinned" aria-hidden="true"></i>
            在 Google 地图查这款烟
          </a>
          <a
            class="secondary-button"
            href="${escapeHtml(mapSearchUrl())}"
            target="_blank"
            rel="noopener noreferrer"
          >
            查附近烟草销售点
          </a>
        </div>
        <div class="store-links" aria-label="按常见渠道搜索">
          <a href="${escapeHtml(chainMapUrl("セブン-イレブン"))}" target="_blank" rel="noopener noreferrer">7-Eleven</a>
          <a href="${escapeHtml(chainMapUrl("ファミリーマート"))}" target="_blank" rel="noopener noreferrer">FamilyMart</a>
          <a href="${escapeHtml(chainMapUrl("ローソン"))}" target="_blank" rel="noopener noreferrer">Lawson</a>
          <a href="${escapeHtml(chainMapUrl("ドン・キホーテ"))}" target="_blank" rel="noopener noreferrer">Don Quijote</a>
        </div>
        <button class="secondary-button full-width japanese-detail-action" type="button" data-japanese-product="${escapeHtml(item.id)}">
          <i data-lucide="languages" aria-hidden="true"></i>
          生成给店员看的日语沟通卡
        </button>
      </section>
    `
    : `
      <section class="detail-block regulatory-block">
        <h3>日本购买前先确认法规</h3>
        <p>页面不能确认这款电子烟或烟弹是否含尼古丁。日本厚生劳动省说明，含尼古丁烟液的销售需要许可；因此这里不提供门店或地图购买链接。</p>
        <a
          class="primary-button"
          href="${escapeHtml(item.source)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i data-lucide="shield-alert" aria-hidden="true"></i>
          查看日本厚生劳动省说明
        </a>
      </section>
    `;

  elements.productDetail.innerHTML = `
    <header class="detail-header">
      <span class="detail-label">Product detail</span>
      <div>
        <button
          class="favorite-toggle detail-favorite"
          type="button"
          aria-label="${favorite ? "取消收藏" : "收藏"} ${escapeHtml(item.jp)}"
          aria-pressed="${favorite}"
        >
          <i data-lucide="bookmark" aria-hidden="true"></i>
        </button>
        <button class="icon-button" type="button" data-close-dialog aria-label="关闭详情">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
    </header>

    <section class="detail-hero">
      <div class="detail-image-wrap">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.jp)} 包装参考图" />
      </div>
      <div class="detail-heading">
        <span class="category-tag">${escapeHtml(item.categoryLabel)} · ${escapeHtml(item.packageFormat)}</span>
        <h2 id="detailTitle">${escapeHtml(item.jp)}</h2>
        <p class="detail-cn">${escapeHtml(item.cn)}</p>
        <div class="detail-price">
          <strong>${escapeHtml(yen(item.jpy))}</strong>
          <small>约 ${escapeHtml(yuan(item.jpy, state.jpyToCny))}</small>
        </div>
        <span class="verified-label" data-status="${item.priceStatus}">
          <i data-lucide="${item.priceStatus === "official" ? "badge-check" : "badge-info"}" aria-hidden="true"></i>
          ${officialLabel} · ${item.priceChecked}
        </span>
        ${detailMarketStatus}
        ${mediaStatusStrip(item)}
        ${variantNote}
      </div>
    </section>

    <section class="detail-block package-identity" id="packageIdentity">
      <div class="detail-block-heading">
        <div>
          <p class="section-kicker">${identityKicker}</p>
          <h3>${escapeHtml(item.identityHeading)}</h3>
        </div>
        <span class="media-audit-badge">图片核验</span>
      </div>
      <div class="package-media-grid">
        <article class="package-media-card">
          <header>
            <div><small>${escapeHtml(item.unitLabel)}</small><strong>${escapeHtml(item.packageFormat)} · ${escapeHtml(item.packageFormatJp)}</strong></div>
            <span data-status="${escapeHtml(item.imageStatus)}">${escapeHtml(imageStatus)}</span>
          </header>
          <div class="package-media-visual">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.jp)} ${escapeHtml(item.packageFormat)}包装参考图" />
          </div>
          <p>${escapeHtml(item.imageNote)}</p>
          ${packageSource}
        </article>
        <article class="package-media-card carton-card">
          <header>
            <div><small>${escapeHtml(item.bulkLabel)}</small>${cartonPrice}</div>
            <span data-status="${escapeHtml(item.cartonStatus)}">${escapeHtml(cartonStatus)}</span>
          </header>
          ${cartonVisual}
          ${cartonIntegrityNotice}
          ${cartonGallery}
          <p>${escapeHtml(item.cartonNote)}</p>
          <div class="package-media-links">
            ${cartonSource}
            ${
              item.cartonApplicable
                ? `<a href="${escapeHtml(item.cartonSearchUrl)}" target="_blank" rel="noopener noreferrer">联网核对整条外箱图</a>`
                : ""
            }
          </div>
        </article>
      </div>
      <p class="section-note">${escapeHtml(item.identityNote)}</p>
    </section>

    <section class="detail-block">
      <h3>这款烟是什么风格</h3>
      <p>${escapeHtml(item.description)}</p>
      <dl class="detail-facts">
        <div><dt>口味</dt><dd>${escapeHtml(flavorLabel(item))}</dd></div>
        <div><dt>强度</dt><dd>${escapeHtml(STRENGTH_LABELS[item.strength])}</dd></div>
        <div><dt>品牌</dt><dd>${escapeHtml(item.brand)}</dd></div>
        <div><dt>兼容 / 类型</dt><dd>${escapeHtml(item.compatibility)}</dd></div>
      </dl>
    </section>

    <section class="detail-block">
      <h3>可能好不好买</h3>
      <div class="availability-panel" data-level="${item.availability}">
        <span class="availability-dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(availability.title)}</strong>
          <small>${escapeHtml(availability.copy)}</small>
        </div>
      </div>
    </section>

    <section class="detail-block">
      <h3>日本人与中国游客怎么看</h3>
      <div class="audience-grid">
        <article class="audience-card">
          <div class="audience-head"><span>日本品牌热度</span><strong>${item.jpScore.toFixed(1)} / 5</strong></div>
          <div class="audience-bar" aria-hidden="true"><span style="--score-width: ${jpWidth}"></span></div>
          <p>${escapeHtml(item.jpImpression)}</p>
        </article>
        <article class="audience-card">
          <div class="audience-head"><span>中国游客品牌热度</span><strong>${item.cnScore.toFixed(1)} / 5</strong></div>
          <div class="audience-bar" aria-hidden="true"><span style="--score-width: ${cnWidth}"></span></div>
          <p>${escapeHtml(item.cnImpression)}</p>
        </article>
      </div>
      <p class="section-note">同品牌烟款共用品牌级编辑指数；以上不是用户原话、随机数或实时销售统计。</p>
    </section>

    ${purchaseSection}

    <footer class="detail-source">
      <span>图片均标注核验状态；请以门店实物为准。</span>
      ${sourceLink}
    </footer>
  `;

  elements.productDetail.querySelector(".detail-favorite")?.addEventListener(
    "click",
    () => toggleFavorite(item.id),
  );
  elements.productDetail.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => requestProductClose());
  });
  elements.productDetail.querySelector("[data-open-method]")?.addEventListener("click", () => {
    requestProductClose(false);
    openSimpleDialog(elements.methodDialog);
  });
  elements.productDetail.querySelector("[data-japanese-product]")?.addEventListener(
    "click",
    (event) => {
      const productId = event.currentTarget.dataset.japaneseProduct;
      requestProductClose(false);
      openAiDialog("japanese", { productId });
    },
  );

  elements.productDetail.querySelectorAll("img").forEach(setImageFallback);
  hydrateIcons(elements.productDetail);
}

function openProduct(productId, trigger, pushHistory = true) {
  const item = productById.get(productId);
  if (!item) return;

  lastProductTrigger = trigger ?? lastProductTrigger;
  state.activeProductId = productId;
  renderProductDetail(item);

  if (!elements.productDialog.open) {
    elements.productDialog.showModal();
  }

  if (pushHistory && history.state?.tabakoDetail !== productId) {
    history.pushState({ tabakoDetail: productId }, "", `#product-${productId}`);
  }

  requestAnimationFrame(() => {
    elements.productDetail.querySelector("[data-close-dialog]")?.focus({ preventScroll: true });
  });
}

function closeProductDialog() {
  if (elements.productDialog.open) {
    elements.productDialog.close();
  }
  state.activeProductId = null;
  lastProductTrigger?.focus({ preventScroll: true });
}

function requestProductClose(useHistory = true) {
  if (useHistory && history.state?.tabakoDetail) {
    history.back();
    return;
  }
  closeProductDialog();
}

function openSimpleDialog(dialog) {
  if (!dialog.open) {
    dialog.showModal();
  }
  requestAnimationFrame(() => dialog.querySelector("[data-close-dialog]")?.focus());
}

function closeSimpleDialog(dialog) {
  if (dialog.open) dialog.close();
  if (dialog === elements.aiDialog) resetAiImage();
}

function compactCatalogForAi() {
  return products.map((item) => ({
    id: item.id,
    jp: item.jp,
    cn: item.cn,
    brand: item.brand,
    type: item.type,
    flavor: item.flavor,
    strength: item.strength,
    jpy: item.jpy,
    availability: item.availability,
    purchaseAllowed: item.purchaseAllowed,
    jpScore: item.jpScore,
    cnScore: item.cnScore,
    searchText: [
      item.jp,
      item.cn,
      item.brand,
      item.description,
      item.compatibility,
      item.categoryLabel,
    ].join(" "),
  }));
}

function setAiMode(mode) {
  if (!["recommend", "vision", "japanese"].includes(mode)) return;
  state.aiMode = mode;
  document.querySelectorAll("[data-ai-mode]").forEach((button) => {
    const active = button.dataset.aiMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-ai-panel]").forEach((panel) => {
    const active = panel.dataset.aiPanel === mode;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  elements.aiResultSection.hidden = true;
  resetAiProgress();
}

function populateJapaneseProducts() {
  const current = elements.aiJapaneseProductSelect.value;
  const fragment = document.createDocumentFragment();
  products
    .filter((item) => item.purchaseAllowed)
    .forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.jp} · ${item.cn}`;
      fragment.appendChild(option);
    });
  elements.aiJapaneseProductSelect.replaceChildren(fragment);
  if (current && productById.has(current)) elements.aiJapaneseProductSelect.value = current;
}

function updateJapaneseCard() {
  const item = productById.get(elements.aiJapaneseProductSelect.value);
  if (!item) {
    elements.aiJapaneseText.textContent = "请选择烟款";
    elements.aiJapaneseExplain.textContent = "把这张卡直接给便利店或烟草店店员看。";
    elements.aiJapaneseCopy.disabled = true;
    return;
  }

  elements.aiJapaneseText.textContent = buildJapaneseRequest(
    item.jp,
    elements.aiJapaneseQuantity.value,
  );
  elements.aiJapaneseExplain.textContent =
    `${item.cn} · 参考 ${yen(item.jpy)}。有无库存请以店员答复为准。`;
  elements.aiJapaneseCopy.disabled = false;
}

function resetAiImage() {
  state.aiImageData = "";
  elements.aiImageInput.value = "";
  elements.aiImagePreview.hidden = true;
  elements.aiImagePreview.removeAttribute("src");
  elements.aiImagePlaceholder.hidden = false;
  elements.aiVisionSubmit.disabled = true;
}

function openAiDialog(mode = "recommend", { query = "", productId = "" } = {}) {
  setAiMode(mode);
  elements.aiServiceNote.dataset.state = state.aiHealth.ready ? "online" : "local";
  elements.aiServiceStatus.textContent = aiHealthDetail();
  refreshAiHealth();

  if (query) elements.aiPrompt.value = query.slice(0, AI_LIMITS.query);
  if (mode === "japanese") {
    populateJapaneseProducts();
    if (productId && productById.get(productId)?.purchaseAllowed) {
      elements.aiJapaneseProductSelect.value = productId;
    }
    updateJapaneseCard();
  }

  openSimpleDialog(elements.aiDialog);
  requestAnimationFrame(() => {
    if (mode === "recommend") elements.aiPrompt.focus({ preventScroll: true });
    if (mode === "vision") elements.aiImageInput.focus({ preventScroll: true });
    if (mode === "japanese") {
      elements.aiJapaneseProductSelect.focus({ preventScroll: true });
    }
  });
}

function createAiMatchCard(match) {
  const item = productById.get(match.id);
  if (!item?.purchaseAllowed) return null;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "ai-match-card";
  button.dataset.productId = item.id;
  button.setAttribute("aria-label", `查看 ${item.jp} 详情`);

  const visual = document.createElement("span");
  visual.className = "ai-match-visual";
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = `${item.jp} 包装参考图`;
  image.loading = "lazy";
  setImageFallback(image);
  visual.appendChild(image);

  const copy = document.createElement("span");
  copy.className = "ai-match-copy";
  const brand = document.createElement("small");
  brand.textContent = `${item.brand} · ${availabilityMeta(item).short}`;
  const name = document.createElement("strong");
  name.textContent = item.jp;
  const cn = document.createElement("span");
  cn.textContent = `${item.cn} · ${yen(item.jpy)}`;
  const reason = document.createElement("em");
  reason.textContent = match.reason || "与输入线索接近";
  copy.append(brand, name, cn, reason);

  const arrow = document.createElement("i");
  arrow.dataset.lucide = "chevron-right";
  arrow.setAttribute("aria-hidden", "true");
  button.append(visual, copy, arrow);
  button.addEventListener("click", () => {
    closeSimpleDialog(elements.aiDialog);
    openProduct(item.id, elements.aiOpenButton);
  });
  return button;
}

function renderAiResult(payload, badge = "本地目录") {
  elements.aiAnswer.textContent =
    payload.answer || "暂时没有足够线索，请换一个品牌名、包装颜色或口味描述。";
  elements.aiResultBadge.textContent = badge;
  elements.aiMatchList.replaceChildren();
  elements.aiSourceList.replaceChildren();
  elements.aiResultActions.replaceChildren();
  elements.aiResultActions.hidden = true;

  for (const match of payload.matches ?? []) {
    const card = createAiMatchCard(match);
    if (card) elements.aiMatchList.appendChild(card);
  }

  for (const source of payload.sources ?? []) {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const title = document.createElement("strong");
    title.textContent = source.title;
    const snippet = document.createElement("span");
    snippet.textContent = source.snippet || new URL(source.url).hostname;
    const icon = document.createElement("i");
    icon.dataset.lucide = "arrow-up-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(title, snippet, icon);
    elements.aiSourceList.appendChild(link);
  }

  renderAiRecoveryActions(payload);

  elements.aiResultSection.hidden = false;
  hydrateIcons(elements.aiResultSection);
  if (elements.aiProgress.hidden) {
    const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    elements.aiResultSection.scrollIntoView({ block: "nearest", behavior: scrollBehavior });
  }
}

function setButtonBusy(button, busy, busyText) {
  if (!button.dataset.idleHtml) button.dataset.idleHtml = button.innerHTML;
  button.disabled = busy;
  button.classList.toggle("is-loading", busy);
  if (busy) {
    button.textContent = busyText;
  } else {
    button.innerHTML = button.dataset.idleHtml;
    hydrateIcons(button);
  }
}

function renderAiRecoveryActions(payload) {
  if (!payload.recovery) return;

  const recoveryQuery = currentSearchPhrase();
  const links = buildExternalSearchLinks(recoveryQuery);
  const queryHint = document.createElement("p");
  queryHint.className = "ai-recovery-query";
  queryHint.textContent = `将搜索：${recoveryQuery}`;

  const localButton = document.createElement("button");
  localButton.type = "button";
  localButton.className = "secondary-button";
  localButton.textContent = "只看本地匹配";
  localButton.disabled = elements.aiMatchList.children.length === 0;
  localButton.addEventListener("click", () => {
    const target = elements.aiMatchList.firstElementChild ?? elements.aiAnswer;
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if ("focus" in target) target.focus({ preventScroll: true });
  });

  const webLink = document.createElement("a");
  webLink.className = "secondary-button";
  webLink.href = links.web;
  webLink.target = "_blank";
  webLink.rel = "noopener noreferrer";
  webLink.textContent = "打开联网搜索关键词";
  webLink.setAttribute("aria-label", `打开联网搜索关键词：${recoveryQuery}`);

  elements.aiResultActions.append(queryHint, localButton, webLink);
  elements.aiResultActions.hidden = false;
}

function resetAiProgress() {
  elements.aiProgress.hidden = true;
  elements.aiProgress.dataset.state = "running";
  elements.aiProgressBar.value = 0;
  elements.aiProgressBar.setAttribute("aria-valuenow", "0");
  elements.aiProgressLabel.textContent = "准备开始";
  elements.aiProgressPercent.textContent = "0%";
  elements.aiProgressSteps.replaceChildren();
}

function setAiProgress({
  value,
  label,
  steps,
  current,
  state = "running",
  percentLabel = "",
}) {
  const boundedValue = Math.max(0, Math.min(100, Math.round(value)));
  elements.aiProgress.hidden = false;
  elements.aiProgress.dataset.state = state;
  elements.aiProgressBar.value = boundedValue;
  elements.aiProgressBar.setAttribute("aria-valuenow", String(boundedValue));
  elements.aiProgressLabel.textContent = label;
  elements.aiProgressPercent.textContent = percentLabel || `${boundedValue}%`;

  const fragment = document.createDocumentFragment();
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const isTerminal = state !== "running" && index === current;
    const status = index < current ? "done" : index === current ? state : "pending";
    item.dataset.status = status;
    if (index < current || (index === current && state === "complete")) {
      icon.textContent = "✓";
    } else if (index === current && state === "blocked") {
      icon.textContent = "!";
    } else if (index === current && state === "failed") {
      icon.textContent = "×";
    } else {
      icon.textContent = String(index + 1);
    }
    copy.textContent = step;
    if (isTerminal) copy.setAttribute("aria-current", "step");
    item.append(icon, copy);
    fragment.appendChild(item);
  });
  elements.aiProgressSteps.replaceChildren(fragment);
}

function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function refreshAiHealth() {
  if (!aiClient.configured) {
    state.aiHealth = { state: "local-only", ready: false, keyConfigured: false };
    updateAiEntryStatus();
    if (elements.aiServiceNote && elements.aiServiceStatus) {
      elements.aiServiceNote.dataset.state = "local";
      elements.aiServiceStatus.textContent = aiHealthDetail();
    }
    return state.aiHealth;
  }

  state.aiHealth = { state: "checking", ready: false, keyConfigured: false };
  updateAiEntryStatus();
  if (elements.aiServiceNote && elements.aiServiceStatus) {
    elements.aiServiceNote.dataset.state = "checking";
    elements.aiServiceStatus.textContent = aiHealthDetail();
  }

  state.aiHealth = await aiClient.health();
  updateAiEntryStatus();
  if (elements.aiServiceNote && elements.aiServiceStatus) {
    elements.aiServiceNote.dataset.state = state.aiHealth.ready ? "online" : "local";
    elements.aiServiceStatus.textContent = aiHealthDetail();
  }
  return state.aiHealth;
}

async function ensureAiReady() {
  if (!aiClient.configured) return state.aiHealth;
  if (state.aiHealth.ready) return state.aiHealth;
  return refreshAiHealth();
}

async function runAiRecommendation() {
  const query = elements.aiPrompt.value.trim();
  if (!query) {
    showToast("先描述包装、口味或预算");
    elements.aiPrompt.focus();
    return;
  }

  const steps = aiClient.configured
    ? ["理解你的描述", "匹配本地目录", "等待安全代理返回", "库外联网补充", "整理结果"]
    : ["理解你的描述", "匹配本地目录", "确认在线增强状态", "完成"];
  setButtonBusy(elements.aiRecommendSubmit, true, "正在理解你的描述…");
  setAiProgress({ value: 8, label: "已收到，正在理解你的描述", steps, current: 0 });
  await nextPaint();

  let localResult = null;
  try {
    const catalog = compactCatalogForAi();
    const matches = localRecommend(query, catalog);
    localResult = {
      answer: matches.length
        ? `先按名称、口味、强度、预算和热度，从本地 ${catalog.length} 款目录里筛出了这些候选。`
        : "本地目录暂时没有足够接近的候选，可以继续联网核对。",
      matches,
      sources: [],
    };
    setAiProgress({ value: 48, label: `本地目录已匹配 ${matches.length} 个候选`, steps, current: 1 });
    renderAiResult(localResult, "本地即时匹配");
    await nextPaint();

    const health = await ensureAiReady();
    if (!health.ready) {
      setAiProgress({
        value: 100,
        label: `本地匹配已完成；${aiHealthDetail(health)}`,
        steps,
        current: 3,
        state: "complete",
      });
      return;
    }

    setButtonBusy(elements.aiRecommendSubmit, true, "正在等待在线结果…");
    const resultPromise = aiClient.ask({ mode: "recommend", query, catalog });
    setAiProgress({ value: 70, label: "请求已发送，正在等待安全代理返回", steps, current: 2 });
    const result = await resultPromise;
    let finalResult = result;
    if ((result.matches ?? []).length === 0) {
      const fallbackQuery = [query, result.answer, "日本 たばこ パッケージ 価格 販売店"]
        .filter(Boolean)
        .join(" ");
      setAiProgress({
        value: 84,
        label: "目录未命中；正在自动联网补充库外线索",
        steps,
        current: 3,
      });
      try {
        const online = await aiClient.ask({ mode: "search", query: fallbackQuery });
        finalResult = {
          ...result,
          answer:
            `${result.answer || "本地目录没有命中。"} 已自动联网查找库外资料；下方来源仅作核对线索，未自动写入目录。`,
          matches: [],
          sources: online.sources ?? [],
        };
      } catch (fallbackError) {
        finalResult = {
          ...result,
          answer:
            `${result.answer || "本地目录没有命中。"} 自动联网补充未完成：${fallbackError.message || "请稍后重试"}。`,
          matches: [],
        };
      }
    }
    setAiProgress({ value: 94, label: "已收到返回，正在整理 AI 与本地目录结果", steps, current: 4 });
    await nextPaint();
    renderAiResult(
      finalResult,
      (result.matches ?? []).length === 0 ? "MiniMax + 联网补充" : "MiniMax + 本地目录",
    );
    setAiProgress({
      value: 100,
      label:
        (finalResult.matches ?? []).length === 0 && (finalResult.sources ?? []).length
          ? `匹配完成；已补充 ${(finalResult.sources ?? []).length} 条联网线索`
          : "匹配完成",
      steps,
      current: steps.length - 1,
      state: "complete",
    });
  } catch (error) {
    const feedback = describeAiFailure(error, { localPreserved: true });
    showAiServiceFailure(feedback);
    setAiProgress({
      value: 70,
      label: `在线增强失败：${feedback.progress}`,
      steps,
      current: Math.max(2, steps.length - 2),
      state: "failed",
      percentLabel: "失败",
    });
    renderAiResult(
      {
        ...(localResult ?? { matches: [], sources: [] }),
        answer: `${localResult?.answer || "本地匹配已保留。"} ${feedback.detail}`,
        recovery: true,
      },
      `本地匹配 · ${feedback.title}`,
    );
    showToast(feedback.toast);
  } finally {
    setButtonBusy(elements.aiRecommendSubmit, false);
  }
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(new Error("图片读取失败")));
    reader.readAsDataURL(file);
  });
}

async function selectAiImage(file) {
  resetAiImage();
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    showToast("请选择 JPG、PNG 或 WebP 图片");
    return;
  }
  if (file.size > AI_LIMITS.imageBytes) {
    showToast("图片超过 4 MB，请压缩后再试");
    return;
  }

  try {
    state.aiImageData = await readImageFile(file);
    elements.aiImagePreview.src = state.aiImageData;
    elements.aiImagePreview.hidden = false;
    elements.aiImagePlaceholder.hidden = true;
    elements.aiVisionSubmit.disabled = false;
  } catch (error) {
    showToast(error.message);
  }
}

async function runAiVision() {
  if (!state.aiImageData) {
    showToast("请先选择一张烟盒图片");
    return;
  }
  const steps = ["检查图片", "检查安全代理", "等待安全代理返回", "匹配本地目录", "库外联网补充"];
  setButtonBusy(elements.aiVisionSubmit, true, "正在检查图片…");
  setAiProgress({ value: 10, label: "正在检查图片格式和大小", steps, current: 0 });
  await nextPaint();
  try {
    setAiProgress({ value: 28, label: "正在检查安全代理是否可用", steps, current: 1 });
    await nextPaint();
    const health = await ensureAiReady();
    if (!health.ready) {
      setAiProgress({
        value: 28,
        label: `连接检查未通过；${aiHealthDetail(health)}；图片没有上传`,
        steps,
        current: 1,
        state: "blocked",
        percentLabel: "阻断",
      });
      renderAiResult(
        {
          answer:
            "在线识别未启用或代理健康检查未通过。为避免把密钥暴露在网页里，拍照识烟只会在安全代理确认可用后发送图片；当前图片没有上传。你仍可用“描述偏好”进行本地匹配。",
          matches: [],
          sources: [],
        },
        "隐私保护 · 未上传",
      );
      return;
    }

    setButtonBusy(elements.aiVisionSubmit, true, "正在等待识别结果…");
    const resultPromise = aiClient.ask({
      mode: "vision",
      query: "",
      image: state.aiImageData,
      catalog: compactCatalogForAi(),
    });
    setAiProgress({ value: 70, label: "图片请求已发送；正在等待安全代理返回", steps, current: 2 });
    const result = await resultPromise;
    setAiProgress({ value: 82, label: "已收到识别结果；正在匹配本地目录", steps, current: 3 });
    await nextPaint();
    let finalResult = result;
    let badge = "MiniMax 图片理解";
    if ((result.matches ?? []).length === 0) {
      const fallbackQuery = [result.answer, "日本 たばこ パッケージ 価格"]
        .join(" ")
        .replace(/\s+/g, " ")
        .slice(0, AI_LIMITS.query);
      setAiProgress({
        value: 90,
        label: "目录未命中；正在自动联网补充库外线索",
        steps,
        current: 4,
      });
      try {
        const online = await aiClient.ask({ mode: "search", query: fallbackQuery });
        finalResult = {
          answer:
            `${result.answer || "图片识别没有命中本地目录。"} 已自动联网查找库外资料；下方来源仅作核对线索，未自动写入目录。`,
          matches: [],
          sources: online.sources ?? [],
        };
        badge = "MiniMax 图片理解 + 联网补充";
      } catch (fallbackError) {
        finalResult = {
          answer:
            `${result.answer || "图片识别没有命中本地目录。"} 自动联网补充未完成：${fallbackError.message || "请稍后重试"}。`,
          matches: [],
          sources: [],
        };
        badge = "MiniMax 图片理解 · 库外未补全";
      }
    }
    renderAiResult(finalResult, badge);
    setAiProgress({
      value: 100,
      label: (finalResult.sources ?? []).length
        ? `图片识别完成；已补充 ${(finalResult.sources ?? []).length} 条联网线索`
        : "图片识别完成",
      steps,
      current: (result.matches ?? []).length === 0 ? 4 : 3,
      state: "complete",
    });
  } catch (error) {
    const feedback = describeAiFailure(error);
    showAiServiceFailure(feedback);
    setAiProgress({
      value: 70,
      label: `图片识别未完成：${feedback.progress}`,
      steps,
      current: 2,
      state: "failed",
      percentLabel: "失败",
    });
    renderAiResult(
      {
        answer: feedback.detail || "图片识别暂不可用，请稍后重试。",
        matches: [],
        sources: [],
        recovery: true,
      },
      `识别未完成 · ${feedback.title}`,
    );
  } finally {
    setButtonBusy(elements.aiVisionSubmit, false);
  }
}

function renderOnlineResults(payload) {
  elements.onlineResultList.replaceChildren();
  if (payload.answer) {
    const summary = document.createElement("p");
    summary.className = "online-summary";
    summary.textContent = payload.answer;
    elements.onlineResultList.appendChild(summary);
  }

  for (const source of payload.sources ?? []) {
    const link = document.createElement("a");
    link.className = "online-result-card";
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const domain = document.createElement("small");
    domain.textContent = new URL(source.url).hostname;
    const title = document.createElement("strong");
    title.textContent = source.title;
    const snippet = document.createElement("span");
    snippet.textContent = source.snippet || "打开原网页核对";
    const icon = document.createElement("i");
    icon.dataset.lucide = "arrow-up-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(domain, title, snippet, icon);
    elements.onlineResultList.appendChild(link);
  }
  hydrateIcons(elements.onlineResultList);
}

async function openOnlineSearch() {
  const query = currentSearchPhrase();
  elements.onlineSearchQuery.textContent = query;
  elements.onlineResultList.replaceChildren();
  applyExternalLinks(query, {
    images: elements.onlineImagesLink,
    web: elements.onlineWebLink,
    official: elements.onlineOfficialLink,
  });
  openSimpleDialog(elements.onlineSearchDialog);

  const health = await ensureAiReady();
  if (!health.ready) {
    elements.onlineSearchStatus.textContent =
      `${aiHealthDetail(health)}。下方三个入口仍可直接联网搜索，不需要本站保存密钥。`;
    return;
  }

  elements.onlineSearchStatus.textContent = "MiniMax 正在联网查找当前资料…";
  try {
    const result = await aiClient.ask({ mode: "search", query });
    elements.onlineSearchStatus.textContent =
      result.sources.length > 0
        ? `找到 ${result.sources.length} 条可继续核对的网页线索`
        : "没有找到可靠来源，建议使用下方直接搜索";
    renderOnlineResults(result);
  } catch (error) {
    const feedback = describeAiFailure(error);
    showAiServiceFailure(feedback);
    elements.onlineSearchStatus.textContent =
      `${feedback.detail || "联网 AI 暂不可用"} 仍可使用下方直接搜索。`;
  }
}

function syncFilterForm() {
  const categoryInput = elements.filterDialog.querySelector(
    `input[name="filterCategory"][value="${state.category}"]`,
  );
  const flavorInput = elements.filterDialog.querySelector(
    `input[name="filterFlavor"][value="${state.flavor}"]`,
  );
  if (categoryInput) categoryInput.checked = true;
  if (flavorInput) flavorInput.checked = true;
}

function openFilters() {
  syncFilterForm();
  openSimpleDialog(elements.filterDialog);
}

function applyFilterForm() {
  state.category =
    elements.filterDialog.querySelector('input[name="filterCategory"]:checked')?.value ?? "all";
  state.flavor =
    elements.filterDialog.querySelector('input[name="filterFlavor"]:checked')?.value ?? "all";
  closeSimpleDialog(elements.filterDialog);
  renderAll();
  document.querySelector("#catalog")?.scrollIntoView({ block: "start" });
}

function resetFilters({ preserveQuery = false } = {}) {
  if (!preserveQuery) {
    state.query = "";
    elements.searchInput.value = "";
  }
  state.category = "all";
  state.flavor = "all";
  state.favoritesOnly = false;
  state.sort = "recommended";
  renderAll();
}

async function loadRate() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5500);

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/JPY", {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("rate request failed");
    const payload = await response.json();
    const rate = Number(payload?.rates?.CNY);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("invalid CNY rate");

    state.jpyToCny = rate;
    elements.rateText.textContent = `1 JPY = ${rate.toFixed(5)} CNY`;
    elements.updatedText.textContent = `汇率更新：${new Date().toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    renderCatalog();
    if (state.activeProductId) {
      renderProductDetail(productById.get(state.activeProductId));
    }
  } catch {
    elements.rateText.textContent = `暂用参考汇率 1 JPY = ${state.jpyToCny.toFixed(5)} CNY`;
    elements.updatedText.textContent = `价格校对：${catalogMeta.priceChecked}`;
  } finally {
    clearTimeout(timeout);
  }
}

elements.searchInput.addEventListener("input", (event) => {
  state.query = event.currentTarget.value.trim().toLocaleLowerCase();
  renderCatalog();
  updateFilterUi();
});

elements.searchClear.addEventListener("click", () => {
  state.query = "";
  elements.searchInput.value = "";
  elements.searchInput.focus();
  renderCatalog();
  updateFilterUi();
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    renderAll();
  });
});

document.querySelectorAll("[data-audience]").forEach((button) => {
  button.addEventListener("click", () => {
    state.rankingAudience = button.dataset.audience;
    renderRankings();
    updateFilterUi();
  });
});

elements.sortSelect.addEventListener("change", (event) => {
  state.sort = event.currentTarget.value;
  renderCatalog();
});

elements.favoritesButton.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  renderAll();
  if (state.favoritesOnly && state.favorites.size === 0) {
    showToast("还没有收藏烟款");
  }
});

elements.aiOpenButton.addEventListener("click", () => openAiDialog("recommend"));
elements.onlineSearchButton.addEventListener("click", openOnlineSearch);

document.querySelectorAll("[data-open-ai-search]").forEach((button) => {
  button.addEventListener("click", () => {
    openAiDialog("recommend", { query: currentSearchPhrase() });
  });
});

document.querySelectorAll("[data-ai-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setAiMode(button.dataset.aiMode);
    if (button.dataset.aiMode === "japanese") {
      populateJapaneseProducts();
      updateJapaneseCard();
    }
  });
});

document.querySelectorAll("[data-ai-suggestion]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.aiPrompt.value = button.dataset.aiSuggestion;
    elements.aiPrompt.focus();
  });
});

elements.aiRecommendSubmit.addEventListener("click", runAiRecommendation);
elements.aiPrompt.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runAiRecommendation();
  }
});
elements.aiImageInput.addEventListener("change", (event) => {
  selectAiImage(event.currentTarget.files?.[0]);
});
elements.aiVisionSubmit.addEventListener("click", runAiVision);
elements.aiJapaneseProductSelect.addEventListener("change", updateJapaneseCard);
elements.aiJapaneseQuantity.addEventListener("change", updateJapaneseCard);
elements.aiJapaneseCopy.addEventListener("click", async () => {
  const text = elements.aiJapaneseText.textContent.trim();
  if (!text || text === "请选择烟款") return;
  try {
    await navigator.clipboard.writeText(text);
    showToast("日语沟通卡已复制");
  } catch {
    showToast("复制失败，请长按日语文字复制");
  }
});

elements.filterButton.addEventListener("click", openFilters);
elements.filterApply.addEventListener("click", applyFilterForm);
elements.filterReset.addEventListener("click", () => {
  state.category = "all";
  state.flavor = "all";
  syncFilterForm();
});
elements.resetFilters.addEventListener("click", () => resetFilters());
document.querySelectorAll("[data-reset-filters]").forEach((button) => {
  button.addEventListener("click", () => resetFilters());
});

document.querySelectorAll("[data-open-method]").forEach((button) => {
  button.addEventListener("click", () => openSimpleDialog(elements.methodDialog));
});

document.querySelectorAll(".sheet-dialog").forEach((dialog) => {
  dialog.querySelectorAll(".dialog-scrim").forEach((scrim) => {
    scrim.addEventListener("click", () => {
      if (dialog === elements.productDialog) {
        requestProductClose();
      } else {
        closeSimpleDialog(dialog);
      }
    });
  });
  dialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      if (dialog === elements.productDialog) {
        requestProductClose();
      } else {
        closeSimpleDialog(dialog);
      }
    });
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (dialog === elements.productDialog) {
      requestProductClose();
    } else {
      closeSimpleDialog(dialog);
    }
  });
});

window.addEventListener("popstate", (event) => {
  const productId = event.state?.tabakoDetail;
  if (productId && productById.has(productId)) {
    openProduct(productId, lastProductTrigger, false);
  } else {
    closeProductDialog();
  }
});

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName;
  if (
    event.key === "/" &&
    tagName !== "INPUT" &&
    tagName !== "TEXTAREA" &&
    tagName !== "SELECT"
  ) {
    event.preventDefault();
    elements.searchInput.focus();
  }
});

window.addEventListener("load", () => hydrateIcons(), { once: true });

if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // The guide remains usable online if offline registration is unavailable.
      });
    },
    { once: true },
  );
}

updateAiEntryStatus();
renderAll();
hydrateIcons();
loadRate();

const requestedProductId = new URLSearchParams(window.location.search).get("product");
if (requestedProductId && productById.has(requestedProductId)) {
  requestAnimationFrame(() => openProduct(requestedProductId, null, false));
}
