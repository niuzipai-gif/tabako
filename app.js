import { rawProducts } from "./data/products.js";
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

const elements = {
  cards: document.querySelector("#cards"),
  cardTemplate: document.querySelector("#cardTemplate"),
  emptyState: document.querySelector("#emptyState"),
  favoritesButton: document.querySelector("#favoritesButton"),
  filterApply: document.querySelector("#filterApply"),
  filterButton: document.querySelector("#filterButton"),
  filterCount: document.querySelector("#filterCount"),
  filterDialog: document.querySelector("#filterDialog"),
  filterReset: document.querySelector("#filterReset"),
  methodDialog: document.querySelector("#methodDialog"),
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
  jpyToCny: 0.0415,
};

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

function flavorLabel(item) {
  return FLAVOR_LABELS[item.flavor] ?? FLAVOR_LABELS.tobacco;
}

function availabilityMeta(item) {
  return AVAILABILITY[item.availability] ?? AVAILABILITY.likely;
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
  return sortProducts(
    filterProducts(products, {
      query: state.query,
      category: state.category,
      flavor: state.flavor,
      favoritesOnly: state.favoritesOnly,
      favorites: state.favorites,
    }),
    state.sort,
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

function renderCatalog() {
  const visibleProducts = currentProducts();
  const fragment = document.createDocumentFragment();
  elements.cards.replaceChildren();

  visibleProducts.forEach((item) => {
    const card = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const openButton = card.querySelector(".product-open");
    const favoriteButton = card.querySelector(".favorite-toggle");
    const image = card.querySelector(".product-image");
    const availability = availabilityMeta(item);

    card.dataset.productId = item.id;
    openButton.setAttribute("aria-label", `查看 ${item.jp}，${item.cn} 的详情`);
    openButton.addEventListener("click", (event) => openProduct(item.id, event.currentTarget));

    image.src = item.image;
    image.alt = `${item.jp} / ${item.cn} 包装参考图`;
    setImageFallback(image);

    card.querySelector(".category-tag").textContent = item.categoryLabel;
    const stockBadge = card.querySelector(".stock-badge");
    stockBadge.dataset.level = item.availability;
    stockBadge.textContent = availability.short;
    card.querySelector(".jp-name").textContent = item.jp;
    card.querySelector(".cn-name").textContent = item.cn;
    card.querySelector(".jpy-price").textContent = yen(item.jpy);
    card.querySelector(".cny-price").textContent = `约 ${yuan(item.jpy, state.jpyToCny)}`;
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
  const ranked = topDistinctBrands(rankingPool(), sort, 6);
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
  const sourceLink = item.source
    ? `<a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a>`
    : `<button class="footer-link" type="button" data-open-method>查看数据说明</button>`;
  const favorite = state.favorites.has(item.id);
  const jpWidth = `${Math.min(100, item.jpScore * 20)}%`;
  const cnWidth = `${Math.min(100, item.cnScore * 20)}%`;
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
        <span class="category-tag">${escapeHtml(item.categoryLabel)} · ${escapeHtml(item.categoryLabelJp)}</span>
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
      </div>
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
      <span>图片为包装识别参考；请以门店实物为准。</span>
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

  const detailImage = elements.productDetail.querySelector(".detail-image-wrap img");
  if (detailImage) setImageFallback(detailImage);
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

renderAll();
hydrateIcons();
loadRate();
