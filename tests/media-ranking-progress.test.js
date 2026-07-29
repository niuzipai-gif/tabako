import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { enrichProduct } from "../catalog.js";
import { rawProducts } from "../data/products.js";

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("every catalog item exposes a truthful carton media state", () => {
  for (const raw of rawProducts) {
    const product = enrichProduct(raw);
    assert.ok(product.packageFormat);
    assert.ok(product.packageFormatJp);
    assert.ok(product.unitLabel);
    assert.ok(product.identityHeading);
    assert.ok(product.imageNote.trim());
    assert.equal(typeof product.cartonApplicable, "boolean");
    assert.match(product.cartonSearchUrl, /^https:\/\/www\.google\.com\/search\?/);
    assert.ok(
      [
        "verified",
        "contents-reference",
        "multi-carton-reference",
        "archive-reference",
        "source-only",
        "needs-review",
        "not-applicable",
      ].includes(product.cartonStatus),
    );
    if (!product.imageSource) {
      assert.equal(product.imageStatus, "review-required");
    }
    if (product.cartonStatus === "verified") {
      assert.ok(product.cartonImage);
      assert.ok(product.cartonSource);
    }
  }
});

test("Seven Stars soft pack and box are distinct, explained variants", () => {
  const soft = enrichProduct(rawProducts.find((item) => item.jp === "セブンスター"));
  const box = enrichProduct(rawProducts.find((item) => item.jp === "セブンスター ボックス"));

  assert.equal(soft.packageFormat, "软包");
  assert.equal(box.packageFormat, "硬盒");
  assert.notEqual(soft.image, box.image);
  assert.match(soft.variantNote, /软包/);
  assert.match(box.variantNote, /硬盒/);
  assert.match(soft.cartonSearchQuery, /10包/);
  assert.doesNotMatch(soft.cartonSearchQuery, /10箱/);
});

