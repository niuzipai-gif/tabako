import { rawProducts } from "./data/products.js";
import { enrichProducts, sortProducts, yen } from "./catalog.js";

const products = enrichProducts(rawProducts);
const feed = document.querySelector("#rankingFeed");
const context = document.querySelector("#rankingContext");
const initialAudience = new URLSearchParams(window.location.search).get("audience");
let audience = initialAudience === "cn" ? "cn" : "jp";

const AVAILABILITY = {
  "widely-available": "常见渠道覆盖较高",
  likely: "有售可能性较高",
  specialist: "更依赖专门店",
  discontinued: "旧款或停产风险",
};

function hydrateIcons(root = document) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({
      attrs: { "aria-hidden": "true" },
      nameAttr: "data-lucide",
      root,
    });
  }
}

function rankingPool() {
  return products.filter(
    (item) =>
      item.type !== "device" &&
      item.type !== "pod" &&
      item.availability !== "discontinued",
  );
}

function createRankItem(item, index) {
  const score = audience === "jp" ? item.jpScore : item.cnScore;
  const reason = audience === "jp" ? item.jpImpression : item.cnImpression;
  const link = document.createElement("a");
  link.className = "ranking-feed-card";
  link.href = `./index.html?product=${encodeURIComponent(item.id)}`;
  link.setAttribute("aria-label", `第 ${index + 1} 名，${item.jp}，${score.toFixed(1)} 分`);

  const rank = document.createElement("span");
  rank.className = "feed-rank";
  rank.innerHTML = `<small>Rank</small><strong>${String(index + 1).padStart(2, "0")}</strong>`;

  const visual = document.createElement("span");
  visual.className = "feed-visual";
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = `${item.jp} ${item.packageFormat}包装参考图`;
  image.loading = index < 3 ? "eager" : "lazy";
  image.decoding = "async";
  image.addEventListener(
    "error",
    () => {
      image.classList.add("is-missing");
      image.removeAttribute("src");
    },
    { once: true },
  );
  visual.appendChild(image);

  const copy = document.createElement("span");
  copy.className = "feed-copy";
  const eyebrow = document.createElement("small");
  eyebrow.textContent = `${item.brand} · ${item.packageFormat}`;
  const name = document.createElement("strong");
  name.textContent = item.jp;
  const cn = document.createElement("span");
  cn.textContent = item.cn;
  const reasonCopy = document.createElement("p");
  reasonCopy.textContent = reason;
  const meta = document.createElement("span");
  meta.className = "feed-meta";
  meta.innerHTML = `<b>${yen(item.jpy)}</b><em>${AVAILABILITY[item.availability] ?? "渠道需核对"}</em>`;
  copy.append(eyebrow, name, cn, reasonCopy, meta);

  const scoreBlock = document.createElement("span");
  scoreBlock.className = "feed-score";
  scoreBlock.innerHTML = `
    <strong>${score.toFixed(1)}</strong>
    <small>/ 5</small>
    <span aria-hidden="true"><i style="--rank-score:${score * 20}%"></i></span>
    <i data-lucide="chevron-right" aria-hidden="true"></i>
  `;

  link.append(rank, visual, copy, scoreBlock);
  return link;
}

function updateAudienceControls() {
  document.querySelectorAll("[data-ranking-audience]").forEach((button) => {
    const active = button.dataset.rankingAudience === audience;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderRanking() {
  const ranked = sortProducts(rankingPool(), audience);
  const fragment = document.createDocumentFragment();
  ranked.forEach((item, index) => fragment.appendChild(createRankItem(item, index)));
  feed.replaceChildren(fragment);
  const audienceName = audience === "jp" ? "日本人气" : "中国游客人气";
  context.textContent = `${audienceName} · 完整 SKU 信息流 · ${ranked.length} 款商品 · 满分 5 分`;
  updateAudienceControls();
  hydrateIcons(feed);
}

document.querySelectorAll("[data-ranking-audience]").forEach((button) => {
  button.addEventListener("click", () => {
    audience = button.dataset.rankingAudience;
    const url = new URL(window.location.href);
    url.searchParams.set("audience", audience);
    history.replaceState(null, "", url);
    renderRanking();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  });
});

renderRanking();
window.addEventListener("load", () => hydrateIcons(), { once: true });
