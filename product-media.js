const GOOGLE_IMAGE_SEARCH = "https://www.google.com/search";

const MEDIA_OVERRIDES = new Map([
  [
    "セブンスター|七星",
    {
      image: "./images/verified/seven-stars-soft-archive.jpg",
      imageStatus: "archive-reference",
      imageSource: "https://www.sakuya765.work/entry/seven_stars",
      imageNote: "软包实拍，可用来辨认软质折边；照片为旧版警示文字，购买时仍需核对当前包装。",
      packageFormat: "软包",
      packageFormatJp: "ソフトパック",
      variantNote: "这是软包版；与“セブンスター ボックス”烟支配方接近，但外壳结构不同，购买时请直接说“ソフト”。",
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/sevenstars-soft-pack-content.jpg",
      cartonSource:
        "https://www.anadf.com/itemdetail.aspx?s_cd=3211051013",
      cartonNote:
        "ANA 免税店页面确认软包 Seven Stars 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。本站另保留历史软包照片用于辨认软包结构。",
    },
  ],
  [
    "セブンスター ボックス|七星 盒装",
    {
      image: "./images/verified/seven-stars-box.jpg",
      imageStatus: "verified",
      imageSource:
        "https://dfree.fukuoka-airport.jp/productDetail.php?product_cd=4411000046",
      imageNote: "福冈机场免税店商品图，用于辨认硬盒正面。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      variantNote: "这是硬盒版；正面视觉与软包很接近，但顶部翻盖和盒体更硬，日文名要带“ボックス”。",
      cartonStatus: "archive-reference",
      cartonImage: "./images/cartons/seven-stars-box-carton-2008.jpg",
      cartonSource: "https://bbs.yanyue.cn/thread-111413-1-1.html",
      cartonNote:
        "2008 年日本本土版真实一カートン外箱实拍（不是 2026 当前包装）。可用于理解 BOX 硬盒整条的长盒结构，现购必须同时核对上方当前单包图。",
    },
  ],
  [
    "メビウス オリジナル|梅比乌斯 原味",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/mevius-original-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/3453",
      cartonNote:
        "プラセール页面标题确认“メビウス（タール10mg）”按1カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 SKU 单包图，不是外箱实拍。",
    },
  ],
  [
    "メビウス スーパーライト|梅比乌斯 超淡",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/mevius-superlight-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000083033",
      cartonNote:
        "ANA 免税店页面确认该 SKU 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认 Super Light 口味与包装色，整条外盒仍待实图核对。",
    },
  ],
  [
    "マールボロ レッド|万宝路 红",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/marlboro-red-box-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/4485",
      cartonNote:
        "プラセール页面标题确认“マールボロ ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 SKU 单包图，不是外箱实拍。",
    },
  ],
  [
    "マールボロ メンソール|万宝路 薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/marlboro-menthol8-box-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/4480",
      cartonNote:
        "プラセール页面标题确认“マールボロ・メンソール・8・ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 Menthol 8 单包图，不是外箱实拍。",
    },
  ],
  [
    "マールボロ ダブルバースト|万宝路 双爆珠",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/marlboro-double-burst-5-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098247",
      cartonNote:
        "ANA 免税店页面确认该 SKU 销售规格为 20本×10箱 / 1カートン，图片为官方单盒正面图，不是整条外箱。用于先辨认内容物口味与包装，整条长盒外观仍待找到。",
    },
  ],
  [
    "ラーク クラシック|乐富门 经典",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lark-classic-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/2884",
      cartonNote:
        "プラセール页面标题确认“ラーク クラシック マイルド KS ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 SKU 单包图，不是外箱实拍。",
    },
  ],
  [
    "ラーク ハイブリッド|乐富门 混合",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lark-hybrid-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200052",
      cartonNote:
        "ANA 免税店页面确认 LARK HYBRID KS BOX 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认 Hybrid Natural Mint Capsule 包装，整条长盒仍待实图核对。",
    },
  ],
  [
    "キャスター 3|卡斯特 3mg",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/winston-caster-white3-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100027",
      cartonNote:
        "ANA 免税店页面确认现行名“ウィンストン・キャスター・ホワイト・3・ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录沿用中国游客常说的 Caster 3，购买时请同时核对 Winston Caster White 3。",
    },
  ],
  [
    "ウィンストン XS|温斯顿 XS",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/winston-xs-caster-white1-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100123",
      cartonNote:
        "ANA 免税店页面确认“ウィンストン XS キャスターホワイト 1 ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为 XS 泛称，此图按 Caster White 1 Box 作内容物参考。",
    },
  ],
  [
    "ウィンストン キャスター ホワイト|温斯顿 白",
    {
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/winston-caster-white-5-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/3933",
      cartonNote:
        "プラセール页面标题确认“ウィンストン・キャスター・ホワイト・5・ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 5mg BOX 单包图，不是外箱实拍。",
    },
  ],
  [
    "キャメル クラフト 6|骆驼 Craft 6",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/camel-craft6-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100180",
      cartonNote:
        "ANA 免税店页面确认“キャメル・クラフト 6・ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认浅蓝 Craft 6 包装，整条长盒仍待实图核对。",
    },
  ],
  [
    "ピース ライト|和平 轻量",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/peace-light-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051018",
      cartonNote:
        "ANA 免税店页面确认 Peace Light Box 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认 10mg Peace Light 内容物，整条长盒仍待实图核对。",
    },
  ],
  [
    "ピース インフィニティ|和平 无限",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/peace-infinity-content.jpg",
      cartonSource: "https://to-world.com/index.php?main_page=product_info&products_id=86",
      cartonNote:
        "TO-WORLD 商品页显示 Peace Infinity 的日本定价按 1カートン列示，并提供该 SKU 包装图；图片为单包正面/斜视图，不是整条外箱。用于辨认 Infinity 深蓝包装，整条长盒仍待实图核对。",
    },
  ],
  [
    "ピアニッシモ アリア メンソール|百乐门细支 薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/pianissimo-aria-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000076238",
      cartonNote:
        "ANA 免税店页面确认 Pianissimo Aria Menthol 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认 Aria Menthol 细支包装，整条长盒仍待实图核对。",
    },
  ],
  [
    "クール ブースト|KOOL 爆珠",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/kool-boost-fresh8-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonNote:
        "ANA 免税店页面确认“クール・ブースト・フレッシュ・8・ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录为泛称 KOOL Boost，本站按 8mg Fresh 作为内容物参考。",
    },
  ],
  [
    "クール ナノ ブースト 8|KOOL Nano 爆珠 8",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/kool-boost-fresh8-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonNote:
        "未找到“クール ナノ ブースト 8”的稳定当前图源；先使用 ANA 免税店“クール・ブースト・フレッシュ・8・ボックス”作为同品牌 8mg 爆珠系近似参考。页面规格为 20本×10箱，但图片不是整条外箱，购买时必须核对完整 Nano 名称。",
    },
  ],
  [
    "メビウス ゴールド オリジナル|梅比乌斯 金装原味",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/mevius-gold6-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100099",
      cartonNote:
        "ANA 免税店页面确认 MEVIUS Gold 6 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为“Gold Original”泛称，此图按 6mg Gold 主流款作内容物参考。",
    },
  ],
  [
    "メビウス メンソール|梅比乌斯 薄荷",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/mevius-premium-menthol-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000083790",
      cartonNote:
        "未找到普通“メビウス メンソール”的稳定一カートン图源；先用 ANA 免税店 MEVIUS Premium Menthol 8 的官方单包图作同品牌薄荷系近似参考。该页面规格为 20本×10箱，但图片不是整条外箱，不能替代普通 Menthol 精确包装。",
    },
  ],
  [
    "マールボロ アイスブラスト 8|万宝路 冰爆 8",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/marlboro-iceblast-mega8-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200068",
      cartonNote:
        "ANA 免税店页面确认 Marlboro Ice Blast Mega 8 Box 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为 Ice Blast 8，购买时请核对是否为 Mega 8 当前包装。",
    },
  ],
  [
    "ラーク 1|乐富门 1mg",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/lark-tropical-ice1-carton-reference.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200011",
      cartonNote:
        "ANA 免税店图片显示 LARK Tropical Ice Menthol 1mg 100's 的横向整条外箱，页面规格为 20本×10箱 / 1カートン。它不是普通“ラーク 1”的精确 SKU，只作为同品牌 1mg 免税整条外箱结构参考。",
    },
  ],
  [
    "ラーク メンソール 5|乐富门 薄荷 5",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/lark-tropical-ice5-carton-reference.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200010",
      cartonNote:
        "ANA 免税店图片显示 LARK Tropical Ice Menthol 5mg KS Box 的横向整条外箱，页面规格为 20本×10箱 / 1カートン。它不是普通“ラーク メンソール 5”的精确 SKU，只作为同品牌 5mg 薄荷系外箱结构参考。",
    },
  ],
  [
    "キャスター 5|卡斯特 5mg",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/winston-caster-white5-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100026",
      cartonNote:
        "ANA 免税店页面确认“ウィンストン・キャスター・ホワイト・5・ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录沿用中国游客常说的 Caster 5，购买时请同时核对 Winston Caster White 5。",
    },
  ],
  [
    "ピース スーパーライト|和平 超淡",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/peace-superlights-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051034",
      cartonNote:
        "ANA 免税店页面确认该 SKU 销售规格为 20本×10箱 / 1カートン，图片为官方单盒正面图，不是整条外箱。已另行找到 A.S.D 搜索结果中的长盒图线索，但原始来源暂无法稳定下载，先显示内容物参考。",
    },
  ],
  [
    "メビウス プレミアム メンソール|梅比乌斯 高级薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/mevius-premium-menthol-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000083790",
      cartonNote:
        "ANA 免税店页面确认 MEVIUS Premium Menthol 8 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为泛称 Premium Menthol，此图按 8mg 主流款作内容物参考。",
    },
  ],
  [
    "マールボロ ゴールド|万宝路 金",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/marlboro-gold-box-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/4469",
      cartonNote:
        "プラセール页面标题确认“マールボロ・ゴールド・ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为准确 Gold Box 单包图，不是外箱实拍。",
    },
  ],
  [
    "IQOS テリア レギュラー|IQOS TEREA 经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-regular-carton.webp",
      cartonSource:
        "https://www.heetsiqosabudhabi.ae/terea-sticks/iqos-terea-regular/",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。外箱警示文字和印刷批次可能更新。",
    },
  ],
  [
    "IQOS テリア メンソール|IQOS TEREA 薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-menthol-carton.webp",
      cartonSource:
        "https://www.heetsiqosabudhabi.ae/terea-sticks/iqos-terea-menthol/",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。青绿色外箱对应 MENTHOL，购买时仍要核对完整名称。",
    },
  ],
  [
    "IQOS テリア ブラックメンソール|IQOS TEREA 黑薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-black-menthol-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-black-menthol-japan-dubai-uae",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。黑绿外箱对应 BLACK MENTHOL，右上角为零售商水印。",
    },
  ],
  [
    "IQOS テリア スムース レギュラー|IQOS TEREA 柔和经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-smooth-regular-carton.webp",
      cartonSource:
        "https://www.heetsiqosabudhabi.ae/terea-sticks/iqos-terea-smooth-regular/",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。灰色外箱对应 SMOOTH REGULAR。",
    },
  ],
  [
    "IQOS テリア ルビー レギュラー|IQOS TEREA 红宝石经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-ruby-regular-carton.jpg",
      cartonSource: "https://heetsiqosuae.ae/products/terea-ruby-regular/",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。蓝红渐变外箱对应 RUBY REGULAR。",
    },
  ],
  [
    "IQOS テリア フュージョン メンソール|IQOS TEREA 融合薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-fusion-menthol-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-fusion-menthol-japan-dubai-uae",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。紫粉渐变外箱对应 FUSION MENTHOL，右上角为零售商水印。",
    },
  ],
  [
    "IQOS テリア ウォーム レギュラー|IQOS TEREA 温感经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-warm-regular-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-warm-regular-japan-dubai-uae",
      cartonNote:
        "日本版真一カートン外箱实拍：10 包 × 20 支，共 200 支。红橙渐变外箱对应 WARM REGULAR，右上角为零售商水印。",
    },
  ],
  [
    "Ploom X メビウス リッチ|Ploom X 浓郁经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-deep-regular-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-rich-1-carton-120pcs-deep-rich-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 MEVIUS Rich 整条外箱图：页面与图片均标注 1 Carton = 6 pack = 120 pieces。该 SKU 与“Deep Regular”口味方向接近，但本站按页面实名单独收录，避免混用。",
    },
  ],
  [
    "Ploom X メビウス ディープ レギュラー|Ploom X 深度经典",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/ploom-mevius-deep-regular-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-rich-1-carton-120pcs-deep-rich-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "JT 2023 年资料显示旧名“メビウス・リッチ・プルーム・エックス・プルーム・エス用”改为“メビウス・ディープ・レギュラー・プルーム・エックス用”。此图为旧名 Rich 的 1 Carton 外箱（6 包 / 120 支），可作改名前后对应参考；当前新包装仍需另行核对。",
    },
  ],
  [
    "Ploom X メビウス コールド メンソール|Ploom X 冷感薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/ploom-mevius-menthol-cold-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2030100079",
      cartonNote:
        "ANA 免税店页面确认旧名“メビウス・メンソール・コールド・フォー・プルーム・エックス・プルーム・エス”销售规格为 20本×10箱 / 1カートン。图片为官方单盒正面图，不是整条外箱；用于辨认 Cold Menthol 内容物。",
    },
  ],
  [
    "Ploom X メビウス スムース|Ploom X 柔和",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-smooth-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-smooth-1-carton-120pcs-harmonious-and-smooth-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 MEVIUS SMOOTH 整条外箱图：该销售规格为 6 包 × 20 支，共 120 支。不是常见的 10 包规格，购买时请按页面数量复核。",
    },
  ],
  [
    "Ploom X メビウス メンソール フレッシュ|Ploom X 清新薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-menthol-fresh-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-menthol-fresh-1-carton-120pcs-clear-exhilarating-menthol/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 MEVIUS Menthol Fresh 整条外箱图：页面与图片均标注 1 Carton = 6 pack = 120 pieces。绿色外箱对应 Menthol Fresh，不替代 Cold Menthol。",
    },
  ],
  [
    "Ploom X キャメル メンソール|Ploom X 骆驼薄荷",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/ploom-camel-menthol-cold-carton-large.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-cold-strong-menthol-stick-1-carton-120-pcs-intense-menthol-that-penetrates/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 CAMEL Menthol Cold 整条外箱图：图片标注 1 Carton = 120 pcs，页面说明 6 包 × 20 支。目录项为通用 Camel Menthol，此图只作为同系列近似 SKU 外箱参考，不标为精确实拍。",
    },
  ],
  [
    "Ploom X キャメル メンソール コールド|Ploom X 骆驼强冷薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-camel-menthol-cold-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-cold-strong-menthol-stick-1-carton-120-pcs-intense-menthol-that-penetrates/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 CAMEL Menthol Cold 整条外箱图：页面与图片均标注 1 Carton = 6 pack = 120 pieces。绿色外箱对应 Cold 强薄荷。",
    },
  ],
  [
    "Ploom X キャメル メンソール イエロー|Ploom X 骆驼柑橘薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-camel-menthol-yellow-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-yellow-citrus-peel-strong-menthol-stick-1-carton-120pcs-citrus-flavor-with-a-refreshing-scent/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 CAMEL Menthol Yellow 整条外箱图：页面与图片均标注 1 Carton = 6 pack = 120 pieces。黄色外箱对应柑橘薄荷。",
    },
  ],
  [
    "Ploom X キャメル スムース|Ploom X 骆驼柔和",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-camel-smooth-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-smooth-stick-1-carton-120pcs-palatable-smooth-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "日本版 CAMEL SMOOTH 整条外箱图：该销售规格为 6 包 × 20 支，共 120 支。不是常见的 10 包规格，购买时请按页面数量复核。",
    },
  ],
  [
    "ナチュラル アメリカン スピリット|美式精神",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/american-spirit-turquoise-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100073",
      cartonNote:
        "ANA 免税店页面确认 Natural American Spirit Organic Leaf Turquoise 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为泛称 Natural American Spirit，此图只作为同品牌 Turquoise 近似参考。",
    },
  ],
  [
    "アメリカン スピリット ターコイズ|美式精神 绿松石",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/american-spirit-turquoise-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100073",
      cartonNote:
        "ANA 免税店页面确认 Natural American Spirit Organic Leaf Turquoise 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。用于辨认 Turquoise 包装色，整条长盒仍待实图核对。",
    },
  ],
  [
    "セーラム ライト|沙龙 淡味",
    {
      cartonStatus: "archive-reference",
      cartonImage: "./images/cartons/salem-lightbox-archive.webp",
      cartonSource: "https://conveni-now.com/column/conveni-salem/",
      cartonNote:
        "该图来自便利店烟草资料页的 Salem Light 历史包装说明。页面明确说明 Salem Light 早已终售，因此这里只作历史包装线索，不代表当前日本机场或便利店仍有库存，也不是整条外箱图。",
    },
  ],
  [
    "セーラム ブラックメンソール|沙龙 黑薄荷",
    {
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/salem-lightbox-archive.webp",
      cartonSource: "https://conveni-now.com/column/conveni-salem/",
      cartonNote:
        "未找到稳定的“セーラム ブラックメンソール”精确包装或一カートン图源；搜索结果主要指向 Salem 品牌历史资料、Salem Light 停产说明或其他品牌 Black Menthol。此图只作为同品牌 Salem 历史包装线索，不代表 Black Menthol 精确 SKU，也不是整条外箱。",
    },
  ],
  [
    "バージニア エス ロゼ メンソール|Virginia S 粉薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/virginia-s-rose-content.jpg",
      cartonSource: "https://www.world-tobacco.jp/view/item/000000001119?category_page_id=ct110",
      cartonNote:
        "世界のたばこ通販商品页提供 Virginia S Rosé Menthol 当前单包图与 20本入り规格。图片不是整条外箱；用于辨认粉色 Rosé Menthol 包装，整条长盒仍待实图核对。",
    },
  ],
  [
    "ホープ|Hope",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/hope-10-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051019",
      cartonPackCount: 20,
      cartonStickCount: 200,
      cartonNote:
        "ANA 免税店页面确认 Hope Original 10本入销售规格为 10本×20箱，合计 200 本；图片为官方单包正面图，不是整条外箱。Hope 与常规 20本×10箱不同，购买时请核对 10 本小盒规格。",
    },
  ],
  [
    "キャメル クラフト 14|骆驼 Craft 14",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/camel-craft14-kikuya-content.gif",
      cartonSource: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
      cartonNote:
        "きくや商品页列出“キャメル・クラフト14・ボックス”，并说明该店按カートン（ケース）单位销售，1カートン为10箱。图片为单包图，不是整条外箱；用于先补精确 SKU 识别。",
    },
  ],
  [
    "わかば|若叶",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/wakaba-kikuya-content.gif",
      cartonSource: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
      cartonNote:
        "きくや商品页列出 わかば，并说明该店按カートン（ケース）单位销售，1カートン为10箱。图片为单包图，不是整条外箱；用于辨认 Wakaba 绿白包装。",
    },
  ],
  [
    "エコー|Echo",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/echo-kikuya-content.gif",
      cartonSource: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
      cartonNote:
        "きくや商品页列出 エコー，并说明该店按カートン（ケース）单位销售，1カートン为10箱。图片为单包图，不是整条外箱；用于辨认 Echo 包装。",
    },
  ],
  [
    "glo hyper ネオ ブリリアント ベリー|glo neo 闪耀莓果",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-brilliant-berry-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-for-hyper-brilliant-berry-sticks-bursting-with-freshness-berry-blend/",
      cartonNote:
        "j-Cigarette 对应商品页 SKU 为 1CartonGloneo(forHyper)BrilliantBerry，并确认可选 1 Carton (= 10 pack)。图片为准确 SKU 单盒图，不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "IQOS センティア バランスド イエロー|IQOS SENTIA 均衡黄",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/sentia-balanced-yellow-content.png",
      cartonSource: "https://www.e-amanoya.jp/view/item/000000003311",
      cartonNote:
        "AMANOYA 页面标题确认“センティア バランスド イエロー（1カートン10個入）”，图片为单盒渲染图，不是整条外箱。用于辨认黄色 Balanced Yellow 包装。",
    },
  ],
  [
    "IQOS センティア フロスト グリーン|IQOS SENTIA 冰绿薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/sentia-frost-green-content.png",
      cartonSource: "https://www.placer-tabaco.com/product/5885",
      cartonNote:
        "プラセール页面确认“センティア・フロスト・グリーン E”按 1カートン/10個 销售；图片为 AMANOYA/SENTIA 单盒参考，不是整条外箱。用于辨认 Frost Green 包装色。",
    },
  ],
  [
    "glo hyper ラッキー ストライク リッチ|glo 幸运击 浓郁",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-lucky-strike-rich-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/1-carton-glohyper-lucky-strike-rich-tobacco-recommended-for-paper-roll-medium-tar-about-6mg-mellow-and-thick-you-can-taste-the-clear-vapor-without-any-peculiarities-a-stick-that-is-one-step-different-from-previous/",
      cartonNote:
        "j-Cigarette 对应商品页确认“1 Carton = 10 pack = 200 pieces”，图片自身带 1 Carton 标识；仍不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "glo hyper ラッキー ストライク メンソール|glo 幸运击 薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-lucky-strike-menthol-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/1-carton-glo-hyper-menthol-lucky-strike-menthol-x-menthol-flavor-refreshing-menthol-flavor/",
      cartonNote:
        "j-Cigarette 对应商品页确认“1Carton = 10 packs = 200 sticks”，图片自身带 1 carton / 10 pack / 200 piece 标识；仍不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "glo hyper ラッキー ストライク ダーク|glo 幸运击 深色款",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-lucky-strike-dark-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/1-carton-glo-hyper-lucky-strike-dark-tobacco-smoky-flavor-like-aromatic-wood/",
      cartonNote:
        "j-Cigarette 对应商品页确认“1 Carton = 10 pack = 200 pieces”，图片自身带 1 Carton 标识；仍不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "glo hyper ネオ トロピカル スワール|glo neo 热带旋风",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-tropical-swirl-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-tm-tropical-swirl-stick-for-glo-hyper-heat-sticks-1-carton-200-heatsticks/",
      cartonNote:
        "j-Cigarette 对应商品页标题确认“glo neo TM Tropical Swirl Stick for glo hyper Heat Sticks 1 carton 200 Heatsticks”。图片为准确 SKU 单盒图，不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "Ploom X メビウス シャープ コールド|Ploom X 锐冷薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/ploom-mevius-sharp-cold-content.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/5668",
      cartonNote:
        "プラセール页面确认“メビウス・シャープ・コールド・メンソール・プルーム用”按カートン（10個）单位销售，并写明たばこスティック20本入り、1カートン/10個。图片为单盒图，不是整条外箱。",
    },
  ],
  [
    "glo hyper ネオ アイスド メンソール|glo neo 冰感薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-iced-menthol-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-for-hyper-iced-menthol-sticks-peppermint-and-cooling-capsule-menthol/",
      cartonNote:
        "j-Cigarette 对应商品页 SKU 为 1CartonGloneo(forHyper)IcedMenthol，并确认可选 1 Carton (= 10 pack)。图片为准确 SKU 单盒图，不是外箱实拍，所以作为整条数量参考图使用。",
    },
  ],
  [
    "lil HYBRID ミックス レギュラー|lil HYBRID 混合经典",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lil-miix-regular-content.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "シリウスタバコ lil HYBRID 页面提供 MIIX Mix 包装图与 20本入り说明。图片为盒装外观/内容物参考，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス メンソール|lil HYBRID 混合薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lil-miix-menthol-content.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "シリウスタバコ lil HYBRID 页面提供 MIIX Ice/Menthol 系包装图与 20本入り说明。图片为盒装外观/内容物参考，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス ベリー|lil HYBRID 混合莓果",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lil-miix-berry-content.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "シリウスタバコ lil HYBRID 页面提供 MIIX Velvet/Berry 系包装图与 20本入り说明。图片为盒装外观/内容物参考，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
]);

