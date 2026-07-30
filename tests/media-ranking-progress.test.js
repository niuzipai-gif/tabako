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
        "variant-reference",
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

  assert.equal(box.cartonStatus, "verified");
  assert.doesNotMatch(box.cartonSource, /briquetonline\.com\/products\/detail\/5426/);
  assert.match(box.cartonSource, /mobile01\.com/);
  assert.match(box.cartonNote, /BOX|20本×10箱|14mg|ANA/);
  const cartonPath = new URL(`../${box.cartonImage.replace(/^\.\//, "")}`, import.meta.url);
  const packPath = new URL(`../${box.image.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(cartonPath), true);
  assert.notEqual(sha256(cartonPath), sha256(packPath));
});

test("production carton manifest only publishes exact verified or visibly historical images", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../images/cartons/manifest.json", import.meta.url), "utf8"),
  );

  assert.equal(manifest.items.length, 43);
  assert.equal(manifest.items.filter((item) => item.status === "verified").length, 43);
  assert.equal(
    manifest.items.filter((item) => item.status === "archive-reference").length,
    0,
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

test("non-verified carton states never expose a main carton image", () => {
  for (const raw of rawProducts) {
    const product = enrichProduct(raw);
    if (product.cartonStatus === "verified" || product.cartonStatus === "not-applicable") {
      continue;
    }

    assert.equal(product.cartonImage, "", product.jp);
  }
});

test("non-verified carton reference galleries are explicit and source-backed", () => {
  for (const raw of rawProducts) {
    const product = enrichProduct(raw);
    if (product.cartonStatus === "verified" || product.cartonStatus === "not-applicable") {
      continue;
    }

    for (const entry of product.cartonGallery) {
      assert.ok(entry.image, product.jp);
      assert.ok(entry.source, product.jp);
      assert.ok(entry.note, product.jp);
      const path = new URL(`../${entry.image.replace(/^\.\//, "")}`, import.meta.url);
      assert.equal(existsSync(path), true, `${product.jp} ${entry.image}`);
    }
  }
});

test("source-only and generated reference states still show a labeled source image", () => {
  const superSlimsMenthol = enrichProduct(
    rawProducts.find((product) => product.jp === "シガローネ・スーパースリム・メンソール"),
  );
  assert.equal(superSlimsMenthol.cartonStatus, "source-only");
  assert.equal(superSlimsMenthol.cartonImage, "");
  assert.ok(superSlimsMenthol.cartonGallery.length >= 2);
  assert.match(superSlimsMenthol.cartonGallery[0].title, /来源商品图参考/);
  assert.match(superSlimsMenthol.cartonGallery[0].note, /整条外箱仍待核验/);
  assert.ok(
    superSlimsMenthol.cartonGallery.some((entry) =>
      /cigaronne-super-slims-menthol-rakuten-10packs\.jpg/.test(entry.image),
    ),
  );

  const tropical = enrichProduct(
    rawProducts.find((product) => product.jp === "glo hyper ネオ トロピカル スワール"),
  );
  assert.equal(tropical.cartonStatus, "contents-reference");
  assert.equal(tropical.cartonImage, "");
  assert.match(tropical.cartonGallery[0].label, /j-Cigarette 1 carton 同 SKU 多盒图/);
  assert.match(
    tropical.cartonGallery[0].image,
    /glo-neo-tropical-swirl-jcigarette-multipack-reference\.jpg/,
  );
  assert.match(tropical.cartonNote, /不是完整 10 盒/);
});