test("Seven Stars Box rejects the wrong 10 mg single-pack source for its 14 mg carton", () => {
  const box = enrichProduct(rawProducts.find((item) => item.jp === "セブンスター ボックス"));

  assert.notEqual(box.cartonStatus, "verified");
  assert.doesNotMatch(box.cartonSource, /briquetonline\.com\/products\/detail\/5426/);
  assert.match(box.cartonNote, /外箱|未展示|参考/);
  if (box.cartonImage) {
    const cartonPath = new URL(`../${box.cartonImage.replace(/^\.\//, "")}`, import.meta.url);
    const packPath = new URL(`../${box.image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(cartonPath), true);
    assert.notEqual(sha256(cartonPath), sha256(packPath));
  }
});

test("production carton manifest only publishes exact verified or visibly historical images", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../images/cartons/manifest.json", import.meta.url), "utf8"),
  );

  assert.equal(manifest.items.length, 10);
  assert.equal(manifest.items.filter((item) => item.status === "verified").length, 9);
  assert.equal(
    manifest.items.filter((item) => item.status === "archive-reference").length,
    1,
  );

  for (const item of manifest.items) {
    assert.ok(["verified", "archive-reference"].includes(item.status));
    assert.match(item.sourcePage, /^https:\/\//);
    assert.match(item.quantity, /1 carton/);
    const path = new URL(`../${item.localPath.replace(/^images\//, "images/")}`, import.meta.url);
    assert.equal(existsSync(path), true);
    assert.equal(sha256(path), item.sha256);
    const catalogProduct = rawProducts
      .map((product) => enrichProduct(product))
      .find((product) => product.id === item.productId);
    assert.ok(catalogProduct, `missing catalog product ${item.productId}`);
    assert.equal(catalogProduct.jp, item.jp);
    assert.equal(catalogProduct.cartonStatus, item.status);
    assert.equal(
      catalogProduct.cartonImage.replace(/^\.\//, ""),
      item.localPath,
    );
    assert.equal(catalogProduct.cartonSource, item.sourcePage);
    if (item.status === "archive-reference") {
      assert.match(item.currentness, /historical/);
    }
  }
});

test("all duplicate image payloads are explicitly registered in the media audit", () => {
  const auditPath = new URL("../images/audit.json", import.meta.url);
  assert.equal(existsSync(auditPath), true);
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  const registered = new Set(audit.groups.flatMap((group) => group.files));
  const seen = new Map();
  const duplicateFiles = new Set();

  for (const file of rawProducts.map((item) => {
    const product = enrichProduct(item);
    return product.originalImage;
  })) {
    const path = new URL(`../${file.replace(/^\.\//, "")}`, import.meta.url);
    const digest = sha256(path);
    const prior = seen.get(digest);
    if (prior) {
      duplicateFiles.add(prior);
      duplicateFiles.add(file);
    } else {
      seen.set(digest, file);
    }
  }

  assert.deepEqual([...duplicateFiles].sort(), [...registered].sort());
  for (const group of audit.groups) {
    assert.ok(group.explanation);
    assert.ok(["resolved", "review-required", "non-product-variant"].includes(group.status));
  }
});

test("AI dialog exposes live progress, stages, and terminal states", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(html, /id="aiProgress"/);
  assert.match(html, /id="aiProgressBar"/);
  assert.match(html, /id="aiProgressSteps"/);
  assert.match(html, /role="progressbar"/);
  assert.match(source, /setAiProgress/);
  assert.match(source, /在线识别未启用/);
  assert.match(source, /图片没有上传/);
  assert.match(source, /percentLabel/);
  assert.match(source, /未连接/);
  assert.doesNotMatch(
    source,
    /value:\s*100,\s*\n\s*label:\s*"在线识别未启用；图片没有上传"/,
  );
  assert.match(source, /if \(elements\.aiProgress\.hidden\)/);
  assert.doesNotMatch(source, /nextPaint\(delay/);
  assert.doesNotMatch(source, /setTimeout\(resolve/);
  assert.doesNotMatch(
    source,
    /请求已交给安全代理|MiniMax 正在分析候选|正通过安全代理上传图片|MiniMax 正在识别包装线索/,
  );
  assert.match(source, /请求已发送，正在等待安全代理返回/);
  assert.match(source, /图片请求已发送；正在等待安全代理返回/);

  const received = source.indexOf("已收到，正在理解你的描述");
  const localMatch = source.indexOf("本地目录已匹配");
  const terminal = source.indexOf("本地匹配已完成；在线增强未启用");
  assert.ok(received > -1 && received < localMatch && localMatch < terminal);

  const proxyCheck = source.indexOf("正在检查安全代理是否可用");
  const noUpload = source.indexOf("在线识别未启用；图片没有上传");
  const visionCall = source.indexOf('mode: "vision"');
  assert.ok(proxyCheck > -1 && proxyCheck < noUpload && noUpload < visionCall);
});

test("device and pod media identities are not mislabeled as a single cigarette pack", () => {
  const device = enrichProduct(rawProducts.find((item) => item.type === "device"));
  const pod = enrichProduct(rawProducts.find((item) => item.type === "pod"));
  const heated = enrichProduct(rawProducts.find((item) => item.type === "heated"));

  assert.equal(device.unitLabel, "设备本体");
  assert.equal(device.identityHeading, "先认准设备本体与型号");
  assert.equal(device.cartonApplicable, false);
  assert.equal(pod.unitLabel, "烟弹 / 配件");
  assert.equal(pod.identityHeading, "先认准烟弹与适配规格");
  assert.equal(pod.cartonApplicable, false);
  assert.equal(heated.unitLabel, "单盒");
  assert.equal(heated.cartonApplicable, true);
});

test("TEREA Fusion uses the official Japanese Menthol SKU name instead of the false Mint variant", () => {
  const fusion = rawProducts.find((item) => item.cn === "IQOS TEREA 融合薄荷");
  assert.equal(fusion.jp, "IQOS テリア フュージョン メンソール");
  const product = enrichProduct(fusion);
  const imagePath = new URL(`../${product.originalImage.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(imagePath), true);
  assert.equal(product.imageStatus, "review-required");
  assert.equal(product.imageSource, "");
});

test("ranking is a separate vertical feed page linked from home", () => {
  const home = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const ranking = readFileSync(new URL("../ranking.html", import.meta.url), "utf8");
  const source = readFileSync(new URL("../ranking.js", import.meta.url), "utf8");

  assert.match(home, /href="\.\/ranking\.html"/);
  assert.match(ranking, /id="rankingFeed"/);
  assert.match(ranking, /data-ranking-audience="jp"/);
  assert.match(ranking, /data-ranking-audience="cn"/);
  assert.match(source, /sortProducts/);
  assert.match(source, /index\.html\?product=/);
});
