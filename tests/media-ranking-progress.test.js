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
    assert.ok(["verified", "source-only", "needs-review", "not-applicable"].includes(product.cartonStatus));
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
