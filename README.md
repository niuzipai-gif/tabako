# 煙草羅盤 · Tabako Compass

面向中国游客的日本烟草旅行参考工具。它把包装识别、日中双语品名、参考价格、口味与强度、设备兼容、渠道可得性、人群热度和 Google 地图查找放进同一条移动端优先的操作路径。

## 中文介绍

Tabako Compass 是面向中国游客的日本烟草参考工具，帮助用户按包装、品牌、口味、强度、价格、设备兼容性和购买渠道线索快速查找商品。它包含传统香烟、加热烟弹、加热设备和部分电子烟/烟弹条目，并提供日语沟通卡、AI 找烟、拍照识烟和离线缓存。

项目不提供实时库存或购买承诺；价格、包装、渠道可得性和汇率都需要以日本门店和厂商最新信息为准。

## 日本語紹介

Tabako Compass は、中国から日本を訪れる旅行者向けのたばこリファレンスツールです。パッケージ、ブランド、味、強さ、価格、デバイス互換性、販売チャネルの手がかりから商品を探せます。紙巻たばこ、加熱式たばこスティック、主要デバイス、一部の電子たばこ関連項目を収録し、日本語の店員向けコミュニケーションカード、AI 検索、写真認識、オフラインキャッシュにも対応しています。

リアルタイム在庫や購入保証を提供するものではありません。価格、パッケージ、販売状況、為替は、購入時に店舗やメーカーの最新情報を確認してください。

线上地址：<https://niuzipai-gif.github.io/tabako/>

## 核心能力

- 146 款传统香烟、加热烟弹、主流加热设备与电子烟/烟弹的日中双语目录
- 中文、日文、品牌、价格与口味搜索
- 图片优先的双列移动端陈列，包装保持完整比例、不裁切
- 类别、口味筛选，价格、双人群热度与设备品牌/型号排序
- 日本人气、中国游客人气两个品牌级编辑指数榜单，并提供独立的纵向排行信息流
- 每款产品的包装参考图、风格、强度、兼容性和渠道可得性说明
- 详情页分开呈现单包与“一カートン”；当前记录 35 个精确整条/多包已核验媒体、10 个多盒参考，无法从图面核对完整 SKU 的外箱会降级为数量来源或待核对，避免一包和一条错配
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

- `worker.js`：校验来源、请求模式、查询长度和图片大小；AI 匹配只使用服务端随版本发布的 146 款目录，并过滤购买权限受限条目；密钥只从 `MINIMAX_API_KEY` 服务端变量读取。
- `wrangler.toml`：公开 Worker 配置，默认仅允许 `https://niuzipai-gif.github.io`。Cloudflare Rate Limiting 绑定是生产保护项；没有绑定时 Worker 仍可调用 MiniMax，便于先把 AI 跑通。
- `.github/workflows/deploy-ai-worker.yml`：仓库配置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`MINIMAX_API_KEY` 三个 GitHub Actions secrets 后，可手动或随 `main` 分支变更自动部署代理。
- `config.js`：公开页面只保存部署后的代理 URL，不放密钥；默认代理只在 GitHub Pages 正式域名启用，本地开发需用 `?aiProxyUrl=https://你的-worker地址/` 或本机代理地址显式测试，避免误打临时公网代理。
- `scripts/local-ai-proxy.mjs`：本机临时代理，默认监听 `127.0.0.1:8789`，可配合 Tailscale Funnel 暴露公网 HTTPS。

部署时必须先撤销任何曾在聊天、截图或日志中出现的旧 Key，然后创建新 Key：

```powershell
npx wrangler secret put MINIMAX_API_KEY
npx wrangler deploy
```

建议生产环境补 Cloudflare Rate Limiting 绑定；没配时代理也会运行，但不会做匿名访问频率保护。

### Cloudflare Worker 长期化部署步骤

Tailscale Funnel 适合临时接通；长期公开使用建议部署 Cloudflare Worker，并把 Worker HTTPS 地址灰度验证后再写入 `config.js`。不要把任何密钥写进 Git、GitHub Pages、URL、截图或命令历史。