const REVIEW_NOTES = new Map([
  [
    "lil HYBRID ミックス レギュラー",
    "当前图片与薄荷版重复，不能据此确认口味包装；请按完整日文名联网核对。",
  ],
  [
    "lil HYBRID ミックス メンソール",
    "当前图片与原味版重复，不能据此确认口味包装；请按完整日文名联网核对。",
  ],
  [
    "IQOS イルマ i ワン ミネラ モデル",
    "当前设备图与另一款 Minera 型号重复；购买前请核对机身形态与完整型号。",
  ],
  [
    "IQOS イルマ i ミネラ モデル",
    "当前设备图与 i ONE Minera 重复；购买前请核对机身形态与完整型号。",
  ],
  [
    "IQOS イルマ i",
    "当前设备图与 PRIME 型号重复；图片只作系列识别，不代表精确型号。",
  ],
  [
    "IQOS イルマ i プライム",
    "当前设备图与标准版重复；图片只作系列识别，不代表精确型号。",
  ],
  [
    "MOTI PLAY ミント ポッド",
    "三个 MOTI PLAY 口味当前共用图片，且尼古丁状态未核实；仅作旧包装线索。",
  ],
  [
    "MOTI PLAY マンゴー ポッド",
    "三个 MOTI PLAY 口味当前共用图片，且尼古丁状态未核实；仅作旧包装线索。",
  ],
  [
    "MOTI PLAY ブルーベリー ポッド",
    "三个 MOTI PLAY 口味当前共用图片，且尼古丁状态未核实；仅作旧包装线索。",
  ],
]);

