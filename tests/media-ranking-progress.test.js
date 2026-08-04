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
        "variant-warning",
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
  assert.equal(soft.cartonStatus, "source-only");
  assert.equal(soft.cartonImage, "");
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

  assert.equal(manifest.items.length, 38);
  assert.equal(manifest.items.filter((item) => item.status === "verified").length, 38);
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
    rawProducts.find((product) => product.jp === "ネオ・ブリリアント・トロピカル・hyper用"),
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

test("Peace Super Lights keeps ANA single-pack artwork below verified", () => {
  const peace = enrichProduct(rawProducts.find((item) => item.jp === "ピース スーパーライト"));

  assert.equal(peace.cartonStatus, "contents-reference");
  assert.equal(peace.cartonImage, "");
  assert.match(peace.cartonSource, /anadf\.com\/itemdetail\.aspx\?s_cd=3211051034/);
  assert.match(peace.cartonNote, /单包\+警示面板|不是整条外箱|ANA/);
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

test("Marlboro Menthol stays below verified until exact Menthol 8 evidence is split", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ メンソール"),
  );

  assert.equal(item.cartonStatus, "variant-reference");
  assert.equal(item.cartonImage, "");
  assert.match(item.cartonSource, /monolog\.r-n-i\.jp\/item\/4902210129006/);
  assert.match(item.cartonNote, /exact SKU|精确 SKU|降级为变体参考/);
  assert.ok(
    item.cartonGallery.some((entry) =>
      /marlboro-menthol8-box-ana-2carton\.jpg/.test(entry.image),
    ),
  );
});

test("split Marlboro Menthol 8 Box publishes the exact duty-free carton set", () => {
  const genericMenthol = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ メンソール"),
  );
  assert.equal(genericMenthol.cartonStatus, "variant-reference");
  assert.equal(genericMenthol.cartonImage, "");

  const menthol8 = enrichProduct(
    rawProducts.find(
      (product) => product.jp === "マールボロ・メンソール・8・ボックス",
    ),
  );
  assert.equal(menthol8.cartonStatus, "verified");
  assert.match(
    menthol8.cartonImage,
    /marlboro-menthol8-box-ana-2carton\.jpg/,
  );
  assert.match(
    menthol8.cartonSource,
    /anadf\.com\/itemdetail\.aspx\?s_cd=7000098242/,
  );
  assert.equal(menthol8.cartonPackCount, 10);
  assert.equal(menthol8.cartonStickCount, 200);
  assert.match(
    menthol8.cartonNote,
    /マールボロ メンソール 8 ボックス|2カートン|20本×10箱/,
  );
});

test("Marlboro Double Burst does not publish a variant carton image as verified", () => {
  const doubleBurst = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ ダブルバースト"),
  );
  assert.equal(doubleBurst.cartonStatus, "variant-reference");
  assert.equal(doubleBurst.cartonImage, "");
  assert.match(doubleBurst.cartonNote, /Purple 5 .*不能混用|降级为变体参考/);
});

test("generic variant rows expose exact SKU shortcuts instead of pretending verified", () => {
  const expectations = new Map([
    ["マールボロ メンソール", ["マールボロ・メンソール・8・ボックス"]],
    ["マールボロ ダブルバースト", ["マールボロ・ダブルバースト・パープル・5・ボックス"]],
    ["クール ブースト", ["クール ブースト 5 ボックス", "クール ブースト フレッシュ 8"]],
    ["ラーク 1", ["ラーク・セレクト・1・100sボックス"]],
    ["ウィンストン XS", ["ウィンストン・キャスター・ホワイト・ワン・100s・ボックス"]],
    [
      "ナチュラル アメリカン スピリット",
      ["ナチュラル アメリカン スピリット ライト 14本入", "アメリカン スピリット ターコイズ"],
    ],
    ["わかば", ["わかば・シガー 10P"]],
    ["エコー", ["エコー・シガー 10P"]],
    [
        "Ploom X キャメル メンソール",
        [
        "キャメル・メンソール・フレッシュ・プルーム用",
        "キャメル・メンソール・コールド・プルーム用",
        "Ploom X キャメル メンソール イエロー",
        "キャメル・メンソール・マスカット・プルーム用",
      ],
    ],
    ["Ploom X キャメル スムース", ["キャメル・スムース・プルーム用"]],
  ]);

  for (const [jp, exactNames] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.deepEqual(item.relatedExactJp, exactNames, jp);
    assert.notEqual(item.cartonStatus, "verified", jp);
    if (item.cartonStatus === "variant-reference") {
      assert.equal(item.cartonImage, "", jp);
    }
  }
});

test("split Marlboro Purple 5 and Ploom Camel Menthol Fresh rows publish only exact verified cartons", () => {
  const genericDoubleBurst = enrichProduct(
    rawProducts.find((product) => product.jp === "マールボロ ダブルバースト"),
  );
  assert.equal(genericDoubleBurst.cartonStatus, "variant-reference");
  assert.equal(genericDoubleBurst.cartonImage, "");

  const purple5 = enrichProduct(
    rawProducts.find(
      (product) => product.jp === "マールボロ・ダブルバースト・パープル・5・ボックス",
    ),
  );
  assert.equal(purple5.cartonStatus, "verified");
  assert.match(purple5.cartonImage, /marlboro-wburst-purple-5-ameblo-10packs\.png/);
  assert.equal(purple5.cartonPackCount, 10);
  assert.equal(purple5.cartonStickCount, 200);
  assert.match(purple5.cartonSource, /ameblo\.jp\/tobacco-kodama\/entry-12864805962/);
  assert.match(purple5.cartonNote, /パープル・5・ボックス|カートンの画像|10 包/);

  const genericCamelMenthol = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X キャメル メンソール"),
  );
  assert.equal(genericCamelMenthol.cartonStatus, "variant-reference");
  assert.equal(genericCamelMenthol.cartonImage, "");

  const camelFresh = enrichProduct(
    rawProducts.find((product) => product.jp === "キャメル・メンソール・フレッシュ・プルーム用"),
  );
  assert.equal(camelFresh.cartonStatus, "verified");
  assert.match(
    camelFresh.cartonImage,
    /ploom-camel-menthol-fresh-yahoo-auctions-10-empty-boxes\.jpg/,
  );
  assert.equal(camelFresh.cartonPackCount, 10);
  assert.equal(camelFresh.cartonStickCount, 200);
  assert.match(camelFresh.cartonSource, /auctions\.yahoo\.co\.jp\/jp\/auction\/n1206003967/);
  assert.match(camelFresh.cartonNote, /CAMEL MENTHOL FRESH|10 包|200/);
});

test("Virginia S Rose Menthol does not publish incomplete carton references as verified", () => {
  const virginia = enrichProduct(
    rawProducts.find((product) => product.jp === "バージニア エス ロゼ メンソール"),
  );
  assert.equal(virginia.cartonStatus, "contents-reference");
  assert.equal(virginia.cartonImage, "");
  assert.match(virginia.cartonNote, /不足以视觉确认完整 10 个同 SKU|降级为数量参考/);
});

test("Wakaba generic stays downgraded while Wakaba Cigar 10P is verified exactly", () => {
  const genericWakaba = enrichProduct(rawProducts.find((product) => product.jp === "わかば"));
  assert.equal(genericWakaba.cartonStatus, "variant-reference");
  assert.equal(genericWakaba.cartonImage, "");
  assert.match(genericWakaba.cartonNote, /わかば・シガー|降级为变体参考/);

  const wakabaCigar = enrichProduct(
    rawProducts.find((product) => product.jp === "わかば・シガー 10P"),
  );
  assert.equal(wakabaCigar.cartonStatus, "verified");
  assert.match(wakabaCigar.cartonImage, /wakaba-cigar-10p-monolog-carton\.jpg/);
  assert.equal(wakabaCigar.cartonPackCount, 10);
  assert.equal(wakabaCigar.cartonStickCount, 200);
  assert.match(wakabaCigar.cartonNote, /わかば・シガー 10P|10P|外箱/);
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

test("verified alias rows disclose the exact printed SKU behind the carton image", () => {
  const expectations = [
    ["ラーク クラシック", /CLASSIC MILDS|クラシック マイルド/],
  ];

  for (const [jp, pattern] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "verified", jp);
    assert.match(item.variantNote, pattern, jp);
  }
});

test("ANA single-pack warning-panel rows stay below verified after pixel audit", () => {
  const expectations = new Map([
    ["ピース ライト", "contents-reference"],
    ["ウィンストン・キャスター・ホワイト・ワン・100s・ボックス", "contents-reference"],
    ["ウィンストン キャスター ホワイト", "variant-warning"],
    ["キャスター 5", "contents-reference"],
    ["アメリカン スピリット ターコイズ", "contents-reference"],
    ["ピース スーパーライト", "contents-reference"],
    ["ピアニッシモ アリア メンソール", "contents-reference"],
    ["クール ブースト フレッシュ 8", "contents-reference"],
    ["ホープ", "contents-reference"],
  ]);

  for (const [jp, status] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, status, jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonNote, /单包\+警示面板|不是整条外箱|不是整条外箱或/, jp);
  }
});

