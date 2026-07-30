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
      cartonStatus: "verified",
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
        "monolog 商品名为“マールボロ・メンソール・8・ボックス 20本×10”，主图可见 10 个 Marlboro Menthol 8 日本警示版盒装排列，按 1カートン / 10包 / 200支核验。ANA 2CT 官方图只保留为免税两条装辅助参考。",
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
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=2010200052",
      cartonNote:
        "ANA 免税店页面确认 LARK HYBRID KS BOX 销售规格为 20本×10箱 / 1カートン，图片为官方单包正面图，不是整条外箱。Placer 另有同名/同系产品页写 20本入り、1カートン/10個。用于辨认 Hybrid Natural Mint Capsule 包装，整条长盒仍待实图核对。",
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
        "ANA 免税店页面确认“ウィンストン XS キャスターホワイト 1 ボックス”销售规格为 20本×10箱 / 1カートン，主图为官方单包正面图，不是整条外箱。JT 现行 Winston 列表以 Cabin / Caster White 等名称为主；旧烟草店资料可见 Winston XS 作为旧款/历史名出现。本站另补充 ANA 现行 Winston Caster White One 100's Box 的官方一条外箱侧面图，作为 1mg Caster 系后继/近似包装参考；购买时仍需核对完整日文名。",
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
        "Yahoo!フリマ页面标题为“タバコの空箱 84個 CAMEL キャメル 6ミリ 水色”，主图展示大量 Camel Craft 6 浅蓝盒整齐排列，可确认一条/多包外观；该来源为空盒收藏/手工材料，不代表现行库存。ANA 官方页补充 20本×10箱 / 1カートン规格。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/kool-boost-fresh-8-ana-carton.jpg",
      cartonSource: "https://www.anadf.com/itemdetail.aspx?s_cd=7000048009",
      cartonNote:
        "ANA 免税店页面确认“クール・ブースト・フレッシュ・8・ボックス”销售规格为 20本×10箱 / 1カートン；第二张官方图展示立体外箱/一条包装，正面有 KOOL BOOST FRESH 8 与 Hokkaido Mint 标识。目录为泛称 KOOL Boost，本站按 8mg Fresh 作为已核验整条图。",
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
      cartonStatus: "verified",
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
        "Mercari 标题为“煙草空箱 LARK SELECT 1 ★72箱”，说明写明 72 個の空箱；主图可见大量 LARK SELECT 1 白色空盒，足以核验 1mg/100s 系列多盒外观。该图为空盒参考，不代表实时库存；购买时请核对 Select 1 / Ultra 1 等 1mg 具体名称。",
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
    "メビウス プレミアム メンソール|梅比乌斯 高级薄荷",
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
          source: "https://www.anadf.com/itemdetail.aspx?s_cd=7000083790",
          note: "ANA 免税店页面确认 MEVIUS Premium Menthol 8 销售规格为 20本×10箱 / 1カートン；图片为官方单包正面图。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT メビウスプレミアムメンソール8 10P”，可作为 10P / 200 支数量来源；但当前可取得图片只显示局部多包排列，不能清楚核对完整同 SKU 10 包整条/一カートン外箱，因此不再标为已核验整条图。目录项为泛称 Premium Menthol，购买时请按 8mg 主流款与完整日文名核对。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-regular-iqosheets-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为蓝色 TEREA 日本警示版整条外盒，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，按来源页标题、文件名和蓝色 Regular 色系共同核对；机场/便利店实时库存仍以门店为准。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-black-menthol-iqosheets-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-black-menthol-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“Terea Black Menthol for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为黑绿 TEREA 日本警示版整条外盒，左侧可读 BLACK MENTHOL，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，只用于核对整条外观与数量，机场/便利店实时库存仍以门店为准。",
    },
  ],
  [
    "IQOS テリア スムース レギュラー|IQOS TEREA 柔和经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001891",
      imageNote:
        "World Tobacco 对应 Smooth Regular SKU 页面图；图面为浅蓝色 TEREA 日本警示版，正面不完整显示口味名时按来源页标题核对。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-smooth-regular-iqosheets-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-smooth-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Smooth Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为银色 TEREA 日本警示版整条外盒，图面警示区可读 SMOOTH，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，只用于核对整条外观与数量，实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア ルビー レギュラー|IQOS TEREA 红宝石经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001887?category_page_id=ct304",
      imageNote:
        "World Tobacco 对应 Ruby Regular SKU 页面图；图面为蓝红色 TEREA 日本警示版，作为单盒辨认参考，不等同整条外箱核验。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-ruby-regular-iqosheets-carton.webp",
      cartonSource: "https://iqosheets-uae.ae/products/iqos-terea-ruby-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Ruby Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为蓝红渐变 TEREA 日本警示版整条外盒，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，按来源页标题、文件名和 Ruby 色系共同核对；实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア フュージョン メンソール|IQOS TEREA 融合薄荷",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001897",
      imageNote:
        "World Tobacco 对应 Fusion Menthol SKU 页面图；图面为紫粉色 TEREA 日本警示版，但正面不直接写完整 FUSION MENTHOL，因此标为来源页参考。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-fusion-menthol-iqosheets-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-fusion-menthol-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Fusion Menthol for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为紫粉渐变 TEREA 日本警示版整条外盒，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，按来源页标题、文件名和 Fusion 色系共同核对；实时库存以门店为准。",
    },
  ],
  [
    "IQOS テリア ウォーム レギュラー|IQOS TEREA 温感经典",
    {
      imageStatus: "reference",
      imageSource: "https://www.world-tobacco.jp/view/item/000000001898?category_page_id=ct304",
      imageNote:
        "World Tobacco 对应 Warm Regular SKU 页面图；图面为暖棕色 TEREA 日本警示版，按来源页标题与实物色系共同核对。",
      cartonStatus: "verified",
      cartonImage: "./images/cartons/terea-warm-regular-iqosheets-carton.webp",
      cartonSource:
        "https://iqosheets-uae.ae/products/iqos-terea-warm-regular-japan-dubai-uae",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonNote:
        "IQOSHeets UAE 商品页标题为“TEREA Warm Regular for ILUMA Japan / 1 Carton”，规格写明 Single Carton / 10 Packs；主图为暖棕色 TEREA 日本警示版整条外盒，图底写明 1 Carton contains 10 Packs / 200 Heatsticks。该图带海外零售商水印，按来源页标题、文件名和 Warm 色系共同核对；实时库存以门店为准。",
    },
  ],
  [
    "シガローネ・レジェンド|卡比龙 Imperial Legend",
    {
      image: "./images/verified/cigaronne-imperial-legend-official.png",
      imageStatus: "reference",
      imageSource: "https://cigaronne.com/our-collection/imperial-collection",
      imageNote:
        "Cigaronne 官网 Imperial Collection 图；官网列 Legend、Big Boss、Royal Slims、Phantom 四个代表款，此图用于补齐卡比龙官网全系列识别。",
      packageFormat: "横向硬盒",
      packageFormatJp: "ボックス",
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://cigaronne.com/our-collection/imperial-collection",
      cartonNote:
        "Cigaronne 官网确认 Imperial Collection 包含 Legend；当前只取得官网产品图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonStatus: "source-only",
      cartonImage: "",
      cartonSource: "https://cigaronne.com/our-collection/imperial-collection",
      cartonNote:
        "Cigaronne 官网确认 Big Boss 属于 Imperial Collection；当前只取得官网产品图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://www.kixdutyfree.jp/en/cigaronne-super-slims-menthol-2407000022.html",
      cartonGallery: [
        {
          title: "来源商品图参考：JAL 官方单盒 / 1カートン规格",
          image: "./images/verified/cigaronne-super-menthol-worldtobacco-pack.jpg",
          source: "https://www.jaldutyfree.com/shop/g/g5319990198/",
          note: "JAL DUTYFREE 页面确认 シガローネ スーパースリム メンソール 为 1カートン10箱・1箱20本入；图为单盒/商品图，不是整条外箱，整条外箱仍待核验。",
        },
      ],
      cartonNote:
        "KIX DUTY FREE 官方英文页确认 CIGARONNE SUPER SLIMS MENTHOL 为 1 carton contains 10 packs、20 cigarettes per pack，免税价 ¥6,800；JAL DUTYFREE 同款页写明 1カートン10箱・1箱20本入。World Tobacco 页面列出 20本入り、タール8mg。Rakuten/堀商事另列 10packs シガローネ スーパースリム メンソール，并注明箱なしセロハン包装；PARMA / Cigars of Dubai / HitCigars 等海外页只提供单盒或通用商品图。当前接入的图为对应 SKU 单盒/展示盒图，不是完整 10 盒整条外箱实拍，因此暂不展示为已核验整条图。",
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
      cartonSource: "https://neutrinoinvest.co.za/wholesale-distribution/tobacco-products/cigaronne/",
      cartonNote:
        "Cigaronne 官网确认 Classic King Size 为 Classic Collection 完整系列之一；Neutrino Invest 批发资料把 King Size 列为 Number of Packs/Carton = 10、Number of cartons/case = 50，并配有 King Size 黑/白单盒展示图。该图不是完整同 SKU 10 包整条外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://neutrinoinvest.co.za/wholesale-distribution/tobacco-products/cigaronne/",
      cartonNote:
        "Cigaronne 官网确认 Classic Compatto 为 Classic Collection 完整系列之一；Neutrino Invest 批发资料把 Compatto 列为 Number of Packs/Carton = 10、Number of cartons/case = 50，并配有 Compatto 单盒展示图。该图不是完整同 SKU 10 包整条外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://neutrinoinvest.co.za/wholesale-distribution/tobacco-products/cigaronne/",
      cartonNote:
        "Cigaronne 官网确认 Classic Ultra Slims 为 Classic Collection 完整系列之一；Neutrino Invest 批发资料把 Ultra Slims 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前仅有官网/批发页包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://neutrinoinvest.co.za/wholesale-distribution/tobacco-products/cigaronne/",
      cartonNote:
        "Cigaronne 官网确认 Classic Super Slims 为 Classic Collection 完整系列之一；Neutrino Invest 批发资料把 Super Slims 列为 Number of Packs/Carton = 10、Number of cartons/case = 50。当前仅有官网/批发页包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://daiyostore.com/shopdetail/000000001178/Cigaronne/page1/order/",
      cartonNote:
        "DAIYOSTORE 商品页确认 シガローネ・タトゥー・チェリー 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类另确认该款为 20本入りリトルシガー。Rakuten/堀商事另列 10packs シガローネ タトゥー チェリー，大浦商店也列 1カートン(10箱)；Cigaronne 官方和 Tabimperia 页面只见单包/开盒图。当前未找到可读完整 SKU 的整条外箱图，本站仅保留单盒/展示图与来源。",
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
      cartonSource: "https://daiyostore.com/shopdetail/000000001179/Cigaronne/page1/order/",
      cartonNote:
        "DAIYOSTORE 商品页确认 シガローネ・タトゥー・チョコレート 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类确认该款为 20本入りリトルシガー。Rakuten/堀商事另列 10packs シガローネ タトゥー チョコレート；Tabimperia 页面写明 10 packs/block，但图片仍是单包。无可核对完整 SKU 的整条图，因此不展示整条外箱。",
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
      cartonSource: "https://daiyostore.com/shopdetail/000000001180/Cigaronne/page1/order/",
      cartonNote:
        "DAIYOSTORE 商品页确认 シガローネ・タトゥー・バニラ 为 入数：20本/箱、商品内容：1カートン(10箱)；World Tobacco 分类确认该款为 20本入りリトルシガー。Rakuten/堀商事另列 10packs シガローネ タトゥー バニラ；Cigaronne 官方页只见双包/单包展示。暂未取得可核对整条外箱图片，因此不发布为已核验整条。",
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
      cartonSource: "https://www.kixdutyfree.jp/en/cigaronne-ultra-slims-black-2407000016.html",
      cartonGallery: [
        {
          title: "来源商品图参考：KIX 官方单盒正面",
          image: "./images/d84cbbb1.jpg",
          source: "https://www.kixdutyfree.jp/en/cigaronne-ultra-slims-black-2407000016.html",
          note: "KIX 官方页商品图为单盒正面；另有开盒内容物图，但都不是 10 盒整条外箱，整条外箱仍待核验。",
        },
      ],
      cartonNote:
        "KIX DUTY FREE 官方英文页确认 Cigaronne Ultra Slims Black 商品号 2407000016，タール6mg、ニコチン0.5mg，免税价 ¥6,000；商品图为单盒正面和开盒内容物图，不是 10 盒整条外箱。World Tobacco 单包价约 ¥700。Rakuten/堀商事另列 10packs シガローネ ウルトラスリム ブラック，并注明箱なしセロハン包装；Cigars of Dubai / TobaccoAsh 页面写 1 Carton / 10 packs / 200 cigarettes，但图也不是完整同 SKU 整条外箱。未取得可核对整条外箱图，因此不展示整条主图。",
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
      cartonSource: "https://cigaronne.com/our-collection/center",
      cartonNote:
        "Cigaronne 官网确认 Center King Size 覆盖 Red、Blue、Black；当前仅有官网多口味包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://cigaronne.com/our-collection/center",
      cartonNote:
        "Cigaronne 官网确认 Center Compatto 覆盖 Red、Blue、Black；当前仅有官网多口味包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://cigaronne.com/our-collection/center",
      cartonNote:
        "Cigaronne 官网确认 Center Ultra Slims 覆盖 Red、Blue、Black；当前仅有官网多口味包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonSource: "https://cigaronne.com/our-collection/center",
      cartonNote:
        "Cigaronne 官网确认 Center Super Slims 覆盖 Red、Blue、Black；当前仅有官网多口味包装参考图，未取得同 SKU 10 包整条/一カートン外箱实拍，因此不展示为已核验整条图。",
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
      cartonStatus: "verified",
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
        "Yahoo!オークション标题为“電子タバコ キャメル メンソールフレッシュ 10個 新品未開封品”，实拍可见 10 个同款 CAMEL ploom X MENTHOL FRESH 盒。该目录项按 Camel Menthol Fresh 线核对为 1カートン = 10包 / 200支；购买时仍请区分 Fresh/Cold/Yellow 等具体口味。",
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
      cartonStatus: "multi-carton-reference",
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
      cartonStatus: "verified",
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
        "ものログ商品名为“PM バージニアスリムロゼメンソール 10P”，主图可见 Rosé Menthol 10 包整条排列，按 20 本×10 包 / 200 支核验；单包图另放入图库辅助辨认。",
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
          note: "きくや页面列出旧 わかば，并说明该店按カートン（ケース）单位销售，1カートン为 10 箱；图片为旧单包图，不是外箱。",
        },
      ],
      cartonNote:
        "ものログ商品名为“JT わかば・シガー 10P”，主图可见 10P 外箱照片，按 10 包 / 200 支核验。旧紙巻き Wakaba 与现行 Wakaba Cigar 名称有差异，购买时应按店铺现行 SKU 再确认。",
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
        "Yahoo!フリマ标题为“glo hyper neo・ブリリアント ベリー☆タバコ 空き箱 15箱”，图片可见 15 个 neo Brilliant Berry for glo hyper 空盒排列，能核对多包外观。该来源为售出空盒/收藏图，不代表当前库存；一条仍按 10 包 / 200 支估算。",
    },
  ],
  [
    "IQOS センティア バランスド イエロー|IQOS SENTIA 均衡黄",
    {
      cartonStatus: "contents-reference",
      cartonImage: "./images/cartons/sentia-balanced-yellow-content.png",
      cartonSource: "https://www.e-amanoya.jp/view/item/000000003311",
      cartonNote:
        "AMANOYA 页面标题确认“センティア バランスド イエロー（1カートン10個入）”；Placer 和 Bigliquy 也列出 カートン（10個）/ 5,700円级别，日本渠道可作为数量来源。Cigars of Dubai 页面写明 1 carton contains 10 packs of 20 tobacco sticks，但图片仍是单盒/商品图。当前图片为单盒渲染图，不是整条外箱，用于辨认黄色 Balanced Yellow 包装。",
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
      cartonStatus: "verified",
      cartonImage: "./images/cartons/glo-lucky-strike-dark-menthol-paypay-52-empty-boxes.jpg",
      cartonSource: "https://paypayfleamarket.yahoo.co.jp/item/z562041458",
      cartonPackCount: 10,
      cartonStickCount: 200,
      cartonGallery: [
        {
          label: "1 Carton 数量参考",
          image: "./images/cartons/glo-lucky-strike-dark-1carton-reference.jpg",
          source:
            "https://j-cigarette.com/1-carton-glo-hyper-lucky-strike-dark-tobacco-smoky-flavor-like-aromatic-wood/",
          note: "j-Cigarette 对应商品页确认 1 Carton = 10 pack = 200 pieces。图片自身带 1 Carton 标识，但不是外箱实拍。",
        },
        {
          label: "KIX 官方当前包装",
          image: "./images/cartons/glo-lucky-strike-dark-kix-official-pack.jpg",
          source:
            "https://www.kixdutyfree.jp/en/lucky-strike-dark-menthol-for-glo-hyper-2406300043.html",
          note: "KIX 官方页展示 LUCKY STRIKE DARK MENTHOL FOR GLO HYPER 当前单盒图，并明确 10 boxes per carton (20 sticks per box)。",
        },
      ],
      cartonNote:
        "Yahoo!フリマ标题为“glo hyper用 LUCKY STRIKE DARK MENTHOL 空箱 52箱セット”，图片可见大量 LUCKY STRIKE DARK MENTHOL for glo hyper 空盒排列，能核对多包外观。该来源为售出空盒/收藏图，不代表当前库存；一条仍按 10 包 / 200 支估算。",
    },
  ],
  [
    "glo hyper ネオ トロピカル スワール|glo neo 热带旋风",
    {
      cartonStatus: "verified",
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
          note: "同页标题确认 1 carton / 200 heatsticks，附图可见同一 Tropical Swirl SKU 多盒排列；主图不是封闭外箱，但可用于核对一条/10 包内容物外观。",
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
        "j-Cigarette 对应商品页标题确认“glo neo TM Tropical Swirl Stick for glo hyper Heat Sticks 1 carton 200 Heatsticks”，同页单包图可读 Tropical Swirl，多盒图为同 SKU 一条/10 包内容物展示，可按 10 packs / 200 heatsticks 核验；图片不是外箱实拍、也不是封闭外箱，购买时仍需以门店实物包装为准。Cigars of Dubai 也写 1 carton contains 10 packs of 20 tobacco sticks。KIX 官方页补充当前单盒包装和 10 boxes per carton 信息。大浦商店页面也列出旧名 ネオ･トロピカル・スワール・スティック・glo hyper用，20本、カートン（10箱）；RELAZO 说明该旧款已リニューアル为ネオ・ブリリアント・トロピカル。",
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
      cartonImage: "./images/verified/lil-miix-ice-sirius-pack.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "Sirius Tobacco 类目页列出ミックス アイス（リルハイブリッド専用）并提供可读单包图，Relazo 评测页确认内容量 20本入、价格 560円、对应リルハイブリッド。Oricon 资料说明官方线上专用たばこ按カートン单位销售，但未给出该口味 10 包整条外箱图。当前图为 MIIX ICE 单盒图，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
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
      cartonImage: "./images/verified/lil-miix-mix-sirius-pack.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "Sirius Tobacco 类目页列出ミックス ミックス（リルハイブリッド専用）并提供可读单包图；Oricon 资料确认 MIIX 系列现行口味含ミックス ミックス，定位为柑橘系フルーティー。Oricon 同页说明官方线上专用たばこ按カートン单位销售，但未给出该口味 10 包整条外箱图。当前图为 MIIX MIX 单盒图，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
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
      cartonImage: "./images/verified/lil-miix-ice-plus-sirius-pack.jpg",
      cartonSource: "https://www.tabako.co.jp/category/item/tvp-all/tvp-lilhybrid/",
      cartonNote:
        "Sirius Tobacco 类目页列出ミックス アイス プラス（リルハイブリッド専用）并提供可读单包图；PR TIMES 资料确认 MIIX Ice Plus 为 lil HYBRID 专用たばこ产品。Oricon 资料说明官方线上专用たばこ按カートン单位销售，但未给出该口味 10 包整条外箱图。当前图为 MIIX ICE PLUS 单盒图，不是已核对的一カートン外箱；购买时还需同时核对专用リキッド。",
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
    cartonStatus: rawCartonStatus,
    cartonImage: applicable && exactCartonImageAllowed ? (override.cartonImage ?? "") : "",
    cartonSource: applicable ? (override.cartonSource ?? "") : "",
    cartonGallery,
    cartonPackCount: applicable ? (override.cartonPackCount ?? 10) : 0,
    cartonStickCount: applicable ? (override.cartonStickCount ?? 200) : 0,
    cartonNote: applicable
      ? (override.cartonNote ?? "整条外箱尚未人工核对；为避免认错，暂不展示不确定图片。")
      : "设备本体和电子烟配件不按传统香烟“一カートン”展示。",
    cartonSearchUrl: searchUrl(query),
    cartonSearchQuery: query,
  };
}