function keyFor(item) {
  return `${item.jp}|${item.cn}`;
}

function searchUrl(query) {
  const url = new URL(GOOGLE_IMAGE_SEARCH);
  url.searchParams.set("tbm", "isch");
  url.searchParams.set("q", query);
  return url.toString();
}

function baseFormat(item) {
  const name = `${item.jp} ${item.cn}`;
  if (item.type === "device") {
    return { packageFormat: "设备本体", packageFormatJp: "デバイス" };
  }
  if (item.type === "pod") {
    return { packageFormat: "烟弹 / 配件", packageFormatJp: "ポッド" };
  }
  if (item.type === "heated") {
    return { packageFormat: "加热烟草盒", packageFormatJp: "スティック箱" };
  }
  if (/ボックス|BOX|盒装/i.test(name)) {
    return { packageFormat: "硬盒", packageFormatJp: "ボックス" };
  }
  if (/ソフト|软包/i.test(name)) {
    return { packageFormat: "软包", packageFormatJp: "ソフトパック" };
  }
  return { packageFormat: "包装形式待核对", packageFormatJp: "要確認" };
}

function identityLabels(item) {
  if (item.type === "device") {
    return {
      unitLabel: "设备本体",
      bulkLabel: "购买规格",
      identityHeading: "先认准设备本体与型号",
      identityNote: "设备本体不使用传统香烟“一カートン”规格；购买时要同时核对完整型号与兼容烟弹。",
    };
  }
  if (item.type === "pod") {
    return {
      unitLabel: "烟弹 / 配件",
      bulkLabel: "购买规格",
      identityHeading: "先认准烟弹与适配规格",
      identityNote: "烟弹与配件不使用传统香烟“一カートン”规格；购买前要核对设备兼容和当地法规。",
    };
  }
  if (item.type === "heated") {
    return {
      unitLabel: "单盒",
      bulkLabel: "一条 / 一カートン",
      identityHeading: "先认准单盒与一カートン",
      identityNote: "加热烟草的一条在日本也常说「一カートン」；不同口味的整条外箱会不同，本站只把已核对图片标为实拍。",
    };
  }
  return {
    unitLabel: "单包",
    bulkLabel: "一条 / 一カートン",
    identityHeading: "先认准单包与一カートン",
    identityNote: "“一条烟”在日本通常说「一カートン」。不同 SKU 的整条外箱会不同，本站只把已核对图片标为实拍。",
  };
}