test("Peace Super Lights uses the official ANA carton-side artwork instead of a single pack", () => {
  const peace = enrichProduct(rawProducts.find((item) => item.jp === "ピース スーパーライト"));

  assert.equal(peace.cartonStatus, "verified");
  assert.match(peace.cartonImage, /peace-superlights-box-ana-carton-side\.jpg/);
  assert.match(peace.cartonSource, /anadf\.com\/itemdetail\.aspx\?s_cd=3211051034/);
  assert.match(peace.cartonNote, /20本×10箱|BOX 外包装|ANA/);
  const cartonPath = new URL(`../${peace.cartonImage.replace(/^\.\//, "")}`, import.meta.url);
  const packPath = new URL(`../${peace.image.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(cartonPath), true);
  assert.notEqual(sha256(cartonPath), sha256(packPath));
});

test("Marlboro Gold uses exact 10-box artwork instead of the ANA single pack or 2-carton image", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ ゴールド"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /marlboro-gold-rakuma-10-empty-boxes\.jpg/);
  assert.match(item.cartonSource, /item\.fril\.jp\/2bea202c31ee48d9c9a5e8e2dd17ecd4/);
  assert.match(item.cartonNote, /マルボロゴールド 10箱|10 包|ANA/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /marlboro-gold-box-ana-2carton\.jpg/.test(entry.image),
    ),
  );
});

test("Marlboro Menthol uses exact 20x10 artwork instead of the ANA 2-carton image", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ メンソール"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /marlboro-menthol8-monolog-20x10\.jpg/);
  assert.match(item.cartonSource, /monolog\.r-n-i\.jp\/item\/4902210129006/);
  assert.match(item.cartonNote, /マールボロ・メンソール・8・ボックス 20本×10|10包|ANA 2CT/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /marlboro-menthol8-box-ana-2carton\.jpg/.test(entry.image),
    ),
  );
});

test("Lark Classic uses exact 10-box evidence instead of the ANA 2-carton reference", () => {
  const item = enrichProduct(rawProducts.find((product) => product.jp === "ラーク クラシック"));

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /lark-classic-milds-mercari-10-empty-boxes\.jpg/);
  assert.equal(item.cartonSource, "https://jp.mercari.com/item/m34271529006");
  assert.equal(item.cartonPackCount, 10);
  assert.equal(item.cartonStickCount, 200);
  assert.match(item.cartonNote, /LARK CLASSIC MILDS|空き箱10個/);
  assert.ok(
    item.cartonGallery.some((entry) => /2カートンセット/.test(entry.note)),
    "ANA 2-carton reference should remain only as gallery context",
  );
});

test("Lark 1 uses visible LARK SELECT 1 multi-box evidence", () => {
  const item = enrichProduct(rawProducts.find((product) => product.jp === "ラーク 1"));

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /lark-select1-mercari-72-empty-boxes\.jpg/);
  assert.equal(item.cartonSource, "https://jp.mercari.com/item/m67407962256");
  assert.equal(item.cartonPackCount, 10);
  assert.equal(item.cartonStickCount, 200);
  assert.match(item.cartonNote, /LARK SELECT 1|72箱/);
  assert.ok(
    item.cartonGallery.some((entry) => /1カートン\/10個/.test(entry.note)),
    "Placer 1-carton quantity reference should remain as gallery context",
  );
});

test("Mevius Original uses exact 20x10 carton artwork instead of the JDF 2-carton image", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス オリジナル"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /mevius-box-monolog-20x10\.jpg/);
  assert.match(item.cartonSource, /monolog\.r-n-i\.jp\/item\/4902210128603/);
  assert.match(item.cartonNote, /メビウス BOX カートン 20本×10|10包|JDF 2CT/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /mevius-original-jdf-2carton\.jpg/.test(entry.image),
    ),
  );
});

test("Ploom X Camel Menthol Fresh, Cold and Sharp Cold use exact multi-box evidence", () => {
  const camel = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X キャメル メンソール"),
  );
  assert.equal(camel.cartonStatus, "verified");
  assert.match(
    camel.cartonImage,
    /ploom-camel-menthol-fresh-yahoo-auctions-10-empty-boxes\.jpg/,
  );
  assert.match(camel.cartonSource, /auctions\.yahoo\.co\.jp\/jp\/auction\/n1206003967/);
  assert.match(camel.cartonNote, /MENTHOL FRESH|10 个同款|10包 \/ 200支/);
  assert.ok(
    camel.cartonGallery.some((entry) =>
      /ploom-camel-menthol-fresh-paypay-7-empty-boxes\.jpg/.test(entry.image),
    ),
  );

  const cold = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス コールド メンソール"),
  );
  assert.equal(cold.cartonStatus, "verified");
  assert.match(cold.cartonImage, /ploom-mevius-cold-menthol-mercari-28-empty-boxes\.jpg/);
  assert.match(cold.cartonSource, /jp\.mercari\.com\/item\/m76398758136/);
  assert.match(cold.cartonNote, /空箱 28個|COLD MENTHOL|10 包|200 支/);

  const sharpCold = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス シャープ コールド"),
  );
  assert.equal(sharpCold.cartonStatus, "verified");
  assert.match(sharpCold.cartonImage, /ploom-mevius-sharp-cold-mercari-10-empty-boxes\.jpg/);
  assert.match(sharpCold.cartonSource, /jp\.mercari\.com\/item\/m78489316130/);
  assert.match(sharpCold.cartonNote, /SHARP COLD MENTHOL|10 个同款/);
});

test("Ploom X Sharp Cold keeps older mixed references as gallery context", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス シャープ コールド"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /ploom-mevius-sharp-cold-mercari-10-empty-boxes\.jpg/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /ploom-mevius-sharp-cold-paypay-20-mixed-empty-boxes\.jpg/.test(entry.image),
    ),
  );
  assert.ok(
    item.cartonGallery.some((entry) => /placer-tabaco\.com\/product\/5668/.test(entry.source)),
  );
});

test("SENTIA Frost Green uses exact visible Frost Green multi-box evidence", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS センティア フロスト グリーン"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /sentia-frost-green-mercari-50-empty-boxes\.jpg/);
  assert.match(item.cartonSource, /jp\.mercari\.com\/item\/m31568595622/);
  assert.match(item.cartonNote, /FROST GREEN|空箱50個|10 包|200 支/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /sentia-frost-green-paypay-9-empty-boxes\.jpg/.test(entry.image),
    ),
  );
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
  assert.match(source, /目录未命中；正在自动联网补充库外线索/);
  assert.match(source, /MiniMax \+ 联网补充/);
  assert.match(source, /已自动联网查找库外资料/);
  assert.match(source, /mode: "search", query: fallbackQuery/);

  const received = source.indexOf("已收到，正在理解你的描述");
  const localMatch = source.indexOf("本地目录已匹配");
  const onlineFallback = source.indexOf("目录未命中；正在自动联网补充库外线索");
  const terminal = source.indexOf("本地匹配已完成；在线增强未启用");
  assert.ok(received > -1 && received < localMatch && localMatch < terminal);
  assert.ok(localMatch > -1 && localMatch < onlineFallback);

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
  assert.equal(product.imageStatus, "reference");
  assert.match(product.imageSource, /world-tobacco\.jp\/view\/item\/000000001897/);
  assert.match(product.imageNote, /来源页参考|World Tobacco|FUSION MENTHOL/);
});

test("TEREA single-pack photos use matching World Tobacco SKU pages and verified cartons stay exact", () => {
  const expected = new Map([
    [
      "IQOS テリア レギュラー",
      {
        pack: /000000001829/,
        carton: /terea-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-regular-japan-dubai-uae/,
        note: /TEREA Regular|10 Packs|200 Heatsticks|水印/,
      },
    ],
    [
      "IQOS テリア スムース レギュラー",
      {
        pack: /000000001891/,
        carton: /terea-smooth-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-smooth-regular-japan-dubai-uae/,
        note: /SMOOTH|10 Packs|200 Heatsticks|水印/,
      },
    ],
    [
      "IQOS テリア ルビー レギュラー",
      {
        pack: /000000001887/,
        carton: /terea-ruby-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-ruby-regular-japan-dubai-uae/,
        note: /Ruby|10 Packs|200 Heatsticks|水印/,
      },
    ],
    [
      "IQOS テリア フュージョン メンソール",
      {
        pack: /000000001897/,
        carton: /terea-fusion-menthol-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-fusion-menthol-japan-dubai-uae/,
        note: /Fusion|10 Packs|200 Heatsticks|水印/,
      },
    ],
    [
      "IQOS テリア ウォーム レギュラー",
      {
        pack: /000000001898/,
        carton: /terea-warm-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-warm-regular-japan-dubai-uae/,
        note: /Warm|10 Packs|200 Heatsticks|水印/,
      },
    ],
  ]);

  for (const [jp, expectation] of expected) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.imageStatus, "reference", jp);
    assert.match(item.imageSource, expectation.pack, jp);
    assert.match(item.imageNote, /World Tobacco|SKU|来源页/, jp);
    assert.equal(item.cartonStatus, "verified", jp);
    assert.match(item.cartonImage, expectation.carton, jp);
    assert.match(item.cartonSource, expectation.source, jp);
    assert.match(item.cartonNote, expectation.note, jp);
  }

  const menthol = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS テリア メンソール"),
  );
  assert.equal(menthol.imageStatus, "reference");
  assert.match(menthol.imageSource, /world-tobacco\.jp\/view\/item\/000000001828/);
  assert.equal(menthol.cartonStatus, "verified");
  assert.match(menthol.cartonImage, /terea-menthol-paypay-39-empty-boxes\.jpg/);
  assert.match(menthol.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z302147694/);
  assert.match(menthol.cartonNote, /MENTHOL|39個|10 包|200 支/);

  const blackMenthol = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS テリア ブラックメンソール"),
  );
  assert.equal(blackMenthol.imageStatus, "reference");
  assert.match(blackMenthol.imageSource, /world-tobacco\.jp\/view\/item\/000000001830/);
  assert.equal(blackMenthol.cartonStatus, "verified");
  assert.match(blackMenthol.cartonImage, /terea-black-menthol-iqosheets-carton\.webp/);
  assert.match(blackMenthol.cartonSource, /iqosheets-uae\.ae\/products\/iqos-terea-black-menthol-japan-dubai-uae/);
  assert.match(blackMenthol.cartonNote, /BLACK MENTHOL|10 Packs|200 Heatsticks|水印/);
});

test("TEREA overseas carton photos publish only after SKU and carton quantity are visible", () => {
  const tereaItems = rawProducts
    .filter((item) => /IQOS テリア/.test(item.jp))
    .map((item) => enrichProduct(item));
  const verifiedOverseas = new Map([
    [
      "IQOS テリア ブラックメンソール",
      {
        image: /terea-black-menthol-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-black-menthol-japan-dubai-uae/,
        note: /BLACK MENTHOL|10 Packs|200 Heatsticks/,
      },
    ],
    [
      "IQOS テリア レギュラー",
      {
        image: /terea-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-regular-japan-dubai-uae/,
        note: /TEREA Regular|10 Packs|200 Heatsticks/,
      },
    ],
    [
      "IQOS テリア スムース レギュラー",
      {
        image: /terea-smooth-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-smooth-regular-japan-dubai-uae/,
        note: /SMOOTH|10 Packs|200 Heatsticks/,
      },
    ],
    [
      "IQOS テリア ルビー レギュラー",
      {
        image: /terea-ruby-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-ruby-regular-japan-dubai-uae/,
        note: /Ruby|10 Packs|200 Heatsticks/,
      },
    ],
    [
      "IQOS テリア フュージョン メンソール",
      {
        image: /terea-fusion-menthol-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-fusion-menthol-japan-dubai-uae/,
        note: /Fusion|10 Packs|200 Heatsticks/,
      },
    ],
    [
      "IQOS テリア ウォーム レギュラー",
      {
        image: /terea-warm-regular-iqosheets-carton\.webp/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-warm-regular-japan-dubai-uae/,
        note: /Warm|10 Packs|200 Heatsticks/,
      },
    ],
  ]);

  assert.ok(tereaItems.length >= 7);
  for (const item of tereaItems) {
    if (item.jp === "IQOS テリア メンソール") {
      assert.equal(item.cartonStatus, "verified");
      assert.match(item.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z302147694/);
      continue;
    }
    const expectation = verifiedOverseas.get(item.jp);
    if (expectation) {
      assert.equal(item.cartonStatus, "verified");
      assert.match(item.cartonImage, expectation.image, item.jp);
      assert.match(item.cartonSource, expectation.source, item.jp);
      assert.match(item.cartonNote, expectation.note, item.jp);
      continue;
    }
    assert.equal(item.cartonStatus, "source-only");
    assert.equal(item.cartonImage, "");
    assert.match(item.cartonNote, /不展示|避免|无法|不能/);
  }
});

test("Cigaronne Phantom Silver is searchable as 卡比龙 and uses verified KIX pack media", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "シガローネ・ファントム・シルバー"),
  );

  assert.equal(item.brand, "Cigaronne");
  assert.equal(item.cn, "卡比龙 Phantom Silver");
  assert.match(`${item.jp} ${item.cn} ${item.brand}`, /卡比龙|Cigaronne|シガローネ/i);
  assert.equal(item.imageStatus, "verified");
  assert.match(item.image, /cigaronne-phantom-silver-kix-pack\.jpg/);
  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /cigaronne-phantom-silver-mercari-shops-carton-set\.jpg/);
  assert.match(item.cartonSource, /jp\.mercari\.com\/shops\/product\/nJwssrPaCwbVrYQDiJdCcE/);
  assert.match(item.cartonNote, /PHANTOM SILVER|カートン空箱|1カートン10箱/);
});

test("Cigaronne Exclusive Brown uses a readable one-carton outer-box photo", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "シガローネ・エクスクルーシブ・ブラウン"),
  );

  assert.equal(item.brand, "Cigaronne");
  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /cigaronne-exclusive-brown-mercari-carton-box\.jpg/);
  assert.match(item.cartonSource, /jp\.mercari\.com\/item\/m71960267321/);
  assert.match(item.cartonNote, /Exclusive Brown|XL FILTER|カートン|10箱|20本/);
  const cartonPath = new URL(`../${item.cartonImage.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(cartonPath), true);
});

test("Cigaronne Big Boss uses the readable Big Boss x10 carton photos, not Exclusive Brown", () => {
  const item = enrichProduct(rawProducts.find((product) => product.jp === "シガローネ・ビッグボス"));

  assert.equal(item.brand, "Cigaronne");
  assert.equal(item.cartonStatus, "verified");
  assert.match(item.cartonImage, /cigaronne-big-boss-rozetka-open-carton\.jpg/);
  assert.match(item.cartonSource, /rozetka\.com\.ua\/ua\/cigaronne-4850008002720\/p573345649/);
  assert.match(item.cartonNote, /Big Boss XL Filter х 10|Пачок в блоці 10|Цигарок в пачці 20/);
  assert.doesNotMatch(item.cartonNote, /Exclusive Brown 图当作 Big Boss[^。]*已核验/);
  const cartonPath = new URL(`../${item.cartonImage.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(cartonPath), true);
  assert.equal(item.cartonGallery.length, 2);
  assert.match(item.cartonGallery[0].image, /cigaronne-big-boss-rozetka-closed-carton\.jpg/);
  assert.match(item.cartonGallery[1].image, /cigaronne-big-boss-rozetka-side\.jpg/);
});

test("all Cigaronne catalog entries have sourced pack media and hide unverified carton photos", () => {
  const items = rawProducts
    .map((product) => enrichProduct(product))
    .filter((product) => product.brand === "Cigaronne");

  assert.equal(items.length, 22);
  assert.equal(items.filter((item) => item.cartonStatus === "verified").length, 8);
  for (const item of items) {
    const imagePath = new URL(`../${item.image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, item.jp);
    assert.ok(["verified", "reference"].includes(item.imageStatus), item.jp);
    assert.match(item.imageSource, /^https:\/\//, item.jp);
    if (item.jp === "シガローネ・ロイヤルスリム・ブラック") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-royal-slims-black-mercari-carton-box\.jpg/, item.jp);
      assert.match(item.cartonNote, /Royal slims XL FILTER|カートン空箱|1カートン10箱/, item.jp);
    } else if (item.jp === "シガローネ・ファントム・シルバー") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-phantom-silver-mercari-shops-carton-set\.jpg/, item.jp);
      assert.match(item.cartonNote, /PHANTOM SILVER|カートン空箱|1カートン10箱/, item.jp);
    } else if (item.jp === "シガローネ・エクスクルーシブ・ブラウン") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-exclusive-brown-mercari-carton-box\.jpg/, item.jp);
      assert.match(item.cartonNote, /Exclusive Brown|XL FILTER|カートン|10箱/, item.jp);
    } else if (item.jp === "シガローネ・ビッグボス") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-big-boss-rozetka-open-carton\.jpg/, item.jp);
      assert.match(item.cartonNote, /Big Boss XL Filter х 10|Пачок в блоці 10|Цигарок в пачці 20/, item.jp);
    } else if (item.jp === "シガローネ・ロイヤルスリム・メンソール") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-royal-menthol-cigarpro-carton\.webp/, item.jp);
      assert.match(item.cartonNote, /Royal Slims XL Filter|10 пачек|200 сигарет/, item.jp);
    } else if (item.jp === "シガローネ・スーパースリム・ブラック") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-super-slims-black-rozetka-carton\.jpg/, item.jp);
      assert.match(item.cartonNote, /Super Slims Black x 10|Пачок в блоці 10/, item.jp);
    } else if (item.jp === "シガローネ・スーパースリム・ホワイト") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-super-slims-white-rozetka-open-carton\.jpg/, item.jp);
      assert.match(
        item.cartonSource,
        /rozetka\.com\.ua\/cigaronne-4850008001020\/p452670179/,
        item.jp,
      );
      assert.match(
        item.cartonNote,
        /Super Slims White x 10|Пачек в блоке 10|Сигарет в пачке 20|EAN 4850008001020/,
        item.jp,
      );
    } else if (item.jp === "シガローネ・マグネット") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-magnet-kix-carton\.jpg/, item.jp);
      assert.match(item.cartonNote, /CIGARONNE MAGNET|1 carton contains 10 packs|20 sticks/, item.jp);
    } else {
      assert.equal(item.cartonStatus, "source-only", item.jp);
      assert.equal(item.cartonImage, "", item.jp);
      assert.match(item.cartonNote, /未|不展示|整条|カートン/, item.jp);
    }
  }
});

