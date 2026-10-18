---
title: '这个博客是怎么搭起来的'
description: 'Astro + Markdown + Cloudflare Pages：一套够轻、够快的写作流程'
pubDate: '2026-10-14'
tags: ['Astro', '建站']
---

第二篇本来只是占位，干脆把它写成一篇真正的建站笔记：记录这个博客用的工具，以及为什么选它们。

## 技术栈

- **Astro**：默认输出静态 HTML，几乎没有多余的 JavaScript
- **Markdown / MDX**：文章就是仓库里的一个文件，写完提交即可
- **Cloudflare Pages**：推送到 GitHub 后自动构建、自动部署
- **原生 CSS**：没有引入 UI 框架，样式和动效都自己写

## 为什么不用现成的博客主题

现成主题当然更快，但博客本身也是我想折腾的一部分。自己写布局和样式，才能把标题字体、纸张质感、深浅色这些细节慢慢调到喜欢的程度。

## 写一篇新文章

在 `src/content/blog/` 下新建一个 Markdown 文件，填好 frontmatter 就能发布：

```md
---
title: '文章标题'
description: '一句话摘要'
pubDate: '2026-10-14'
tags: ['随笔']
---

正文从这里开始。
```

代码块会自动高亮，右上角也有复制按钮。剩下的事情，交给 `git push`。

> 工具只是工具，能让人愿意持续写下去的那个，才是好工具。
