import { resolveProductMedia } from "./product-media.js";

const PRICE_CHECKED = "2026-07-29";
const MHLW_E_CIGARETTE_GUIDANCE =
  "https://kennet.mhlw.go.jp/information/information/dictionary/tobacco/yt-059.html";

const TYPE_LABELS = {
  cigarette: "传统香烟",
  heated: "加热烟弹",
  device: "加热设备",
  pod: "电子烟弹 / 一次性参考",
};

const TYPE_LABELS_JP = {
  cigarette: "紙巻きたばこ",
  heated: "加熱式たばこ",
  device: "加熱式デバイス",
  pod: "電子たばこポッド・使い捨て参考",
};

const BRAND_PROFILES = [
  {
    test: /Ploom|with2/i,
    brand: "Ploom",
    jpScore: 4.2,
    cnScore: 3.8,
    availability: "likely",
    jpImpression: "Ploom 在日本本地能见度较高，烟草感与薄荷线都较完整。",
    cnImpression: "中国游客熟悉度低于 IQOS，常需要先确认设备型号和兼容性。",
    source: "https://www.jti.co.jp/tobacco/products/plooms/index.html",
  },
  {
    test: /セブンスター|七星/i,
    brand: "Seven Stars",
    jpScore: 4.8,
    cnScore: 4.8,
    availability: "widely-available",
    jpImpression: "在日本常被视为经典重口味代表，辨识度和长期知名度都很高。",
    cnImpression: "中国游客对“七星”中文名和包装认知度高，常被当作日本烟代表款。",
    source: "https://www.jti.co.jp/tobacco/products/sevenstars/index.html",
  },
  {
    test: /メビウス|梅比乌斯|MEVIUS/i,
    brand: "Mevius",
    jpScore: 4.9,
    cnScore: 4.6,
    availability: "widely-available",
    jpImpression: "系列覆盖从原味到低焦与薄荷，常见评价集中在稳定、顺口和选择多。",
    cnImpression: "中国游客熟悉度较高，蓝白包装和柔和路线容易辨认。",
    source: "https://www.jti.co.jp/tobacco/products/mevius/index.html",
  },
  {
    test: /マールボロ|万宝路|Marlboro/i,
    brand: "Marlboro",
    jpScore: 4.5,
    cnScore: 4.8,
    availability: "widely-available",
    jpImpression: "在日本属于常见国际品牌，原味与薄荷线都有稳定受众。",
    cnImpression: "中国用户品牌认知度很高，红、金、薄荷和爆珠款比较容易沟通。",
    source: "https://www.pmi.com/markets/japan/ja/company/products",
  },
  {
    test: /テリア|TEREA/i,
    brand: "TEREA",
    jpScore: 4.8,
    cnScore: 4.6,
    availability: "widely-available",
    jpImpression: "IQOS ILUMA 主力烟弹，口味线丰富，在加热烟用户中能见度很高。",
    cnImpression: "中国 IQOS 用户熟悉度高，常按颜色和薄荷强度选择。",
    source: "https://jp.iqos.com/",
  },
  {
    test: /センティア|SENTIA/i,
    brand: "SENTIA",
    jpScore: 4.3,
    cnScore: 4.1,
    availability: "likely",
    jpImpression: "被理解为 IQOS ILUMA 的标准价位线，口味直观、选择较多。",
    cnImpression: "中国游客对它的认知低于 TEREA，但价格相对友好。",
    source: "https://jp.iqos.com/",
  },
  {
    test: /ピース|和平|Peace/i,
    brand: "Peace",
    jpScore: 4.4,
    cnScore: 4.5,
    availability: "likely",
    jpImpression: "在日本有鲜明的经典高香气形象，偏好者通常重视香气和品牌历史。",
    cnImpression: "中国游客常被包装与“和平”中文名吸引，礼品辨识度较高。",
    source: "https://www.jti.co.jp/tobacco/products/peace/",
  },
  {
    test: /アメリカン スピリット|美式精神|American Spirit/i,
    brand: "American Spirit",
    jpScore: 4.1,
    cnScore: 4.2,
    availability: "likely",
    jpImpression: "自然派のブランドイメージと香りの個性で、固定ファンに認知されています。",
    cnImpression: "中国游客常因独特包装和自然烟草定位关注，购买时需留意日本版支数。",
    source: "https://www.jti.co.jp/tobacco/products/american_spirit/index.html",
  },
  {
    test: /キャメル|骆驼|Camel/i,
    brand: "Camel",
    jpScore: 4.2,
    cnScore: 4.0,
    availability: "likely",
    jpImpression: "常被评价为价格友好、口味选择直接，Craft 系列覆盖面广。",
    cnImpression: "中国用户熟悉品牌，但日本限定细分款需要看包装和日文名确认。",
    source: "https://www.jti.co.jp/tobacco/products/camel/",
  },
  {
    test: /シガローネ|Cigaronne|卡比龙/i,
    brand: "Cigaronne",
    jpScore: 3.8,
    cnScore: 4.0,
    availability: "specialist",
    jpImpression: "日本评价常集中在横向高级包装、115mm 超长极细规格和礼品感；一般便利店能见度低，更偏烟草专门店或机场免税。",
    cnImpression: "中国游客常把它叫“卡比龙”，容易被灰黑色长盒和高端外观吸引；购买前要核对 Phantom/Royal/Super Slims 等具体系列。",
    source: "https://www.kixdutyfree.jp/en/cigaronne-phantom-silver-2407000018.html",
  },
  {
    test: /ラーク|乐富门|Lark/i,
    brand: "Lark",
    jpScore: 4.0,
    cnScore: 3.9,
    availability: "likely",
    jpImpression: "日本市场常见的国际品牌之一，风格偏传统，老用户认知稳定。",
    cnImpression: "中国游客可能熟悉中文译名，但具体日本款需要对照包装。",
    source: "https://www.pmi.com/markets/japan/ja/company/products",
  },
  {
    test: /ウィンストン|温斯顿|キャスター|卡斯特|Winston/i,
    brand: "Winston",
    jpScore: 3.9,
    cnScore: 3.7,
    availability: "likely",
    jpImpression: "传统烟草线和柔和的 Caster White 系列各有固定受众。",
    cnImpression: "中国用户对品牌有认知，香草感较明显的 Caster White 更容易被记住。",
    source: "https://www.jti.co.jp/tobacco/products/winston/index.html",
  },
  {
    test: /クール|KOOL/i,
    brand: "KOOL",
    jpScore: 3.8,
    cnScore: 3.8,
    availability: "likely",
    jpImpression: "KOOL はメンソール系の印象が強く、爆珠や清涼感を重視するユーザーに知られています。",
    cnImpression: "中国游客通常按“KOOL/爆珠/薄荷”来辨认，购买时要看清具体毫克数与爆珠款。",
    source: "https://www.batj.com/",
  },
  {
    test: /セーラム|沙龙|Salem/i,
    brand: "Salem",
    jpScore: 3.4,
    cnScore: 3.5,
    availability: "discontinued",
    jpImpression: "Salem 在日本更像旧款或存量认知，实际在售情况需要逐店确认。",
    cnImpression: "中国游客可能听过沙龙薄荷，但日本当前可买性不稳定，建议不要只凭旧图判断。",
    source: "https://www.jti.co.jp/tobacco/products/",
  },
  {
    test: /ピアニッシモ|Pianissimo|百乐门/i,
    brand: "Pianissimo",
    jpScore: 3.9,
    cnScore: 3.8,
    availability: "likely",
    jpImpression: "Pianissimo 常被认作细支、轻柔和带香气的女性向路线。",
    cnImpression: "中国游客常按细支、淡雅包装和薄荷/果香线索来辨认。",
    source: "https://www.jti.co.jp/tobacco/products/pianissimo/",
  },
  {
    test: /バージニア エス|Virginia S/i,
    brand: "Virginia S",
    jpScore: 3.8,
    cnScore: 3.8,
    availability: "likely",
    jpImpression: "Virginia S 偏细支轻柔路线，薄荷与香气款更容易被记住。",
    cnImpression: "中国游客通常按细支、粉色或薄荷包装辨认，适合作为轻口味对照。",
    source: "https://www.jti.co.jp/tobacco/products/",
  },
  {
    test: /ホープ|Hope/i,
    brand: "Hope",
    jpScore: 3.7,
    cnScore: 3.4,
    availability: "likely",
    jpImpression: "Hope 是日本传统短支香烟，认知度来自经典包装和固定用户。",
    cnImpression: "中国游客熟悉度不高，更多是作为日本老牌短支烟了解。",
    source: "https://www.jti.co.jp/tobacco/products/hope/",
  },
  {
    test: /わかば|若叶|Wakaba/i,
    brand: "Wakaba",
    jpScore: 3.2,
    cnScore: 3.1,
    availability: "discontinued",
    jpImpression: "わかば 多属于旧款/停产线索，当前购买需要特别核对库存。",
    cnImpression: "中国游客不建议把旧款资料当成当前可买依据。",
    source: "https://www.jti.co.jp/tobacco/products/",
  },
  {
    test: /エコー|Echo/i,
    brand: "Echo",
    jpScore: 3.2,
    cnScore: 3.1,
    availability: "discontinued",
    jpImpression: "Echo 多属于旧款/停产线索，当前购买需要特别核对库存。",
    cnImpression: "中国游客不建议把旧款资料当成当前可买依据。",
    source: "https://www.jti.co.jp/tobacco/products/",
  },
  {
    test: /glo|ラッキー|幸运击|neo|virto|ヴァルト/i,
    brand: "glo",
    jpScore: 4.0,
    cnScore: 3.7,
    availability: "likely",
    jpImpression: "glo 用户会按设备兼容与口味选择，便利店渠道通常较容易询问。",
    cnImpression: "中国游客对设备兼容最敏感，购买前需要确认是否为 glo HYPER 用。",
    source: "https://www.batj.com/",
  },
  {
    test: /lil HYBRID|MIIX|(?:^|[\s・])ミックス(?:[\s・]|$)/i,
    brand: "lil HYBRID",
    jpScore: 3.8,
    cnScore: 3.7,
    availability: "specialist",
    jpImpression: "専用リキッドとたばこスティックを使う独自方式で、取扱店は事前確認が必要です。",
    cnImpression: "中国游客对 lil HYBRID 的熟悉度有限，购买前应先核对设备和专用烟弹。",
    source: "https://jp.iqos.com/node/11511",
  },
];