test("Cigaronne official collection additions use local official media but no unverified carton image", () => {
  const expectations = new Map([
    ["シガローネ・レジェンド", /cigaronne-imperial-legend-official\.png/],
    ["シガローネ・クラシック・キングサイズ", /cigaronne-classic-king-size-official\.png/],
    ["シガローネ・クラシック・コンパット", /cigaronne-classic-compatto-official\.png/],
    ["シガローネ・クラシック・ウルトラスリム", /cigaronne-classic-ultra-slims-official\.png/],
    ["シガローネ・クラシック・スーパースリム", /cigaronne-classic-super-slims-official\.png/],
    ["シガローネ・センター・キングサイズ", /cigaronne-center-king-size-official\.png/],
    ["シガローネ・センター・コンパット", /cigaronne-center-compatto-official\.png/],
    ["シガローネ・センター・ウルトラスリム", /cigaronne-center-ultra-slims-official\.png/],
    ["シガローネ・センター・スーパースリム", /cigaronne-center-super-slims-official\.png/],
  ]);

  for (const [jp, imagePattern] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.brand, "Cigaronne", jp);
    assert.equal(item.imageStatus, "reference", jp);
    assert.match(item.image, imagePattern, jp);
    assert.match(item.imageSource, /cigaronne\.com\/our-collection/, jp);
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonNote, /官网确认|未取得.*整条|不展示/, jp);

    const imagePath = new URL(`../${item.image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, jp);
  }
});

test("Cigaronne Classic source-only gaps use exact SAS ten-piece SKU leads without publishing display images", () => {
  const expectations = new Map([
    [
      "シガローネ・クラシック・キングサイズ",
      {
        source: /sas\.am\/en\/catalog\/armyanskaya_sigareta\/163104/,
        note: /SAS Armenia.*King Size.*163104.*163105.*10 pcs/s,
      },
    ],
    [
      "シガローネ・クラシック・コンパット",
      {
        source: /sas\.am\/en\/catalog\/armyanskaya_sigareta\/4116/,
        note: /SAS Armenia.*Compatto.*4116.*163100.*10 pcs/s,
      },
    ],
    [
      "シガローネ・クラシック・ウルトラスリム",
      {
        source: /sas\.am\/en\/catalog\/armyanskaya_sigareta\/163111/,
        note: /SAS Armenia.*Ultra Slims.*163111.*163110.*10 pcs/s,
      },
    ],
    [
      "シガローネ・クラシック・スーパースリム",
      {
        source: /sas\.am\/en\/catalog\/armyanskaya_sigareta\/163109/,
        note: /SAS Armenia.*Super Slims.*163109.*163108.*10 pcs/s,
      },
    ],
  ]);

  for (const [jp, expectation] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonSource, expectation.source, jp);
    assert.match(item.cartonNote, expectation.note, jp);
    assert.match(item.cartonNote, /Neutrino Invest.*Number of Packs\/Carton = 10/s, jp);
    assert.match(item.cartonNote, /不是完整同 SKU 10 包整条外箱实拍|未取得(?:完整)?同 SKU 10 包整条/, jp);
  }
});

test("source-only Cigaronne carton gaps point to exact 1-carton product sources", () => {
  const expectations = new Map([
    [
      "シガローネ・レジェンド",
      {
        source: /mostabaktorg\.moscow\/sigareti\/cigaronne\/cigaronne-legend-xl-filter/,
        note: /Cigaronne Legend XL Filter|Количество пачек в блоке 10|В упаковке 10 пачек/,
      },
    ],
    [
      "シガローネ・スーパースリム・メンソール",
      {
        source: /item\.rakuten\.co\.jp\/snus\/2759/,
        note: /10packs シガローネ スーパースリム メンソール|箱なしセロハン包装|1 carton contains 10 packs/,
      },
    ],
    [
      "シガローネ・タトゥー・チェリー",
      {
        source: /item\.rakuten\.co\.jp\/snus\/2538/,
        note: /10packs シガローネ タトゥー チェリー|商品内容：1カートン\(10箱\)|大浦商店/,
      },
    ],
    [
      "シガローネ・タトゥー・チョコレート",
      {
        source: /item\.rakuten\.co\.jp\/snus\/2539/,
        note: /10packs シガローネ タトゥー チョコレート|商品内容：1カートン\(10箱\)|Tabimperia/,
      },
    ],
    [
      "シガローネ・タトゥー・バニラ",
      {
        source: /item\.rakuten\.co\.jp\/snus\/2540/,
        note: /10packs シガローネ タトゥー バニラ|商品内容：1カートン\(10箱\)|Cigaronne 官方/,
      },
    ],
    [
      "シガローネ・ウルトラスリム・ブラック",
      {
        source: /item\.rakuten\.co\.jp\/snus\/2608/,
        note: /10packs シガローネ ウルトラスリム ブラック|箱なしセロハン包装|商品号 2407000016/,
      },
    ],
  ]);

  for (const [jp, expectation] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonSource, expectation.source, jp);
    assert.match(item.cartonNote, expectation.note, jp);
  }
});

test("Cigaronne Royal Menthol and Super Slims Black use exact verified carton images", () => {
  const royal = enrichProduct(
    rawProducts.find((product) => product.jp === "シガローネ・ロイヤルスリム・メンソール"),
  );
  assert.equal(royal.cartonStatus, "verified");
  assert.match(royal.cartonImage, /cigaronne-royal-menthol-cigarpro-carton\.webp/);
  assert.match(royal.cartonSource, /cigarpro\.ru/);
  assert.match(royal.cartonNote, /Royal Slims XL Filter|10 пачек|200 сигарет/);
  assert.match(royal.cartonGallery[0].image, /cigaronne-royal-menthol-cigarpro-carton-open\.webp/);

  const superBlack = enrichProduct(
    rawProducts.find((product) => product.jp === "シガローネ・スーパースリム・ブラック"),
  );
  assert.equal(superBlack.cartonStatus, "verified");
  assert.match(superBlack.cartonImage, /cigaronne-super-slims-black-rozetka-carton\.jpg/);
  assert.match(superBlack.cartonSource, /rozetka\.com\.ua/);
  assert.match(superBlack.cartonNote, /Super Slims Black x 10|Пачок в блоці 10|SUPER SLIMS/);
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

test("Ploom X Sharp Cold records the exact 10-box image and keeps 1-carton quantity evidence", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス シャープ コールド"),
  );

  assert.equal(item.cartonStatus, "verified");
  assert.equal(item.cartonSource, "https://jp.mercari.com/item/m78489316130");
  assert.match(item.cartonNote, /10 个同款 MEVIUS ploom X SHARP COLD MENTHOL/);
  assert.match(item.cartonNote, /1カートン\/10個/);
  assert.match(item.cartonImage, /ploom-mevius-sharp-cold-mercari-10-empty-boxes\.jpg/);
});

test("source-only Cigaronne gaps keep Rakuten 10packs leads without publishing unverified cartons", () => {
  const expectations = new Map([
    [
      "シガローネ・スーパースリム・メンソール",
      /cigaronne-super-slims-menthol-rakuten-10packs\.jpg/,
    ],
    ["シガローネ・タトゥー・チェリー", /cigaronne-tattoo-cherry-rakuten-10packs\.jpg/],
    [
      "シガローネ・タトゥー・チョコレート",
      /cigaronne-tattoo-chocolate-rakuten-10packs\.jpg/,
    ],
    ["シガローネ・タトゥー・バニラ", /cigaronne-tattoo-vanilla-rakuten-10packs\.jpg/],
    [
      "シガローネ・ウルトラスリム・ブラック",
      /cigaronne-ultra-slims-black-rakuten-10packs\.jpg/,
    ],
  ]);

  for (const [jp, imagePattern] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonNote, /Rakuten\/堀商事.*10packs/s, jp);
    assert.ok(item.cartonGallery.some((entry) => imagePattern.test(entry.image)), jp);
    for (const entry of item.cartonGallery.filter((galleryEntry) =>
      imagePattern.test(galleryEntry.image),
    )) {
      assert.match(entry.note, /単包|開包|正面|箱なし|不是.*整条外箱/, jp);
      const imagePath = new URL(`../${entry.image.replace(/^\.\//, "")}`, import.meta.url);
      assert.equal(existsSync(imagePath), true, entry.image);
    }
  }
});

