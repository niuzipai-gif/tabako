# 煙草羅盤 · Tabako Compass

面向中国游客的日本烟草旅行参考工具。它把包装识别、日中双语品名、参考价格、口味与强度、设备兼容、渠道可得性、人群热度和 Google 地图查找放进同一条移动端优先的操作路径。

线上地址：<https://niuzipai-gif.github.io/tabako/>

## 核心能力

- 91 款传统香烟、加热烟弹、设备与电子烟/烟弹的日中双语目录
- 中文、日文、品牌、价格与口味搜索
- 类别、口味筛选，价格与双人群热度排序
- 日本人气、中国游客人气两个编辑指数榜单
- 每款产品的包装参考图、风格、强度、兼容性和渠道可得性说明
- 商品日文名直达 Google 地图搜索，并提供便利店与 Don Quijote 快捷入口
- 本地收藏、详情历史返回、实时日元/人民币换算
- 响应式移动端/桌面端布局，可安装 PWA 与同源资源离线缓存
- 键盘与读屏基础可访问性，支持 `prefers-reduced-motion`

## 数据边界

- `官方参考价` 只用于已按厂商或官方公告校对的系列；其余标为 `指导价`。
- 页面不连接门店 POS 或实时库存。“常见”“较可能有”“需专门店”“旧款风险”是渠道可得性估计，不是库存承诺。
- 日本人气与中国游客人气是基于品牌能见度、渠道覆盖和旅行者认知的编辑指数，不是实时销量，也不是抓取评论的平均分。
- 评价文字是常见印象的中文概括，不冒充日本或中国消费者的逐字评论。
- 包装、价格、在售状态和汇率都可能变化，购买时应以厂商和门店实物为准。

价格校对入口：

- [日本财务省烟草零售价信息](https://www.mof.go.jp/policy/tab_salt/topics/kouriteika.html)
- [JT Mevius](https://www.jti.co.jp/tobacco/products/mevius/index.html)
- [JT Seven Stars](https://www.jti.co.jp/tobacco/products/sevenstars/index.html)
- [JT Winston](https://www.jti.co.jp/tobacco/products/winston/index.html)
- [JT 2026 年 Camel Craft 价格公告](https://www.jti.co.jp/investors/library/press_releases/20260529_J01.html)
- [JT 2026 年 Ploom 烟弹价格公告](https://www.jti.co.jp/investors/library/press_releases/20260226_J01.html)
- [IQOS Japan 2026 年价格公告](https://jp.iqos.com/node/11511)

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

- `data/products.js`：原始 91 款产品数据
- `catalog.js`：数据规范化、价格规则、筛选、排行与地图链接
- `app.js`：交互状态、收藏、详情、筛选与汇率
- `styles.css`：移动端优先的视觉与响应式布局
- `images/`：本地包装参考图
- `tests/`：Node 内置测试
- `docs/`：审计、设计方向、实施方案和视觉 QA 证据

仓库的 GitHub Pages 工作流会在 `main` 分支更新后自动发布到原网址。