const PRICE_RULES = [
  { test: (item) => item.type === "heated" && /テリア|TEREA/i.test(item.jp), value: 620, source: "official" },
  { test: (item) => item.type === "heated" && /センティア|SENTIA/i.test(item.jp), value: 570, source: "official" },
  { test: (item) => item.type === "heated" && /lil HYBRID|MIIX|ミックス/i.test(item.jp), value: 560, source: "official" },
  {
    test: (item) => item.type === "heated" && /Ploom X.*メビウス/i.test(item.jp),
    value: 550,
    source: "official",
  },
  {
    test: (item) => item.type === "heated" && /Ploom X.*キャメル/i.test(item.jp),
    value: 530,
    source: "official",
  },
  {
    test: (item) => item.type === "cigarette" && /キャメル クラフト/i.test(item.jp),
    value: 470,
    source: "official",
  },
  {
    test: (item) => item.type === "cigarette" && /アメリカン スピリット/i.test(item.jp),
    value: 440,
    source: "official",
  },
  {
    test: (item) => item.type === "cigarette" && /セブンスター/i.test(item.jp),
    value: 600,
    source: "official",
  },
  {
    test: (item) => item.type === "cigarette" && /メビウス/i.test(item.jp),
    value: 580,
    source: "official",
  },
  {
    test: (item) => item.type === "cigarette" && /ウィンストン|キャスター/i.test(item.jp),
    value: 540,
    source: "official",
  },
];