test("remaining non-Cigaronne carton gaps document checked quantity sources without publishing main carton images", () => {
  const expectations = new Map([
    ["メビウス メンソール", /Premium Menthol|E-series|独立现行 SKU/],
    ["メビウス・プレミアムメンソール・オプション・パープル・8", /2010100049|20本×10箱|10P|局部多包排列|不再标为已核验整条图/],
    ["ラーク ハイブリッド", /Placer|TABACO EXPRESS|１カートン（10個入）|在庫数 48点|単包正面/],
    ["ナチュラル アメリカン スピリット", /品牌泛称|Menthol One|不能回填/],
    ["ウィンストン XS", /JT 现行 Winston|旧款\/历史名|近似包装参考/],
    ["セーラム ブラックメンソール", /日本未进口品|Salem Light|不代表日本门店/],
    ["ラーク メンソール 5", /Select\/100s|历史变体|10 包整条外箱/],
    ["lil HYBRID ミックス レギュラー", /終卖|カートン单位|専用リキッド/],
    ["lil HYBRID ミックス アイス", /AMANOYA SETAGAYA|ミックス・アイス（10個）|MIIX ICE/],
    ["lil HYBRID ミックス ミックス", /AMANOYA SETAGAYA|ミックス・ミックス（10個）|MIIX MIX/],
    ["lil HYBRID ミックス アイス プラス", /AMANOYA SETAGAYA|ミックス・アイスプラス（10個）|MIIX ICE PLUS/],
    ["lil HYBRID ミックス ベルベット", /Sirius Tobacco|Velvet|カートン单位/],
  ]);

  for (const [jp, note] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.notEqual(item.cartonStatus, "verified", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonNote, note, jp);
    if (jp === "ラーク ハイブリッド") {
      assert.match(item.cartonSource, /placer-tabaco\.com\/product\/2965/, jp);
      assert.match(item.cartonNote, /在庫あり|不是整条外箱/, jp);
    }
  }
});

