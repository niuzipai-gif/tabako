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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/mevius-box-monolog-20x10.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210128603",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "单包侧面辅助",
          image: "./images/cartons/mevius-box-monolog-pack-side.jpg",
          source: "https://monolog.r-n-i.jp/item/4902210128603",
          note: "同一 monolog 页面购买者图片，能看到 MEVIUS ORIGINAL 10 单包侧面和 JAN；用于辅助确认不是 Light / Super Lights。"
        },
        {
          label: "Japan Duty Free 官方 2CT 参考",
          image: "./images/cartons/mevius-original-jdf-2carton.jpg",
          source:
            "https://duty-free-japan.jp/narita/en/goodsDetail.aspx?sCD=5302030459",
          note: "JDF 成田页标题为 MEVIUS BOX 2CT SET，图面写有 2 CARTONS SPECIAL OFFER / 200×2 400 CIGARETTES；作为免税两条装参考，不作为主一条图。"
        }
      ],
      cartonNote:
        "monolog 商品名为“JT メビウス BOX カートン 20本×10”，主图可见 10 个 MEVIUS ORIGINAL 10 日本警示版盒装排列，按 1カートン / 10包 / 200支核验。JDF 2CT 官方图只保留为两条装辅助参考。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/marlboro-red-box-monolog-20x10.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210122205",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 官方 1カートン规格 / 单包图",
          image: "./images/cartons/ana-marlboro-red-1ct.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098238",
          note: "ANA 免税店页面确认“マールボロ ボックス”销售规格为 20本×10箱 / 1カートン；商品图为官方单包正面，不是整条外箱。",
        },
        {
          label: "ANA 官方 2カートン参考",
          image: "./images/cartons/marlboro-red-box-ana-2carton.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098239",
          note: "旧图为“マールボロ 400's”两条装外箱，规格为 (20本×10箱)×2；用于区分免税 2CT 包装，不作为本站主一条图。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT マールボロ・ボックス 20本×10”，主图可见 Marlboro Red 一条侧面实拍和日本警示文字，按 10 包 / 200 支核验。ANA 另有“マールボロ ボックス”官方 1カートン页面确认 20本×10箱规格；旧 2CT 图仅保留为免税两条装参考。",
    },
  ],
  [
    "マールボロ メンソール|万宝路 薄荷",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: ["マールボロ・メンソール・8・ボックス"],
      cartonImage: "./images/cartons/marlboro-menthol8-monolog-20x10.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210129006",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "10 包排列辅助",
          image: "./images/cartons/marlboro-menthol8-monolog-20x10-alt.jpg",
          source: "https://monolog.r-n-i.jp/item/4902210129006",
          note: "同一 monolog 页面购买者图片，显示 10 个 Marlboro Menthol 8 日本警示版盒装排列；用于辅助核对一条数量。"
        },
        {
          label: "ANA 官方 2カートン参考",
          image: "./images/cartons/marlboro-menthol8-box-ana-2carton.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098242",
          note: "ANA 免税店商品页为“マールボロ メンソール 8 ボックス 2カートンセット”，规格为 (20本×10箱)×2；作为两条装参考，不作为本站主一条图。"
        }
      ],
      cartonNote:
        "monolog 标题回读为“マールボロライトメンソール BOX 20本×10”，本地图可见 10 个绿色 Marlboro 包装，但无法完全闭合到当前目录泛称“マールボロ メンソール”或 Menthol 8 精确 SKU。按严格核验门槛降级为变体参考；若后续拆分/改名为精确 live SKU，再重新核验。",
    },
  ],
  [
    "マールボロ・メンソール・8・ボックス|万宝路 薄荷 8mg 盒装",
    {
      image: "./images/cartons/marlboro-menthol8-box-ana-2carton.jpg",
      imageStatus: "verified",
      imageSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098242",
      imageNote:
        "ANA DUTY FREE 官方 2カートンセット图，可读 Marlboro menthol 8 与日本警示；用于 exact Menthol 8 Box 行的外箱识别。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/marlboro-menthol8-box-ana-2carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098242",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "Centrair 同款 2カートン图",
          image: "./images/cartons/marlboro-menthol-8-2ct-reference.jpg",
          source:
            "https://duty-free.centrair.jp/ko/product/detail.aspx?scd=1041010125",
          note: "Centrair Duty Free 页面图同样展示 Marlboro Lights Menthol 8mg 2-carton 外箱；作为跨机场同款包装辅助。",
        },
        {
          label: "monolog 10 包排列辅助",
          image: "./images/cartons/marlboro-menthol8-monolog-20x10.jpg",
          source: "https://monolog.r-n-i.jp/item/4902210129006",
          note: "monolog 页面标题回读为マールボロライトメンソール BOX 20本×10，图片可见 10 个绿色 Marlboro Menthol 8 包；作为 10 包排列辅助。",
        },
      ],
      cartonNote:
        "ANA DUTY FREE 商品页标题为“マールボロ メンソール 8 ボックス 2カートンセット”，页面规格写明 (20本×10箱)×2；主图可见两条 Marlboro menthol 8 外箱/2 cartons 标识与日本警示。按 exact マールボロ・メンソール・8・ボックス 的 1 carton / 10 packs / 200 cigarettes 核验；generic マールボロ メンソール 仍不升级。",
    },
  ],
  [
    "マールボロ ダブルバースト|万宝路 双爆珠",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: ["マールボロ・ダブルバースト・パープル・5・ボックス"],
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
        "大阪京橋たばこセンターこだま文章和图片能支持 Marlboro W-Burst Purple 5 精确 SKU 的 10 包整条排列，但当前目录项是泛称“マールボロ ダブルバースト”。Purple 5 / W-Burst 5 不能混用为同一已核验整条，因此降级为变体参考；如后续拆分为 Purple 5，可再升回 verified。",
    },
  ],
  [
    "マールボロ・ダブルバースト・パープル・5・ボックス|万宝路 双爆珠 紫 5mg 盒装",
    {
      image: "./images/cartons/marlboro-wburst-purple-5-ameblo-10packs.png",
      imageStatus: "verified",
      imageSource: "https://ameblo.jp/tobacco-kodama/entry-12864805962.html",
      imageNote:
        "大阪京橋たばこセンターこだま掲載图，图中文字与页面标题均指向 マールボロ・ダブルバースト・パープル・5・ボックス。",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/marlboro-wburst-purple-5-ameblo-10packs.png",
      cartonSource: "https://ameblo.jp/tobacco-kodama/entry-12864805962.html",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "KIX 官方 Purple 5 单包参考",
          image: "./images/cartons/marlboro-wburst-purple-5-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/marlboro-w-burst-purple-5-box-2405300106.html",
          note: "KIX 官方页用于辅助确认 W-Burst Purple 5 当前单包视觉；主整条图仍使用 Ameblo 10 包实拍。",
        },
        {
          label: "ANA 官方 1カートン规格 / 单包图",
          image: "./images/cartons/marlboro-double-burst-5-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000098247",
          note: "ANA 免税店规格源确认 20本×10箱 / 1カートン；主图为单包，不替代 Ameblo 10 包实拍。",
        },
      ],
      cartonNote:
        "页面标题和正文精确写明“マールボロ・ダブル・バースト・パープル・5・ボックス”，规格为 20本，且正文说明“今回はカートンの画像を掲載”。主图可见 10 包同 SKU Purple 5 日本警示版排列，按 10 包 / 200 支核验；该 verified 只绑定精确 Purple 5 行，不回填泛称 DoubleBurst 行。",
    },
  ],
  [
    "ラーク クラシック|乐富门 经典",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/lark-classic-milds-mercari-10-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m34271529006",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 免税 2カートン参考",
          image: "./images/cartons/lark-classic-mild-ks-ana-2carton.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200053",
          note: "ANA 免税店商品页为“ラーク マイルド KS ボックス 400S”，规格写明 (20本×10箱)×2，并说明是 2カートンセット；用于补充免税购买场景。"
        },
      ],
      cartonNote:
        "Mercari 标题为“LARK空き箱 10個 パックコード付き JK045”，说明写明“ラーク クラシックマイルドの空き箱10個”。主图可见 10 个 LARK CLASSIC MILDS 空盒，足以核验同 SKU 10 盒外观；该图为空盒参考，不代表实时库存。ANA 免税页另有 2カートンセット参考，Placer 对应品名为“ラーク クラシック マイルド KS ボックス”。",
    },
  ],
  [
    "ラーク ハイブリッド|乐富门 混合",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lark-hybrid-pack-content.jpg",
      cartonSource: "https://www.placer-tabaco.com/product/2965",
      cartonNote:
        "Placer 页面标题为“ラーク ハイブリッドKS ボックス ... カートン（10個）単位で取り寄せ商品”，正文写 20本入り、1カートン/10個，并显示在庫あり；TABACO EXPRESS 同 SKU 页面写明“１カートン（10個入）”、入数/1個 20本、在庫数 48点。两站主图仍是单包/商品图，不是整条外箱。ANA 免税店页面另确认 LARK HYBRID KS BOX 销售规格为 20本×10箱 / 1カートン，图片同样为官方单包正面图。当前仅用于辨认 Hybrid Natural Mint Capsule 包装，整条长盒仍待实图核对。",
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
      relatedExactJp: ["ウィンストン・キャスター・ホワイト・ワン・100s・ボックス"],
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
        "ANA 免税店页面确认“ウィンストン XS キャスターホワイト 1 ボックス”销售规格为 20本×10箱 / 1カートン，主图为官方单包正面图，不是整条外箱。JT 现行 Winston 列表以 Cabin / Caster White 等名称为主；旧烟草店资料可见 Winston XS 作为旧款/历史名出现。本站另补充 ANA 现行 Winston Caster White One 100's Box 的官方一条外箱侧面图，作为 1mg Caster 系后继/近似包装参考；购买时仍需核对完整日文名。",
    },
  ],
  [
    "ウィンストン・キャスター・ホワイト・ワン・100s・ボックス|Winston Caster White One 100s 盒装",
    {
      image: "./images/cartons/winston-caster-white-one-100s-ana-carton-side.jpg",
      imageStatus: "verified",
      imageSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100028",
      imageNote:
        "ANA DUTY FREE exact 页面第二张图，图面可读 BOX 100's / Winston / CASTER / 1，用于现行 1mg Caster White One 100s 盒装一条辨认。",
      packageFormat: "100s 盒装",
      packageFormatJp: "100's ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/winston-caster-white-one-100s-ana-carton-side.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100028",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "ANA DUTY FREE 页面商品名为“ウィンストン・キャスター・ホワイト・ワン・100’s・ボックス”，规格写明 20本×10箱；第二张官方图展示横向外箱侧面，可读 BOX 100's / Winston / CASTER / 1。按 exact 现行 1mg Caster White One 100s 一条 / 10 包 / 200 支核验；旧“ウィンストン XS”仍保持近似参考，不覆盖。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/camel-craft6-paypay-84-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z441431200",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "35 个空盒近景",
          image: "./images/cartons/camel-craft6-paypay-35-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z529831112",
          note: "Yahoo!フリマ页面标题为“CAMEL 6mg 空箱 35個”，图片可见 Camel Craft 6 多个空盒近景；用于确认多包外观，不代表可购买库存。",
        },
        {
          label: "ANA 官方单包 / 1カートン规格",
          image: "./images/cartons/camel-craft6-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100180",
          note: "ANA 免税店页面确认“キャメル・クラフト 6・ボックス”销售规格为 20本×10箱 / 1カートン；主图为官方单包正面图。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ主来源图可见 84 个 CAMEL 1913 CRAFT 6 同款空盒，图面可读 CAMEL 6/Craft，远超 10 包视觉门槛；同一搜索回读也出现“キャメル クラフト 6 空箱 89個セット”。ANA 官方页可补充该 SKU 通常按 20本×10箱 / 1カートン销售。该来源为空盒/收藏图，不代表当前库存；按 10 包 / 200 支核验。",
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
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/peace-infinity-monolog-20px10-carton.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210141015",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "单包正面辨认图",
          image: "./images/cartons/peace-infinity-content.jpg",
          source:
            "https://to-world.com/index.php?main_page=product_info&products_id=86",
          note: "TO-WORLD 商品页提供 Peace Infinity 单包正面/斜视图，用于辨认深蓝包装；不是整条外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT ピースインフィニティ 20PX10”，主图可见 10 包整条塑封实拍，按 20 本×10 包 / 200 支核验；单包正面图另放入图库辅助辨认。",
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
      cartonStatus: "variant-reference",
      relatedExactJp: [
        "クール ブースト 5 ボックス",
        "クール ブースト フレッシュ 8",
      ],
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonGallery: [
        {
          label: "近似 SKU：KOOL Boost Fresh 8",
          image: "./images/cartons/kool-boost-fresh-8-ana-carton.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
          note:
            "该图为“クール・ブースト・フレッシュ・8・ボックス”的 1カートン外箱，不足以证明泛称“クール ブースト”就是同一 SKU。",
        },
      ],
      cartonNote:
        "泛称 KOOL Boost 未找到可独立证明同一 SKU 的整条外箱图；ANA 免税店证据仅对应“クール・ブースト・フレッシュ・8・ボックス”。因此这里降级为近似 SKU 参考，不发布主整条图。",
    },
  ],
  [
    "クール ブースト 5 ボックス|KOOL Boost Fresh 5",
    {
      image: "./images/cartons/kool-boost-5-ana-carton.jpg",
      imageStatus: "verified",
      imageSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000050840",
      imageNote:
        "ANA 免税店 exact SKU 页面为 KOOL BOOST 5 BOX，Size 为 20本×10箱；第二张官方图展示 KOOL BOOST FRESH 5 的整条外盒视角。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/kool-boost-5-ana-carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000050840",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 单包正面参考",
          image: "./images/cartons/kool-boost-5-ana-pack.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000050840",
          note: "同一 ANA exact SKU 页面第一张图为单包正面，仅作包装参考；verified 主图使用第二张整条外盒图。",
        },
      ],
      cartonNote:
        "ANA 免税店页面商品名为 KOOL BOOST 5 BOX，商品编号 7000050840，Size 明确为 20本×10箱；第二张官方图展示 KOOL BOOST FRESH 5 的长条外盒/整条包装视角，按 10 包 / 200 支核验。该 exact 5mg 行为新增 SKU，不回填泛称“クール ブースト”。",
    },
  ],
  [
    "クール ブースト フレッシュ 8|KOOL Boost Fresh 8",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/kool-boost-fresh-8-ana-carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "旧 Nano Blizzard 8 参考",
          image:
            "./images/cartons/kool-nano-blizzard8-carton-monolog-reference.jpg",
          source: "https://monolog.r-n-i.jp/item/8888396207409",
          note: "旧线“クール・ナノ・ブリザード・8”与当前 Boost Fresh 8 不是同一完整 SKU，仅保留为 KOOL 8mg 爆珠旧资料线索。",
        },
      ],
      cartonNote:
        "原目录名“クール ナノ ブースト 8”无法被公开资料稳定核验；日本免税与烟草店稳定使用“クール・ブースト・フレッシュ・8・ボックス / KOOL BOOST FRESH 8 BOX”。ANA 免税店页面确认销售规格为 20本×10箱 / 1カートン，第二张官方图展示 KOOL BOOST FRESH 8 一条外箱，按 10 包 / 200 支核验。",
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
      relatedExactJp: [
        "メビウス・プレミアムメンソール・オプション・パープル・8",
        "メビウス・アップル・オプション・プルーム用",
      ],
      cartonImage:
        "./images/cartons/mevius-premium-menthol8-10p-monolog-reference.png",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210166117",
      cartonNote:
        "未找到现行普通“メビウス メンソール”的稳定一カートン外箱图源；JT 现行 Mevius 纸烟列表主要列 Premium Menthol / E-series 等细分名，并未把普通“メビウス メンソール”作为独立现行 SKU。JDF/Ginza 与 Placer 可确认 Premium Menthol 系为 1カートン 200本 / 1カートン10個，ものログ页面标题为“JT メビウスプレミアムメンソール8 10P”，购买者图片展示 10 包排列实物，可帮助理解一条/10P 内容物；但它不是封闭外箱，也不是普通 Menthol 独立 SKU。购买时请按 Premium Menthol 8 或 E-series 的完整日文名核对。",
    },
  ],
  [
    "マールボロ アイスブラスト 8|万宝路 冰爆 8",
    {
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/marlboro-iceblast-box-10p-monolog-carton.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4930941000738",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 官方 Mega 8 单包 / 1カートン规格",
          image: "./images/cartons/marlboro-iceblast-mega8-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200068",
          note: "ANA 免税店页面确认 Marlboro Ice Blast Mega 8 Box 销售规格为 20本×10箱 / 1カートン；主图为官方单包正面图。",
        },
        {
          label: "JAL 官方当前包装",
          image: "./images/cartons/marlboro-iceblast-mega8-jal-official-pack.jpg",
          source: "https://www.jaldutyfree.com/shop/g/g5312040137/",
          note: "JAL DUTYFREE 页面展示 Marlboro Iceblast Mega Box 8mg 当前单包图，并写明每人合计 40 カートン购买上限；该图不是一条外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名为“PM マールボロ アイスブラストボックス 10P”，主图可见 10 包整条实拍，按 20 本×10 包 / 200 支核验。ANA / JAL 官方页另补充 Mega 8 当前单包图和免税规格；购买时请核对是否为 Ice Blast Mega 8 当前包装。",
    },
  ],
  [
    "ラーク 1|乐富门 1mg",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: ["ラーク・セレクト・1・100sボックス"],
      cartonImage: "./images/cartons/lark-select1-mercari-72-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m67407962256",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "日本店铺 1カートン数量来源",
          image: "./images/cartons/lark-ultra-1-placer-carton-reference.jpg",
          source: "https://www.placer-tabaco.com/product/1022",
          note: "プラセール页面标题确认“ラーク ウルトラ 1mg 100 ボックス”按カートン（10個）单位销售，并写明20本入り、1カートン/10個。图片为 1mg 系列单包图，不是外箱实拍。"
        },
      ],
      cartonNote:
        "Mercari 标题为“煙草空箱 LARK SELECT 1 ★72箱”，图片可见大量 LARK SELECT 1 空盒；但目录名为泛称“ラーク 1”，图库数量来源又指向“ラーク ウルトラ 1mg 100 ボックス”单包。Select 1 / Ultra 1 不能混用为同一已核验整条，因此降级为变体参考，购买时必须核对具体 1mg SKU。",
    },
  ],
  [
    "ラーク・セレクト・1・100sボックス|乐富门 Select 1 100s 盒装",
    {
      image: "./images/cartons/lark-select1-mercari-72-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://jp.mercari.com/item/m67407962256",
      imageNote:
        "Mercari 图可见大量 LARK SELECT 1 空盒，图面可读 SELECT 1；用于精确 Select 1 多盒视觉核验。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/lark-select1-mercari-72-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m67407962256",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "Ultra 1 数量/近似参考",
          image: "./images/cartons/lark-ultra-1-placer-carton-reference.jpg",
          source: "https://www.placer-tabaco.com/product/1022",
          note: "プラセール页面标题确认“ラーク ウルトラ 1mg 100 ボックス”按カートン（10個）单位销售；这是同 1mg 系列数量参考，不替代 Select 1 主核验图。",
        },
      ],
      cartonNote:
        "Mercari 标题为“煙草空箱 LARK SELECT 1 ★72箱”，图片可见大量 LARK SELECT 1 空盒，远超 10 包视觉门槛；主图和标题均指向 exact Select 1。按常规 1カートン 10 包 / 200 支核验；该 verified 只绑定精确 Select 1 行，不回填泛称 Lark 1 行。",
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
        "プラセール页面标题确认“ラーク・セレクト・メンソール・5・100sボックス”按カートン（10個）单位销售，并写明 20本入り、1カートン/10個。检索到的 Lark Ice Mint / Select Menthol 相关图多为单包或历史变体，未发现可读完整同 SKU 10 包整条外箱。图片为 5mg Menthol 系列单包图，不是外箱实拍；购买时请核对 Select/100s 名称。",
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
    "メビウス・プレミアムメンソール・オプション・パープル・8|梅比乌斯 高级薄荷 紫莓爆珠 8",
    {
      cartonStatus: "contents-reference",
      cartonImage: "",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210166117",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "ANA 官方单包 / 1カートン规格",
          image: "./images/cartons/mevius-premium-menthol-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2010100049",
          note: "ANA 免税店页面确认“メビウス・プレミアムメンソール・オプション・パープル・8”销售规格为 20本×10箱 / 1カートン；图片为官方单包正面图。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT メビウスプレミアムメンソール8 10P”，ANA 免税店商品页（商品番号 2010100049）写明完整 SKU“メビウス・プレミアムメンソール・オプション・パープル・8”为 20本×10箱 / 1カートン，可作为 10P / 200 支数量来源；但当前可取得图片只显示单包或局部多包排列，不能清楚核对完整同 SKU 10 包整条/一カートン外箱，因此不再标为已核验整条图。目录项已经改为完整 SKU，购买时仍请按店内实物和完整日文名核对。",
    },
  ],
  [
    "マールボロ ゴールド|万宝路 金",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/marlboro-gold-rakuma-10-empty-boxes.jpg",
      cartonSource: "https://item.fril.jp/2bea202c31ee48d9c9a5e8e2dd17ecd4",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "10 空盒近景",
          image: "./images/cartons/marlboro-gold-rakuma-10-empty-boxes-detail.jpg",
          source: "https://item.fril.jp/2bea202c31ee48d9c9a5e8e2dd17ecd4",
          note: "同一 Rakuma 出品的第二张图，能看清 Marlboro gold 正面与日本警示文字；用于辅助核对，不代表当前库存。",
        },
        {
          label: "ANA 官方 1カートン规格 / 单包图",
          image: "./images/cartons/marlboro-gold-ana-1ct-pack.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=8000002095",
          note: "ANA 免税店页面确认“マールボロ ゴールド ボックス”销售规格为 20本×10箱 / 1カートン；商品图为官方单包正面，不是整条外箱。",
        },
        {
          label: "ANA 官方 2カートン参考",
          image: "./images/cartons/marlboro-gold-box-ana-2carton.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=8000002097",
          note: "旧图为“マールボロ ゴールド ボックス 400s 2カートン(20パック)”，规格为 (20本×10箱)×2；用于区分免税 2CT 包装，不作为本站主一条图。",
        },
      ],
      cartonNote:
        "Rakuma 出品标题为“たばこ タバコ 空き箱 マルボロ ゴールド 10箱”，说明写明“マルボロゴールド 10箱”；主图可见 10 个 Marlboro gold 日本警示版空盒排列，可作为一条 10 包/200 支的实拍辨认参考。它不是未开封外箱，且不代表实时库存；ANA 官方页另确认该 SKU 规格为 20本×10箱 / 1カートン。",
    },
  ],
  [
    "IQOS テリア レギュラー|IQOS TEREA 经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001829",
      imageNote:
        "World Tobacco 对应 SKU 页面图；图面为日本警示版 TEREA 单盒，部分页面商品图不在正面印完整口味名，购买时仍按页面标题与实物色系核对。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，机场/便利店实时库存仍以门店为准。",
    },
  ],
  [
    "IQOS テリア メンソール|IQOS TEREA 薄荷",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001828",
      imageNote:
        "World Tobacco 对应 Menthol SKU 页面图；单盒图为青绿色 TEREA 日本警示版，用于辨认，不把它当作整条外箱证明。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-menthol-paypay-39-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z302147694",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "单盒空盒结构参考",
          image: "./images/cartons/terea-menthol-empty-box-structure.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z302147694",
          note: "同一 PayPay 出品的第二张图，展示 TEREA for IQOS ILUMA 青绿色空盒打开后的结构；用于辅助辨认，不代表实时库存。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题为“アイコス テリア メンソール 空箱 39個 登録未使用”，主图可见超过 10 个 TEREA for IQOS ILUMA 青绿色空盒排列，前排侧面能读 MENTHOL，足以核对 TEREA Menthol 多盒/一条外观。该来源为售出空盒/收藏图，不代表当前库存；一条仍按 10 包 / 200 支。",
    },
  ],
  [
    "IQOS テリア ブラックメンソール|IQOS TEREA 黑薄荷",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001830",
      imageNote:
        "World Tobacco 对应 Black Menthol SKU 页面图；图面为深色 TEREA 日本警示版，按来源页标题确认口味。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-black-menthol-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“Terea Black Menthol for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，机场/便利店实时库存仍以门店为准。",
    },
  ],
  [
    "IQOS テリア スムース レギュラー|IQOS TEREA 柔和经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001891",
      imageNote:
        "World Tobacco 对应 Smooth Regular SKU 页面图；图面为浅蓝色 TEREA 日本警示版，正面不完整显示口味名时按来源页标题核对。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-smooth-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Smooth Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア ルビー レギュラー|IQOS TEREA 红宝石经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001887?category_page_id=ct304",
      imageNote:
        "World Tobacco 对应 Ruby Regular SKU 页面图；图面为蓝红色 TEREA 日本警示版，作为单盒辨认参考，不等同整条外箱核验。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://iqosheets-uae.ae/products/iqos-terea-ruby-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Ruby Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア フュージョン メンソール|IQOS TEREA 融合薄荷",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001897",
      imageNote:
        "World Tobacco 对应 Fusion Menthol SKU 页面图；图面为紫粉色 TEREA 日本警示版，但正面不直接写完整 FUSION MENTHOL，因此标为来源页参考。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-fusion-menthol-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Fusion Menthol for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア ウォーム レギュラー|IQOS TEREA 温感经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001898?category_page_id=ct304",
      imageNote:
        "World Tobacco 对应 Warm Regular SKU 页面图；图面为暖棕色 TEREA 日本警示版，按来源页标题与实物色系共同核对。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-warm-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Warm Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；但公开图像更像单盒商品渲染并叠加 1 Carton contains 10 Packs / 200 Heatsticks 文案，不能证明实拍整条外箱或 10 个同 SKU 包装，因此降为数量来源线索，实时库存以门店为准。",
    },
  ],
  [
    "シガローネ・レジェンド|卡比龙 Imperial Legend",
    {
      image: "./images/cartons/cigaronne-legend-cigaronne-app-outer-box.jpg",
      imageStatus: "verified",
      imageSource: "https://www.cigaronne.app/products/",
      imageNote:
        "Cigaronne.app 产品卡图可读 Cigaronne LEGEND / Time-Tested XL FILTER，展示横向外盒形态，用于 Legend 外盒辨认。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-legend-cigaronne-app-outer-box.jpg",
      cartonSource: "https://armshop.ru/catalog/sigaronne/sigarety-armyanskie-cigaronne-royal-legend-black-gold-new-120mm-xl-filter-sps-cigaronne/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "Cigaronne.app 水印版外盒参考",
          image: "./images/cartons/cigaronne-legend-cigaronne-app-outer-box.jpg",
          source: "https://www.cigaronne.app/products/",
          note: "图面可读 Cigaronne LEGEND / IMPERIAL COLLECTION / Time-Tested XL FILTER；用于核对外盒外观。",
        },
        {
          label: "Cigaronne 官方系列参考",
          image: "./images/verified/cigaronne-imperial-legend-official.png",
          source: "https://cigaronne.com/our-collection/imperial-collection",
          note: "Cigaronne 官网 Imperial Collection 图，保留作系列识别参考。",
        },
      ],
      cartonNote:
        "Armshop exact 页面标题为 Cigaronne Royal Legend Black&Gold New 120mm XL FILTER / SPS Cigaronne，并写明 Цена указана за блок、В блоке 10 пачек、Блок с магнитным закрытием；Cigaronne.app 产品图可读 Cigaronne LEGEND / Time-Tested XL FILTER 的横向外盒。按 exact Legend Black&Gold / Legend XL Filter 的 10 包 / 200 支外盒证据核验；该证据仅绑定 Legend，不可回填 Big Boss、Phantom、Royal Slims 或其它 Imperial Collection 款。",
    },
  ],
  [
    "シガローネ・ビッグボス|卡比龙 Imperial Big Boss",
    {
      image: "./images/verified/cigaronne-imperial-big-boss-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/imperial-collection",
      imageNote:
        "Cigaronne 官网 Imperial Collection Big Boss 图；用于补齐卡比龙高端 Imperial 系列。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-big-boss-rozetka-open-carton.jpg",
      cartonSource: "https://rozetka.com.ua/ua/cigaronne-4850008002720/p573345649/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          title: "闭盒正面",
          image: "./images/cartons/cigaronne-big-boss-rozetka-closed-carton.jpg",
          source: "https://rozetka.com.ua/ua/cigaronne-4850008002720/p573345649/",
          note: "同一 Rozetka 页面闭合外盒图，图面清楚可读 Cigaronne / Big Boss XL FILTER；用于确认不是 Exclusive Brown。",
        },
        {
          title: "外盒侧面",
          image: "./images/cartons/cigaronne-big-boss-rozetka-side.jpg",
          source: "https://rozetka.com.ua/ua/cigaronne-4850008002720/p573345649/",
          note: "同一页面局部图，侧面可读 Big Boss XL FILTER，可辅助核对 SKU 名称。",
        },
      ],
      cartonNote:
        "Rozetka 页面标题为“Блок сигарет Cigaronne Big Boss XL Filter х 10 пачок”，规格写明 Пачок в блоці 10、Цигарок в пачці 20、Комплектація 10 пачок у блоці。主图展示打开的一条外盒，图面可读 Cigaronne / Big Boss XL FILTER，并能看到多包排列；闭盒和侧面图同样可读 Big Boss XL FILTER，用于纠正此前误把 Exclusive Brown 图当作 Big Boss 的风险。",
    },
  ],
  [
    "シガローネ・ロイヤルスリム・メンソール|卡比龙 Royal Slims Menthol",
    {
      image: "./images/verified/cigaronne-royal-menthol-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000002256",
      imageNote:
        "World Tobacco 对应 SKU 页面图，图面可读 Cigaronne Menthol / Royal slims，用于区分绿色 Royal Slims Menthol；JAL 同款页另确认 1カートン10箱。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-royal-menthol-cigarpro-carton.webp",
      cartonSource:
        "https://www.cigarpro.ru/sigarety/cigaronne/sigarety-cigaronne-menthol-royal-slims-xl-filter/",
      cartonGallery: [
        {
          title: "整条开箱图",
          image: "./images/cartons/cigaronne-royal-menthol-cigarpro-carton-open.webp",
          source:
            "https://www.cigarpro.ru/sigarety/cigaronne/sigarety-cigaronne-menthol-royal-slims-xl-filter/",
          note: "同一 Cigarpro 页面第二张图，打开后可见成排同款绿色 Royal Slims Menthol 单盒；用于辅助确认不是普通 Super Slims Menthol。",
        },
        {
          title: "日本官方单盒 / 数量来源",
          image: "./images/verified/cigaronne-royal-menthol-worldtobacco-pack.jpg",
          source: "https://www.jaldutyfree.com/shop/g/g5319990197/",
          note: "JAL DUTYFREE 页面确认日本免税同款按 1カートン10箱・1箱20本入 销售；图为单盒辨认参考。",
        },
      ],
      cartonNote:
        "Cigarpro 页面标题为“Cigaronne Menthol Royal Slims XL Filter”，规格写明 10 пачек（10 包），整条正面图可读 Cigaronne MENTHOL / Royal slims XL FILTER，底部标注 200 сигарет；同页开箱图可见成排同款绿色单盒。JAL DUTYFREE 另确认日本免税销售规格为 1カートン10箱・1箱20本入。",
    },
  ],
  [
    "シガローネ・ロイヤルスリム・ホワイト|卡比龙 Royal Slims White",
    {
      image: "./images/verified/cigaronne-royal-slims-white-dougenzaka-pack.jpg",
      imageStatus: "verified",
      imageSource:
        "https://ameblo.jp/dougenzaka-tabaco-shop/entry-12281071982.html",
      imageNote:
        "道玄坂のたばこ屋发布的日本店铺实拍/告知图，图面可见 Cigaronne Royal slims XL FILTER White 与 3mg/900円/20cigarettes；用于补齐 Royal Slims 白款辨认，不替代整条外箱。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-royal-slims-white-rozetka-carton.jpg",
      cartonSource:
        "https://rozetka.com.ua/ua/cigaronne-4850008001785/p430594658/",
      cartonGallery: [
        {
          title: "Rozetka 开盒 10 包图",
          image: "./images/cartons/cigaronne-royal-slims-white-rozetka-open-carton.jpg",
          source:
            "https://rozetka.com.ua/ua/cigaronne-4850008001785/p430594658/",
          note: "同一 Rozetka exact 页面图组，开盒图可见多包同款白色 Royal slims XL FILTER，商品标题和规格闭合到 10 包 / 20 支 / EAN 4850008001785。",
        },
        {
          title: "日本店铺白款实拍 / 20 本信息",
          image: "./images/verified/cigaronne-royal-slims-white-dougenzaka-pack.jpg",
          source:
            "https://ameblo.jp/dougenzaka-tabaco-shop/entry-12281071982.html",
          note: "日本店铺页面文字写 シガローネ・ロイヤル・スリム・ホワイト / Cigaronne ROYAL SLIM WHITE、900円/一箱、ロングサイズ(20本入)、3mg/0.3mg；图片同时展示 Black/White，但可读白款 Royal slims XL FILTER。不是 10 包整条图。",
        },
      ],
      cartonNote:
        "Rozetka exact 页面标题为“Cigaronne Royal Slims White х 10 пачок”，规格写 Пачок в блоці 10、Цигарок в пачці 20、Упаковка Блок、Комплектація 10 пачок у блоці、EAN 4850008001785；图组可见白色 Royal slims XL FILTER 外盒和开盒多包同款内容物。道玄坂のたばこ屋页面另确认日本流通名为 シガローネ・ロイヤル・スリム・ホワイト、900円/一箱、20本入、3mg/0.3mg。按 exact Royal Slims White 一条 / 10 包 / 200 支核验。",
    },
  ],
  [
    "シガローネ・スーパースリム・メンソール|卡比龙 Super Slims Menthol",
    {
      image: "./images/verified/cigaronne-super-menthol-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000002255",
      imageNote:
        "World Tobacco 对应 SKU 页面图，图面可读 Cigaronne Menthol / Super Slims，绿色包装对应薄荷款；JAL 同款页另确认 1カートン10箱。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://item.rakuten.co.jp/snus/2759/",
      cartonGallery: [
        {
          title: "来源商品图参考：JAL 官方单盒 / 1カートン规格",
          image: "./images/verified/cigaronne-super-menthol-worldtobacco-pack.jpg",
          source: "https://www.jaldutyfree.com/shop/g/g5319990198/",
          note: "JAL DUTYFREE 页面确认 シガローネ スーパースリム メンソール 为 1カートン10箱・1箱20本入；图为单盒/商品图，不是整条外箱，整条外箱仍待核验。",
        },
        {
          title: "Rakuten 10packs 来源商品图",
          image: "./images/cartons/cigaronne-super-slims-menthol-rakuten-10packs.jpg",
          source: "https://item.rakuten.co.jp/snus/2759/",
          note: "堀商事 Rakuten 页面商品名直接写 10packs / 箱なしセロハン包装；图片为同 SKU 单包与开包展示图，不是封闭整条外箱。",
        },
      ],
      cartonNote:
        "Rakuten/堀商事商品名直接列 10packs シガローネ スーパースリム メンソール，并注明箱なしセロハン包装，可作为 10 包数量来源但不是外箱图；KIX DUTY FREE 官方英文页确认 CIGARONNE SUPER SLIMS MENTHOL 为 1 carton contains 10 packs、20 cigarettes per pack，免税价 ¥6,800；JAL DUTYFREE 同款页写明 1カートン10箱・1箱20本入。MostabakTorg 页面写明一块/блок、В упаковке 10 пачек，但 3 张商品图均为绿色 Menthol 单包/开盒/烟支图；Cigars of Dubai 页面写 1 Carton = 10 packs = 200 cigarettes total，但结构化图片仍是单包正面。当前接入的图为对应 SKU 单盒/展示盒图，不是完整 10 盒整条外箱实拍，因此暂不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・スーパースリム・ホワイト|卡比龙 Super Slims White",
    {
      image: "./images/cartons/cigaronne-super-slims-white-rozetka-open-carton.jpg",
      imageStatus: "verified",
      imageSource:
        "https://rozetka.com.ua/cigaronne-4850008001020/p452670179/",
      imageNote:
        "Rozetka 对应商品标题为“Блок сигарет Cigaronne Super Slims White x 10 пачек (4850008001020)”，主图为白色 Super Slims 一条开盒实拍，可见多包同款排列；用于新增白色具体 SKU，避免把白色一条图误套到泛 Classic Super Slims 系列。",
      packageFormat: "细支硬盒",
      packageFormatJp: "スーパースリム",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/cigaronne-super-slims-white-rozetka-open-carton.jpg",
      cartonSource:
        "https://rozetka.com.ua/cigaronne-4850008001020/p452670179/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          title: "闭盒侧面 / EAN",
          image:
            "./images/cartons/cigaronne-super-slims-white-rozetka-closed-carton.jpg",
          source:
            "https://rozetka.com.ua/cigaronne-4850008001020/p452670179/",
          note: "同一 Rozetka 页面闭盒图，条码侧可见 EAN 4850008001020 与 200/20s 标识，辅助确认是白色 Super Slims 一条包装。",
        },
        {
          title: "盒体 200 支说明",
          image:
            "./images/cartons/cigaronne-super-slims-white-rozetka-side-carton.jpg",
          source:
            "https://rozetka.com.ua/cigaronne-4850008001020/p452670179/",
          note: "同一页面整条侧面图，白色外盒可见 Cigaronne 与乌克兰警示；页面规格另写 Пачек в блоке 10、Сигарет в пачке 20、Упаковка Блок。",
        },
      ],
      cartonNote:
        "Rozetka 页面标题为“Блок сигарет Cigaronne Super Slims White x 10 пачек (4850008001020)”，价格行写 2 394₴ за 10 шт，规格写明 Пачек в блоке 10、Сигарет в пачке 20、Упаковка Блок、Цвет упаковки Белый、EAN 4850008001020。主图展示白色 Cigaronne Super Slims 一条开盒实拍，闭盒图和侧面图进一步确认 200/20s 与条码，因此按 Super Slims White 具体 SKU 的 1 carton / 10 packs / 200 cigarettes 核验。",
    },
  ],
  [
    "シガローネ・クラシック・キングサイズ|卡比龙 Classic King Size",
    {
      image: "./images/verified/cigaronne-classic-king-size-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/classic-collection",
      imageNote:
        "Cigaronne 官网 Classic Collection King Size 图；官网说明 Classic 覆盖 King Size、Compatto、Ultra Slim、Super Slims。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://www.sas.am/en/catalog/armyanskaya_sigareta/163104/",
      cartonNote:
        "Cigaronne 官网确认 Classic King Size 为 Classic Collection 完整系列之一；SAS Armenia 对应 Cigaronne King Size 具体 SKU 页提供 1 pcs / 10 pcs 购买切换和实时库存（163104 白盒、163105 黑盒均可按 10 pcs 选择），页面图为单盒而非一条外箱。Neutrino Invest 批发资料另把 King Size 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前条目是系列级 King Size，不把黑/白任一单盒误标为完整同 SKU 10 包整条外箱；它不是完整同 SKU 10 包整条外箱实拍，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・クラシック・コンパット|卡比龙 Classic Compatto",
    {
      image: "./images/verified/cigaronne-classic-compatto-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/classic-collection",
      imageNote:
        "Cigaronne 官网 Classic Collection Compatto 图；用于区分短细盒 Compatto 与 King Size / Ultra Slims。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://www.sas.am/en/catalog/armyanskaya_sigareta/4116/",
      cartonNote:
        "Cigaronne 官网确认 Classic Compatto 为 Classic Collection 完整系列之一；SAS Armenia 对应 Cigaronne Compatto 具体 SKU 页提供 1 pcs / 10 pcs 购买切换和实时库存（4116 Black、163100 White 均可按 10 pcs 选择），页面图为单盒而非一条外箱。Neutrino Invest 批发资料另把 Compatto 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前条目是系列级 Compatto，未取得完整同 SKU 10 包整条外箱实拍，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・クラシック・ウルトラスリム|卡比龙 Classic Ultra Slims",
    {
      image: "./images/verified/cigaronne-classic-ultra-slims-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/classic-collection",
      imageNote:
        "Cigaronne 官网 Classic Collection Ultra Slims 图；用于补齐卡比龙超细支系列。",
      packageFormat: "超细硬盒",
      packageFormatJp: "ウルトラスリム",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://www.sas.am/en/catalog/armyanskaya_sigareta/163111/",
      cartonNote:
        "Cigaronne 官网确认 Classic Ultra Slims 为 Classic Collection 完整系列之一；SAS Armenia 对应 Cigaronne Ultra Slims 具体 SKU 页提供 1 pcs / 10 pcs 购买切换和实时库存（163111、163110 两个颜色/强度 SKU 均可按 10 pcs 选择），页面图为单盒而非一条外箱。Neutrino Invest 批发资料另把 Ultra Slims 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前未取得完整同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・クラシック・スーパースリム|卡比龙 Classic Super Slims",
    {
      image: "./images/verified/cigaronne-classic-super-slims-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/classic-collection",
      imageNote:
        "Cigaronne 官网 Classic Collection Super Slims 图；官网说明 Super Slims 有 White、Black、Menthol 版本。",
      packageFormat: "细支硬盒",
      packageFormatJp: "スーパースリム",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://www.sas.am/en/catalog/armyanskaya_sigareta/163109/",
      cartonNote:
        "Cigaronne 官网确认 Classic Super Slims 为 Classic Collection 完整系列之一；SAS Armenia 对应 Cigaronne Super Slims 具体 SKU 页提供 1 pcs / 10 pcs 购买切换和实时库存（163109、163108 两个颜色/强度 SKU 均可按 10 pcs 选择），页面图为单盒而非一条外箱。Neutrino Invest 批发资料另把 Super Slims 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前未取得完整同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・タトゥー・チェリー|卡比龙 Tattoo Cherry",
    {
      image: "./images/verified/cigaronne-tattoo-cherry-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000002096",
      imageNote:
        "World Tobacco 对应 Tattoo Cherry 页面图；图中可见 Cherry 标识与纸盒/抽屉式陈列，用于辨认此类小雪茄风格包装。",
      packageFormat: "盒装小雪茄",
      packageFormatJp: "リトルシガー",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://item.rakuten.co.jp/snus/2538/",
      cartonGallery: [
        {
          title: "Rakuten 10packs 来源商品图",
          image: "./images/cartons/cigaronne-tattoo-cherry-rakuten-10packs.jpg",
          source: "https://item.rakuten.co.jp/snus/2538/",
          note: "堀商事 Rakuten 页面商品名直接写 10packs シガローネ タトゥー チェリー；图片为 Cherry 单包/开包展示图，不是 10 包整条外箱。",
        },
      ],
      cartonNote:
        "Rakuten/堀商事商品名直接列 10packs シガローネ タトゥー チェリー；DAIYOSTORE 商品页确认该 SKU 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类另确认该款为 20本入りリトルシガー，大浦商店也列 1カートン(10箱)。Tabimperia 的 Cherry Super Slims 页写 Количество пачек в блоке: 10、20 支/包，TRT457 的 Cherry King Size 页写 Цена указана за 1 блок / В блоке 10 пачек；Cigars of Dubai 写 1 Carton = 10 packs = 200 cigarillos total。但这些页面图片均为单包/开盒/宣传图，或不是当前 King Size 目标 SKU，当前未找到可读完整 SKU 的整条外箱图，本站仅保留单盒/展示图与来源。",
    },
  ],
  [
    "シガローネ・タトゥー・チョコレート|卡比龙 Tattoo Chocolate",
    {
      image: "./images/verified/cigaronne-tattoo-chocolate-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000002095",
      imageNote:
        "World Tobacco 对应 Tattoo Chocolate 页面图；用于区分巧克力风味 Tattoo 系列，包装与普通 Phantom/Royal 横盒不同。",
      packageFormat: "盒装小雪茄",
      packageFormatJp: "リトルシガー",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://item.rakuten.co.jp/snus/2539/",
      cartonGallery: [
        {
          title: "Rakuten 10packs 来源商品图",
          image: "./images/cartons/cigaronne-tattoo-chocolate-rakuten-10packs.jpg",
          source: "https://item.rakuten.co.jp/snus/2539/",
          note: "堀商事 Rakuten 页面商品名直接写 10packs シガローネ タトゥー チョコレート；图片为 Chocolate 单包正面图，不是 10 包整条外箱。",
        },
      ],
      cartonNote:
        "Rakuten/堀商事商品名直接列 10packs シガローネ タトゥー チョコレート；DAIYOSTORE 商品页确认该 SKU 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类确认该款为 20本入りリトルシガー。Tabimperia 页面写明 В блоке 10 пачек，但图片仍是单包/站内推荐图；尚未找到可核对完整 SKU 的 10 包整条图，因此不展示整条外箱。",
    },
  ],
  [
    "シガローネ・タトゥー・バニラ|卡比龙 Tattoo Vanilla",
    {
      image: "./images/verified/cigaronne-tattoo-vanilla-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000002094",
      imageNote:
        "World Tobacco 对应 Tattoo Vanilla 页面图；用于区分香草风味 Tattoo 系列。",
      packageFormat: "盒装小雪茄",
      packageFormatJp: "リトルシガー",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://item.rakuten.co.jp/snus/2540/",
      cartonGallery: [
        {
          title: "Rakuten 10packs 来源商品图",
          image: "./images/cartons/cigaronne-tattoo-vanilla-rakuten-10packs.jpg",
          source: "https://item.rakuten.co.jp/snus/2540/",
          note: "堀商事 Rakuten 页面商品名直接写 10packs シガローネ タトゥー バニラ；图片为 Vanilla 单包与烟支展示图，不是 10 包整条外箱。",
        },
      ],
      cartonNote:
        "Rakuten/堀商事商品名直接列 10packs シガローネ タトゥー バニラ；DAIYOSTORE 商品页确认该 SKU 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类确认该款为 20本入りリトルシガー。SAS Armenia 的 Tattoo King Size Vanilla 页可确认 20 cigarillos 与单包图，Cigars of Dubai 写 1 Carton = 10 packs = 200 cigarillos total；Cigaronne 官方页只见双包/单包展示。暂未取得可核对整条外箱图片，因此不发布为已核验整条。",
    },
  ],
  [
    "シガローネ・マグネット|卡比龙 Magnet",
    {
      image: "./images/verified/cigaronne-magnet-worldtobacco-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001978",
      imageNote:
        "World Tobacco 对应 Magnet 页面图，图面可读 Cigaronne Magnet，用于区分蓝色 Magnet 款；DAIYOSTORE 同款页确认 1カートン10箱。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-magnet-kix-carton.jpg",
      cartonSource: "https://www.kixdutyfree.jp/en/cigaronne-magnet-2407000017.html",
      cartonNote:
        "KIX DUTY FREE 官方页标题为“CIGARONNE MAGNET”，规格写明 1 carton contains 10 packs、1 pack contains 20 sticks；主图为日文警示版蓝色横向整条外盒，图面可读 Cigaronne MAGNET。DAIYOSTORE 与 Rakuten/堀商事另确认日本渠道按 1カートン(10箱) / 10packs 销售。",
    },
  ],
  [
    "シガローネ・ファントム|卡比龙 Phantom",
    {
      image: "./images/cartons/cigaronne-phantom-rozetka-carton.jpg",
      imageStatus: "verified",
      imageSource: "https://rozetka.com.ua/ua/cigaronne-4850008002232/p452660369/",
      imageNote:
        "Rozetka exact Phantom 页面图，图面可读 Cigaronne PHANTOM / The slimmest XL FILTER；这是灰色 Phantom，不等同现有 Phantom Silver。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-phantom-rozetka-carton.jpg",
      cartonSource: "https://rozetka.com.ua/ua/cigaronne-4850008002232/p452660369/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          title: "Rozetka 侧角度外盒图",
          image: "./images/cartons/cigaronne-phantom-rozetka-carton-angle.jpg",
          source: "https://rozetka.com.ua/ua/cigaronne-4850008002232/p452660369/",
          note: "同一 Rozetka exact 页面图组，外盒正面可读 Cigaronne PHANTOM，不写 Silver；用于避免把 Phantom 和 Phantom Silver 混用。",
        },
      ],
      cartonNote:
        "Rozetka exact 页面标题为“Cigaronne Phantom x 10 пачок”，规格写 Пачок в блоці 10、Цигарок в пачці 20、Упаковка Блок、Комплектація 10 пачок в блоці、EAN 4850008002232；图面可读 Cigaronne PHANTOM / The slimmest XL FILTER。Cigaronne 官方 Phantom 页面说明该款为 light-grey packaging、5mg/0.5mg。该 verified 只绑定灰色 Phantom，不覆盖既有 Phantom Silver。",
    },
  ],
  [
    "シガローネ・ファントム・シルバー|卡比龙 Phantom Silver",
    {
      image: "./images/cartons/cigaronne-phantom-silver-kix-pack.jpg",
      imageStatus: "verified",
      imageSource:
        "https://www.kixdutyfree.jp/en/cigaronne-phantom-silver-2407000018.html",
      imageNote:
        "KIX DUTY FREE 官方商品图，正面可读 Cigaronne Phantom Silver / Imperial Collection / The slimmest XL Filter，用于识别用户常说的“卡比龙”。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-phantom-silver-mercari-shops-carton-set.jpg",
      cartonSource:
        "https://jp.mercari.com/shops/product/nJwssrPaCwbVrYQDiJdCcE",
      cartonGallery: [
        {
          title: "Fa-So-La 官方 1カートン数量来源",
          image: "./images/cartons/cigaronne-phantom-silver-kix-pack.jpg",
          source:
            "https://www.fasola-shop.com/goodsDetail.aspx?sCD=5312210002",
          note: "Fa-So-La 页面确认シガローネ・ファントム・シルバー按 1カートン10箱・1箱20本入销售；图为单包辨认参考。",
        },
        {
          title: "KIX 官方打开后内容物",
          image: "./images/cartons/cigaronne-phantom-silver-kix-detail.jpg",
          source:
            "https://www.kixdutyfree.jp/en/cigaronne-phantom-silver-2407000018.html",
          note: "KIX 第二张官方图展示打开后的 Phantom Silver 单包内容物，不是 10 包整条外箱。",
        },
        {
          title: "日本烟草店单包参考",
          image: "./images/cartons/cigaronne-phantom-silver-worldtobacco-pack.jpg",
          source: "https://www.world-tobacco.jp/view/item/000000001846",
          note: "世界のたばこ通販页面确认 20本入り、タール5mg、ニコチン0.5mg、アルメニア产。",
        },
      ],
      cartonNote:
        "Mercari Shops 页面标题为“シガローネ カートン空箱 各2個セット”，说明写明ブラウン×2、ブラック×2、シルバー×2，且为輸送用の外箱（カートン）。主图前排正面清楚可读 Cigaronne PHANTOM SILVER / IMPERIAL COLLECTION，可用于核对 Phantom Silver 整条外箱；该图为空箱参考，不代表实时库存。Fa-So-La / KIX 官方免税页另确认该 SKU 以 1カートン10箱・1箱20本入销售。",
    },
  ],
  [
    "シガローネ・エクスクルーシブ・ブラウン|卡比龙 Exclusive Brown",
    {
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/shopdetail/000000001845/",
      imageNote:
        "World Tobacco 对应 Exclusive Brown 页面图，棕色横盒，叶巻葉ブレンド说明对应该 SKU。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-exclusive-brown-mercari-carton-box.jpg",
      cartonSource:
        "https://jp.mercari.com/item/m71960267321",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "Mercari 页面标题与说明写明“シガローネ・エクスクルーシブ・ブラウン×1箱”，并说明该化粧箱是シガローネたばこをカートンで購入した時に付属的外箱；主图外盒正面可读 Exclusive Brown / XL FILTER / Cigaronne。该图为空箱参考，不代表实时库存；Fa-So-La 与 JTeXpress 另确认该 SKU 按 1カートン10箱 / 1箱20本入 销售。",
    },
  ],
  [
    "シガローネ・ウルトラスリム・ブラック|卡比龙 Ultra Slims Black",
    {
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/shopdetail/000000000915/",
      imageNote:
        "World Tobacco 对应 Ultra Slims Black 页面图；黑色短横盒，用于区分 Royal / Super / Ultra 三个黑色细支层级。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://item.rakuten.co.jp/snus/2608/",
      cartonGallery: [
        {
          title: "来源商品图参考：KIX 官方单盒正面",
          image: "./images/d84cbbb1.jpg",
          source: "https://www.kixdutyfree.jp/en/cigaronne-ultra-slims-black-2407000016.html",
          note: "KIX 官方页商品图为单盒正面；另有开盒内容物图，但都不是 10 盒整条外箱，整条外箱仍待核验。",
        },
        {
          title: "Rakuten 10packs 来源商品图",
          image: "./images/cartons/cigaronne-ultra-slims-black-rakuten-10packs.jpg",
          source: "https://item.rakuten.co.jp/snus/2608/",
          note: "堀商事 Rakuten 页面商品名直接写 10packs シガローネ ウルトラスリム ブラック / 箱なしセロハン包装；图片为 Ultra Slims Black 开包展示图，不是整条外箱。",
        },
      ],
      cartonNote:
        "Rakuten/堀商事商品名直接列 10packs シガローネ ウルトラスリム ブラック，并注明箱なしセロハン包装，可作为 10 包数量来源但不是外箱图；KIX DUTY FREE 官方英文页确认 Cigaronne Ultra Slims Black 商品号 2407000016，タール6mg、ニコチン0.5mg，免税价 ¥6,000；商品图为单盒正面和开盒内容物图，不是 10 盒整条外箱。World Tobacco 单包价约 ¥700。Cigars of Dubai / TobaccoAsh 页面写 1 Carton / 10 packs / 200 cigarettes，但图也不是完整同 SKU 整条外箱。未取得可核对整条外箱图，因此不展示整条主图。",
    },
  ],
  [
    "シガローネ・スーパースリム・ブラック|卡比龙 Super Slims Black",
    {
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/shopdetail/000000000916/",
      imageNote:
        "World Tobacco 对应 Super Slims Black 页面图；黑色横盒，图面尺寸与 Ultra/Royal 接近，需按完整日文名核对。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-super-slims-black-rozetka-carton.jpg",
      cartonSource: "https://rozetka.com.ua/ua/cigaronne-4850008001013/p452668382/",
      cartonGallery: [
        {
          title: "整条近景",
          image: "./images/cartons/cigaronne-super-slims-black-rozetka-detail.jpg",
          source: "https://rozetka.com.ua/ua/cigaronne-4850008001013/p452668382/",
          note: "同一 Rozetka 页面备查图；页面标题和规格确认 Black x 10 пачок，图面用于辅助识别黑色 Super Slims 外盒。",
        },
      ],
      cartonNote:
        "Rozetka 页面标题为“Блок сигарет Cigaronne Super Slims Black x 10 пачок”，规格写明 Пачок в блоці 10、Цигарок в пачці 20、EAN 4850008001013；主图为黑色密封整条外盒，图面可读 Cigaronne SUPER SLIMS。DAIYOSTORE 与 Rakuten/堀商事另确认日本侧同款按 1カートン10箱 / 10packs 记录。",
    },
  ],
  [
    "シガローネ・ロイヤルスリム・ブラック|卡比龙 Royal Slims Black",
    {
      imageStatus: "verified",
      imageSource: "https://www.world-tobacco.jp/view/item/000000000917?category_page_id=ct122",
      imageNote:
        "World Tobacco 对应 Royal Slims Black 页面图，图面可读 Cigaronne / Royal slims XL FILTER。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/cigaronne-royal-slims-black-mercari-carton-box.jpg",
      cartonSource: "https://jp.mercari.com/en/item/m83941507410",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "Mercari 出品标题写明 Cigaronne Royal Slims シガローネ カートン空箱，实拍图面清楚可读 Royal slims XL FILTER 与日文警示，用于辨认整条外箱外观；图为二手空箱参考，不代表实时库存。Fa-So-La 与 KIX 均列出 Royal Slims Black 免税价约 ¥11,000；World Tobacco 单包页确认 20本入り、タール4mg、ニコチン0.4mg，按 1カートン10箱 / 200支理解。",
    },
  ],
  [
    "シガローネ・センター・キングサイズ|卡比龙 Center King Size",
    {
      image: "./images/verified/cigaronne-center-king-size-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/center",
      imageNote:
        "Cigaronne 官网 Center King Size 图；官网列 Red/Blue/Black 多强度参数，用于补齐 Center 系列。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://mostabaktorg.moscow/sigareti/armyanskie-sigarety/center-king-size-blue",
      cartonNote:
        "Cigaronne 官网确认 Center King Size 覆盖 Red、Blue、Black；MostabakTorg 的 Center King Size Blue/Red 页面写明 Формат King Size、Количество пачек в блоке 10、Количество сигарет в пачке 20、Производитель ООО “SPS Cigaronne”，并按 блок 标价/库存展示。页面图仍是单盒/商品图，不是可读完整同 SKU 10 包整条外箱；当前仅有官网多口味包装参考图，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・センター・コンパット|卡比龙 Center Compatto",
    {
      image: "./images/verified/cigaronne-center-compatto-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/center",
      imageNote:
        "Cigaronne 官网 Center Compatto 图；用于区分 Center 系列短细盒。",
      packageFormat: "硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://mostabaktorg.moscow/sigareti/center/center-compatto-blue",
      cartonNote:
        "Cigaronne 官网确认 Center Compatto 覆盖 Red、Blue、Black；MostabakTorg 的 Center Compatto Blue / Center Compact Red 页面按 блок 销售，检索页和商品页均把 Center Compatto/Compact 归入 Center 系列，并列出 10 包整条数量线索。公开图仍为单盒/商品图，不是可读完整同 SKU 10 包整条外箱；当前仅保留官网多口味包装参考图，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・センター・ウルトラスリム|卡比龙 Center Ultra Slims",
    {
      image: "./images/verified/cigaronne-center-ultra-slims-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/center",
      imageNote:
        "Cigaronne 官网 Center Ultra Slims 图；官网列 Red/Blue/Black 与对应焦油/尼古丁参数。",
      packageFormat: "超细硬盒",
      packageFormatJp: "ウルトラスリム",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://mostabaktorg.moscow/sigareti/center/center-ultra-slims-blue",
      cartonNote:
        "Cigaronne 官网确认 Center Ultra Slims 覆盖 Red、Blue、Black；MostabakTorg Center Ultra Slims Blue 页面写明 Формат Ultra Slims、Количество пачек в блоке 10、Количество сигарет в пачке 20、Производитель ООО “SPS Cigaronne”，并按 блок 销售；Center Ultra Slims Red 页面有同样数量字段。公开图仍为单盒/商品图，不是可读完整同 SKU 10 包整条外箱，因此不展示为已核验整条图。",
    },
  ],
  [
    "シガローネ・センター・スーパースリム|卡比龙 Center Super Slims",
    {
      image: "./images/verified/cigaronne-center-super-slims-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/center",
      imageNote:
        "Cigaronne 官网 Center Super Slims 图；用于补齐 Center 细支系列。",
      packageFormat: "细支硬盒",
      packageFormatJp: "スーパースリム",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://mostabaktorg.moscow/sigareti/armyanskie-sigarety/center-super-slims-blue",
      cartonNote:
        "Cigaronne 官网确认 Center Super Slims 覆盖 Red、Blue、Black；MostabakTorg Center Super Slims Blue/Red 页面写明 Формат Super Slims、Количество пачек в блоке 10、Количество сигарет в пачке 20、Производитель ООО “SPS Cigaronne”，并按 блок 标价/库存展示。公开图仍为单盒/商品图，不是可读完整同 SKU 10 包整条外箱，因此不展示为已核验整条图。",
    },
  ],
  [
    "Ploom X メビウス リッチ|Ploom X 浓郁经典",
    {
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-rich-1-carton-120pcs-deep-rich-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "j-Cigarette 页面标题与正文标注 1 Carton = 6 pack = 120 pieces，可作为 MEVIUS Rich 数量线索；但公开图更像单盒商品渲染并叠加 1 Carton = 120 pcs 文案，不能证明实拍整条外箱或 6 个同 SKU 包装，因此不标为已核验整条。该 SKU 与“Deep Regular”口味方向接近，但本站按页面实名单独收录，避免混用。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-cold-menthol-mercari-28-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m76398758136",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "28 空箱实拍",
          image: "./images/cartons/ploom-mevius-cold-menthol-mercari-28-empty-boxes.jpg",
          source: "https://jp.mercari.com/item/m76398758136",
          note: "Mercari 页面写明“Ploom x メビウス コールドメンソール 空箱 28個”；图片可读 MEVIUS / ploom X / COLD MENTHOL，超过 10 盒，足以核对一条外观。",
        },
        {
          label: "9 空箱参考",
          image: "./images/cartons/ploom-mevius-cold-menthol-mercari-9-empty-boxes.jpg",
          source: "https://jp.mercari.com/item/m42729362406",
          note: "旧 Mercari 来源为 9 个同款空盒，保留作辅助参考；主核验图已改为 28 个空箱实拍。",
        },
        {
          label: "ANA 1カートン数量参考",
          image: "./images/cartons/ploom-mevius-menthol-cold-pack-content.jpg",
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=2030100079",
          note: "ANA 免税店页面确认旧名“メビウス・メンソール・コールド・フォー・プルーム・エックス・プルーム・エス”销售规格为 20本×10箱 / 1カートン；图片为官方单盒正面图。",
        },
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/ploom-mevius-cold-menthol-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/mevius-cold-menthol-for-ploom-2412600265.html",
          note: "KIX 官方页展示当前 MEVIUS Cold Menthol for Ploom 单盒图，并列出免税价/零售价；同页为 Ploom 官方销售来源。",
        },
      ],
      cartonNote:
        "Mercari 页面标题/说明确认“Ploom x メビウス コールドメンソール 空箱 28個”，图片可见 28 个 MEVIUS / ploom X / COLD MENTHOL 空盒排列，能核验为同 SKU 多盒实拍；一条数量按 ANA / KIX 的 10 包 / 200 支。",
    },
  ],
  [
    "Ploom X メビウス ブラック コールド メンソール|Ploom X 梅比乌斯 黑冷薄荷",
    {
      image:
        "./images/cartons/ploom-mevius-black-cold-menthol-mercari-16-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://jp.mercari.com/item/m51545192101",
      imageNote:
        "Mercari 页面标题/说明写明 MEVIUS for Ploom BLACK COLD MENTHOL 空箱16箱，第 4 张商品图可见 16 个 MEVIUS / for ploom / BLACK COLD MENTHOL 同款空盒。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-mevius-black-cold-menthol-mercari-16-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m51545192101",
      cartonPackCount: 16,
      cartonStickCount: 320,
      cartonGallery: [
        {
          label: "ANA 官方 10 箱规格参考",
          image: "./images/cartons/ploom-mevius-black-cold-menthol-mercari-16-empty-boxes.jpg",
          source: "https://www.anadf.com/ItemDetail.aspx?s_cd=2030100202",
          note: "ANA 免税店页面确认“メビウス・ブラック・コールド・メンソール・プルーム用”规格为 20本×10箱；该 gallery 复用主图，仅作为数量来源链接入口。",
        },
      ],
      cartonNote:
        "Mercari 页面标题为“MEVIUS for Ploom BLACK COLD MENTHOL空箱16箱”，说明写明 Ploom専用の加熱式たばこスティック、BLACK COLD MENTHOL フレーバーの空箱16箱；第 4 张商品图可见 4×4 共 16 个 MEVIUS / for ploom / BLACK COLD MENTHOL 同款空盒，满足 10+ same-SKU packs proof。ANA 官方页另确认“メビウス・ブラック・コールド・メンソール・プルーム用”サイズ为 20本×10箱；本 exact 行按 16箱 / 320 sticks 记录，且不回填 Menthol Fresh、Cold Menthol 或其他短名行。",
    },
  ],
  [
    "Ploom X メビウス アロマリッチ レギュラー|Ploom X 梅比乌斯 醇香经典",
    {
      image:
        "./images/cartons/ploom-mevius-aromarich-regular-mercari-15-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://jp.mercari.com/item/m56874401248",
      imageNote:
        "Mercari 页面标题/说明写明 Ploom メビウス アロマリッチ レギュラー 空箱15箱セット，第 1 张商品图可见 15 个以上 MEVIUS / for ploom / AROMARICH REGULAR 同款空盒。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-mevius-aromarich-regular-mercari-15-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m56874401248",
      cartonPackCount: 15,
      cartonStickCount: 300,
      cartonGallery: [
        {
          label: "大浦商店 10 箱规格参考",
          image:
            "./images/cartons/ploom-mevius-aromarich-regular-mercari-15-empty-boxes.jpg",
          source: "https://tabaccoshop-ooura.com/?page_id=709",
          note: "大浦商店页面列出“メビウス・アロマリッチ・レギュラー・プルーム用”，规格为 20本、カートン（10箱）；该 gallery 复用主图，仅作为数量来源链接入口。",
        },
        {
          label: "Cigars of Dubai 数量参考",
          image:
            "./images/cartons/ploom-mevius-aromarich-regular-mercari-15-empty-boxes.jpg",
          source:
            "https://cigarsofdubai.com/product/mevius-aroma-rich-regular-ploom-x-jp/",
          note: "Cigars of Dubai 页面确认 Mevius Aroma Rich Regular for Ploom X 为 1 pack 20 sticks、1 carton 10 packs / 200 sticks；图片不作为主证据。",
        },
      ],
      cartonNote:
        "Mercari 页面标题为“Ploom メビウス アロマリッチ レギュラー 空箱 15箱セット”，说明重复“メビウス アロマリッチ レギュラー 空箱15箱”；第 1 张和第 2 张商品图可见 4列多排同款 MEVIUS / for ploom / AROMARICH REGULAR 空盒，满足 10+ same-SKU packs proof。大浦商店页面另列出“メビウス・アロマリッチ・レギュラー・プルーム用”，规格为 20本、カートン（10箱）；Cigars of Dubai 补充 1 carton = 10 packs × 20 sticks。该 exact 行按 15箱 / 300 sticks 记录，不回填 Ploom X メビウス リッチ、スムース、メンソール フレッシュ 或其他短名行。",
    },
  ],
  [
    "メビウス・アップル・オプション・プルーム用|Ploom X 梅比乌斯 Apple Option",
    {
      image:
        "./images/cartons/ploom-mevius-apple-option-paypay-24-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://paypayfleamarket.yahoo.co.jp/item/z629229784",
      imageNote:
        "Yahoo!フリマ页面标题/说明写明 MEVIUS Ploom APPLE OPTION 加熱式たばこ 空箱 24箱；主图可见至少 15 个 MEVIUS / for ploom / APPLE OPTION 同款空盒。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-mevius-apple-option-paypay-24-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z629229784",
      cartonPackCount: 24,
      cartonStickCount: 480,
      cartonGallery: [
        {
          label: "大浦商店 10 箱规格参考",
          image:
            "./images/cartons/ploom-mevius-apple-option-paypay-24-empty-boxes.jpg",
          source: "https://tabaccoshop-ooura.com/?page_id=709",
          note: "大浦商店页面列出“メビウス・アップル・オプション・プルーム用”，规格为 20本、カートン（10箱）；该 gallery 复用主图，仅作为数量来源链接入口。",
        },
        {
          label: "JAL DUTYFREE 10 箱规格参考",
          image:
            "./images/cartons/ploom-mevius-apple-option-paypay-24-empty-boxes.jpg",
          source: "https://duty-free-japan.jp/narita/ta/goodsDetail.aspx?sCD=5302030506",
          note: "Japan Duty Free/JAL 系商品页列出 MEVIUS Apple Option Ploom X，商品号 5302030506，并在香烟列表中说明 1 carton / 10 packs / 200 pieces。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ页面标题为“MEVIUS Ploom APPLE OPTION 加熱式たばこ 空箱 24箱”，说明写明 APPLE OPTION 空箱24個セット；主图可见 3列多排同款红色 MEVIUS / for ploom / APPLE OPTION 空盒，至少 15 个正面/顶面可读，满足 10+ same-SKU packs proof。大浦商店另列“メビウス・アップル・オプション・プルーム用”，规格为 20本、カートン（10箱）；JAL/Japan Duty Free 商品号 5302030506 补充 1 carton / 10 packs / 200 pieces。该 exact 行按 24箱 / 480 sticks 记录，不回填其他 Ploom X メビウス 短名或 Option 系列。",
    },
  ],
  [
    "Ploom X メビウス スムース|Ploom X 柔和",
    {
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-smooth-1-carton-120pcs-harmonious-and-smooth-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "j-Cigarette 页面标题和 SKU 均指向 [1Carton] Ploom X / Ploom S Mevius Smooth；商品正文写明 1 Carton = 6 pack = 120 pieces。商品图正面可读 MEVIUS / ploom X / SMOOTH，图面上方标注 1 Carton = 120 pcs；但画面更像单盒商品渲染并叠加数量文案，不能证明实拍整条外箱或 6 个同 SKU 包装，因此短名 Smooth 降为数量来源线索，不回填后继 Smooth Regular。",
    },
  ],
  [
    "Ploom X メビウス スムース レギュラー|Ploom X 梅比乌斯 柔和经典",
    {
      image: "./images/cartons/ploom-mevius-smooth-regular-paypay-12-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://paypayfleamarket.yahoo.co.jp/item/z581238832",
      imageNote:
        "Yahoo!フリマ页面标题为“メビウス スムース レギュラー ploom X 空箱（12個）”，图片可见 12 个 MEVIUS ploom X SMOOTH REGULAR 同款盒。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-smooth-regular-paypay-12-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z581238832",
      cartonPackCount: 12,
      cartonStickCount: 240,
      cartonGallery: [
        {
          label: "J-cigarette 1 carton quantity render",
          image: "./images/cartons/ploom-mevius-smooth-carton.jpg",
          source:
            "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-smooth-1-carton-120pcs-harmonious-and-smooth-taste/",
          note: "该图仅为 1 Carton = 120 pcs 数量渲染，不能单独作为 verified；本 exact 行的主证据来自 PayPay 12 个同款实拍盒。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ页面标题和 description 均写“メビウス スムース レギュラー ploom X 空箱（12個）”，description 另列【その他】ploom X、【数量】12箱；og:image 可见 12 个 MEVIUS ploom X SMOOTH REGULAR 同款空盒，其中多盒正面和侧标可读。按 strict gate 的 10+ same-SKU packs proof 核验 exact Ploom X メビウス スムース レギュラー；短名 Ploom X メビウス スムース 仍保留为 contents-reference，不强升。",
    },
  ],
  [
    "Ploom X メビウス メンソール フレッシュ|Ploom X 清新薄荷",
    {
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-mevius-menthol-fresh-ana-10box-carton.jpg",
      cartonSource:
        "https://www.anadf.com/en/itemdetail.aspx?s_cd=2030100077",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "旧 1 carton 数量参考",
          image: "./images/cartons/ploom-mevius-menthol-fresh-carton.jpg",
          source:
            "https://j-cigarette.com/1carton-ploom-x-ploom-s-mevius-menthol-fresh-1-carton-120pcs-clear-exhilarating-menthol/",
          note: "j-Cigarette 页面写明 1 Carton = 6 pack = 120 pieces，但图片更像单包/渲染图叠加数量文案，不作为主图证据。",
        },
      ],
      cartonNote:
        "ANA DUTY FREE 2030100077 页面为 Ploom X MEVIUS MENTHOL FRESH，商品图可见 MEVIUS / ploom X / MENTHOL FRESH 的整条外装正面，同页 quantity 写明 20cigarettes×10boxes；按 exact SKU 的 10包/200 sticks verified carton 记录。旧 j-Cigarette 6-pack 数量页仅保留为 gallery 参考，不替代 Cold Menthol。",
    },
  ],
  [
    "Ploom X キャメル メンソール|Ploom X 骆驼薄荷",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: [
        "Ploom X キャメル メンソール フレッシュ",
        "Ploom X キャメル メンソール コールド",
        "Ploom X キャメル メンソール イエロー",
        "キャメル・メンソール・マスカット・プルーム用",
      ],
      cartonImage:
        "./images/cartons/ploom-camel-menthol-fresh-yahoo-auctions-10-empty-boxes.jpg",
      cartonSource: "https://auctions.yahoo.co.jp/jp/auction/n1206003967",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "1 Carton 数量参考",
          image:
            "./images/cartons/ploom-camel-menthol-fresh-placer-carton-reference.jpg",
          source: "https://www.placer-tabaco.com/product/5991",
          note: "プラセール页面标题确认“キャメル・メンソール・フレッシュ・プルーム用”按カートン（10個）单位销售，并写明たばこスティック20本入り、1カートン/10個；图片为单盒图。",
        },
        {
          label: "7盒旧实拍参考",
          image:
            "./images/cartons/ploom-camel-menthol-fresh-paypay-7-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z545895006",
          note: "旧 PayPay フリマ来源为 7 个 CAMEL ploom X MENTHOL FRESH 空盒，只保留为多盒外观参考，不再作为主一条图。",
        },
      ],
      cartonNote:
        "Yahoo!オークション标题和图片均为 CAMEL MENTHOL FRESH 10 個，但目录项是“Ploom X キャメル メンソール”。Fresh 不能直接替代非 Fresh/泛称 Menthol，因此降级为变体参考；若后续把目录明确改为 Menthol Fresh，需要重新配套核验。",
    },
  ],
  [
    "Ploom X キャメル メンソール フレッシュ|Ploom X 骆驼清新薄荷",
    {
      image:
        "./images/cartons/ploom-camel-menthol-fresh-yahoo-auctions-10-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://auctions.yahoo.co.jp/jp/auction/n1206003967",
      imageNote:
        "Yahoo!オークション画像可见 10 个 CAMEL / ploom X / MENTHOL FRESH 同款盒；用作精确 Menthol Fresh 多盒视觉参考。",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-camel-menthol-fresh-yahoo-auctions-10-empty-boxes.jpg",
      cartonSource: "https://auctions.yahoo.co.jp/jp/auction/n1206003967",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "Cigars of Dubai Box of 200 数量参考",
          image: "./images/cartons/ploom-camel-menthol-fresh-cod-pack.jpg",
          source:
            "https://cigarsofdubai.com/product/camel-menthol-fresh-ploom-x-jp/",
          note: "页面结构化描述写明 Camel Menthol Fresh for Ploom X，1 pack contains 20 tobacco sticks，1 carton contains 10 packs / Total 200 tobacco sticks；图片仅作单盒参考。",
        },
        {
          label: "7盒旧实拍参考",
          image:
            "./images/cartons/ploom-camel-menthol-fresh-paypay-7-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z545895006",
          note: "旧 PayPay フリマ来源为 7 个 CAMEL ploom X MENTHOL FRESH 空盒，只保留为多盒外观参考，不作为主一条图。",
        },
      ],
      cartonNote:
        "Yahoo!オークション主图可见 10 个 CAMEL / ploom X / MENTHOL FRESH 同款盒，视觉满足 10 包门槛；Cigars of Dubai 页面结构化描述补充 exact Camel Menthol Fresh for Ploom X 的 1 carton = 10 packs × 20 sticks = 200 heatsticks。该 verified 只绑定精确 Menthol Fresh 行，不回填泛称 Camel Menthol 行。",
    },
  ],
  [
    "キャメル・メンソール・マスカット・プルーム用|Ploom 骆驼 Muscat 葡萄薄荷",
    {
      image: "./images/cartons/ploom-camel-menthol-muscat-jcigarette-120pcs-carton.jpg",
      imageStatus: "reference",
      imageSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-muscat-green-stick-1-carton-120-pcs-muscat-flavor-with-a-refreshing-scent/",
      imageNote:
        "j-Cigarette 来源图可读 CAMEL / ploom X / MENTHOL MUSCAT GREEN，图上标注 1 Carton = 120 pcs，用于 Muscat exact 外箱辨认。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-muscat-green-stick-1-carton-120-pcs-muscat-flavor-with-a-refreshing-scent/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonGallery: [
        {
          label: "AMANOYA 单盒 / 10個数量参考",
          image: "./images/cartons/ploom-camel-menthol-muscat-amanoya-pack.png",
          source: "https://www.e-amanoya.jp/view/item/000000002978",
          note: "AMANOYA exact 商品名为キャメル・メンソール・マスカット・プルーム用，可选カートン（10個）；页面图为单盒，不替代主外箱图。",
        },
      ],
      cartonNote:
        "j-Cigarette exact 页面标题为 [1Carton] Ploom X / Ploom S Camel Menthol Muscat green stick 1 Carton (120 pcs)，正文写 1 Carton = 6 pack = 120 pieces，图面可读 CAMEL / ploom X / MENTHOL MUSCAT GREEN 与 1 Carton = 120 pcs；但该图更像单盒商品渲染并叠加数量文案，不能证明实拍整条外箱或 6 个同 SKU 包装，因此仅作数量/外观参考。日本零售页另常见 1カートン/10個 数量线索，仅作参考。该证据不能回填 Ploom X キャメル メンソール泛称或 Fresh/Cold/Yellow 变体。",
    },
  ],
  [
    "Ploom X キャメル メンソール コールド|Ploom X 骆驼强冷薄荷",
    {
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-camel-menthol-cold-paypay-12-empty-boxes.jpg",
      cartonSource:
        "https://paypayfleamarket.yahoo.co.jp/item/z650557490",
      cartonPackCount: 12,
      cartonStickCount: 240,
      cartonGallery: [
        {
          label: "旧 1 carton 数量参考",
          image: "./images/cartons/ploom-camel-menthol-cold-carton.jpg",
          source:
            "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-cold-strong-menthol-stick-1-carton-120-pcs-intense-menthol-that-penetrates/",
          note: "j-Cigarette 页面写明 1 Carton = 6 pack = 120 pieces，但图片不是整条外箱或 10+ 同 SKU 实拍，仅保留为数量参考。",
        },
      ],
      cartonNote:
        "PayPay フリマ z650557490 标题/描述写明 Ploom CAMEL MENTHOL COLD 空箱 10箱セット＋2箱，图片可见 12 个同款 CAMEL 绿色 Ploom 盒；按 20 sticks/box 记录为 12箱/240 sticks 的 carton-equivalent proof。旧 j-Cigarette 6-pack 数量页仅保留为 gallery 参考。",
    },
  ],
  [
    "Ploom X キャメル メンソール イエロー|Ploom X 骆驼柑橘薄荷",
    {
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/ploom-camel-menthol-yellow-mercari-20-empty-boxes.jpg",
      cartonSource:
        "https://jp.mercari.com/item/m90240906087",
      cartonPackCount: 20,
      cartonStickCount: 400,
      cartonGallery: [
        {
          label: "旧 1 carton 数量参考",
          image: "./images/cartons/ploom-camel-menthol-yellow-carton.jpg",
          source:
            "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-menthol-yellow-citrus-peel-strong-menthol-stick-1-carton-120pcs-citrus-flavor-with-a-refreshing-scent/",
          note: "j-Cigarette 页面写明 1 Carton = 6 pack = 120 pieces，但图片不是整条外箱或 10+ 同 SKU 实拍，仅保留为数量参考。",
        },
        {
          label: "20 本单包内容参考",
          image: "",
          source:
            "https://vapelog.jp/archives/55846",
          note: "Vapelog 商品信息写明 キャメル・メンソール・イエロー，プルームX/プルームS 用，1 箱 20 本入り；用于支数换算，不作为图片证据。",
        },
      ],
      cartonNote:
        "Mercari m90240906087 标题/页面写明 タバコ空箱20個 プルームX CAMELメンソールイエローの空箱，主图可见 4×5 共 20 个同款 CAMEL / ploom X / MENTHOL YELLOW 盒；Vapelog 写明该 SKU 为 20本入り，故按 20箱/400 sticks 的 carton-equivalent proof 记录。旧 j-Cigarette 6-pack 数量页仅保留为 gallery 参考。",
    },
  ],
  [
    "Ploom X キャメル スムース|Ploom X 骆驼柔和",
    {
      cartonStatus: "contents-reference",
      relatedExactJp: ["キャメル・スムース・プルーム用"],
      cartonImage: "./images/cartons/ploom-camel-smooth-carton.jpg",
      cartonSource:
        "https://j-cigarette.com/1carton-ploom-x-ploom-s-camel-smooth-stick-1-carton-120pcs-palatable-smooth-taste/",
      cartonPackCount: 6,
      cartonStickCount: 120,
      cartonNote:
        "该来源页面写明 1 Carton = 120 pcs，但当前图片更像单包/渲染图叠加数量文案，不是 sealed carton/outer box，也不是 6 个同 SKU 包实拍。按严格核验门槛降级为数量参考。",
    },
  ],
  [
    "キャメル・スムース・プルーム用|Ploom 骆驼 Smooth 柔和",
    {
      image: "./images/cartons/camel-smooth-ploom-paypay-33-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://paypayfleamarket.yahoo.co.jp/item/z612685972",
      imageNote:
        "Yahoo!フリマ页面说明为“CAMEL ploom SMOOTHの加熱式たばこ 空箱33箱セット”，图片可见远超 10 个 CAMEL / Ploom / SMOOTH 同款盒。",
      packageFormat: "加热式烟弹盒",
      packageFormatJp: "たばこスティック",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/camel-smooth-ploom-paypay-33-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z612685972",
      cartonPackCount: 33,
      cartonStickCount: 660,
      cartonGallery: [
        {
          label: "PayPay 10箱 旧核验证据",
          image: "./images/cartons/camel-smooth-ploom-paypay-10-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z583255814",
          note: "旧 Yahoo!フリマ页面标题为“【空箱】CAMEL for Ploom smooth 10箱セット”，用于保留此前 10 箱 exact 核验线索。",
        },
        {
          label: "PayPay 10箱 detail 2",
          image: "./images/cartons/camel-smooth-ploom-paypay-10-empty-boxes-detail.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z583255814",
          note: "同一 Yahoo!フリマ页面第二张图，用于辅助确认 CAMEL SMOOTH 盒身细节。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ z612685972 页面说明写“CAMEL ploom SMOOTHの加熱式たばこ 空箱33箱セット”；主图可见远超 10 个浅蓝色 CAMEL / Ploom / SMOOTH 同款空盒，正面和侧面均可读。按 strict gate 的 10+ same-SKU packs proof 核验 exact キャメル・スムース・プルーム用；旧 z583255814 的 10箱セット保留为辅助证据。短名 Ploom X キャメル スムース 仍保留为 contents-reference，不强升。",
    },
  ],
  [
    "ナチュラル アメリカン スピリット|美式精神",
    {
      cartonStatus: "multi-carton-reference",
      relatedExactJp: [
        "ナチュラル アメリカン スピリット ライト 14本入",
        "アメリカン スピリット ターコイズ",
      ],
      cartonImage: "./images/cartons/american-spirit-green-paypay-10-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z613084698",
      cartonGallery: [
        {
          title: "10 个绿色系空盒参考",
          image: "./images/cartons/american-spirit-green-paypay-10-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z613084698",
          note: "Yahoo!フリマ页面标题与说明均写 AMERICAN SPIRIT 空箱10個セット；用于多盒外观参考，因目录为品牌泛称，仍不标记为精确现行 SKU。",
        },
        {
          title: "黄绿色多盒参考",
          image: "./images/cartons/american-spirit-yellowgreen-paypay-66-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z348982180",
          note: "Yahoo!フリマ标题为“アメリカン・スピリット空箱 101+1=102個”，说明文字写“66箱+1箱(デザイン違い)”；用于理解 American Spirit 多盒外观，不当作单一现行 SKU。",
        },
        {
          title: "旧 Regular Box 单包参考",
          image: "./images/cartons/american-spirit-regular-box-reference.jpg",
          source: "https://www.tirakita.com/fl_tabacco/fl_tabacco_22.shtml",
          note: "TIRAKITA 页面明确为“ナチュラル・アメリカン・スピリット レギュラーボックス”，商品详情写明20本入り、タール12mg/ニコチン1.5mg，页面状态为売切れ；不是整条外箱。",
        },
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
        "Yahoo!フリマ标题为“AMERICAN SPIRIT アメリカンスピリット 空箱 10個セット”，商品说明写 AMERICAN SPIRIT、グリーン系、個数10個；图片可见 10 个同色 Natural American Spirit 空盒。当前目录项仍是品牌泛称，不是 Turquoise / Gold / ONE / Menthol One / Light 等具体 SKU；虽然 ANA 能找到个别 American Spirit 具体款的 20本×10箱免税图源，但不能回填到这个泛称条目。因此只作为多盒/一条参考，不标记为精确整条外箱已核验。",
    },
  ],
  [
    "ナチュラル アメリカン スピリット ライト 14本入|美式精神 Light 14支",
    {
      image: "./images/verified/american-spirit-light-14-ana-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.anadf.com/cn/itemdetail.aspx?s_cd=2010100174",
      imageNote:
        "ANA DUTY FREE SHOP 商品图，页面商品名为“ナチュラル アメリカン スピリット ライト １４本入”，图面为黄色 Light 单包，适合旅行时辨认具体 SKU。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/american-spirit-yellow-kurivip-carton.jpg",
      cartonSource: "https://kurivip18.com/katalog/cigarettes/american_spirit_yellow1",
      cartonPackCount: 10,
      cartonStickCount: 140,
      cartonGallery: [
        {
          title: "日本版 Yellow / Light 横向 block 外盒",
          image: "./images/cartons/american-spirit-yellow-kurivip-carton.jpg",
          source: "https://kurivip18.com/katalog/cigarettes/american_spirit_yellow1",
          note: "KuriVIP 页面标题写“Блок сигарет … American Spirit Yellow (Japan)”，商品图为黄色横向外盒，图面可读 Natural American Spirit 与日文警示；用于辨认 Yellow/Light 一条外盒外观。",
        },
        {
          title: "ANA 官方 Light 单包正面",
          image: "./images/verified/american-spirit-light-14-ana-pack.jpg",
          source: "https://www.anadf.com/cn/itemdetail.aspx?s_cd=2010100174",
          note: "ANA 页面商品名为ナチュラル アメリカン スピリット ライト １４本入，尺寸写 14本×10箱，免税价 ¥3,000；单包图用于核对当前 Light 14本入包装。",
        },
        {
          title: "ANA 官方 Light 侧面图",
          image: "./images/verified/american-spirit-light-14-ana-side.jpg",
          source: "https://www.anadf.com/cn/itemdetail.aspx?s_cd=2010100174",
          note: "侧面图可读 LIGHT / ライト 与日文警示；用于避免把绿色 Turquoise、Gold、ONE 等错配到 Light。",
        },
      ],
      cartonNote:
        "KuriVIP 商品页标题为“Блок сигарет Американ Спирит Желтый (Япония) - American Spirit Yellow (Japan)”，主图为黄色日本版横向 block 外盒，图面可读 Natural American Spirit 与日文警示；ANA DUTY FREE SHOP 同款 Light 14本入页面确认尺寸为 14本×10箱、免税价 ¥3,000，并列出成田/羽田等可预约机场。因此本站把 Yellow/Light 14本入作为独立具体 SKU 展示，不再混到泛称 American Spirit。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/salem-light-box10-monolog-carton.png",
      cartonSource: "https://monolog.r-n-i.jp/item/0012300197137",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "历史包装说明图",
          image: "./images/cartons/salem-lightbox-archive.webp",
          source: "https://conveni-now.com/column/conveni-salem/",
          note: "便利店烟草资料页说明 Salem Light 已终售；该图只作历史包装线索。",
        },
      ],
      cartonNote:
        "ものログ商品名为“セーラム・ライト・ボックス 10個”，主图可见 Salem Light 10 个盒装整条实拍，按 10 包 / 200 支核验。该 SKU 属历史/终售方向，不代表当前日本机场或便利店仍有库存。",
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
        "未找到日本在售“セーラム ブラックメンソール”的稳定商品页或一カートン外箱图。CigarettesPedia 收录的图为美国 Salem Black Label Full Flavor Menthol 100's 包装，可作为“黑薄荷/Black Label”方向的外观线索；日本烟草店旧问答曾把“セーラムブラックラベル(アメリカ)”列为日本未进口品，因此此图不代表日本门店在库，也不是整条外箱。若旅途中要找 Salem，优先核对仍在售的 Salem Light 等日本渠道名。",
    },
  ],
  [
    "バージニア エス ロゼ メンソール|Virginia S 粉薄荷",
    {
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/virginia-rose-menthol-10p-monolog-carton.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4930941000004",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "World Tobacco 单包辨认图",
          image: "./images/cartons/virginia-s-rose-content.jpg",
          source:
            "https://www.world-tobacco.jp/view/item/000000001119?category_page_id=ct110",
          note: "世界のたばこ通販商品页提供 Virginia S Rosé Menthol 当前单包图与 20本入り规格；不是整条外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名为“PM バージニアスリムロゼメンソール 10P”，可证明 10P/数量线索；但当前主图视觉只能确认约 5 个 Rosé Menthol 包装，不是 sealed carton，也不足以视觉确认完整 10 个同 SKU 包。按严格核验门槛降级为数量参考。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/camel-craft14-ebay-12-empty-boxes.jpg",
      cartonSource: "https://www.ebay.com/itm/127067591681",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "单包识别图",
          image: "./images/cartons/camel-craft14-kikuya-content.gif",
          source: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
          note: "きくや商品页列出“キャメル・クラフト14・ボックス”，并说明 1カートン为10箱；该图为单包参考。",
        },
      ],
      cartonNote:
        "eBay 商品标题为“CAMEL 1913 CRAFT 14 Cigarettes Empty Box 12 Boxes Lot”，图片可见 12 个 Camel Craft 14 空盒叠放，足以核对 14mg 多包外观。该来源为收藏/空盒图，不代表当前库存；通常一条按 10 包 / 200 支估算，购买时仍以门店实物为准。",
    },
  ],
  [
    "わかば|若叶",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: ["わかば・シガー 10P"],
      cartonImage: "./images/cartons/wakaba-cigar-10p-monolog-carton.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210153810",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "旧 Wakaba 单包辨认图",
          image: "./images/cartons/wakaba-kikuya-content.gif",
          source: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
          note: "きくや页面列出旧 わかば，并说明该店按カートン（ケース）单位销售，1カートン为 10 箱；图片为旧单包图，不是外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名和可见图均指向“JT わかば・シガー 10P”，不是旧紙巻き/泛称“わかば”。在目录未拆分或改名为“わかば・シガー”前，不能作为泛称 わかば 的已核验整条图，降级为变体参考。",
    },
  ],
  [
    "わかば・シガー 10P|Wakaba Cigar 10P",
    {
      image: "./images/cartons/wakaba-cigar-10p-monolog-carton.jpg",
      imageStatus: "verified",
      imageSource: "https://monolog.r-n-i.jp/item/4902210153810",
      imageNote:
        "ものログ图可见 わかば CIGARS 横向外箱；商品名为 JT わかば・シガー 10P。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/wakaba-cigar-10p-monolog-carton.jpg",
      cartonSource: "https://monolog.r-n-i.jp/item/4902210153810",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "旧 Wakaba 单包辨认图",
          image: "./images/cartons/wakaba-kikuya-content.gif",
          source: "https://kikuya.my.coocan.jp/jp_etc_tb.htm",
          note: "きくや页面列出旧 わかば，并说明该店按カートン（ケース）单位销售，1カートン为 10 箱；用于区分旧紙巻き泛称 Wakaba。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT わかば・シガー 10P”，主图可见 わかば CIGARS 横向外箱；10P 指向 10 包/一条规格，按 10 包 / 200 支核验。该 verified 只绑定精确 わかば・シガー 10P 行，不回填旧紙巻き/泛称 Wakaba 行。",
    },
  ],
  [
    "エコー|Echo",
    {
      cartonStatus: "variant-reference",
      relatedExactJp: ["エコー・シガー 10P"],
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
        "ものログ商品名和可见图均指向“JT エコー・シガー 10P”，不是旧紙巻き/泛称“エコー”。在目录未拆分或改名为“エコー・シガー”前，不能作为泛称 Echo 的已核验整条图，降级为变体参考。",
    },
  ],
  [
    "エコー・シガー 10P|Echo Cigar 10P",
    {
      image: "./images/cartons/echo-cigar-10p-monolog-carton-side.jpg",
      imageStatus: "verified",
      imageSource: "https://monolog.r-n-i.jp/item/4902210153919",
      imageNote:
        "ものログ图可见 echo CIGARS 横向外箱侧面；商品名为 JT エコー・シガー 10P。",
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
          note: "きくや页面列出旧 Echo，并说明该店按カートン（ケース）单位销售，1カートン为 10 箱；用于区分旧紙巻き泛称 Echo。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT エコー・シガー 10P”，主图可见 echo CIGARS 横向外箱侧面；10P 指向 10 包/一条规格，按 10 包 / 200 支核验。该 verified 只绑定精确 エコー・シガー 10P 行，不回填旧紙巻き/泛称 Echo 行。",
    },
  ],
  [
    "glo hyper ネオ ブリリアント ベリー|glo neo 闪耀莓果",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-neo-brilliant-berry-paypay-15-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z486874470",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-neo-brilliant-berry-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/glo-neo-for-hyper-brilliant-berry-sticks-bursting-with-freshness-berry-blend/",
          note: "j-Cigarette 对应商品页 SKU 为 1CartonGloneo(forHyper)BrilliantBerry，并确认可选 1 Carton (= 10 pack)。图片为准确 SKU 单盒图，不是外箱实拍。",
        },
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-neo-brilliant-berry-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/neo-brilliant-berry-for-glo-hyper-2406100175.html",
          note: "KIX 官方页展示 neo Brilliant Berry for glo hyper 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题为“glo hyper neo・ブリリアント ベリー☆タバコ 空き箱 15箱”，图片可见 15 个 neo Brilliant Berry for glo hyper 空盒排列，能核对同 SKU 多包外观。KIX 官方页展示 neo Brilliant Berry for glo hyper 当前单盒图，并明确 10 boxes per carton (20 sticks per box)；因此按 10 包 / 200 支核验为精确整条/足量同 SKU 参考。该来源为售出空盒/收藏图，不代表当前库存。",
    },
  ],
  [
    "IQOS センティア バランスド イエロー|IQOS SENTIA 均衡黄",
    {
      image: "./images/verified/sentia-balanced-yellow-hrt-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://handrollingtobacco.co.uk/product/sentia-balanced-yellow-jp/",
      imageNote:
        "Hand Rolling Tobacco UK / HRT 商品页 Pack of 20 变体图，图面可读 SENTIA、for IQOS ILUMA，用于核对黄色 Balanced Yellow 单包包装。",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://handrollingtobacco.co.uk/product/sentia-balanced-yellow-jp/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "HRT Box of 200 变体图",
          image: "./images/cartons/sentia-balanced-yellow-hrt-box200.jpg",
          source: "https://handrollingtobacco.co.uk/product/sentia-balanced-yellow-jp/",
          note: "HRT 页面将该图绑定到 Box of 200 变体；图面可读 SENTIA、for IQOS ILUMA、黄色 Balanced Yellow 外盒与日文警示。",
        },
        {
          label: "HRT Pack of 20 单包图",
          image: "./images/verified/sentia-balanced-yellow-hrt-pack.jpg",
          source: "https://handrollingtobacco.co.uk/product/sentia-balanced-yellow-jp/",
          note: "同页 Pack of 20 变体图，用于与 Box of 200 外盒做同 SKU 核对。",
        },
      ],
      cartonNote:
        "Hand Rolling Tobacco UK / HRT 页面为 SENTIA Balanced Yellow 提供 Pack of 20 与 Box of 200 两个变体，页面说明 1 carton contains 10 packs of 20 tobacco sticks / Total 200 tobacco sticks；但 Box of 200 变体图仍更像单盒商品图，不能证明实拍整条外箱或 10 个同 SKU 包装，因此仅作数量来源线索。AMANOYA、Placer 另确认日本渠道按 1カートン10個 / 5,700円级别销售。",
    },
  ],
  [
    "IQOS センティア フロスト グリーン|IQOS SENTIA 冰绿薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/sentia-frost-green-mercari-50-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m31568595622",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "50 空箱实拍",
          image: "./images/cartons/sentia-frost-green-mercari-50-empty-boxes.jpg",
          source: "https://jp.mercari.com/item/m31568595622",
          note: "Mercari 标题/描述为“アイコス センティアフロストグリーン空箱50個”。图片可见 SENTIA、for IQOS ILUMA、FROST GREEN，属于同款多盒实拍。",
        },
        {
          label: "9 空箱参考",
          image: "./images/cartons/sentia-frost-green-paypay-9-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z618983782",
          note: "Yahoo!フリマ标题为“IQOS ILUMA SENTIA センティア フロストグリーン 空箱 9箱セット”；作为辅助来源，不作为完整一条主图。",
        },
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/sentia-frost-green-content.png",
          source: "https://www.placer-tabaco.com/product/5885",
          note: "プラセール页面确认“センティア・フロスト・グリーン E”按 1カートン/10個 销售；图片为单盒参考。",
        },
      ],
      cartonNote:
        "Mercari 标题/描述确认“アイコス センティアフロストグリーン空箱50個”，主图可见 SENTIA / for IQOS ILUMA / FROST GREEN，足以核验为同 SKU 多盒实拍；一条数量按 プラセール 1カートン/10個 计算为 10 包 / 200 支。PayPay 9 空箱图保留为辅助参考，不替代主核验图。",
    },
  ],
  [
    "glo hyper ラッキー ストライク リッチ|glo 幸运击 浓郁",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-lucky-strike-rich-paypay-27-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z501925796",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-lucky-strike-rich-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/1-carton-glohyper-lucky-strike-rich-tobacco-recommended-for-paper-roll-medium-tar-about-6mg-mellow-and-thick-you-can-taste-the-clear-vapor-without-any-peculiarities-a-stick-that-is-one-step-different-from-previous/",
          note: "j-Cigarette 对应商品页确认 1 Carton = 10 pack = 200 pieces。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题为“glo グロー ラッキーストライク リッチ 空箱 27個”，图片可见 27 个 Lucky Strike Rich Tobacco for glo hyper 空盒排列，能核对多包外观。该来源为售出空盒/收藏图，不代表当前库存；一条仍按 10 包 / 200 支估算。",
    },
  ],
  [
    "glo hyper ラッキー ストライク メンソール|glo 幸运击 薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-lucky-strike-menthol-mercari-10-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m27415415655",
      cartonPackCount: 10,
      cartonGallery: [
        {
          label: "旧混合多盒参考",
          image: "./images/cartons/glo-lucky-strike-menthol-paypay-mixed-9-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z583034152",
          note: "Yahoo!フリマ旧候选图混有 Berry Menthol，不再作为主图；仅保留用于解释此前未核验状态。",
        },
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-lucky-strike-menthol-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/1-carton-glo-hyper-menthol-lucky-strike-menthol-x-menthol-flavor-refreshing-menthol-flavor/",
          note: "j-Cigarette 对应商品页确认 1 Carton = 10 packs = 200 sticks。图片自身带 1 carton / 10 pack / 200 piece 标识，但不是外箱实拍。",
        },
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-lucky-strike-menthol-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/lucky-strike-menthol-for-glo-hyper-2406300046.html",
          note: "KIX 官方页展示 LUCKY STRIKE MENTHOL FOR GLO HYPER 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "Mercari 商品标题为“glohyper グローハイパーラッキーストライク空箱 10箱”，主图可见 10 个同款 LUCKY STRIKE MENTHOL for glo hyper 紫色空盒排列，按同 SKU 10 盒实拍核验。该来源为空盒/收藏图，不代表实时库存；KIX 官方页和 j-Cigarette 页面另确认 1 carton / 10 boxes / 200 sticks。",
    },
  ],
  [
    "glo hyper ラッキー ストライク ダーク|glo 幸运击 深色款",
    {
      image: "./images/cartons/glo-lucky-strike-dark-tobacco-paypay-14-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://paypayfleamarket.yahoo.co.jp/item/z584991492",
      imageNote:
        "Yahoo!フリマ图可见同一画面内 12 个 LUCKY STRIKE DARK TOBACCO for glo HYPER 空盒，右侧另有 10 枚同 SKU 裁切盖片；商品说明为“空箱14個 切り取った蓋部分10枚”。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-lucky-strike-dark-tobacco-paypay-14-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z584991492",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "Yahoo!フリマ 14 空箱实拍",
          image:
            "./images/cartons/glo-lucky-strike-dark-tobacco-paypay-14-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z584991492",
          note: "页面标题/说明为 LUCKY STRIKE glo HYPER DARK TOBACCO 空箱14個；主图可见 12 个同 SKU 空盒加 10 枚同 SKU 盖片。",
        },
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-lucky-strike-dark-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/1-carton-glo-hyper-lucky-strike-dark-tobacco-smoky-flavor-like-aromatic-wood/",
          note: "j-Cigarette 对应商品页确认 1 Carton = 10 pack = 200 pieces。图片自身带 1 Carton 标识，但不是外箱实拍。",
        },
        {
          label: "Amanoya 当前包装/数量参考",
          image:
            "./images/cartons/glo-lucky-strike-dark-tobacco-amanoya-pack.png",
          source: "https://www.e-amanoya.jp/view/category/ct349",
          note: "Amanoya glo hyper 分类页列出“ラッキーストライク・ダーク・タバコ・glo hyper用（1カートン10個入）”，图片为 exact Dark Tobacco 单包参考。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ exact SKU 页面标题/说明为“LUCKY STRIKE glo HYPER DARK TOBACCO 空箱14個 切り取った蓋部分10枚”，主图可见 12 个 LUCKY STRIKE DARK TOBACCO for glo HYPER 同款空盒，右侧另有 10 枚同 SKU 盖片；j-Cigarette 对应 Dark Tobacco 页作为 1 carton = 10 packs = 200 pieces 数量参考。Dark Menthol 证据仅保留在独立“glo hyper ラッキー ストライク ダーク メンソール”行，二者不再混用。",
    },
  ],
  [
    "glo hyper ラッキー ストライク ダーク メンソール|glo 幸运击 深薄荷",
    {
      image:
        "./images/cartons/glo-lucky-strike-dark-menthol-paypay-52-empty-boxes.jpg",
      imageStatus: "verified",
      imageSource: "https://paypayfleamarket.yahoo.co.jp/item/z562041458",
      imageNote:
        "Yahoo!フリマ图可见大量 LUCKY STRIKE DARK MENTHOL for glo hyper 同款盒；用于精确 Dark Menthol 多盒视觉核验。",
      cartonStatus: "verified",
      cartonImage:
        "./images/cartons/glo-lucky-strike-dark-menthol-paypay-52-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z562041458",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "KIX 官方 Dark Menthol 单包/数量参考",
          image: "./images/cartons/glo-lucky-strike-dark-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/lucky-strike-dark-menthol-for-glo-hyper-2406300043.html",
          note: "KIX 官方页展示 LUCKY STRIKE DARK MENTHOL FOR GLO HYPER 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题和主图均指向 LUCKY STRIKE DARK MENTHOL，图片可见远超 10 个同款 DARK MENTHOL for glo hyper 盒。KIX 官方页补充 exact Dark Menthol 当前单包图和 10 boxes per carton (20 sticks per box) 数量信息，按 10 包 / 200 支核验；该 verified 只绑定精确 Dark Menthol 行，不回填泛称 Dark Tobacco 行。",
    },
  ],
  [
    "glo hyper ネオ トロピカル スワール|glo neo 热带旋风",
    {
      cartonStatus: "contents-reference",
      cartonImage:
        "./images/cartons/glo-neo-tropical-swirl-jcigarette-multipack-reference.jpg",
      cartonSource:
        "https://j-cigarette.com/glo-neo-tm-tropical-swirl-stick-for-glo-hyper-heat-sticks-1-carton-200-heatsticks/",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "j-Cigarette 1 carton 同 SKU 多盒图",
          image: "./images/cartons/glo-neo-tropical-swirl-jcigarette-multipack-reference.jpg",
          source:
            "https://j-cigarette.com/glo-neo-tm-tropical-swirl-stick-for-glo-hyper-heat-sticks-1-carton-200-heatsticks/",
          note: "同页标题确认 1 carton / 200 heatsticks，附图可见同一 Tropical Swirl SKU 多盒排列；但画面只有 5+1 盒，不是完整 10 盒，也不是封闭外箱，因此只能作为内容图参考。",
        },
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-neo-tropical-swirl-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/neo-brilliant-tropical-click-for-glo-hyper-2406100176.html",
          note: "KIX 官方页展示 neo Brilliant Tropical Click for glo hyper 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "j-Cigarette 对应商品页标题确认“glo neo TM Tropical Swirl Stick for glo hyper Heat Sticks 1 carton 200 Heatsticks”，同页单包图可读 Tropical Swirl，多盒图为同 SKU 5+1 盒排列；但图片不是完整 10 盒、不是外箱实拍，也不是封闭外箱，因此不能按严格一条图核验。Cigars of Dubai 也写 1 carton contains 10 packs of 20 tobacco sticks。KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。大浦商店页面也列出旧名 ネオ･トロピカル・スワール・スティック・glo hyper用，20本、カートン（10箱）；RELAZO 说明该旧款已リニューアル为ネオ・ブリリアント・トロピカル。",
    },
  ],
  [
    "Ploom X メビウス シャープ コールド|Ploom X 锐冷薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/ploom-mevius-sharp-cold-mercari-10-empty-boxes.jpg",
      cartonSource: "https://jp.mercari.com/item/m78489316130",
      cartonPackCount: 10,
      cartonGallery: [
        {
          label: "カートン数量来源",
          image: "./images/cartons/ploom-mevius-sharp-cold-content.jpg",
          source: "https://www.placer-tabaco.com/product/5668",
          note: "プラセール页面确认该 SKU 按カートン（10個）单位销售，たばこスティック20本入り、1カートン/10個。",
        },
        {
          title: "Sharp Cold 10 盒混合实拍",
          image: "./images/cartons/ploom-mevius-sharp-cold-paypay-20-mixed-empty-boxes.jpg",
          source: "https://paypayfleamarket.yahoo.co.jp/item/z606359296",
          note: "Yahoo!フリマ说明为 Ploom MEVIUS 空箱20箱，其中 ブラックメンソール10箱、シャープコールド10箱；图面可读 10 个 SHARP COLD MENTHOL 与 10 个 BLACK COLD MENTHOL。它是混合 20 盒参考，不是纯单 SKU 一カートン。"
        },
        {
          label: "清晰单盒参考",
          image: "./images/cartons/ploom-mevius-sharp-cold-cod-pack-reference.jpg",
          source:
            "https://cigarsofdubai.com/product/mevius-sharp-cold-menthol-ploom-x-jp/",
          note: "Cigars of Dubai 页面确认 1 carton contains 10 packs of 20 tobacco sticks，并提供 Sharp Cold Menthol 清晰单盒图；该图不是一条外箱。",
        },
      ],
      cartonNote:
        "Mercari 图片可见 10 个同款 MEVIUS ploom X SHARP COLD MENTHOL 空盒，图面能读出 SHARP COLD MENTHOL；按同 SKU 10 盒实拍核验。プラセール页面另确认该 SKU 按カートン（10個）单位销售，并写明たばこスティック20本入り、1カートン/10個。该来源为空盒/收藏图，不代表实时库存。",
    },
  ],
  [
    "glo hyper ネオ アイスド メンソール|glo neo 冰感薄荷",
    {
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-neo-iced-menthol-paypay-24-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z462331094",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-neo-iced-menthol-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/glo-neo-for-hyper-iced-menthol-sticks-peppermint-and-cooling-capsule-menthol/",
          note: "j-Cigarette 对应商品页 SKU 为 1CartonGloneo(forHyper)IcedMenthol，并确认可选 1 Carton (= 10 pack)。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题为“【空箱】グロー アイスド メンソール 24個”，说明写有“glo neo Iced Menthol”；图片可见 24 个 neo Iced Menthol for glo hyper 空盒排列，能核对多包外观。该来源为售出空盒图，不代表当前库存；一条仍按 10 包 / 200 支估算。",
    },
  ],
  [
    "lil HYBRID ミックス レギュラー|lil HYBRID 混合经典",
    {
      imageStatus: "reference",
      imageSource: "https://ameblo.jp/tobacco-kodama/entry-12838717652.html",
      imageNote:
        "こだま页面说明ミックス レギュラー已终卖后短暂再入荷，属于稀少/历史款；当前主图仅作旧款识别。",
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/lil-miix-regular-kodama-content.png",
      cartonSource: "https://ameblo.jp/tobacco-kodama/entry-12838717652.html",
      cartonNote:
        "大阪京橋たばこセンターこだま页面说明“ミックス レギュラー”已终卖后短暂再入荷，并写明 20本入、需搭配 lil HYBRID 专用设备与リキッドカートリッジ；同页列出 MIIX 家族含 Ice、Ice Plus、Mix、Regular、Velvet。Oricon 资料说明官方线上专用たばこ按カートン单位销售，但该资料不是 Regular 同 SKU 整条外箱图。图片为 Regular 单盒与 cartridge 对照图，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス アイス|lil HYBRID 混合冰薄荷",
    {
      image: "./images/verified/lil-miix-ice-sirius-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      imageNote:
        "Sirius Tobacco 对应 MIIX Ice 单包图，图面可读 MIIX ICE 与日文警示；Relazo 另确认 2023 年后绿色新设计。",
      cartonStatus: "contents-reference",
      cartonImage: "",
      cartonSource: "https://www.e-amanoya.jp/view/item/000000003194?category_page_id=ct391",
      cartonGallery: [
        {
          title: "AMANOYA 10個页面商品图",
          image: "./images/cartons/lil-miix-ice-amanoya-10unit.png",
          source: "https://www.e-amanoya.jp/view/item/000000003194?category_page_id=ct391",
          note: "AMANOYA 页面标题写“ミックス・アイス（10個）”，商品图为 MIIX ICE 单包正面；这是 10個来源页的单包图，不是整条外箱。",
        },
        {
          title: "Sirius Tobacco 单包参考",
          image: "./images/verified/lil-miix-ice-sirius-pack.jpg",
          source: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
          note: "Sirius Tobacco 类目页提供可读 MIIX ICE 单包图；它不是 10 個整条外箱。",
        },
      ],
      cartonNote:
        "AMANOYA SETAGAYA 具体商品页标题为“ミックス・アイス（10個）”，价格 5,600 円，可作为同口味 10 个单位来源；页面商品图为可读 MIIX ICE 单包正面，不是 10 個整条外箱。Sirius Tobacco 与 Relazo 另确认内容量 20本入、价格 560円、对应リルハイブリッド。当前图不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス ミックス|lil HYBRID 混合果香",
    {
      image: "./images/verified/lil-miix-mix-sirius-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      imageNote:
        "Sirius Tobacco 对应 MIIX Mix 单包图；Oricon 将其列为 MIIX 现行全 4 口味之一，定位为柑橘/果香方向。",
      cartonStatus: "contents-reference",
      cartonImage: "",
      cartonSource: "https://www.e-amanoya.jp/view/item/000000003193?category_page_id=ct391",
      cartonGallery: [
        {
          title: "AMANOYA 10個页面商品图",
          image: "./images/cartons/lil-miix-mix-amanoya-10unit.png",
          source: "https://www.e-amanoya.jp/view/item/000000003193?category_page_id=ct391",
          note: "AMANOYA 页面标题写“ミックス・ミックス（10個）”，商品图为 MIIX MIX 单包正面；这是 10個来源页的单包图，不是整条外箱。",
        },
        {
          title: "Sirius Tobacco 单包参考",
          image: "./images/verified/lil-miix-mix-sirius-pack.jpg",
          source: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
          note: "Sirius Tobacco 类目页提供可读 MIIX MIX 单包图；它不是 10 個整条外箱。",
        },
      ],
      cartonNote:
        "AMANOYA SETAGAYA 具体商品页标题为“ミックス・ミックス（10個）”，价格 5,600 円，可作为同口味 10 个单位来源；页面商品图为可读 MIIX MIX 单包正面，不是 10 個整条外箱。Sirius Tobacco 与 Oricon 另确认 MIIX 系列现行口味含ミックス ミックス，定位为柑橘系フルーティー。当前图不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス アイス プラス|lil HYBRID 混合冰薄荷 Plus",
    {
      image: "./images/verified/lil-miix-ice-plus-sirius-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      imageNote:
        "Sirius Tobacco 对应 MIIX Ice Plus 单包图；PR TIMES 资料确认该口味由 Philip Morris Japan 发布。",
      cartonStatus: "contents-reference",
      cartonImage: "",
      cartonSource: "https://www.e-amanoya.jp/view/item/000000003192?category_page_id=ct391",
      cartonGallery: [
        {
          title: "AMANOYA 10個页面商品图",
          image: "./images/cartons/lil-miix-ice-plus-amanoya-10unit.png",
          source: "https://www.e-amanoya.jp/view/item/000000003192?category_page_id=ct391",
          note: "AMANOYA 页面标题写“ミックス・アイスプラス（10個）”，商品图为 MIIX ICE PLUS 单包正面；这是 10個来源页的单包图，不是整条外箱。",
        },
        {
          title: "Sirius Tobacco 单包参考",
          image: "./images/verified/lil-miix-ice-plus-sirius-pack.jpg",
          source: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
          note: "Sirius Tobacco 类目页提供可读 MIIX ICE PLUS 单包图；它不是 10 個整条外箱。",
        },
      ],
      cartonNote:
        "AMANOYA SETAGAYA 具体商品页标题为“ミックス・アイスプラス（10個）”，价格 5,600 円，可作为同口味 10 个单位来源；页面商品图为可读 MIIX ICE PLUS 单包正面，不是 10 個整条外箱。Sirius Tobacco 与 PR TIMES 另确认 MIIX Ice Plus 为 lil HYBRID 专用たばこ产品。当前图不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
  [
    "lil HYBRID ミックス ベルベット|lil HYBRID 混合莓果",
    {
      image: "./images/verified/lil-miix-velvet-sirius-pack.jpg",
      imageStatus: "verified",
      imageSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      imageNote:
        "Sirius Tobacco 对应 MIIX Velvet 单包图；こだま与 PR TIMES 均确认 Velvet 是 2023 年新增口味。",
      cartonStatus: "contents-reference",
      cartonImage: "./images/verified/lil-miix-velvet-sirius-pack.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "Sirius Tobacco 类目页列出ミックス ベルベット（リルハイブリッド専用）并提供可读单包图；こだま页面说明 Velvet 为 2023 年 11 月下旬発売、20本入り，PR TIMES 也确认其为 Philip Morris Japan 发布的新口味。Oricon 资料说明官方线上专用たばこ按カートン单位销售，但未找到 Velvet 可读同 SKU 10 包整条图。当前图为 Velvet 单盒图，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
    },
  ],
]);

const REVIEW_NOTES = new Map([
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

function generatedReferenceTitle(status) {
  return {
    "contents-reference": "单包 / 内容图参考",
    "multi-carton-reference": "多盒 / 数量参考",
    "variant-reference": "近似变体参考",
    "source-only": "来源商品图参考",
  }[status] ?? "补充参考图";
}

function generatedReferenceNote(status, cartonNote) {
  const statusNote = {
    "contents-reference": "这张图用于辨认单包或来源页内容，不是完整一条外箱。",
    "multi-carton-reference": "这张图用于辨认多盒或多条参考，不会当作纯单 SKU 一条主图。",
    "variant-reference": "这张图只用于辨认近似变体或历史包装，不代表当前同 SKU 一条。",
    "source-only": "这张图来自已记录来源，只作商品外观线索；整条外箱仍待核验。",
  }[status] ?? "这张图只作补充参考，不当作已核验整条外箱。";
  return cartonNote ? `${statusNote} ${cartonNote}` : statusNote;
}

function resolveCartonGallery(override, originalImage, status, allowed) {
  if (!allowed) return [];
  if (Array.isArray(override.cartonGallery) && override.cartonGallery.length) {
    return override.cartonGallery;
  }
  const image = override.cartonImage || override.image || originalImage;
  const source = override.cartonSource || override.imageSource || "";
  if (!image || !source) return [];
  return [
    {
      title: generatedReferenceTitle(status),
      image,
      source,
      note: generatedReferenceNote(status, override.cartonNote),
    },
  ];
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
  const rawCartonStatus = applicable ? (override.cartonStatus ?? "needs-review") : "not-applicable";
  const exactCartonImageAllowed = rawCartonStatus === "verified";
  const referenceGalleryAllowed = [
    "verified",
    "archive-reference",
    "contents-reference",
    "multi-carton-reference",
    "variant-reference",
    "source-only",
  ].includes(rawCartonStatus);
  const cartonGallery = resolveCartonGallery(
    override,
    originalImage,
    rawCartonStatus,
    applicable && referenceGalleryAllowed,
  );

  return {
    originalImage,
    image: override.image ?? originalImage,
    imageStatus: override.imageStatus ?? item.imageStatus ?? "review-required",
    imageSource: override.imageSource ?? item.imageSource ?? "",
    imageNote:
      override.imageNote ??
      item.imageNote ??
      (reviewNote || defaultImageNote),
    packageFormat: override.packageFormat ?? format.packageFormat,
    packageFormatJp: override.packageFormatJp ?? format.packageFormatJp,
    unitLabel: identity.unitLabel,
    bulkLabel: identity.bulkLabel,
    identityHeading: identity.identityHeading,
    identityNote: identity.identityNote,
    variantNote: override.variantNote ?? reviewNote,
    cartonApplicable: applicable,
    cartonStatus: rawCartonStatus,
    cartonImage: applicable && exactCartonImageAllowed ? (override.cartonImage ?? "") : "",
    cartonSource: applicable ? (override.cartonSource ?? "") : "",
    cartonGallery,
    cartonPackCount: applicable ? (override.cartonPackCount ?? 10) : 0,
    cartonStickCount: applicable ? (override.cartonStickCount ?? 200) : 0,
    cartonNote: applicable
      ? (override.cartonNote ?? "整条外箱尚未人工核对；为避免认错，暂不展示不确定图片。")
      : "设备本体和电子烟配件不按传统香烟“一カートン”展示。",
    relatedExactJp: Array.isArray(override.relatedExactJp) ? override.relatedExactJp : [],
    cartonSearchUrl: searchUrl(query),
    cartonSearchQuery: query,
  };
}