function clampScore(value) {
  return Math.max(2.8, Math.min(5, Math.round(value * 10) / 10));
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash >>> 0, 16777619);
  }
  return hash >>> 0;
}

function resolveFlavor(item) {
  const text = `${item.jp} ${item.cn}`.toLowerCase();
  if (/ベリー|莓|葡萄|グレープ|ライチ|荔枝|マンゴー|芒果|ピーチ|蜜桃|アップル|苹果|フルーツ|果/.test(text)) {
    return "fruit";
  }
  if (/メンソール|ミント|薄荷|アイス|冰|コールド|フロスト|クール/.test(text)) {
    return "menthol";
  }
  if (item.type === "device") return "device";
  if (item.type === "pod") return "vapor";
  return "tobacco";
}

function resolveStrength(item, flavor) {
  if (item.type === "device" || item.type === "pod") return "not-applicable";
  const text = `${item.jp} ${item.cn}`;
  const amount = text.match(/(?:^|\s)(1|2|3|5|6|7|8|10|12|14|18)(?:mg)?(?:\s|$)/i);
  const value = amount ? Number(amount[1]) : null;
  if (/スーパーライト|超淡|ライト|轻|スムース|柔和|ONE|ワン/i.test(text) || (value && value <= 3)) {
    return "light";
  }
  if (/ブラック|ボールド|リッチ|浓|深|クラシック|经典/i.test(text) || (value && value >= 10)) {
    return "strong";
  }
  return flavor === "menthol" ? "medium" : "medium";
}