test("lil HYBRID source-only carton references use exact AMANOYA ten-unit pages where available", () => {
  const expectations = new Map([
    [
      "lil HYBRID ミックス アイス",
      {
        source: /e-amanoya\.jp\/view\/item\/000000003194/,
        image: /lil-miix-ice-amanoya-10unit\.png/,
      },
    ],
    [
      "lil HYBRID ミックス ミックス",
      {
        source: /e-amanoya\.jp\/view\/item\/000000003193/,
        image: /lil-miix-mix-amanoya-10unit\.png/,
      },
    ],
    [
      "lil HYBRID ミックス アイス プラス",
      {
        source: /e-amanoya\.jp\/view\/item\/000000003192/,
        image: /lil-miix-ice-plus-amanoya-10unit\.png/,
      },
    ],
  ]);

  for (const [jp, expectation] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "contents-reference", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonSource, expectation.source, jp);
    assert.match(item.cartonNote, /10個|単包正面|不是.*一カートン外箱/, jp);
    const amanoyaEntry = item.cartonGallery.find((entry) => expectation.image.test(entry.image));
    assert.ok(amanoyaEntry, jp);
    assert.match(amanoyaEntry.source, expectation.source, jp);
    assert.match(amanoyaEntry.note, /10個.*単包图|10個来源页的单包图|不是整条外箱/, jp);
    const imagePath = new URL(`../${amanoyaEntry.image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, amanoyaEntry.image);
  }
});

test("lil HYBRID MIIX lineup includes Mix and Ice Plus with exact pack media but no carton claim", () => {
  const expectations = new Map([
    ["lil HYBRID ミックス アイス", /lil-miix-ice-sirius-pack\.jpg/],
    ["lil HYBRID ミックス ミックス", /lil-miix-mix-sirius-pack\.jpg/],
    ["lil HYBRID ミックス アイス プラス", /lil-miix-ice-plus-sirius-pack\.jpg/],
    ["lil HYBRID ミックス ベルベット", /lil-miix-velvet-sirius-pack\.jpg/],
  ]);

  for (const [jp, imagePattern] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.brand, "lil HYBRID", jp);
    assert.equal(item.imageStatus, "verified", jp);
    assert.match(item.image, imagePattern, jp);
    assert.equal(item.cartonStatus, "contents-reference", jp);
    assert.match(item.cartonNote, /不是已核对的一カートン外箱/, jp);

    const imagePath = new URL(`../${item.image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, jp);
  }
});