1. 在 Cloudflare 获取部署凭据：

   - `CLOUDFLARE_ACCOUNT_ID`：登录 Cloudflare Dashboard，在目标账号 / zone 的 Overview 页面右侧 API 区域复制 Account ID；如果使用 Workers CI/CD，Cloudflare 官方也要求 CI 同时提供 account ID。
   - `CLOUDFLARE_API_TOKEN`：Cloudflare Dashboard → Manage Account / My Profile → API Tokens → Create Token；Workers 部署使用自定义 token，权限选择 Cloudflare Workers 的编辑权限（官方 CI/CD 文档示例为 “Edit Cloudflare Workers”），作用域限制到本项目所在账号。

   官方参考：

   - Cloudflare Workers GitHub Actions：<https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>
   - Cloudflare 创建 API Token：<https://developers.cloudflare.com/fundamentals/api/get-started/create-token/>

2. 在 GitHub 仓库配置 Actions secrets：

   打开 `niuzipai-gif/tabako` → Settings → Secrets and variables → Actions → New repository secret，分别添加：

   ```text
   CLOUDFLARE_API_TOKEN
   CLOUDFLARE_ACCOUNT_ID
   MINIMAX_API_KEY
   ```

   如果使用 `gh`，建议不要把值写进命令行参数；让 `gh` 交互式读取，或从安全的密码管理器/本地文件通过 stdin 输入：

   ```powershell
   gh secret set CLOUDFLARE_API_TOKEN --repo niuzipai-gif/tabako
   gh secret set CLOUDFLARE_ACCOUNT_ID --repo niuzipai-gif/tabako
   gh secret set MINIMAX_API_KEY --repo niuzipai-gif/tabako
   gh secret list --repo niuzipai-gif/tabako
   ```

3. 触发并确认 Worker 部署：

   ```powershell
   gh workflow run deploy-ai-worker.yml --repo niuzipai-gif/tabako --ref main
   gh run list --repo niuzipai-gif/tabako --workflow deploy-ai-worker.yml --limit 3
   ```

   成功部署的日志应出现 `npm test`、`wrangler secret put MINIMAX_API_KEY` 和 `wrangler deploy`。如果只看到 `Skipping AI Worker deploy because ... is not configured`，说明 secrets 仍缺失，Worker 没有真正部署。

4. 用 Worker URL 灰度验证：

   ```text
   https://niuzipai-gif.github.io/tabako/?aiProxyUrl=https%3A%2F%2F你的-worker地址%2F
   ```

   验证推荐、联网搜索和拍照识别均可用后，再把 `config.js` 的默认代理从 Tailscale Funnel 改为 Cloudflare Worker HTTPS 地址。

把部署结果的 HTTPS 地址写入 `config.js`：

```text
https://niuzipai-gif.github.io/tabako/?aiProxyUrl=https%3A%2F%2F你的-worker地址%2F
```

代理按官方当前接口接线：

- [MiniMax-M3 Chat Completions 与图片理解](https://platform.minimaxi.com/docs/api-reference/text-chat-openai)
- [MiniMax `web_search` 服务端工具](https://platform.minimaxi.com/docs/guides/server-tools)

如果代理为空或服务暂时不可用，站点仍保留本地推荐、外部搜索链接、完整目录、地图和日语沟通卡。

### Tailscale Funnel 临时公网代理

当前 GitHub Pages 正式域名默认 AI 地址可以指向 Tailscale Funnel：

```text
https://tabako.tail74d566.ts.net/tabako-ai
```

本机启动方式：

```powershell
# .dev.vars 只保存在本机，不提交 Git
# MINIMAX_API_KEY=你的服务端密钥
npm run ai:local
tailscale funnel --bg --set-path=/tabako-ai 8789
```

这个方案能快速接通公网，但依赖当前电脑在线、Tailscale 在线、本机代理进程持续运行。长期稳定上线仍建议迁移到 Cloudflare Worker、Vercel 或其它 serverless 代理。

本地 `127.0.0.1` 或 `localhost` 预览不会默认直连这个 Funnel 地址；如需本地联调，请先启动本机代理并用 `?aiProxyUrl=` 显式传入可接受当前 origin 的代理地址。

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

- `data/products.js`：原始 146 款产品数据
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