function resolvePrice(item) {
  const rule = PRICE_RULES.find((candidate) => candidate.test(item));
  if (!rule) {
    return { jpy: item.jpy, priceStatus: "guide" };
  }
  return { jpy: rule.value, priceStatus: rule.source };
}

function resolveProfile(item) {
  const text = `${item.jp} ${item.cn}`;
  return (
    BRAND_PROFILES.find((profile) => profile.test.test(text)) ?? {
      brand: item.jp.split(/\s/)[0],
      jpScore: item.type === "pod" ? 3.2 : 3.7,
      cnScore: item.type === "pod" ? 3.5 : 3.6,
      availability: item.type === "pod" ? "specialist" : "likely",
      jpImpression: "日本での流通は商品と店舗により差があり、銘柄名を見せて確認するのが確実です。",
      cnImpression: "中国游客评价较分散，建议优先按包装、口味和设备兼容确认。",
      source: "",
    }
  );
}

function resolveAvailability(item, profile) {
  const text = `${item.jp} ${item.cn}`;
  if (item.type === "pod") return "restricted";
  if (item.type === "device" && /discontinued/i.test(String(item.marketStatus ?? ""))) return "discontinued";
  if (/わかば|若叶|エコー|Echo|セーラム|沙龙|RELX|MOTI|ELFBAR|VAPORESSO|Uwell|Voopoo/i.test(text)) {
    return /わかば|若叶|エコー|Echo|セーラム|沙龙/i.test(text) ? "discontinued" : "specialist";
  }
  if (item.type === "device") return "specialist";
  return profile.availability;
}

function describeProduct(item, flavor, strength, profile) {
  if (item.type === "device") {
    return `${profile.brand} 设备本体。购买前请核对适配烟弹、颜色与套装内容；便利店并非每家都备货。`;
  }
  if (item.type === "pod") {
    return "电子烟或替换烟弹类产品。页面无法确认其中是否含尼古丁；日本国内对含尼古丁烟液的销售有严格许可要求，因此不提供购买地点引导。";
  }

  const flavorText = {
    tobacco: "以烟草香和烘烤感为主",
    menthol: "以清凉薄荷和干净尾韵为主",
    fruit: "带果香或爆珠变化",
  }[flavor];
  const strengthText = {
    light: "整体偏轻柔",
    medium: "强度适中",
    strong: "烟草感和满足感偏强",
  }[strength];

  return `${flavorText}，${strengthText}。这是旅行辨认与购买沟通用的口味概括，实际感受会因个人习惯而不同。`;
}

function compatibility(item) {
  if (/テリア|センティア/i.test(item.jp)) return "仅适配 IQOS ILUMA 系列";
  if (/Ploom/i.test(item.jp)) return "适配对应 Ploom 设备";
  if (/glo/i.test(item.jp)) return "适配 glo HYPER 系列";
  if (/lil HYBRID/i.test(item.jp)) return "仅适配 lil HYBRID";
  if (item.type === "device") return "设备本体，请查看商品名称确认型号";
  if (item.type === "pod") return "请严格核对烟弹/雾化芯型号";
  return "纸卷香烟，无设备兼容要求";
}

function podSubtype(item) {
  if (item.type !== "pod") return "";
  return /ELFBAR|600/i.test(`${item.jp} ${item.cn}`) ? "disposable-vape" : "replacement-pod";
}

