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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/sevenstars-soft-ana-carton-side.jpg",
      cartonSource:
        "https://www.anadf.com/itemdetail.aspx?s_cd=3211051013",
      cartonNote:
        "ANA 免税店页面确认软包 Seven Stars 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向外箱侧面（SevenStars Charcoal Filter + 警示文字）。本站另保留历史软包照片用于辨认软包结构；当前价格和库存以 ANA 页面为准。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/seven-stars-box-mobile01-dutyfree-carton.jpg",
      cartonSource: "https://www.mobile01.com/topicdetail.php?f=345&t=5177706",
      cartonNote:
        "Mobile01 日本现场实拍图清楚展示 SevenStars Charcoal Filter BOX 长条外盒，页面讨论也区分软盒/硬盒并提到机场购买；ANA 官方页同时确认该 SKU 为 20本×10箱、タール14mg、ニコチン1.2mg，预约机场含成田/羽田。论坛图用于辨认整条外观，当前价格和库存仍以免税店页面/门店为准。",
    },
  ],
  [
    "メビウス オリジナル|梅比乌斯 原味",
    {
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/mevius-original-jdf-2carton.jpg",
      cartonSource:
        "https://duty-free-japan.jp/narita/en/goodsDetail.aspx?sCD=5302030459",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "Japan Duty Free 成田机场免税预约页标题为“MEVIUS BOX 2CT SET”，商品图正面明确写有“2 CARTONS SPECIAL OFFER / 200×2 400 CIGARETTES”。这是官方两条装外箱图，可用于辨认 MEVIUS Original 免税整条组合外观；若只买 1 カートン，仍以门店实际包装为准。",
    },
  ],
  [
    "メビウス スーパーライト|梅比乌斯 超淡",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/mevius-superlights6-carton-jpcanada-202604.jpg",
      cartonSource:
        "https://bbs.jpcanada.com/topics.php?bbs=1&cat=&icon=0&msgid=233158&order=0",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "2026-04 Jpcanada 出品帖文字写明 Mevius super lights (メビウス スーパーライト) 6，1カートン；照片可见未拆封 MEVIUS SUPER LIGHTS 6 soft pack 整条外箱。日本商品名通常写作メビウス・スーパーライト，图片英文面为 SUPER LIGHTS。",
    },
  ],
  [
    "マールボロ レッド|万宝路 红",
    {
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/marlboro-red-box-ana-2carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098239",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店商品页为“マールボロ 400's”，规格写明 (20本×10箱)×2；图片可见官方 2 CARTONS 红色外箱。它是两条装参考，不是单独一条拆分图；购买单条时按 10 包 / 200 支理解。",
    },
  ],
  [
    "マールボロ メンソール|万宝路 薄荷",
    {
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/marlboro-menthol8-box-ana-2carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098242",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店商品页为“マールボロ メンソール 8 ボックス 2カートンセット”，规格写明 (20本×10箱)×2；图片可见官方 2 CARTONS 外箱。它是两条装参考，不是单独一条拆分图；购买单条时按 10 包 / 200 支理解。",
    },
  ],
  [
    "マールボロ ダブルバースト|万宝路 双爆珠",
    {
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/marlboro-wburst-purple-5-ameblo-10packs.png",
      cartonSource: "https://ameblo.jp/tobacco-kodama/entry-12864805962.html",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 官方单包 / 1カートン规格",
          image: "./images/cartons/marlboro-double-burst-5-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098247",
          note: "ANA 免税店页面确认该 SKU 销售规格为 20本×10箱 / 1カートン；主图为官方单盒正面图，不是整条外箱。",
        },
        {
          label: "KIX 官方 Purple 5 当前包装",
          image: "./images/cartons/marlboro-wburst-purple-5-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/marlboro-w-burst-purple-5-box-2405300106.html",
          note: "KIX 官方页展示 MARLBORO W-BURST PURPLE 5 BOX 当前单包图，并列出免税价、库存限制和每人购买上限；该图不是一条外箱。",
        },
        {
          label: "KIX 官方 W-Burst 5 当前包装",
          image: "./images/cartons/marlboro-wburst-5-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/marlboro-w-burst-5-box-2405300089.html",
          note: "KIX 官方页展示 MARLBORO W-BURST 5 BOX 当前单包图，可用于区分蓝绿爆珠版与 Purple 版；该图不是一条外箱。",
        },
        {
          label: "5 包排列参考",
          image:
            "./images/cartons/marlboro-wburst-purple-5-localcig-5pack-reference.png",
          source:
            "https://localcigsupply.com/product/marlboro-w-burst-purple-carton/",
          note: "第三方页面的 W-Burst Purple 5 多包排列图，只显示 5 包，不是完整 10 包/一条外箱；仅用于确认多包视觉一致性。",
        },
      ],
      cartonNote:
        "大阪京橋たばこセンターこだま文章明确写“今回はカートンの画像を掲載”，图片展示 Marlboro W-Burst Purple 5 的完整 10 包整条排列，按一カートン 10 包 / 200 支核验；该图是整条内包实图，不是长盒外箱侧面。ANA / KIX 官方页补充免税销售规格与现行单包图。",
    },
  ],
  [
    "ラーク クラシック|乐富门 经典",
    {
      cartonStatus: "multi-carton-reference",
      cartonImage: "./images/cartons/lark-classic-mild-ks-ana-2carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200053",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店商品页为“ラーク マイルド KS ボックス 400S”，规格写明 (20本×10箱)×2，并说明是2カートンセット；图片可见 2 CARTON SPECIAL 外箱。Placer 对应品名为“ラーク クラシック マイルド KS ボックス”。它是两条装参考，购买单条时按 10 包 / 200 支理解。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/winston-caster-white3-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100027",
      cartonNote:
        "ANA 免税店页面确认现行名“ウィンストン・キャスター・ホワイト・3・ボックス”销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。目录沿用中国游客常说的 Caster 3，购买时请同时核对 Winston Caster White 3。",
    },
  ],
  [
    "ウィンストン XS|温斯顿 XS",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/winston-xs-caster-white1-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100123",
      cartonGallery: [
        {
          label: "现行 1mg 系一条外箱参考",
          image:
            "./images/cartons/winston-caster-white-one-100s-ana-carton-side.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100028",
          note: "ANA 官方图展示 Winston Caster White One 100's Box 的横向 1カートン外箱侧面；它可帮助辨认当前 1mg Caster 系外箱，但不是旧 XS Caster White 1 Box 完全同名 SKU。",
        },
      ],
      cartonNote:
        "ANA 免税店页面确认“ウィンストン XS キャスターホワイト 1 ボックス”销售规格为 20本×10箱 / 1カートン，主图为官方单包正面图，不是整条外箱。本站另补充 ANA 现行 Winston Caster White One 100's Box 的官方一条外箱侧面图，作为 1mg Caster 系后继/近似包装参考；购买时仍需核对完整日文名。",
    },
  ],
  [
    "ウィンストン キャスター ホワイト|温斯顿 白",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/winston-caster-white5-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100026",
      cartonNote:
        "ANA 免税店页面确认“ウィンストン・キャスター・ホワイト・5・ボックス”销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。目录项“Winston Caster White”按 5mg Box 主流款核验；购买时请同时确认 1mg/3mg/5mg 与 soft/box 差异。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/peace-light-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051018",
      cartonNote:
        "ANA 免税店页面确认 Peace Light Box 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。用于辨认 10mg Peace Light 整条外观；当前价格和库存以 ANA 页面为准。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/pianissimo-aria-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000076238",
      cartonNote:
        "ANA 免税店页面确认 Pianissimo Aria Menthol 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。用于辨认 Aria Menthol 细支整条外观；当前价格和库存以 ANA 页面为准。",
    },
  ],
  [
    "クール ブースト|KOOL 爆珠",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/kool-boost-fresh-8-ana-carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonNote:
        "ANA 免税店页面确认“クール・ブースト・フレッシュ・8・ボックス”销售规格为 20本×10箱 / 1カートン；第二张官方图展示立体外箱/一条包装，正面有 KOOL BOOST FRESH 8 与 Hokkaido Mint 标识。目录为泛称 KOOL Boost，本站按 8mg Fresh 作为已核验整条图。",
    },
  ],
  [
    "クール ナノ ブースト 8|KOOL Nano 爆珠 8",
    {
      cartonStatus: "variant-reference",
      cartonImage:
        "./images/cartons/kool-nano-blizzard8-carton-monolog-reference.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/8888396207409",
      cartonNote:
        "公开资料更稳定对应 KOOL Nano 8 旧线为“クール・ナノ・ブリザード・8”。ものログ页面标题为“Bクールナノブリザード・8カートン”，商品图展示多包排列实物，比单包图更接近一条/カートン语境；但图片清晰度低，不是封闭外箱。WORLD TOBACCO 另列该旧线为20本入り、タール8mg/ニコチン0.7mg。当前目录名“ナノ ブースト 8”仍未能被稳定核验，购买前必须核对完整日文名。",
    },
  ],
  [
    "メビウス ゴールド オリジナル|梅比乌斯 金装原味",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/mevius-gold-original-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100099",
      cartonNote:
        "ANA 免税店页面确认 MEVIUS Gold 6 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。目录项为“Gold Original”泛称，此图按 6mg Gold 主流款作整条外观参考。",
    },
  ],
  [
    "メビウス メンソール|梅比乌斯 薄荷",
    {
      cartonStatus: "variant-reference",
      cartonImage:
        "./images/cartons/mevius-premium-menthol8-10p-monolog-reference.png",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210166117",
      cartonNote:
        "未找到现行普通“メビウス メンソール”的稳定一カートン外箱图源；JT 当前纸烟列表也未列出该独立名称。旧烟草店资料曾以“メビウス メンソール8”为标题介绍“メビウス：プレミアムメンソール8”（2013年3月中旬全国発売、20本入）。ものログ页面标题为“JT メビウスプレミアムメンソール8 10P”，购买者图片展示 10 包排列实物，可帮助理解一条/10P 内容物；但它不是封闭外箱，也不是普通 Menthol 独立 SKU。购买时请按 Premium Menthol 8 核对。",
    },
  ],
  [
    "マールボロ アイスブラスト 8|万宝路 冰爆 8",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/marlboro-iceblast-mega8-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200068",
      cartonGallery: [
        {
          label: "JAL 官方当前包装",
          image: "./images/cartons/marlboro-iceblast-mega8-jal-official-pack.jpg",
          source: "https://www.jaldutyfree.com/shop/g/g5312040137/",
          note: "JAL DUTYFREE 页面展示 Marlboro Iceblast Mega Box 8mg 当前单包图，并写明每人合计 40 カートン购买上限；该图不是一条外箱。",
        },
      ],
      cartonNote:
        "ANA 免税店页面确认 Marlboro Ice Blast Mega 8 Box 销售规格为 20本×10箱 / 1カートン，主图为官方单包正面图，不是整条外箱。目录项为 Ice Blast 8；本站另补充 JAL 官方当前单包图，购买时请核对是否为 Mega 8 当前包装。",
    },
  ],
  [
    "ラーク 1|乐富门 1mg",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lark-ultra-1-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/1022",
      cartonNote:
        "プラセール页面标题确认“ラーク ウルトラ 1mg 100 ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为 1mg 系列单包图，不是外箱实拍；购买时请核对 Ultra/100s 名称。",
    },
  ],
  [
    "ラーク メンソール 5|乐富门 薄荷 5",
    {
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/lark-select-menthol5-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/5764",
      cartonNote:
        "プラセール页面标题确认“ラーク・セレクト・メンソール・5・100sボックス”按カートン（10個）单位销售。图片为 5mg Menthol 系列单包图，不是外箱实拍；购买时请核对 Select/100s 名称。",
    },
  ],
  [
    "キャスター 5|卡斯特 5mg",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/winston-caster-white5-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100026",
      cartonNote:
        "ANA 免税店页面确认“ウィンストン・キャスター・ホワイト・5・ボックス”销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外箱侧面。目录沿用中国游客常说的 Caster 5，购买时请同时核对 Winston Caster White 5。",
    },
  ],
  [
    "ピース スーパーライト|和平 超淡",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/peace-superlights-box-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051034",
      cartonNote:
        "ANA 免税店同一商品页确认该 SKU 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向 BOX 外包装侧面（Peace Super Lights + 警示文字）。这是官方整条外观参考；当前价格、预约机场和库存仍以 ANA 页面为准。",
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
      cartonImage: "./images/cartons/marlboro-gold-box-ana-2carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=8000002097",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonNote:
        "ANA 免税店商品页为“マールボロ ゴールド ボックス 400s 2カートン(20パック)”，规格写明 (20本×10箱)×2；图片可见官方 2 CARTONS 金色外箱。它是两条装参考，不是单独一条拆分图；购买单条时按 10 包 / 200 支理解。",
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
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-mevius-deep-regular-mikey-carton-side.jpeg",
      cartonSource:
        "https://mikeymcq1.com/product/%E3%80%90mevius-deep-regular-%E6%BF%83%E5%8E%9F%E5%91%B3%E3%80%91-%E6%97%A5%E6%9C%AC%E4%B8%83%E6%98%9F-ploom-%E5%8A%A0%E7%86%B1%E8%8F%B8%E5%BD%88%EF%BD%9C%E5%8F%B0%E7%81%A3%E7%8F%BE%E8%B2%A8%EF%BD%9C/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "日本店铺カートン单位单盒参考",
          image:
            "./images/cartons/ploom-mevius-deep-regular-placer-carton-reference.jpg",
          source: "https://www.placer-tabaco.com/product/5665",
          note: "プラセール页面标题确认“メビウス・ディープ・レギュラー・プルーム用”按カートン（10個）单位销售，并写明 1カートン/10個；主图为准确 SKU 单盒图。",
        },
        {
          label: "清晰单盒参考",
          image:
            "./images/cartons/ploom-mevius-deep-regular-cod-pack-reference.jpg",
          source:
            "https://cigarsofdubai.com/product/mevius-deep-regular-ploom-x-jp/",
          note: "Cigars of Dubai 页面确认 1 carton contains 10 packs of 20 tobacco sticks，并提供 Deep Regular 清晰单盒图；该图不是一条外箱。",
        },
      ],
      cartonNote:
        "台湾糖巢商品页标题与规格写明“整條 10 包裝 / 20 支/盒，10 盒/條”，并提供 MEVIUS ploom X Deep Regular 横向条形外包装图；用于辨认一条外包装侧面。プラセール与 Cigars of Dubai 页面补充 1カートン/10個、10 packs / 200 sticks 文字来源和单盒参考。",
    },
  ],
  [
    "Ploom X メビウス コールド メンソール|Ploom X 冷感薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/ploom-mevius-menthol-cold-pack-content.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2030100079",
      cartonGallery: [
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/ploom-mevius-cold-menthol-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/mevius-cold-menthol-for-ploom-2412600265.html",
          note: "KIX 官方页展示当前 MEVIUS Cold Menthol for Ploom 单盒图，并列出免税价/零售价；同页为 Ploom 官方销售来源。",
        },
      ],
      cartonNote:
        "ANA 免税店页面确认旧名“メビウス・メンソール・コールド・フォー・プルーム・エックス・プルーム・エス”销售规格为 20本×10箱 / 1カートン。图片为官方单盒正面图，不是整条外箱；KIX 官方页另提供当前包装和免税店购买信息。",
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
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/ploom-camel-menthol-fresh-placer-carton-reference.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/5991",
      cartonNote:
        "プラセール页面标题确认“キャメル・メンソール・フレッシュ・プルーム用”按カートン（10個）单位销售，并写明たばこスティック20本入り、1カートン/10個。图片为 Menthol Fresh 单包图，不是外箱实拍；购买时请核对 Fresh/Cold 具体名称。",
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
      cartonImage: "./images/cartons/american-spirit-regular-box-reference.jpg",
      cartonSource: "https://www.tirakita.com/fl_tabacco/fl_tabacco_22.shtml",
      cartonGallery: [
        {
          title: "旧系列包装参考",
          image: "./images/cartons/american-spirit-lineup-piazza-reference.png",
          source: "https://tabacco-piazza.com/tabacco/amespi_naturalamericanspirit/",
          note: "Tabacco Piazza 旧资料页的 American Spirit 系列图，可帮助区分红、黑、蓝、黄、橙、青、绿等包装色；它不是一カートン外箱图。",
        },
        {
          title: "当前 Turquoise 14本入",
          image: "./images/cartons/american-spirit-organic-leaf-turquoise-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5461",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 Gold 14本入",
          image: "./images/cartons/american-spirit-organic-leaf-gold-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5462",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 ONE 14本入",
          image: "./images/cartons/american-spirit-organic-leaf-one-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5464",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 Light 14本入",
          image: "./images/cartons/american-spirit-organic-leaf-light-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5465",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 Mint Light 14本入",
          image: "./images/cartons/american-spirit-organic-mint-light-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5080",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 Mint Ultra Light 14本入",
          image: "./images/cartons/american-spirit-organic-mint-ultralight-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5081",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
        {
          title: "当前 Mint ONE 14本入",
          image: "./images/cartons/american-spirit-organic-mint-one-placer-content.jpg",
          source: "https://www.placer-tabaco.com/product/5082",
          note: "Placer 当前商品页标注カートン10個単位、在庫あり；图片为单包正面。",
        },
      ],
      cartonNote:
        "TIRAKITA 页面明确为“ナチュラル・アメリカン・スピリット レギュラーボックス”，商品详情写明20本入り、タール12mg/ニコチン1.5mg，页面状态为売切れ。Tabacco Piazza 旧资料也记录 Regular Box 为20本入；但 Placer 当前日本页显示常见在售款已是 Organic Leaf / Light / Organic Mint 等14本入具体 SKU，且多款以1カートン/10個、在庫あり销售。这里用 Regular Box 作泛称主辨认图，并补当前变体单包图辅助识别颜色；仍不是一カートン外箱，购买时请按具体变体名确认。",
    },
  ],
  [
    "アメリカン スピリット ターコイズ|美式精神 绿松石",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/american-spirit-turquoise-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100073",
      cartonNote:
        "ANA 免税店页面确认 Natural American Spirit Organic Leaf Turquoise 销售规格为 20本×10箱 / 1カートン，第二张官方图展示横向外箱侧面。用于辨认 Turquoise 整条外观；当前价格和库存以 ANA 页面为准。",
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
      cartonImage: "./images/cartons/salem-black-label-menthol-usa-reference.jpg",
      cartonSource:
        "https://www.cigarettespedia.com/index.php/Salem_%28Black_Label_Full_Flavor_%27_Menthol%29_L-20-H_-_USA",
      cartonNote:
        "未找到日本在售“セーラム ブラックメンソール”的稳定商品页或一カートン外箱图。CigarettesPedia 收录的图为美国 Salem Black Label Full Flavor Menthol 100's 包装，可作为“黑薄荷/Black Label”方向的外观线索；日本烟草店旧问答曾把“セーラムブラックラベル(アメリカ)”列为日本未进口品，因此此图不代表日本门店在库，也不是整条外箱。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/hope-original-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=3211051019",
      cartonPackCount: 20,
      cartonStickCount: 200,
      cartonNote:
        "ANA 免税店页面确认 Hope Original 10本入销售规格为 10本×20箱，合计 200 本；第二张官方图展示横向外箱侧面。Hope 与常规 20本×10箱不同，购买时请核对 10 本小盒规格。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/echo-cigar-10p-monolog-carton-side.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210153919",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "旧 Echo 单包辨认图",
          image: "./images/cartons/echo-kikuya-content.gif",
          source: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
          note: "きくや页面列出旧 Echo，并说明该店按カートン（ケース）单位销售，1カートン为 10 箱；图片为旧单包图，不是外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT エコー・シガー 10P”，主图可见 echo CIGARS 长条外箱侧面，按 10 包 / 200 支核验。旧紙巻き Echo 与现行 Echo Cigar 名称有差异，购买时应按店铺现行 SKU 再确认。",
    },
  ],
  [
    "glo hyper ネオ ブリリアント ベリー|glo neo 闪耀莓果",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-brilliant-berry-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-for-hyper-brilliant-berry-sticks-bursting-with-freshness-berry-blend/",
      cartonGallery: [
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-neo-brilliant-berry-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/neo-brilliant-berry-for-glo-hyper-2406100175.html",
          note: "KIX 官方页展示 neo Brilliant Berry for glo hyper 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "j-Cigarette 对应商品页 SKU 为 1CartonGloneo(forHyper)BrilliantBerry，并确认可选 1 Carton (= 10 pack)。图片为准确 SKU 单盒图，不是外箱实拍；KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。",
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
      cartonGallery: [
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-lucky-strike-menthol-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/lucky-strike-menthol-for-glo-hyper-2406300046.html",
          note: "KIX 官方页展示 LUCKY STRIKE MENTHOL FOR GLO HYPER 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "j-Cigarette 对应商品页确认“1Carton = 10 packs = 200 sticks”，图片自身带 1 carton / 10 pack / 200 piece 标识；仍不是外箱实拍。KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。",
    },
  ],
  [
    "glo hyper ラッキー ストライク ダーク|glo 幸运击 深色款",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-lucky-strike-dark-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/1-carton-glo-hyper-lucky-strike-dark-tobacco-smoky-flavor-like-aromatic-wood/",
      cartonGallery: [
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-lucky-strike-dark-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/lucky-strike-dark-menthol-for-glo-hyper-2406300043.html",
          note: "KIX 官方页展示 LUCKY STRIKE DARK MENTHOL FOR GLO HYPER 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "j-Cigarette 对应商品页确认“1 Carton = 10 pack = 200 pieces”，图片自身带 1 Carton 标识；仍不是外箱实拍。KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。",
    },
  ],
  [
    "glo hyper ネオ トロピカル スワール|glo neo 热带旋风",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/glo-neo-tropical-swirl-1carton-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-tm-tropical-swirl-stick-for-glo-hyper-heat-sticks-1-carton-200-heatsticks/",
      cartonGallery: [
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-neo-tropical-swirl-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/neo-brilliant-tropical-click-for-glo-hyper-2406100176.html",
          note: "KIX 官方页展示 neo Brilliant Tropical Click for glo hyper 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "j-Cigarette 对应商品页标题确认“glo neo TM Tropical Swirl Stick for glo hyper Heat Sticks 1 carton 200 Heatsticks”。图片为准确 SKU 单盒图，不是外箱实拍；KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。",
    },
  ],
  [
    "Ploom X メビウス シャープ コールド|Ploom X 锐冷薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/ploom-mevius-sharp-cold-content.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/5668",
      cartonGallery: [
        {
          label: "清晰单盒参考",
          image: "./images/cartons/ploom-mevius-sharp-cold-cod-pack-reference.jpg",
          source:
            "https://cigarsofdubai.com/product/mevius-sharp-cold-menthol-ploom-x-jp/",
          note: "Cigars of Dubai 页面确认 1 carton contains 10 packs of 20 tobacco sticks，并提供 Sharp Cold Menthol 清晰单盒图；该图不是一条外箱。",
        },
      ],
      cartonNote:
        "プラセール页面确认“メビウス・シャープ・コールド・メンソール・プルーム用”按カートン（10個）单位销售，并写明たばこスティック20本入り、1カートン/10個。图片为单盒图，不是整条外箱；本站另补充清晰单盒参考和 10 包/200 支文字来源。",
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
    cartonGallery: applicable ? (override.cartonGallery ?? []) : [],
    cartonPackCount: applicable ? (override.cartonPackCount ?? 10) : 0,
    cartonStickCount: applicable ? (override.cartonStickCount ?? 200) : 0,
    cartonNote: applicable
      ? (override.cartonNote ?? "整条外箱尚未人工核对；为避免认错，暂不展示不确定图片。")
      : "设备本体和电子烟配件不按传统香烟“一カートン”展示。",
    cartonSearchUrl: searchUrl(query),
    cartonSearchQuery: query,
  };
}