test("single-pack or ambiguous carton sources stay below verified after pixel audit", () => {
  const expectations = [
    ["メビウス ゴールド オリジナル", /Gold 6|单包|verified 门槛/],
    ["キャスター 3", /ホワイト・3|单包|verified 门槛/],
    ["クール ブースト 5 ボックス", /KOOL BOOST 5 BOX|单包|verified 门槛/],
    ["セブンスター", /软包|单包|verified 门槛/],
  ];

  for (const [jp, pattern] of expectations) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(`${item.variantNote} ${item.cartonNote}`, pattern, jp);
  }
});

test("Lark 1 keeps Select 1 and Ultra 1 evidence below verified until SKU is split", () => {
  const item = enrichProduct(rawProducts.find((product) => product.jp === "ラーク 1"));

  assert.equal(item.cartonStatus, "variant-reference");
  assert.equal(item.cartonImage, "");
  assert.equal(item.cartonSource, "https://jp.mercari.com/item/m67407962256");
  assert.equal(item.cartonPackCount, 10);
  assert.equal(item.cartonStickCount, 200);
  assert.match(item.cartonNote, /Select 1 \/ Ultra 1 不能混用/);
  assert.ok(
    item.cartonGallery.some((entry) => /1カートン\/10個/.test(entry.note)),
    "Placer 1-carton quantity reference should remain as gallery context",
  );
});

test("Camel Craft 6, Lark Select 1, and Echo Cigar publish only exact verified cartons", () => {
  const camel6 = enrichProduct(
    rawProducts.find((product) => product.jp === "キャメル クラフト 6"),
  );
  assert.equal(camel6.cartonStatus, "verified");
  assert.match(camel6.cartonImage, /camel-craft6-paypay-84-empty-boxes\.jpg/);
  assert.equal(camel6.cartonPackCount, 10);
  assert.equal(camel6.cartonStickCount, 200);
  assert.match(camel6.cartonNote, /CAMEL 6|84個|10 包/);

  const genericLark1 = enrichProduct(rawProducts.find((product) => product.jp === "ラーク 1"));
  assert.equal(genericLark1.cartonStatus, "variant-reference");
  assert.equal(genericLark1.cartonImage, "");

  const select1 = enrichProduct(
    rawProducts.find((product) => product.jp === "ラーク・セレクト・1・100sボックス"),
  );
  assert.equal(select1.cartonStatus, "verified");
  assert.match(select1.cartonImage, /lark-select1-mercari-72-empty-boxes\.jpg/);
  assert.equal(select1.cartonPackCount, 10);
  assert.equal(select1.cartonStickCount, 200);
  assert.match(select1.cartonNote, /LARK SELECT 1|72箱|10 包/);

  const genericEcho = enrichProduct(rawProducts.find((product) => product.jp === "エコー"));
  assert.equal(genericEcho.cartonStatus, "variant-reference");
  assert.equal(genericEcho.cartonImage, "");

  const echoCigar = enrichProduct(
    rawProducts.find((product) => product.jp === "エコー・シガー 10P"),
  );
  assert.equal(echoCigar.cartonStatus, "verified");
  assert.match(echoCigar.cartonImage, /echo-cigar-10p-monolog-carton-side\.jpg/);
  assert.equal(echoCigar.cartonPackCount, 10);
  assert.equal(echoCigar.cartonStickCount, 200);
  assert.match(echoCigar.cartonNote, /エコー・シガー 10P|10P|外箱/);
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

test("Ploom X generic Camel Menthol stays reference-only while exact Cold and Sharp Cold remain verified", () => {
  const camel = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X キャメル メンソール"),
  );
  assert.equal(camel.cartonStatus, "variant-reference");
  assert.equal(camel.cartonImage, "");
  assert.match(camel.cartonSource, /auctions\.yahoo\.co\.jp\/jp\/auction\/n1206003967/);
  assert.match(camel.cartonNote, /Fresh 不能直接替代/);
  assert.ok(
    camel.cartonGallery.some((entry) =>
      /ploom-camel-menthol-fresh-paypay-7-empty-boxes\.jpg/.test(entry.image),
    ),
  );

  const camelCold = enrichProduct(
    rawProducts.find((product) => product.jp === "キャメル・メンソール・コールド・プルーム用"),
  );
  assert.equal(camelCold.cartonStatus, "verified");
  assert.match(
    camelCold.cartonImage,
    /ploom-camel-menthol-cold-paypay-12-empty-boxes\.jpg/,
  );
  assert.match(
    camelCold.cartonSource,
    /paypayfleamarket\.yahoo\.co\.jp\/item\/z650557490/,
  );
  assert.equal(camelCold.cartonPackCount, 12);
  assert.equal(camelCold.cartonStickCount, 240);
  assert.match(camelCold.cartonNote, /CAMEL MENTHOL COLD|10箱セット\＋2箱|12箱/);

  const camelYellow = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X キャメル メンソール イエロー"),
  );
  assert.equal(camelYellow.cartonStatus, "verified");
  assert.match(
    camelYellow.cartonImage,
    /ploom-camel-menthol-yellow-mercari-20-empty-boxes\.jpg/,
  );
  assert.match(camelYellow.cartonSource, /jp\.mercari\.com\/item\/m90240906087/);
  assert.equal(camelYellow.cartonPackCount, 20);
  assert.equal(camelYellow.cartonStickCount, 400);
  assert.match(camelYellow.cartonNote, /MENTHOL YELLOW|20個|20本/);

  const camelMuscat = enrichProduct(
    rawProducts.find((product) => product.jp === "キャメル・メンソール・マスカット・プルーム用"),
  );
  assert.equal(camelMuscat.cartonStatus, "source-only");
  assert.equal(camelMuscat.cartonImage, "");
  assert.match(camelMuscat.cartonSource, /j-cigarette\.com\/1carton-ploom-x-ploom-s-camel-menthol-muscat/);
  assert.equal(camelMuscat.cartonPackCount, 6);
  assert.equal(camelMuscat.cartonStickCount, 120);
  assert.match(camelMuscat.cartonNote, /MENTHOL MUSCAT GREEN|1 Carton = 6 pack = 120 pieces|不能证明|不能回填/);

  const cold = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・コールド・メンソール・プルーム用"),
  );
  assert.equal(cold.cartonStatus, "verified");
  assert.match(cold.cartonImage, /ploom-mevius-cold-menthol-mercari-28-empty-boxes\.jpg/);
  assert.match(cold.cartonSource, /jp\.mercari\.com\/item\/m76398758136/);
  assert.match(cold.cartonNote, /空箱 28個|COLD MENTHOL|10 包|200 支/);

  const sharpCold = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・シャープ・コールド・メンソール・プルーム用"),
  );
  assert.equal(sharpCold.cartonStatus, "verified");
  assert.match(sharpCold.cartonImage, /ploom-mevius-sharp-cold-mercari-10-empty-boxes\.jpg/);
  assert.match(sharpCold.cartonSource, /jp\.mercari\.com\/item\/m78489316130/);
  assert.match(sharpCold.cartonNote, /SHARP COLD MENTHOL|10 个同款/);

  const blackCold = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・ブラック・コールド・メンソール・プルーム用"),
  );
  assert.equal(blackCold.cartonStatus, "verified");
  assert.match(
    blackCold.cartonImage,
    /ploom-mevius-black-cold-menthol-mercari-16-empty-boxes\.jpg/,
  );
  assert.match(blackCold.cartonSource, /jp\.mercari\.com\/item\/m51545192101/);
  assert.equal(blackCold.cartonPackCount, 16);
  assert.equal(blackCold.cartonStickCount, 320);
  assert.match(blackCold.cartonNote, /BLACK COLD MENTHOL|16箱|20本×10箱/);

  const aromaRich = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・アロマリッチ・レギュラー・プルーム用"),
  );
  assert.equal(aromaRich.cartonStatus, "verified");
  assert.match(
    aromaRich.cartonImage,
    /ploom-mevius-aromarich-regular-mercari-15-empty-boxes\.jpg/,
  );
  assert.match(aromaRich.cartonSource, /jp\.mercari\.com\/item\/m56874401248/);
  assert.equal(aromaRich.cartonPackCount, 15);
  assert.equal(aromaRich.cartonStickCount, 300);
  assert.match(aromaRich.cartonNote, /AROMARICH REGULAR|15箱|カートン（10箱）/);

  const appleOption = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・アップル・オプション・プルーム用"),
  );
  assert.equal(appleOption.cartonStatus, "verified");
  assert.match(
    appleOption.cartonImage,
    /ploom-mevius-apple-option-paypay-24-empty-boxes\.jpg/,
  );
  assert.match(appleOption.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z629229784/);
  assert.equal(appleOption.cartonPackCount, 24);
  assert.equal(appleOption.cartonStickCount, 480);
  assert.match(appleOption.cartonNote, /APPLE OPTION|24箱|カートン（10箱）/);
});