function deviceBrandOrder(item) {
  const text = `${item.deviceBrand ?? ""} ${item.brand ?? ""} ${item.jp} ${item.cn}`;
  if (/IQOS/i.test(text)) return 10;
  if (/Ploom|with2/i.test(text)) return 20;
  if (/glo/i.test(text)) return 30;
  if (/lil HYBRID/i.test(text)) return 40;
  if (/RELX/i.test(text)) return 50;
  if (/MOTI/i.test(text)) return 55;
  if (/VAPORESSO|XROS/i.test(text)) return 60;
  if (/Uwell|Caliburn/i.test(text)) return 70;
  if (/Voopoo|Argus/i.test(text)) return 80;
  if (/OXVA|XLIM/i.test(text)) return 90;
  if (/Geekvape|Wenax/i.test(text)) return 100;
  return 900;
}

const BRAND_SORT_ORDER = new Map(
  [
    "Mevius",
    "Seven Stars",
    "Marlboro",
    "Cigaronne",
    "Lark",
    "Winston",
    "Camel",
    "Peace",
    "American Spirit",
    "KOOL",
    "Salem",
    "Pianissimo",
    "Virginia S",
    "Hope",
    "Wakaba",
    "Echo",
    "TEREA",
    "SENTIA",
    "IQOS",
    "Ploom",
    "glo",
    "lil HYBRID",
    "RELX",
    "MOTI",
    "VAPORESSO",
    "Uwell",
    "Voopoo",
    "ELFBAR",
    "OXVA",
    "Geekvape",
  ].map((brand, index) => [brand.toLocaleLowerCase(), index * 10]),
);

function brandSortOrder(item) {
  return BRAND_SORT_ORDER.get(String(item.brand ?? "").toLocaleLowerCase()) ?? 900;
}

function deviceModelOrder(item) {
  if (Number.isFinite(Number(item.deviceOrder))) return Number(item.deviceOrder);
  const text = `${item.jp} ${item.cn}`;
  if (/Ploom AURA/i.test(text)) return 2010;
  if (/Ploom CUBE/i.test(text)) return 2020;
  if (/with2/i.test(text)) return /Special|スペシャル/i.test(text) ? 2410 : 2400;
  if (/PRIME/i.test(text)) return 10;
  if (/ADVANCED/i.test(text)) return 2500;
  if (/Ploom X\b/i.test(text)) return 2600;
  if (/Ploom S 2\.0/i.test(text)) return 2700;
  if (/Ploom TECH\+/i.test(text)) return 2900;
  if (/HYPER pro\+/i.test(text)) return 18;
  if (/Hilo Plus/i.test(text)) return 21;
  if (/Hilo/i.test(text)) return 22;
  if (/HYPER air/i.test(text)) return 30;
  if (/XROS 5|ARGUS G3|XLIM Pro 2|Wenax Q Pro/i.test(text)) return 18;
  if (/PRO|XROS Pro|HYPER pro/i.test(text)) return 20;
  if (/\bG4\b|XROS 4|ARGUS G2|XLIM SQ Pro 2/i.test(text)) return 25;
  if (/\bG3\b|3\.0|XROS 3|ARGUS P2/i.test(text)) return 30;
  if (/イルマ i(?!.*ワン)|ILUMA i(?!.*ONE)/i.test(text)) return 35;
  if (/ONE|ワン/i.test(text)) return 40;
  if (/air/i.test(text)) return 45;
  if (/\b2\.0\b|S 2\.0/i.test(text)) return 50;
  if (/\bX2\b/i.test(text)) return 55;
  if (/nano|mini|Lite/i.test(text)) return 60;
  if (/0\.6Ω|0\.6ohm/i.test(text)) return 110;
  if (/0\.7Ω|0\.7ohm/i.test(text)) return 120;
  if (/0\.8Ω|0\.8ohm/i.test(text)) return 130;
  if (/0\.9Ω|0\.9ohm/i.test(text)) return 140;
  if (/1\.0Ω|1\.0ohm/i.test(text)) return 150;
  if (/1\.2Ω|1\.2ohm/i.test(text)) return 160;
  return 500;
}