test("Cigaronne pack media uses exact local images while American Spirit separates generic and Light media", () => {
  const cigaronne = [
    ["シガローネ・ロイヤルスリム・メンソール", /cigaronne-royal-menthol-worldtobacco-pack\.jpg/],
    ["シガローネ・スーパースリム・メンソール", /cigaronne-super-menthol-worldtobacco-pack\.jpg/],
    ["シガローネ・タトゥー・チェリー", /cigaronne-tattoo-cherry-worldtobacco-pack\.jpg/],
    ["シガローネ・タトゥー・チョコレート", /cigaronne-tattoo-chocolate-worldtobacco-pack\.jpg/],
    ["シガローネ・タトゥー・バニラ", /cigaronne-tattoo-vanilla-worldtobacco-pack\.jpg/],
    ["シガローネ・マグネット", /cigaronne-magnet-worldtobacco-pack\.jpg/],
  ];

  for (const [jp, imagePattern] of cigaronne) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.imageStatus, "verified", jp);
    assert.match(item.image, imagePattern, jp);
    if (jp === "シガローネ・ロイヤルスリム・メンソール") {
      assert.equal(item.cartonStatus, "verified", jp);
      assert.match(item.cartonImage, /cigaronne-royal-menthol-cigarpro-carton\.webp/, jp);
    } else if (jp === "シガローネ・マグネット") {
      assert.equal(item.cartonStatus, "verified", jp);
      assert.match(item.cartonImage, /cigaronne-magnet-kix-carton\.jpg/, jp);
    } else {
      assert.equal(item.cartonStatus, "source-only", jp);
      assert.equal(item.cartonImage, "", jp);
    }
  }

  const americanSpirit = enrichProduct(
    rawProducts.find((product) => product.jp === "ナチュラル アメリカン スピリット"),
  );
  assert.equal(americanSpirit.cartonStatus, "multi-carton-reference");
  assert.equal(americanSpirit.cartonImage, "");
  assert.match(americanSpirit.cartonGallery[0].image, /american-spirit-green-paypay-10-empty-boxes\.jpg/);
  assert.match(americanSpirit.cartonNote, /個数10個/);
  assert.match(americanSpirit.cartonNote, /ブランド泛称|品牌泛称/);

  const americanSpiritLight = enrichProduct(
    rawProducts.find((product) => product.jp === "ナチュラル アメリカン スピリット ライト 14本入"),
  );
  assert.equal(americanSpiritLight.brand, "American Spirit");
  assert.equal(americanSpiritLight.imageStatus, "verified");
  assert.match(americanSpiritLight.image, /american-spirit-light-14-ana-pack\.jpg/);
  assert.equal(americanSpiritLight.cartonStatus, "verified");
  assert.match(americanSpiritLight.cartonImage, /american-spirit-yellow-kurivip-carton\.jpg/);
  assert.match(americanSpiritLight.cartonSource, /kurivip18\.com/);
  assert.equal(americanSpiritLight.cartonPackCount, 10);
  assert.equal(americanSpiritLight.cartonStickCount, 140);
  assert.match(americanSpiritLight.cartonNote, /14本×10箱/);
  assert.match(americanSpiritLight.cartonNote, /Yellow\/Light/);
  assert.match(americanSpiritLight.cartonGallery[1].source, /anadf\.com/);
  for (const image of [
    americanSpiritLight.image,
    americanSpiritLight.cartonImage,
    americanSpiritLight.cartonGallery[2].image,
  ]) {
    const imagePath = new URL(`../${image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, image);
  }
});

test("glo Lucky Strike Menthol uses exact 10-box evidence", () => {
  const lucky = enrichProduct(
    rawProducts.find((product) => product.jp === "glo hyper ラッキー ストライク メンソール"),
  );
  assert.equal(lucky.cartonStatus, "verified");
  assert.match(lucky.cartonImage, /glo-lucky-strike-menthol-mercari-10-empty-boxes\.jpg/);
  assert.match(lucky.cartonSource, /jp\.mercari\.com\/item\/m27415415655/);
  assert.match(lucky.cartonNote, /空箱 10箱/);
  assert.match(lucky.cartonNote, /10 boxes|200 sticks/);

  const tropical = enrichProduct(
    rawProducts.find((product) => product.jp === "glo hyper ネオ トロピカル スワール"),
  );
  assert.equal(tropical.cartonStatus, "contents-reference");
  assert.equal(tropical.cartonImage, "");
  assert.match(
    tropical.cartonGallery[0].image,
    /glo-neo-tropical-swirl-jcigarette-multipack-reference\.jpg/,
  );
  assert.match(tropical.cartonNote, /不是完整 10 盒/);
  assert.match(tropical.cartonNote, /大浦商店.*カートン（10箱）/s);
  assert.match(tropical.cartonNote, /リニューアル.*ネオ・ブリリアント・トロピカル/s);
});

test("SENTIA Balanced Yellow uses the Box of 200 carton variant instead of the old single-pack reference", () => {
  const sentia = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS センティア バランスド イエロー"),
  );

  assert.equal(sentia.cartonStatus, "verified");
  assert.equal(sentia.imageStatus, "verified");
  assert.match(sentia.image, /sentia-balanced-yellow-hrt-pack\.jpg/);
  assert.match(sentia.cartonImage, /sentia-balanced-yellow-hrt-box200\.jpg/);
  assert.match(sentia.cartonSource, /handrollingtobacco\.co\.uk/);
  assert.equal(sentia.cartonPackCount, 10);
  assert.equal(sentia.cartonStickCount, 200);
  assert.match(sentia.cartonNote, /Box of 200/);
  assert.match(sentia.cartonNote, /10 packs of 20 tobacco sticks/);
  assert.match(sentia.cartonGallery[0].label, /Box of 200/);
  for (const image of [sentia.image, sentia.cartonImage]) {
    const imagePath = new URL(`../${image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, image);
  }
});