test("Ploom X Mevius Smooth keeps the 6-pack render as source-only quantity evidence", () => {
  const smooth = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス スムース"),
  );

  assert.equal(smooth.cartonStatus, "source-only");
  assert.equal(smooth.cartonImage, "");
  assert.match(smooth.cartonSource, /j-cigarette\.com\/1carton-ploom-x-ploom-s-mevius-smooth/);
  assert.equal(smooth.cartonPackCount, 6);
  assert.equal(smooth.cartonStickCount, 120);
  assert.match(smooth.cartonNote, /MEVIUS \/ ploom X \/ SMOOTH|1 Carton = 6 pack = 120 pieces|不能证明/);
});

test("Ploom X Mevius Menthol Fresh publishes the exact ANA 10-box carton image", () => {
  const fresh = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス メンソール フレッシュ"),
  );

  assert.equal(fresh.cartonStatus, "verified");
  assert.match(
    fresh.cartonImage,
    /ploom-mevius-menthol-fresh-ana-10box-carton\.jpg/,
  );
  assert.match(fresh.cartonSource, /anadf\.com\/en\/itemdetail\.aspx\?s_cd=2030100077/);
  assert.equal(fresh.cartonPackCount, 10);
  assert.equal(fresh.cartonStickCount, 200);
  assert.match(fresh.cartonNote, /MENTHOL FRESH|20cigarettes×10boxes|整条外装/);
});

test("split Ploom X Mevius Smooth Regular publishes the exact 12-box evidence only", () => {
  const shortName = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X メビウス スムース"),
  );
  assert.equal(shortName.cartonStatus, "source-only");
  assert.equal(shortName.cartonImage, "");

  const exact = enrichProduct(
    rawProducts.find(
      (product) =>
        product.jp === "メビウス・スムース・レギュラー・プルーム用",
    ),
  );
  assert.equal(exact.cartonStatus, "verified");
  assert.match(
    exact.cartonImage,
    /ploom-mevius-smooth-regular-paypay-12-empty-boxes\.jpg/,
  );
  assert.match(
    exact.cartonSource,
    /paypayfleamarket\.yahoo\.co\.jp\/item\/z581238832/,
  );
  assert.equal(exact.cartonPackCount, 12);
  assert.equal(exact.cartonStickCount, 240);
  assert.match(exact.cartonNote, /SMOOTH REGULAR|空箱（12個）|12箱/);
});

test("split Camel Smooth Ploom publishes the exact 33-box evidence only", () => {
  const shortName = enrichProduct(
    rawProducts.find((product) => product.jp === "Ploom X キャメル スムース"),
  );
  assert.equal(shortName.cartonStatus, "contents-reference");
  assert.equal(shortName.cartonImage, "");

  const exact = enrichProduct(
    rawProducts.find((product) => product.jp === "キャメル・スムース・プルーム用"),
  );
  assert.equal(exact.cartonStatus, "verified");
  assert.match(
    exact.cartonImage,
    /camel-smooth-ploom-paypay-33-empty-boxes\.jpg/,
  );
  assert.match(
    exact.cartonSource,
    /paypayfleamarket\.yahoo\.co\.jp\/item\/z612685972/,
  );
  assert.equal(exact.cartonPackCount, 33);
  assert.equal(exact.cartonStickCount, 660);
  assert.match(exact.cartonNote, /CAMEL ploom SMOOTH|空箱33箱セット|10\+ same-SKU/);
});

