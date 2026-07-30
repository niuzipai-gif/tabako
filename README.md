# 煙草羅盤 · Tabako Compass

面向中国游客的日本烟草旅行参考工具。它把包装识别、日中双语品名、参考价格、口味与强度、设备兼容、渠道可得性、人群热度和 Google 地图查找放进同一条移动端优先的操作路径。

线上地址：<https://niuzipai-gif.github.io/tabako/>

## 核心能力

- 125 款传统香烟、加热烟弹、主流加热设备与电子烟/烟弹的日中双语目录
- 中文、日文、品牌、价格与口味搜索
- 图片优先的双列移动端陈列，包装保持完整比例、不裁切
- 类别、口味筛选，价格、双人群热度与设备品牌/型号排序
- 日本人气、中国游客人气两个品牌级编辑指数榜单，并提供独立的纵向排行信息流
- 每款产品的包装参考图、风格、强度、兼容性和渠道可得性说明
- 详情页分开呈现单包与“一カートン”；当前已核验 4 款 TEREA 真整条外箱，并提供 1 款明确标注年份的七星历史外箱参考
- 商品日文名直达 Google 地图搜索，并提供便利店与 Don Quijote 快捷入口
- 本地收藏、详情历史返回、实时日元/人民币换算
- AI 找烟：按口味、强度、预算、设备与包装线索做本地即时推荐，并显示阶段、进度和终态
- 拍照识烟：通过安全代理调用 MiniMax-M3 图片理解，返回目录候选
- 零结果恢复：MiniMax 联网搜索、Google 图片/网页与 JT 厂商资料入口
- 离线日语沟通卡：选择商品和数量，生成可直接给店员看的礼貌日语
- 响应式移动端/桌面端布局，可安装 PWA 与同源资源离线缓存
- 键盘与读屏基础可访问性，支持 `prefers-reduced-motion`

## 数据边界

- `官方参考价` 只用于已按厂商或官方公告校对的系列；其余标为 `指导价`。
- 页面不连接门店 POS 或实时库存。“常见”“较可能有”“需专门店”“旧款风险”是渠道可得性估计，不是库存承诺。
- 日本人气与中国游客人气是基于品牌能见度、渠道覆盖和旅行者认知的品牌级编辑指数；同品牌烟款共用分值，不使用名称哈希或随机数，不是实时销量，也不是抓取评论的平均分。
- 评价文字是常见印象的中文概括，不冒充日本或中国消费者的逐字评论。
- 电子烟/烟弹条目无法核实尼古丁状态，只保留旧包装识别。日本销售含尼古丁烟液需要许可，因此这些条目不提供地图或门店购买引导。
- 包装、价格、在售状态和汇率都可能变化，购买时应以厂商和门店实物为准。
- `images/cartons/manifest.json` 记录每张整条图的精确 SKU、状态、数量、来源与 SHA-256。`verified` 才表示当前精确整条图；`archive-reference` 必须在界面中明确提示不是当前包装。

价格校对入口：