export function resolveProductMedia(item, originalImage) {
  const override = MEDIA_OVERRIDES.get(keyFor(item)) ?? {};
  const applicable = item.type === "cigarette" || item.type === "heated";
  const format = baseFormat(item);
  const identity = identityLabels(item);
  const reviewNote = REVIEW_NOTES.get(item.jp) ?? "";
  const query = `${item.jp} 一カートン 外箱 10包`;
  const defaultImageNote =
    "该包装图尚未逐款人工核验，仅作旅行辨认线索；警示文字、印刷批次和外包装可能变化，请以门店实物为准。";

  return {
    originalImage,
    image: override.image ?? originalImage,
    imageStatus: override.imageStatus ?? "review-required",
    imageSource: override.imageSource ?? "",
    imageNote:
      override.imageNote ??
      (reviewNote || defaultImageNote),
    packageFormat: override.packageFormat ?? format.packageFormat,
    packageFormatJp: override.packageFormatJp ?? format.packageFormatJp,
    unitLabel: identity.unitLabel,
    bulkLabel: identity.bulkLabel,
    identityHeading: identity.identityHeading,
    identityNote: identity.identityNote,
    variantNote: override.variantNote ?? reviewNote,
    cartonApplicable: applicable,
    cartonStatus: applicable ? (override.cartonStatus ?? "needs-review") : "not-applicable",
    cartonImage: applicable ? (override.cartonImage ?? "") : "",
    cartonSource: applicable ? (override.cartonSource ?? "") : "",
    cartonPackCount: applicable ? (override.cartonPackCount ?? 10) : 0,
    cartonStickCount: applicable ? (override.cartonStickCount ?? 200) : 0,
    cartonNote: applicable
      ? (override.cartonNote ?? "整条外箱尚未人工核对；为避免认错，暂不展示不确定图片。")
      : "设备本体和电子烟配件不按传统香烟“一カートン”展示。",
    cartonSearchUrl: searchUrl(query),
    cartonSearchQuery: query,
  };
}