test("Ploom X Sharp Cold keeps older mixed references as gallery context", () => {
  const item = enrichProduct(
    rawProducts.find((product) => product.jp === "メビウス・シャープ・コールド・メンソール・プルーム用"),
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
  assert.match(source, /在线增强失败：\$\{feedback\.progress\}/);
  assert.match(source, /本地匹配 · \$\{feedback\.title\}/);
  assert.match(source, /MiniMax 上游返回额度不足或请求过于频繁/);
  assert.match(source, /图片请求已发送；正在等待安全代理返回/);
  assert.match(source, /目录未命中；正在自动联网补充库外线索/);
  assert.match(source, /MiniMax \+ 联网补充/);
  assert.match(source, /已自动联网查找库外资料/);
  assert.match(source, /mode: "search", query: fallbackQuery/);
  assert.match(source, /function hasAiWebEvidenceIntent/);
  assert.match(source, /没有识别到品牌、烟草、包装或目录线索/);
  assert.match(source, /if \(!hasAiWebEvidenceIntent\(query, catalog\)\)/);

  const received = source.indexOf("已收到，正在理解你的描述");
  const localMatch = source.indexOf("本地目录已匹配");
  const onlineFallback = source.indexOf("目录未命中；正在自动联网补充库外线索");
  const terminal = source.indexOf("本地匹配已完成；");
  assert.ok(received > -1 && received < localMatch && localMatch < terminal);
  assert.ok(localMatch > -1 && localMatch < onlineFallback);

  const proxyCheck = source.indexOf("正在检查安全代理是否可用");
  const noUpload = source.indexOf("图片没有上传");
  const visionCall = source.indexOf('mode: "vision"');
  assert.ok(proxyCheck > -1 && proxyCheck < noUpload && noUpload < visionCall);
});

test("new official TEREA reference images stay non-carton", () => {
  const expected = [
    "テリア ブラック フューシャ メンソール",
    "テリア ブラック サンシャイン メンソール",
    "テリア イエロー メンソール",
    "テリア トロピカル メンソール",
    "テリア ブライト メンソール",
    "テリア ブラック イエロー メンソール",
  ];
  const products = rawProducts.map((product) => enrichProduct(product));

  for (const jp of expected) {
    const rawItem = rawProducts.find((product) => product.jp === jp);
    const item = products.find((product) => product.jp === jp);
    assert.ok(rawItem, jp);
    assert.ok(item, jp);
    assert.match(rawItem.img, /jp\.iqos\.com\/sites\/g\/files\/default\/files\/styles\/hd\/public\/intro-text-video\/PDP/i, jp);
    assert.equal(item.imageStatus, "reference", jp);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.match(item.imageSource, /jp\.iqos\.com\/products\/terea-/, jp);
    assert.match(item.imageNote, /不是 10 包一カートン整条证据/, jp);
    assert.notEqual(item.cartonStatus, "verified", jp);
  }
});

test("device and pod media identities are not mislabeled as a single cigarette pack", () => {
  const device = enrichProduct(rawProducts.find((item) => item.type === "device"));
  const pod = enrichProduct(rawProducts.find((item) => item.type === "pod"));
  const heated = enrichProduct(rawProducts.find((item) => item.type === "heated"));
  const liquid = enrichProduct(
    rawProducts.find((item) => item.jp === "lil HYBRID リキッド カートリッジ"),
  );

  assert.equal(device.unitLabel, "设备本体");
  assert.equal(device.identityHeading, "先认准设备本体与型号");
  assert.equal(device.cartonApplicable, false);
  assert.equal(pod.unitLabel, "烟弹 / 配件");
  assert.equal(pod.identityHeading, "先认准烟弹与适配规格");
  assert.equal(pod.cartonApplicable, false);
  assert.equal(heated.unitLabel, "单盒");
  assert.equal(heated.cartonApplicable, true);
  assert.equal(liquid.packageFormat, "专用液体烟弹");
  assert.equal(liquid.packageFormatJp, "リキッドカートリッジ");
  assert.equal(liquid.unitLabel, "液体烟弹");
  assert.equal(liquid.bulkLabel, "购买规格");
  assert.equal(liquid.cartonApplicable, false);
  assert.equal(liquid.cartonStatus, "not-applicable");
  assert.equal(liquid.cartonPackCount, 0);
  assert.equal(liquid.cartonStickCount, 0);
  assert.match(liquid.cartonNote, /不按传统香烟 10包\/200支/);
});

test("item-level media metadata passes through for device images without carton claims", () => {
  const item = enrichProduct({
    type: "device",
    jp: "测试设备",
    cn: "测试设备",
    jpy: 1000,
    img: "https://example.com/device.jpg",
    imageStatus: "reference",
    imageSource: "https://example.com/device-source",
    imageNote: "官方营销图，仅用于辨认设备外观。",
  });

  assert.equal(item.imageStatus, "reference");
  assert.equal(item.imageSource, "https://example.com/device-source");
  assert.equal(item.imageNote, "官方营销图，仅用于辨认设备外观。");
  assert.equal(item.cartonApplicable, false);
  assert.equal(item.cartonStatus, "not-applicable");
});

test("recent real-image device replacements carry explicit image source and note", () => {
  const expectedDevices = [
    "IQOS イルマ i プライム",
    "IQOS イルマ i",
    "IQOS イルマ i ワン",
    "Ploom CUBE",
    "glo Hilo Plus",
    "glo HYPER pro+",
    "lil HYBRID 3.0",
    "VAPORESSO XROS 5 Nano",
    "Uwell Caliburn G4 Pro",
    "Uwell Caliburn G4 Classic",
    "Voopoo Argus P3",
    "Voopoo Argus G2 Mini",
    "OXVA XLIM PRO 2 DNA",
    "OXVA XLIM GO 2",
    "Geekvape Wenax Q Ultra",
    "Geekvape Wenax Q2",
  ];
  const products = rawProducts.map((product) => enrichProduct(product));

  for (const name of expectedDevices) {
    const item = products.find((product) => `${product.jp} ${product.cn}`.includes(name));
    assert.ok(item, `${name} exists`);
    assert.ok(item.type === "device" || item.type === "vape-device", `${name} type`);
    assert.match(item.imageSource, /^https:\/\//, `${name} imageSource`);
    assert.match(item.imageNote, /营销图|组合图|官方|来源|设备外观/, `${name} imageNote`);
    assert.doesNotMatch(item.image, /picsum\.photos/, `${name} image`);
    assert.equal(item.cartonApplicable, false, `${name} cartonApplicable`);
    assert.equal(item.cartonStatus, "not-applicable", `${name} cartonStatus`);
  }
});

test("cigarette and heated products do not turn ordinary product source into imageSource automatically", () => {
  const cigarette = enrichProduct({
    type: "cigarette",
    jp: "テスト シガレット",
    cn: "测试香烟",
    jpy: 500,
    source: "https://example.com/product-source",
  });
  const heated = enrichProduct({
    type: "heated",
    jp: "テスト ヒートスティック",
    cn: "测试加热烟弹",
    jpy: 580,
    source: "https://example.com/heated-product-source",
  });

  assert.equal(cigarette.imageSource, "");
  assert.equal(heated.imageSource, "");
  assert.equal(cigarette.source, "https://example.com/product-source");
  assert.equal(heated.source, "https://example.com/heated-product-source");
});

test("TEREA Fusion uses the official Japanese Menthol SKU name instead of the false Mint variant", () => {
  const fusion = rawProducts.find((item) => item.cn === "IQOS TEREA 融合薄荷");
  assert.equal(fusion.jp, "IQOS テリア フュージョン メンソール");
  const product = enrichProduct(fusion);
  const imagePath = new URL(`../${product.originalImage.replace(/^\.\//, "")}`, import.meta.url);
  assert.equal(existsSync(imagePath), true);
  assert.equal(product.imageStatus, "reference");
  assert.match(product.imageSource, /jp\.iqos\.com\/discover\/iluma\/terea/);
  assert.match(product.imageNote, /IQOS 官方|Fusion Menthol|一カートン整条证据/);
});

test("round47 immediate official media replacements stay conservative", () => {
  const expectedImages = new Map([
    ["Ploom AURA", "https://www.clubjt.jp/brand-site/ploom/images/Common/ploomAura.webp"],
    ["with2", "https://shop.clubjt.jp/online/images/Products/A_with2_common_230727.jpg"],
    ["with2 スペシャルエディション", "https://shop.clubjt.jp/online/images/Products/with2_specialedition_B.jpg"],
    [
      "glo Hilo",
      "https://www.discoverglo.jp/content/dam/myglo/jp/device/device/soft-gated/Device_Hyperseries_Comparison-hilo_250x340.webp",
    ],
    ["IQOS テリア レギュラー", "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREARegular_Desktop.jpg"],
    ["IQOS テリア メンソール", "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREAMenthol_Desktop.jpg"],
    [
      "IQOS テリア ブラックメンソール",
      "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREABlackMenthol_Desktop.jpg",
    ],
    [
      "IQOS テリア スムース レギュラー",
      "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREASmoothRegular_Desktop.jpg",
    ],
    ["IQOS テリア ルビー レギュラー", "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREARubyRegular_Desktop.jpg"],
    ["IQOS テリア ウォーム レギュラー", "https://jp.iqos.com/sites/g/files/default/files/2026-06/PDP_KV_TEREAWarmRegular_Desktop.jpg"],
    [
      "IQOS センティア バランスド イエロー",
      "https://jp.iqos.com/sites/g/files/default/files/2026-04/SentiaBrandDiscovery_Regular_sentia-balanced-yellow.png",
    ],
  ]);
  const devices = new Set(["Ploom AURA", "with2", "with2 スペシャルエディション", "glo Hilo"]);

  for (const [jp, image] of expectedImages) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.equal(raw.img, image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);

    const item = enrichProduct(raw);
    assert.equal(item.imageStatus, "reference", jp);
    assert.equal(item.imageSource, raw.imageSource, jp);
    if (devices.has(jp)) {
      assert.equal(item.type, "device", jp);
      assert.equal(item.cartonStatus, "not-applicable", jp);
      assert.equal(item.cartonImage, "", jp);
      assert.match(item.imageNote, /设备外观|不代表.*包装|整条/, jp);
    } else {
      assert.equal(item.type, "heated", jp);
      if (jp === "IQOS テリア メンソール") {
        assert.equal(item.cartonStatus, "verified", `${jp} keeps existing exact multi-box evidence`);
      } else {
        assert.notEqual(item.cartonStatus, "verified", `${jp} must not be upgraded from pack imagery`);
      }
      assert.match(item.imageNote, /单包|产品页参考/, jp);
      assert.match(item.imageNote, /不是 10 包|一カートン整条证据/, jp);
    }
  }

  const products = rawProducts.map((product, index) => enrichProduct(product, index));
  const hilo = products.find((product) => product.jp === "glo Hilo");
  const hyperPro = products.find((product) => product.jp === "glo HYPER pro");
  const with2Device = products.find((product) => product.jp === "with2");
  const ploomAura = products.find((product) => product.jp === "Ploom AURA");
  assert.doesNotMatch(hilo.img, /hyper-pro|Hyperpro/i);
  assert.doesNotMatch(hilo.compatibility, /HYPER 系列$/);
  assert.notEqual(hilo.img, hyperPro.img);
  assert.equal(with2Device.deviceBrand, "with2");
  assert.equal(ploomAura.deviceBrand, "Ploom");
  assert.notEqual(with2Device.img, ploomAura.img);
  assert.match(with2Device.imageNote, /不是 Ploom AURA\/Ploom X/);
});

test("round48 immediate media replacements do not fall back to picsum or upgrade cartons", () => {
  const expected = new Map([
    ["IQOS テリア フュージョン メンソール", /PDP_KV_TEREAFusionMenthol_Desktop\.jpg/],
    ["IQOS センティア フロスト グリーン", /SentiaBrandDiscovery_Regular_sentia-frost-green\.png/],
    ["メビウス・ディープ・レギュラー・プルーム用", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2023\/0221_01\.png/],
    ["Ploom X メビウス リッチ", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2021\/0715_04\.png/],
    ["Ploom X メビウス スムース", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2023\/0221_01\.png/],
    ["メビウス・コールド・メンソール・プルーム用", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2023\/0221_01\.png/],
    ["メビウス・シャープ・コールド・メンソール・プルーム用", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2023\/0221_01\.png/],
    ["メビウス・ミックス・ミント・メンソール・プルーム用", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2023\/0419_01\.png/],
    ["キャメル・リッチ・プルーム用", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2021\/0715_04\.png/],
    ["Ploom X キャメル スムース", /jti\.co\.jp\/investors\/library\/press_releases\/images\/2021\/0715_03\.jpg/],
    ["シガローネ・タトゥー・チェリー", /cdn\.store-assets\.com\/s\/185568\/i\/75246507\.jpeg\?width=1024/],
    ["シガローネ・タトゥー・チョコレート", /cdn\.store-assets\.com\/s\/185568\/i\/75246507\.jpeg\?width=1024/],
    ["シガローネ・タトゥー・バニラ", /cdn\.store-assets\.com\/s\/185568\/i\/75246508\.jpeg\?width=1024/],
  ]);
  const existingStrictCartonVerified = new Set([
    "IQOS センティア フロスト グリーン",
    "メビウス・ディープ・レギュラー・プルーム用",
    "メビウス・コールド・メンソール・プルーム用",
    "メビウス・シャープ・コールド・メンソール・プルーム用",
  ]);

  for (const [jp, imagePattern] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, imagePattern, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.match(raw.imageNote, /参考|单包|lineup|composite|JTeXpress|JTI|IQOS/i, jp);
    assert.match(item.imageNote, /参考|source-only|线索|单包|lineup|composite|JTI|IQOS|JTeXpress|辨认|用于区分/i, jp);
    if (existingStrictCartonVerified.has(jp)) {
      assert.equal(item.cartonStatus, "verified", `${jp} keeps pre-existing strict carton evidence`);
    } else {
      assert.notEqual(item.cartonStatus, "verified", `${jp} must not be upgraded to carton verified by round48 media`);
    }
  }
});

test("round49 immediate media replacements do not fall back to picsum or override carton guardrails", () => {
  const expected = new Map([
    ["セブンスター ボックス", /anadf\.com\/images\/item\/7000007061_00\.jpg/],
    ["マールボロ アイスブラスト 8", /anadf\.com\/images\/item\/2010200068_00\.jpg/],
    ["マールボロ ゴールド", /anadf\.com\/images\/item\/8000002097_00\.jpg/],
    ["シガローネ・ロイヤルスリム・メンソール", /buy\.am\/media\/image\/3e\/a7\/a9\/sas-608010\.jpg/],
    ["シガローネ・マグネット", /static\.parma\.am\/origin\/product\/1024\/96357\.jpg/],
    ["シガローネ・ビッグボス", /tobaccoash\.com\/wp-content\/uploads\/2024\/03\/Cigaronne-Big-Boss-XL-Filter\.jpg/],
    ["シガローネ・ファントム・シルバー", /tobaccoash\.com\/wp-content\/uploads\/2024\/03\/Cigaronne-Phantom-Slims-Silver\.jpg/],
    ["シガローネ・エクスクルーシブ・ブラウン", /cdn\.store-assets\.com\/s\/185568\/i\/75246362\.jpeg\?width=1024/],
    ["シガローネ・ウルトラスリム・ブラック", /tobaccoash\.com\/wp-content\/uploads\/2024\/03\/Cigaronne-Ultra-Slims-Black\.jpg/],
    ["シガローネ・スーパースリム・ブラック", /tobaccoash\.com\/wp-content\/uploads\/2024\/03\/Cigaronne-Super-Slims-Black\.jpg/],
    ["シガローネ・ロイヤルスリム・ブラック", /tobaccoash\.com\/wp-content\/uploads\/2024\/03\/Cigaronne-Royal-Slims-XL-Filter-Black\.jpg/],
  ]);
  const preExistingStrictCartonVerified = new Set([
    "セブンスター ボックス",
    "マールボロ アイスブラスト 8",
    "マールボロ ゴールド",
    "シガローネ・ロイヤルスリム・メンソール",
    "シガローネ・マグネット",
    "シガローネ・ビッグボス",
    "シガローネ・ファントム・シルバー",
    "シガローネ・エクスクルーシブ・ブラウン",
    "シガローネ・スーパースリム・ブラック",
    "シガローネ・ロイヤルスリム・ブラック",
  ]);

  for (const [jp, imagePattern] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, imagePattern, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.match(raw.imageNote, /参考|単包|单包|海外|carton reference|JTeXpress|ANA|Duty-free|辨认/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.doesNotMatch(item.imageNote, /picsum/i, jp);
    if (preExistingStrictCartonVerified.has(jp)) {
      assert.equal(item.cartonStatus, "verified", `${jp} keeps pre-existing strict carton evidence`);
    } else {
      assert.notEqual(item.cartonStatus, "verified", `${jp} must not be upgraded to carton verified by round49 reference media`);
    }
  }
});

test("round50 immediate media replacements do not fall back to picsum or get hidden by overrides", () => {
  const expected = new Map([
    ["メビウス スーパーライト", { image: /anadf\.com\/images\/item\/7000083033_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=7000083033/, carton: "verified" }],
    ["マールボロ レッド", { image: /anadf\.com\/images\/item\/7000098238_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=7000098238/, carton: "verified" }],
    ["マールボロ メンソール", { image: /anadf\.com\/images\/item\/7000098245_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=7000098245/, carton: "variant-reference" }],
    ["ラーク クラシック", { image: /placer-tabaco\.com\/data\/placer\/product\/18a5d1c093\.jpg/, source: /placer-tabaco\.com\/product\/2884/, carton: "verified" }],
    ["ラーク ハイブリッド", { image: /anadf\.com\/images\/item\/2010200052_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010200052/, carton: "contents-reference" }],
    ["キャメル クラフト 6", { image: /anadf\.com\/images\/item\/2010100180_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100180/, carton: "verified" }],
    ["ピース ライト", { image: /anadf\.com\/images\/item\/3211051018_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=3211051018/, carton: "contents-reference" }],
    ["ウィンストン XS", { image: /anadf\.com\/images\/item\/2010100123_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100123/, carton: "contents-reference" }],
    ["ウィンストン キャスター ホワイト", { image: /anadf\.com\/images\/item\/2010100026_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100026/, carton: "variant-warning" }],
    ["メビウス・プレミアムメンソール・オプション・パープル・8", { image: /anadf\.com\/images\/item\/2010100049_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100049/, carton: "contents-reference" }],
    ["ピース スーパーライト", { image: /anadf\.com\/images\/item\/3211051034_00\.jpg/, source: /anadf\.com\/en\/itemdetail\.aspx\?s_cd=3211051034/, carton: "contents-reference" }],
    ["クール ブースト フレッシュ 8", { image: /anadf\.com\/images\/item\/7000048009_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=7000048009/, carton: "contents-reference" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|单包|single-pack|not carton verified|不是整条|不是 10 包/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.match(item.imageSource, expectation.source, `${jp} round50 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|单包|single-pack|not carton verified|不是整条|不是 10 包/i, `${jp} round50 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round50 reference media`);
  }

  const xs = enrichProduct(rawProducts.find((product) => product.jp === "ウィンストン XS"));
  assert.match(xs.imageNote, /XS Caster White 1|旧款|完整日文名/);
  const casterWhite = enrichProduct(rawProducts.find((product) => product.jp === "ウィンストン キャスター ホワイト"));
  assert.match(casterWhite.imageNote, /5mg Box|泛称|1mg\/3mg\/5mg/);
});

test("round51 immediate media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["メビウス オリジナル", { image: /anadf\.com\/images\/item\/2010100109_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100109/, carton: "verified" }],
    ["セブンスター", { image: /anadf\.com\/images\/item\/3211051013_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=3211051013/, carton: "source-only" }],
    ["マールボロ ダブルバースト", { image: /anadf\.com\/images\/item\/7000098247_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=7000098247/, carton: "variant-reference" }],
    ["ナチュラル アメリカン スピリット ライト 14本入", { image: /anadf\.com\/images\/item\/2010100174_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100174/, carton: "verified" }],
    ["アメリカン スピリット ターコイズ", { image: /anadf\.com\/images\/item\/2010100073_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100073/, carton: "contents-reference" }],
    ["ピアニッシモ アリア メンソール", { image: /anadf\.com\/images\/item\/2010100121_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100121/, carton: "contents-reference" }],
    ["バージニア エス ロゼ メンソール", { image: /makeshop-multi-images\.akamaized\.net\/kdaisho\/itemimages\/000000001119_7u01G5K\.jpg/, source: /world-tobacco\.jp\/view\/item\/000000001119/, carton: "contents-reference" }],
    ["ホープ", { image: /anadf\.com\/images\/item\/3211051019_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=3211051019/, carton: "contents-reference" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|单包|single-product|retailer|not visible carton|不是整条|不是 10 包|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round51 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|单包|single-product|retailer|not visible carton|不是整条|不是 10 包|not carton verified/i, `${jp} round51 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round51 reference media`);
  }
});

test("round52 immediate media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["キャスター 3", { image: /anadf\.com\/images\/item\/2010100027_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100027/, carton: "source-only" }],
    ["キャスター 5", { image: /anadf\.com\/images\/item\/2010100026_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2010100026/, carton: "contents-reference" }],
    ["バージニア エス ロゼ メンソール", { image: /makeshop-multi-images\.akamaized\.net\/kdaisho\/itemimages\/000000001119_7u01G5K\.jpg/, source: /world-tobacco\.jp\/view\/item\/000000001119/, carton: "contents-reference" }],
    ["メビウス・シトラス・オプション・プルーム用", { image: /anadf\.com\/images\/item\/2030100195_00\.jpg/, source: /anadf\.com\/ItemDetail\.aspx\?s_cd=2030100195/i, carton: "needs-review" }],
    ["メビウス・ペアー・オプション・プルーム用", { image: /anadf\.com\/images\/item\/2030100211_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100211/i, carton: "needs-review" }],
    ["ラッキー・ストライク・ベリー・メンソール・glo hyper用", { image: /anadf\.com\/images\/item\/2030100225_00\.jpg/, source: /anadf\.com\/ItemDetail\.aspx\?s_cd=2030100225/i, carton: "needs-review" }],
    ["ケント・トゥルー・リッチ・メンソール・glo hyper用", { image: /anadf\.com\/images\/item\/2030100175_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100175/i, carton: "needs-review" }],
    ["glo HYPER pro", { image: /myglo\.com\/jp\/ja\/device\/glo-hyper-pro\/.*hyperpro-lineup-lapisblue-2x\.webp/, source: /myglo\.com\/jp\/ja\/device\/glo-hyper-pro/, carton: "not-applicable" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|single-product|retailer|device|not visible carton|不是整条|不是 10 包|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round52 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|single-product|retailer|device|not visible carton|不是整条|不是 10 包|not carton verified/i, `${jp} round52 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round52 reference media`);
  }
});

test("round53 immediate media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["キャメル クラフト 14", { image: /makeshop-multi-images\.akamaized\.net\/kdaisho\/itemimages\/000000001935_LH9nIAZ\.jpg/, source: /world-tobacco\.jp\/view\/item\/000000001935/, carton: "verified" }],
    ["キャメル・メンソール・コールド・プルーム用", { image: /anadf\.com\/images\/item\/2030100203_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100203/i, carton: "verified" }],
    ["キャメル・メンソール・ベリー・プルーム用", { image: /anadf\.com\/images\/item\/2030100205_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100205/i, carton: "needs-review" }],
    ["キャメル・ベリー・オプション・プルーム用", { image: /anadf\.com\/images\/item\/2030100212_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100212/i, carton: "needs-review" }],
    ["ラッキー・ストライク・リッチ・タバコ・glo hyper用", { image: /kishida\.ocnk\.net\/data\/kishida\/product\/p_image\/k3965_1\.jpg/, source: /kishida\.ocnk\.net\/product\/3285/, carton: "verified" }],
    ["ラッキー・ストライク・メンソール・glo hyper用", { image: /tabako\.co\.jp\/tabako\/wp-content\/uploads\/2022\/12\/tvp-lky_me20glohpr\.jpg/, source: /tabako\.co\.jp\/item\/tvp-lky_me20glohpr/, carton: "verified" }],
    ["ラッキー・ストライク・ベリー・ブースト・glo hyper用", { image: /tabako\.co\.jp\/tabako\/wp-content\/uploads\/2024\/01\/tvp-lky_berryboost\.jpg/, source: /tabako\.co\.jp\/item\/tvp-lky_berryboost/, carton: "needs-review" }],
    ["ラッキー・ストライク・トロピカル・ブースト・glo hyper用", { image: /tabako\.co\.jp\/tabako\/wp-content\/uploads\/2024\/01\/tvp-lky_tropicalboost\.jpg/, source: /tabako\.co\.jp\/item\/tvp-lky_tropicalboost/, carton: "needs-review" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|single-product|retail|ANA|not visible|不是整条|不是 10 包|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round53 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|single-product|retail|ANA|not visible|不是整条|不是 10 包|not carton verified/i, `${jp} round53 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round53 reference media`);
  }
});

test("round54 immediate media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["ラッキー・ストライク・ベリー・スイッチ・hyper用", { image: /tabako\.co\.jp\/tabako\/wp-content\/uploads\/2025\/02\/tvp-lky_berryswitch\.jpg/, source: /tabako\.co\.jp\/item\/tvp-lky_berryswitch/, carton: "needs-review" }],
    ["ラッキー・ストライク・トロピカル・スイッチ・hyper用", { image: /tabako\.co\.jp\/tabako\/wp-content\/uploads\/2025\/02\/tvp-lky_toropicalswitch\.jpg/, source: /tabako\.co\.jp\/item\/tvp-lky_toropicalswitch/, carton: "needs-review" }],
    ["ケント・トゥルー・タバコ・glo hyper用", { image: /anadf\.com\/images\/item\/2030100174_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100174/i, carton: "needs-review" }],
    ["ケント・トゥルー・メンソール・glo hyper用", { image: /placer-tabaco\.com\/data\/placer\/product\/20240929_ffe3e1\.jpg/, source: /placer-tabaco\.com\/product\/6068/, carton: "needs-review" }],
    ["ケント・トゥルー・ベリー・ブースト・glo hyper用", { image: /anadf\.com\/images\/item\/2030100176_00\.jpg/, source: /anadf\.com\/itemdetail\.aspx\?s_cd=2030100176/i, carton: "needs-review" }],
    ["IQOS イルマ i ワン ミネラ モデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/One_MINERA\.png/, source: /iqos\.com\/news\/iqos-iluma-i-minera-limited-edition/, carton: "not-applicable" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|single-product|retail|official|device|not visible|不是整条|不是 10 包|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round54 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|single-product|retail|official|device|not visible|不是整条|不是 10 包|not carton verified/i, `${jp} round54 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round54 reference media`);
  }
});

test("round55 immediate media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["ケント・トゥルー・リッチ・タバコ・glo hyper用", { image: /makeshop-multi-images\.akamaized\.net\/izumiya77\/itemimages\/000000002526_V8jybPd\.jpg/, source: /izumiya-tobacco\.com\/shopdetail\/000000002526/, carton: "needs-review" }],
    ["IQOS イルマ i ミネラ モデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/Mid_MINERA\.png/, source: /iqos\.com\/news\/iqos-iluma-i-minera-limited-edition/, carton: "not-applicable" }],
    ["IQOS イルマ i アニバーサリーモデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/10YA_SET\.jpg/, source: /iqos\.com\/news\/iqos-iluma-i-anniversary-edition/, carton: "not-applicable" }],
    ["IQOS イルマ i プライム アニバーサリーモデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/IQOS_4_ILUMA_PRIME_CORE_E_BREEZE_BLUE_A01_R8%20%281%29_0\.png/, source: /iqos\.com\/news\/iqos-iluma-i-anniversary-edition/, carton: "not-applicable" }],
    ["IQOS イルマ i プライム リミックスモデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/styles\/hd_webp\/public\/hero\/remix_pdp_d_banner_kv_prime\.jpg\.webp\?itok=wuQspQhf/, source: /iqos\.com\/products\/iluma\/iluma-i-prime-remix-limited-edition/, carton: "not-applicable" }],
    ["IQOS イルマ i リミックスモデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/styles\/hd_webp\/public\/hero\/remix_pdp_d_banner_kv_mid\.jpg\.webp\?itok=x6gQsD8G/, source: /iqos\.com\/products\/iluma\/iluma-i-remix-limited-edition/, carton: "not-applicable" }],
    ["IQOS イルマ i ワン リミックスモデル", { image: /iqos\.com\/sites\/g\/files\/default\/files\/styles\/hd_webp\/public\/hero\/remix_pdp_d_banner_kv_one\.jpg\.webp\?itok=L7VM7tFX/, source: /iqos\.com\/products\/iluma\/iluma-i-one-remix-limited-edition/, carton: "not-applicable" }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /reference|参考|single-product|retail|official|device|not visible|不是整条|不是 10 包|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round55 source should survive media enrichment`);
    assert.match(item.imageNote, /reference|参考|single-product|retail|official|device|not visible|不是整条|不是 10 包|not carton verified/i, `${jp} round55 note should survive media enrichment`);
    assert.equal(item.cartonStatus, expectation.carton, `${jp} carton status must not change because of round55 reference media`);
  }
});

test("round56 immediate device media replacements stay reference-only and keep carton guardrails", () => {
  const expected = new Map([
    ["IQOS イルマ i プライム アスペングリーン", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/AspenGreen_Delist_News_landscape\.png/, source: /iqos\.com\/news\/suspension-of-iqos-iluma-i-prime-aspen-green/ }],
    ["IQOS イルマ プライム", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/ILUMA-PRIME_PDP_200x500\.png/, source: /iqos\.com\/news\/iluma-prime-iluma-difference/ }],
    ["IQOS イルマ", { image: /iqos\.com\/sites\/g\/files\/default\/files\/inline-images\/ILUMA_PDP_200x500\.png/, source: /iqos\.com\/news\/iluma-prime-iluma-difference/ }],
  ]);

  for (const [jp, expectation] of expected) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, expectation.image, jp);
    assert.doesNotMatch(raw.img, /picsum\.photos/, jp);
    assert.equal(raw.imageStatus, "reference", jp);
    assert.match(raw.imageSource, expectation.source, jp);
    assert.match(raw.imageNote, /device reference|official|not tobacco|not pack\/carton evidence|not carton verified/i, jp);

    const item = enrichProduct(raw);
    assert.doesNotMatch(item.image, /picsum\.photos/, jp);
    assert.equal(item.imageStatus, "reference", `${jp} image status should stay conservative after enrichment`);
    assert.match(item.imageSource, expectation.source, `${jp} round56 source should survive media enrichment`);
    assert.match(item.imageNote, /device reference|official|not tobacco|not pack\/carton evidence|not carton verified/i, `${jp} round56 note should survive media enrichment`);
    assert.equal(item.cartonStatus, "not-applicable", `${jp} device carton status must remain not-applicable`);
    assert.equal(item.cartonImage, "", `${jp} device must not publish carton image`);
  }

  for (const jp of ["IQOS イルマ i プライム WE モデル", "IQOS イルマ i ワン WE モデル"]) {
    const raw = rawProducts.find((product) => product.jp === jp);
    assert.ok(raw, jp);
    assert.match(raw.img, /picsum\.photos/, `${jp} stays unlanded because evidence is WE 2023 non-i`);
  }
});

test("TEREA single-pack photos use matching World Tobacco pages while caption-only carton renders stay source-only", () => {
  const expected = new Map([
    [
      "IQOS テリア レギュラー",
      {
        pack: /jp\.iqos\.com\/discover\/iluma\/terea/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-regular-japan-dubai-uae/,
        note: /TEREA Regular|10 Packs|200 Heatsticks|不能证明/,
      },
    ],
    [
      "IQOS テリア スムース レギュラー",
      {
        pack: /jp\.iqos\.com\/discover\/iluma\/terea/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-smooth-regular-japan-dubai-uae/,
        note: /SMOOTH|10 Packs|200 Heatsticks|不能证明/,
      },
    ],
    [
      "IQOS テリア ルビー レギュラー",
      {
        pack: /jp\.iqos\.com\/discover\/iluma\/terea/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-ruby-regular-japan-dubai-uae/,
        note: /Ruby|10 Packs|200 Heatsticks|不能证明/,
      },
    ],
    [
      "IQOS テリア フュージョン メンソール",
      {
        pack: /jp\.iqos\.com\/discover\/iluma\/terea/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-fusion-menthol-japan-dubai-uae/,
        note: /Fusion|10 Packs|200 Heatsticks|不能证明/,
      },
    ],
    [
      "IQOS テリア ウォーム レギュラー",
      {
        pack: /jp\.iqos\.com\/discover\/iluma\/terea/,
        source: /iqosheets-uae\.ae\/products\/iqos-terea-warm-regular-japan-dubai-uae/,
        note: /Warm|10 Packs|200 Heatsticks|不能证明/,
      },
    ],
  ]);

  for (const [jp, expectation] of expected) {
    const item = enrichProduct(rawProducts.find((product) => product.jp === jp));
    assert.equal(item.imageStatus, "reference", jp);
    assert.match(item.imageSource, expectation.pack, jp);
    if (expectation.oldWorldTobaccoReference) {
      assert.match(item.imageNote, /World Tobacco|SKU|来源页/, jp);
    } else {
      assert.match(item.imageNote, /IQOS 官方|单包|产品页参考/, jp);
    }
    assert.equal(item.cartonStatus, "source-only", jp);
    assert.equal(item.cartonImage, "", jp);
    assert.match(item.cartonSource, expectation.source, jp);
    assert.match(item.cartonNote, expectation.note, jp);
  }

  const menthol = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS テリア メンソール"),
  );
  assert.equal(menthol.imageStatus, "reference");
  assert.match(menthol.imageSource, /jp\.iqos\.com\/discover\/iluma\/terea/);
  assert.equal(menthol.cartonStatus, "verified");
  assert.match(menthol.cartonImage, /terea-menthol-paypay-39-empty-boxes\.jpg/);
  assert.match(menthol.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z302147694/);
  assert.match(menthol.cartonNote, /MENTHOL|39個|10 包|200 支/);

  const blackMenthol = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS テリア ブラックメンソール"),
  );
  assert.equal(blackMenthol.imageStatus, "reference");
  assert.match(blackMenthol.imageSource, /jp\.iqos\.com\/discover\/iluma\/terea/);
  assert.equal(blackMenthol.cartonStatus, "source-only");
  assert.equal(blackMenthol.cartonImage, "");
  assert.match(blackMenthol.cartonSource, /iqosheets-uae\.ae\/products\/iqos-terea-black-menthol-japan-dubai-uae/);
  assert.match(blackMenthol.cartonNote, /BLACK MENTHOL|10 Packs|200 Heatsticks|不能证明/);
});

