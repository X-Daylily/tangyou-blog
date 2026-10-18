# 糖油糍粑的 blog

个人博客：记录学习、项目复盘与日常思考。用 Astro 构建，Cloudflare Pages 托管，`git push` 即发布。

线上地址：<https://tangyou-blog.pages.dev>

## 技术栈

- **Astro 7**：默认输出静态 HTML，几乎不带多余 JavaScript
- **Markdown / MDX**：文章就是仓库里的一个文件
- **原生 CSS**：没有 UI 框架，样式与动效自己写
- **Cloudflare Pages**：推送到 GitHub 后自动构建部署
- **Sharp**：构建期生成响应式图片

## 本地开发

需要 Node.js 22.12+（见 `.nvmrc`）。

```sh
npm install
npm run dev        # http://localhost:4321
```

后台运行（见 `AGENTS.md`）：

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## 常用命令

| 命令                   | 作用                        |
| ---------------------- | --------------------------- |
| `npm run dev`          | 本地开发服务器              |
| `npm run build`        | 构建到 `dist/`              |
| `npm run preview`      | 预览构建产物                |
| `npm run check`        | Astro + TypeScript 类型检查 |
| `npm run format`       | Prettier 格式化             |
| `npm run format:check` | 只检查格式，不改文件        |

## 写一篇新文章

在 `src/content/blog/` 新建 Markdown 文件：

```md
---
title: '文章标题'
description: '一句话摘要'
pubDate: '2026-10-18'
tags: ['随笔']
draft: false
---

正文从这里开始。
```

字段说明：

| 字段          | 必填 | 说明                                        |
| ------------- | ---- | ------------------------------------------- |
| `title`       | 是   | 标题                                        |
| `description` | 是   | 摘要，用于列表、RSS、搜索与分享卡片         |
| `pubDate`     | 是   | 发布日期                                    |
| `updatedDate` | 否   | 更新日期，显示「最后更新于」                |
| `heroImage`   | 否   | 头图，放在 `src/assets/` 并写相对路径       |
| `tags`        | 否   | 标签数组，自动生成标签页                    |
| `draft`       | 否   | `true` 时本地可见、线上构建排除并加 noindex |

提交推送后，Cloudflare Pages 会自动构建上线。

## 目录结构

```text
├── public/                 # 原样拷贝的静态文件（favicon、_headers）
├── src/
│   ├── assets/             # 图片与字体，会被构建优化
│   ├── components/         # Header / Footer / Logo / 组件
│   ├── content/blog/       # 文章源文件
│   ├── layouts/            # 文章页布局
│   ├── pages/              # 路由（首页、文章、标签、RSS、404…）
│   ├── styles/             # 全局样式与主题变量
│   ├── utils/              # 阅读时长等工具
│   ├── consts.ts           # 站点名、作者、社交链接
│   └── content.config.ts   # 文章 frontmatter 校验
├── astro.config.mjs        # 站点地址、集成、字体
└── OPTIMIZE.md             # 优化手册（改造记录与清单）
```

## 部署

推送到 `main` 分支即触发 Cloudflare Pages 构建。若构建失败，先本地跑一遍：

```sh
npm run check && npm run build
```