- [日本财务省烟草零售价信息](https://www.mof.go.jp/policy/tab_salt/topics/kouriteika.html)
- [JT Mevius](https://www.jti.co.jp/tobacco/products/mevius/index.html)
- [JT Seven Stars](https://www.jti.co.jp/tobacco/products/sevenstars/index.html)
- [JT Winston](https://www.jti.co.jp/tobacco/products/winston/index.html)
- [JT 2026 年 Camel Craft 价格公告](https://www.jti.co.jp/investors/library/press_releases/20260529_J01.html)
- [JT 2026 年 Ploom 烟弹价格公告](https://www.jti.co.jp/investors/library/press_releases/20260226_J01.html)
- [IQOS Japan 2026 年价格公告](https://jp.iqos.com/node/11511)
- [日本厚生劳动省电子烟说明](https://kennet.mhlw.go.jp/information/information/dictionary/tobacco/yt-059.html)

## 外部服务与隐私

- 页面启动时会向 `open.er-api.com` 请求 JPY/CNY 汇率；如果请求失败，会回退到页面内的参考汇率。
- Google 地图只会在用户主动点击商品或渠道链接后打开；本项目本身不请求浏览器定位权限。
- Google 图片、网页与 JT 资料搜索只会在用户主动点击后打开，搜索词会发送给对应搜索服务。
- “描述偏好”会先在浏览器内对本地目录做即时匹配，不需要上传内容。
- 拍照识烟只有在用户选择图片并点击“开始识别”后才会发送；安全代理未配置时图片不会上传。
- MiniMax API Key 只能放在服务端环境变量，绝不能写入 `config.js`、前端代码、GitHub Pages 或浏览器存储。
- 商品包装图、界面图标和目录数据均从本站同源加载。

## MiniMax 安全接入

本站部署在静态 GitHub Pages 上，浏览器下载得到所有前端代码，因此不能直接保存 MiniMax 密钥。仓库提供了一个 Cloudflare Worker 兼容的安全代理模板：

- `worker.js`：校验来源、请求模式、查询长度和图片大小；AI 匹配只使用服务端随版本发布的 125 款目录，并过滤购买权限受限条目；密钥只从 `MINIMAX_API_KEY` 服务端变量读取。
- `wrangler.toml`：公开 Worker 配置，默认仅允许 `https://niuzipai-gif.github.io`。Cloudflare Rate Limiting 绑定是生产保护项；没有绑定时 Worker 仍可调用 MiniMax，便于先把 AI 跑通。
- `.github/workflows/deploy-ai-worker.yml`：仓库配置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`MINIMAX_API_KEY` 三个 GitHub Actions secrets 后，可手动或随 `main` 分支变更自动部署代理。
- `config.js`：公开页面只保存部署后的代理 URL，不放密钥；也支持用 `?aiProxyUrl=https://你的-worker地址/` 临时写入本机浏览器，便于上线前测试。

部署时必须先撤销任何曾在聊天、截图或日志中出现的旧 Key，然后创建新 Key：

```powershell
npx wrangler secret put MINIMAX_API_KEY
npx wrangler deploy
```

建议生产环境补 Cloudflare Rate Limiting 绑定；没配时代理也会运行，但不会做匿名访问频率保护。

把部署结果的 HTTPS 地址写入 `config.js`：

```text
https://niuzipai-gif.github.io/tabako/?aiProxyUrl=https%3A%2F%2F你的-worker地址%2F
```

代理按官方当前接口接线：

- [MiniMax-M3 Chat Completions 与图片理解](https://platform.minimaxi.com/docs/api-reference/text-chat-openai)
- [MiniMax `web_search` 服务端工具](https://platform.minimaxi.com/docs/guides/server-tools)

如果代理为空或服务暂时不可用，站点仍保留本地推荐、外部搜索链接、完整目录、地图和日语沟通卡。

## 本地运行与验证

直接用静态服务器打开项目根目录：

```powershell
python -m http.server 4173
```

运行数据、结构与交互接线的自动化检查：

```powershell
npm test
```

补充或更新本地包装图：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-search-images.ps1
```

## 目录结构

- `data/products.js`：原始 125 款产品数据
- `catalog.js`：数据规范化、价格规则、筛选、排行与地图链接
- `product-media.js`：单包/一カートン媒体状态、包装变体与重复图核验规则
- `ranking.html` / `ranking.js`：日本人气与中国游客人气纵向排行页
- `ai-client.js`：本地推荐、外部搜索 URL、AI 客户端与响应安全归一化
- `app.js`：交互状态、收藏、详情、筛选与汇率
- `config.js`：公开运行配置，只允许填写代理 URL
- `worker.js`：可独立部署的 MiniMax 安全代理
- `styles.css`：移动端优先的视觉与响应式布局
- `images/`：本地包装参考图
- `vendor/`：离线可用的 Lucide 图标库与许可证
- `tests/`：Node 内置测试
- `docs/`：审计、设计方向、实施方案和视觉 QA 证据

仓库的 GitHub Pages 工作流会在 `main` 分支更新后自动发布到原网址。