test("TEREA overseas caption-only carton renders do not publish as verified images", () => {
  const tereaItems = rawProducts
    .filter((item) => /IQOS テリア/.test(item.jp))
    .map((item) => enrichProduct(item));
  const captionOnlySources = new Map([
    ["IQOS テリア ブラックメンソール", /iqosheets-uae\.ae\/products\/iqos-terea-black-menthol-japan-dubai-uae/],
    ["IQOS テリア レギュラー", /iqosheets-uae\.ae\/products\/iqos-terea-regular-japan-dubai-uae/],
    ["IQOS テリア スムース レギュラー", /iqosheets-uae\.ae\/products\/iqos-terea-smooth-regular-japan-dubai-uae/],
    ["IQOS テリア ルビー レギュラー", /iqosheets-uae\.ae\/products\/iqos-terea-ruby-regular-japan-dubai-uae/],
    ["IQOS テリア フュージョン メンソール", /iqosheets-uae\.ae\/products\/iqos-terea-fusion-menthol-japan-dubai-uae/],
    ["IQOS テリア ウォーム レギュラー", /iqosheets-uae\.ae\/products\/iqos-terea-warm-regular-japan-dubai-uae/],
  ]);

  assert.ok(tereaItems.length >= 7);
  for (const item of tereaItems) {
    if (item.jp === "IQOS テリア メンソール") {
      assert.equal(item.cartonStatus, "verified");
      assert.match(item.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z302147694/);
      continue;
    }
    const expectation = captionOnlySources.get(item.jp);
    if (expectation) {
      assert.equal(item.cartonStatus, "source-only");
      assert.equal(item.cartonImage, "");
      assert.match(item.cartonSource, expectation, item.jp);
      assert.match(item.cartonNote, /10 Packs|200 Heatsticks|不能证明/, item.jp);
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

  assert.equal(items.length, 24);
  assert.equal(items.filter((item) => item.cartonStatus === "verified").length, 11);
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
    } else if (item.jp === "シガローネ・ファントム") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-phantom-rozetka-carton\.jpg/, item.jp);
      assert.match(item.cartonNote, /Cigaronne Phantom x 10|EAN 4850008002232|Phantom Silver/, item.jp);
    } else if (item.jp === "シガローネ・エクスクルーシブ・ブラウン") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-exclusive-brown-mercari-carton-box\.jpg/, item.jp);
      assert.match(item.cartonNote, /Exclusive Brown|XL FILTER|カートン|10箱/, item.jp);
    } else if (item.jp === "シガローネ・ビッグボス") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-big-boss-rozetka-open-carton\.jpg/, item.jp);
      assert.match(item.cartonNote, /Big Boss XL Filter х 10|Пачок в блоці 10|Цигарок в пачці 20/, item.jp);
    } else if (item.jp === "シガローネ・レジェンド") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-legend-cigaronne-app-outer-box\.jpg/, item.jp);
      assert.match(item.cartonSource, /armshop\.ru\/catalog\/sigaronne\/sigarety-armyanskie-cigaronne-royal-legend-black-gold-new-120mm-xl-filter-sps-cigaronne/, item.jp);
      assert.match(item.cartonNote, /Legend Black&Gold|В блоке 10 пачек|Cigaronne LEGEND|不可回填/, item.jp);
    } else if (item.jp === "シガローネ・ロイヤルスリム・メンソール") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-royal-menthol-cigarpro-carton\.webp/, item.jp);
      assert.match(item.cartonNote, /Royal Slims XL Filter|10 пачек|200 сигарет/, item.jp);
    } else if (item.jp === "シガローネ・ロイヤルスリム・ホワイト") {
      assert.equal(item.cartonStatus, "verified", item.jp);
      assert.match(item.cartonImage, /cigaronne-royal-slims-white-rozetka-carton\.jpg/, item.jp);
      assert.match(item.image, /cigaronne-royal-slims-white-dougenzaka-pack\.jpg/, item.jp);
      assert.match(item.cartonNote, /Royal Slims White х 10|EAN 4850008001785|10 包 \/ 200 支/, item.jp);
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

test("Cigaronne Legend uses the exact outer-box evidence and keeps official series reference in gallery", () => {
  const item = enrichProduct(rawProducts.find((product) => product.jp === "シガローネ・レジェンド"));

  assert.equal(item.cartonStatus, "verified");
  assert.equal(item.imageStatus, "verified");
  assert.match(item.image, /cigaronne-legend-cigaronne-app-outer-box\.jpg/);
  assert.match(item.cartonImage, /cigaronne-legend-cigaronne-app-outer-box\.jpg/);
  assert.match(item.cartonSource, /armshop\.ru/);
  assert.equal(item.cartonPackCount, 10);
  assert.equal(item.cartonStickCount, 200);
  assert.match(item.cartonNote, /Time-Tested XL FILTER|10 包 \/ 200 支|不可回填 Big Boss/);
  assert.match(
    item.cartonGallery.map((entry) => entry.image).join(" "),
    /cigaronne-imperial-legend-official\.png/,
  );
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
    rawProducts.find((product) => product.jp === "メビウス・シャープ・コールド・メンソール・プルーム用"),
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

test("Winston Caster White One 100s is split from legacy XS but stays below verified without carton pixels", () => {
  const xs = enrichProduct(rawProducts.find((product) => product.jp === "ウィンストン XS"));
  assert.equal(xs.cartonStatus, "contents-reference");
  assert.equal(xs.cartonImage, "");
  assert.match(xs.cartonNote, /旧款\/历史名|近似包装参考/);

  const one100s = enrichProduct(
    rawProducts.find(
      (product) => product.jp === "ウィンストン・キャスター・ホワイト・ワン・100s・ボックス",
    ),
  );
  assert.equal(one100s.cartonStatus, "contents-reference");
  assert.equal(one100s.cartonImage, "");
  assert.match(one100s.cartonSource, /anadf\.com\/itemdetail\.aspx\?s_cd=2010100028/);
  assert.equal(one100s.cartonPackCount, 10);
  assert.equal(one100s.cartonStickCount, 200);
  assert.match(one100s.cartonNote, /20本×10箱|单包\+警示面板|旧“ウィンストン XS”仍保持近似参考/);
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
    ["シガローネ・ロイヤルスリム・ホワイト", /cigaronne-royal-slims-white-dougenzaka-pack\.jpg/],
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
    } else if (jp === "シガローネ・ロイヤルスリム・ホワイト") {
      assert.equal(item.cartonStatus, "verified", jp);
      assert.match(item.cartonImage, /cigaronne-royal-slims-white-rozetka-carton\.jpg/, jp);
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
  assert.equal(americanSpiritLight.imageStatus, "reference");
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
    rawProducts.find((product) => product.jp === "ラッキー・ストライク・メンソール・glo hyper用"),
  );
  assert.equal(lucky.cartonStatus, "verified");
  assert.match(lucky.cartonImage, /glo-lucky-strike-menthol-mercari-10-empty-boxes\.jpg/);
  assert.match(lucky.cartonSource, /jp\.mercari\.com\/item\/m27415415655/);
  assert.match(lucky.cartonNote, /空箱 10箱/);
  assert.match(lucky.cartonNote, /10 boxes|200 sticks/);

  const tropical = enrichProduct(
    rawProducts.find((product) => product.jp === "ネオ・ブリリアント・トロピカル・hyper用"),
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

test("KOOL Boost 5 BOX keeps the ANA source below verified after image review", () => {
  const raw = rawProducts.find((product) => product.jp === "クール ブースト 5 ボックス");
  assert.ok(raw);
  const boost5 = enrichProduct(raw);

  assert.equal(boost5.cartonStatus, "source-only");
  assert.equal(boost5.cartonImage, "");
  assert.match(boost5.cartonSource, /anadf\.com\/itemdetail\.aspx\?s_cd=7000050840/);
  assert.equal(boost5.cartonPackCount, 10);
  assert.equal(boost5.cartonStickCount, 200);
  assert.match(boost5.cartonNote, /KOOL BOOST 5 BOX.*20本×10箱.*单包/s);
});

test("glo Lucky Strike Dark publishes exact Dark Tobacco multi-box evidence", () => {
  const dark = enrichProduct(
    rawProducts.find((product) => product.jp === "ラッキー・ストライク・ダーク・タバコ・glo hyper用"),
  );

  assert.equal(dark.cartonStatus, "verified");
  assert.match(dark.cartonImage, /glo-lucky-strike-dark-tobacco-paypay-14-empty-boxes\.jpg/);
  assert.match(dark.cartonSource, /paypayfleamarket\.yahoo\.co\.jp\/item\/z584991492/);
  assert.equal(dark.cartonPackCount, 10);
  assert.equal(dark.cartonStickCount, 200);
  assert.match(dark.cartonNote, /DARK TOBACCO.*空箱14個/s);
});

test("glo Brilliant Berry, Dark Tobacco, and split Dark Menthol publish only exact verified cartons", () => {
  const berry = enrichProduct(
    rawProducts.find((product) => product.jp === "ネオ・ブリリアント・ベリー・hyper用"),
  );
  assert.equal(berry.cartonStatus, "verified");
  assert.match(berry.cartonImage, /glo-neo-brilliant-berry-paypay-15-empty-boxes\.jpg/);
  assert.equal(berry.cartonPackCount, 10);
  assert.equal(berry.cartonStickCount, 200);
  assert.match(berry.cartonNote, /Brilliant Berry|15 个|10 boxes per carton/);

  const genericDark = enrichProduct(
    rawProducts.find((product) => product.jp === "ラッキー・ストライク・ダーク・タバコ・glo hyper用"),
  );
  assert.equal(genericDark.cartonStatus, "verified");
  assert.match(
    genericDark.cartonImage,
    /glo-lucky-strike-dark-tobacco-paypay-14-empty-boxes\.jpg/,
  );

  const darkMenthol = enrichProduct(
    rawProducts.find(
      (product) => product.jp === "ラッキー・ストライク・ダーク・メンソール・glo hyper用",
    ),
  );
  assert.equal(darkMenthol.cartonStatus, "verified");
  assert.match(
    darkMenthol.cartonImage,
    /glo-lucky-strike-dark-menthol-paypay-52-empty-boxes\.jpg/,
  );
  assert.equal(darkMenthol.cartonPackCount, 10);
  assert.equal(darkMenthol.cartonStickCount, 200);
  assert.match(darkMenthol.cartonNote, /DARK MENTHOL|52 个|10 boxes per carton/);
});

test("SENTIA Balanced Yellow keeps Box of 200 as source-only until a real carton image is found", () => {
  const sentia = enrichProduct(
    rawProducts.find((product) => product.jp === "IQOS センティア バランスド イエロー"),
  );

  assert.equal(sentia.cartonStatus, "source-only");
  assert.equal(sentia.imageStatus, "reference");
  assert.match(sentia.image, /SentiaBrandDiscovery_Regular_sentia-balanced-yellow\.png/);
  assert.match(sentia.imageSource, /jp\.iqos\.com\/discover\/iluma\/sentia/);
  assert.match(sentia.imageNote, /单包|产品页参考/);
  assert.equal(sentia.cartonImage, "");
  assert.match(sentia.cartonSource, /handrollingtobacco\.co\.uk/);
  assert.equal(sentia.cartonPackCount, 10);
  assert.equal(sentia.cartonStickCount, 200);
  assert.match(sentia.cartonNote, /Box of 200/);
  assert.match(sentia.cartonNote, /10 packs of 20 tobacco sticks/);
  assert.match(sentia.cartonNote, /不能证明/);
  assert.match(sentia.cartonGallery[0].label, /Box of 200/);
  for (const image of [sentia.cartonGallery[0].image, sentia.cartonGallery[1].image]) {
    const imagePath = new URL(`../${image.replace(/^\.\//, "")}`, import.meta.url);
    assert.equal(existsSync(imagePath), true, image);
  }
});