function brandSeriesOrder(item) {
  const text = `${item.jp} ${item.cn}`;
  if (/シガローネ|Cigaronne|卡比龙/i.test(text)) {
    if (/レジェンド|Legend/i.test(text)) return 10;
    if (/ビッグボス|Big Boss/i.test(text)) return 20;
    if (/ロイヤルスリム.*ブラック|Royal Slims Black/i.test(text)) return 30;
    if (/ロイヤルスリム.*ホワイト|Royal Slims White/i.test(text)) return 35;
    if (/ロイヤルスリム.*メンソール|Royal Slims Menthol/i.test(text)) return 40;
    if (/ファントム|Phantom/i.test(text)) return 50;
    if (/エクスクルーシブ|Exclusive/i.test(text)) return 60;
    if (/クラシック.*キング|Classic King Size/i.test(text)) return 70;
    if (/クラシック.*コンパット|Classic Compatto/i.test(text)) return 80;
    if (/クラシック.*ウルトラ|Classic Ultra Slims/i.test(text)) return 90;
    if (/クラシック.*スーパー|Classic Super Slims/i.test(text)) return 100;
    if (/スーパースリム.*ブラック|Super Slims Black/i.test(text)) return 110;
    if (/スーパースリム.*メンソール|Super Slims Menthol/i.test(text)) return 120;
    if (/スーパースリム.*ホワイト|Super Slims White/i.test(text)) return 125;
    if (/ウルトラスリム.*ブラック|Ultra Slims Black/i.test(text)) return 130;
    if (/タトゥー.*チェリー|Tattoo Cherry/i.test(text)) return 140;
    if (/タトゥー.*チョコレート|Tattoo Chocolate/i.test(text)) return 150;
    if (/タトゥー.*バニラ|Tattoo Vanilla/i.test(text)) return 160;
    if (/センター.*キング|Center King Size/i.test(text)) return 170;
    if (/センター.*コンパット|Center Compatto/i.test(text)) return 180;
    if (/センター.*ウルトラ|Center Ultra Slims/i.test(text)) return 190;
    if (/センター.*スーパー|Center Super Slims/i.test(text)) return 200;
    if (/マグネット|Magnet/i.test(text)) return 210;
  }
  return item.type === "device" || item.type === "pod" ? deviceModelOrder(item) : 500;
}

export function enrichProduct(item, index = 0) {
  const key = `${item.jp}|${item.cn}`;
  const hash = fnv1a(key);
  const imageKey = hash.toString(16).padStart(8, "0");
  const originalImage =
    typeof item.img === "string" && item.img.startsWith("./")
      ? item.img
      : `./images/${imageKey}.jpg`;
  const profile = resolveProfile(item);
  const flavor = resolveFlavor(item);
  const strength = resolveStrength(item, flavor);
  const price = resolvePrice(item);
  const availability = resolveAvailability(item, profile);

  return {
    ...item,
    ...price,
    ...resolveProductMedia(item, originalImage),
    id: `p-${hash.toString(16).padStart(8, "0")}`,
    imageKey,
    brand: profile.brand,
    categoryLabel: TYPE_LABELS[item.type] ?? TYPE_LABELS.pod,
    categoryLabelJp: TYPE_LABELS_JP[item.type] ?? TYPE_LABELS_JP.pod,
    flavor,
    strength,
    compatibility: compatibility(item),
    availability,
    purchaseAllowed: availability !== "restricted",
    jpScore: clampScore(profile.jpScore),
    cnScore: clampScore(profile.cnScore),
    description: describeProduct(item, flavor, strength, profile),
    jpImpression: profile.jpImpression,
    cnImpression: profile.cnImpression,
    source: item.type === "pod" ? MHLW_E_CIGARETTE_GUIDANCE : (item.source ?? profile.source),
    marketStatus: item.type === "pod" ? "restricted-regulatory-reference" : item.marketStatus,
    productSubtype: podSubtype(item),
    priceChecked: PRICE_CHECKED,
    originalIndex: index,
  };
}

export function enrichProducts(products) {
  return products.map(enrichProduct);
}

