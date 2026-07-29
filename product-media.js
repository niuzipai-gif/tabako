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
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/mevius-original-2ct-reference.jpg",
      cartonSource:
        "https://duty-free-japan.jp/narita/en/goodsDetail.aspx?sCD=5302030459",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "成田机场免税店 MEVIUS BOX 2CT SET 商品图：外箱明确标注 2 CARTONS / 200×2 / 400 CIGARETTES。它不是单独一条图，但可用于辨认 MEVIUS ORIGINAL 免税整条外箱视觉。",
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
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/marlboro-red-2ct-reference.jpg",
      cartonSource: "https://www.anadf.com/en/ItemDetail.aspx?S_CD=7000098239",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店 MARLBORO 400's 商品图：页面规格为 (20 cigarettes×10 boxes)×2，即 2 カートン / 20 包 / 400 支。它不是单独一条图，但能展示 Marlboro Red 免税整条外箱形态。",
    },
  ],
  [
    "マールボロ メンソール|万宝路 薄荷",
    {
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/marlboro-menthol-8-2ct-reference.jpg",
      cartonSource: "https://www.anadf.com/en/itemdetail.aspx?s_cd=7000098242",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店 MARLBORO LIGHTS MENTHOL BOX 400's 商品图：页面规格为 (20cigarettes×10boxes)×2，即 2 カートン / 20 包 / 400 支。目录项是泛称“メンソール”，此图按 Menthol 8 作为多条装外箱参考。",
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
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/lark-mild-400s-2ct-reference.jpg",
      cartonSource: "https://www.anadf.com/en/itemdetail.aspx?s_cd=2010200053",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店 LARK MILD KS BOX 400S 商品图：页面规格为 (20cigarettes×10boxes)×2，即 2 カートン / 20 包 / 400 支。目录项是“ラーク クラシック”，此图只作为同品牌 9mg 系列免税整条外箱参考，不标为精确实拍。",
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
      cartonStatus: "variant-reference",
      cartonImage: "./images/cartons/winston-caster-white1-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100028",
      cartonNote:
        "ANA 免税店页面确认“ウィンストン・キャスター・ホワイト・ワン・100's・ボックス”销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。目录项为 Caster White 泛称，此图只作为同系列 1mg 近似参考。",
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
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/marlboro-gold-2ct-reference.jpg",
      cartonSource: "https://www.anadf.com/cn/itemdetail.aspx?s_cd=8000002097",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店 マールボロ ゴールド ボックス 400s 商品图：页面规格为 (20根×10盒)×2，即 2 カートン / 20 包 / 400 支。它不是单独一条图，但能展示 Marlboro Gold 整条外箱形态。",
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
    "glo hyper ネオ ブリリアント ベリー|glo neo 闪耀莓果",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-brilliant-berry-pack-content.jpg",
      cartonSource: "https://www.anadf.com/ItemDetail.aspx?S_CD=2030100074",
      cartonNote:
        "ANA 免税店页面确认该 SKU 销售规格为 20本×10箱 / 1カートン，图片为公式单盒正面图，不是整条外箱。用于辨认 Brilliant Berry 口味色块与品牌，整条外盒仍待实图核对。",
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
