# タバコ価格ガイド

一个可直接发布的静态网站，汇总日本热门香烟、加热不燃烧、IQOS 机器本体、电子烟与烟弹的参考价格，并显示本地商品图片与日元/人民币换算。

## 本地预览

直接双击 `index.html` 即可，或在项目目录启动一个简单静态服务器。

## 一键补图

项目会优先读取 `images/` 里的本地图片。新增商品后可以运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-search-images.ps1
```

## 发布到 GitHub Pages

仓库已经包含 GitHub Pages 自动部署工作流 `.github/workflows/deploy-pages.yml`。

你只需要做下面几步：

1. 在 GitHub 新建一个空仓库。
2. 把当前项目推送到 GitHub。
3. 进入 GitHub 仓库 `Settings` -> `Pages`。
4. 在 `Build and deployment` 里把 `Source` 设成 `GitHub Actions`。
5. 以后每次推送到默认分支，网站都会自动重新部署。

## 首次推送示例

把下面命令里的仓库地址替换成你自己的：

```powershell
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

部署完成后，公开地址通常会显示在 GitHub Pages 设置页和 Actions 部署结果里。