export function filterProducts(products, filters = {}) {
  const {
    query = "",
    category = "all",
    flavor = "all",
    favoritesOnly = false,
    favorites = [],
  } = filters;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const compactQuery = normalizedQuery
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
  const favoriteIds = favorites instanceof Set ? favorites : new Set(favorites);

  return products.filter((item) => {
    if (category.startsWith("brand:")) {
      const brand = category.slice("brand:".length).trim().toLocaleLowerCase();
      if (item.brand.toLocaleLowerCase() !== brand) return false;
    } else if (category !== "all" && item.type !== category) {
      return false;
    }
    if (flavor !== "all" && item.flavor !== flavor) return false;
    if (favoritesOnly && !favoriteIds.has(item.id)) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      item.jp,
      item.cn,
      item.brand,
      item.categoryLabel,
      item.categoryLabelJp,
      item.description,
      item.compatibility,
      ...(Array.isArray(item.relatedExactJp) ? item.relatedExactJp : []),
      item.cartonSearchQuery,
      item.cartonNote,
      item.variantNote,
      item.flavor,
      item.strength,
      String(item.jpy),
    ]
      .join(" ")
      .normalize("NFKC")
      .toLocaleLowerCase();

    const normalizedHaystack = haystack.normalize("NFKC");
    const compactHaystack = normalizedHaystack.replace(/[^\p{Letter}\p{Number}]+/gu, "");

    return normalizedHaystack.includes(normalizedQuery.normalize("NFKC")) ||
      (compactQuery.length >= 2 && compactHaystack.includes(compactQuery));
  });
}

function mediaTrustRank(item) {
  const cartonRank =
    {
      verified: 0,
      "archive-reference": 1,
      "multi-carton-reference": 4,
      "contents-reference": 5,
      "variant-reference": 6,
      "source-only": 7,
      "needs-review": 8,
    }[item.cartonStatus] ?? 9;
  const imageRank =
    {
      verified: 0,
      "archive-reference": 1,
      reference: 3,
      "review-required": 4,
    }[item.imageStatus] ?? 5;
  return cartonRank * 10 + imageRank;
}

export function sortProducts(products, sort = "recommended") {
  const result = [...products];
  const compareName = (a, b) => a.jp.localeCompare(b.jp, "ja");
  const compareBrand = (a, b) =>
    brandSortOrder(a) - brandSortOrder(b) ||
    String(a.brand ?? "").localeCompare(String(b.brand ?? ""), "ja") ||
    String(a.type ?? "").localeCompare(String(b.type ?? ""), "en");
  const compareDevice = (a, b) =>
    deviceBrandOrder(a) - deviceBrandOrder(b) ||
    deviceModelOrder(a) - deviceModelOrder(b) ||
    (a.originalIndex ?? 0) - (b.originalIndex ?? 0) ||
    compareName(a, b);

  if (sort === "device") {
    return result.sort(compareDevice);
  }

  if (sort === "jp") {
    return result.sort(
      (a, b) =>
        b.jpScore - a.jpScore ||
        b.cnScore - a.cnScore ||
        mediaTrustRank(a) - mediaTrustRank(b) ||
        (a.originalIndex ?? 0) - (b.originalIndex ?? 0) ||
        compareName(a, b),
    );
  }
  if (sort === "cn") {
    return result.sort(
      (a, b) =>
        b.cnScore - a.cnScore ||
        b.jpScore - a.jpScore ||
        mediaTrustRank(a) - mediaTrustRank(b) ||
        (a.originalIndex ?? 0) - (b.originalIndex ?? 0) ||
        compareName(a, b),
    );
  }
  if (sort === "price-asc") {
    return result.sort((a, b) => a.jpy - b.jpy || compareName(a, b));
  }
  if (sort === "price-desc") {
    return result.sort((a, b) => b.jpy - a.jpy || compareName(a, b));
  }

  return result.sort(
    (a, b) =>
      compareBrand(a, b) ||
      (a.type === "device" && b.type === "device" ? compareDevice(a, b) : 0) ||
      brandSeriesOrder(a) - brandSeriesOrder(b) ||
      (a.originalIndex ?? 0) - (b.originalIndex ?? 0) ||
      compareName(a, b),
  );
}

export function topDistinctBrands(products, sort = "jp", limit = 6) {
  const result = [];
  const brands = new Set();

  for (const item of sortProducts(products, sort)) {
    if (brands.has(item.brand)) continue;
    brands.add(item.brand);
    result.push(item);
    if (result.length >= limit) break;
  }

  return result;
}

export function mapSearchUrl(product) {
  const query = product?.jp ? `${product.jp} たばこ 販売店` : "たばこ 販売店";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function chainMapUrl(chain) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${chain} たばこ`)}`;
}

export function yen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function yuan(value, rate) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 1,
  }).format(value * rate);
}

export function typeLabel(type) {
  return TYPE_LABELS[type] ?? TYPE_LABELS.pod;
}

export const catalogMeta = {
  priceChecked: PRICE_CHECKED,
  typeLabels: TYPE_LABELS,
};
