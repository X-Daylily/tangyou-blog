# 博客优化手册（照着抄即可）

> 目标：把 Astro Blog starter 改造成「你自己的中文博客」。
> 每步都写了**文件路径 + 可直接粘贴的代码**。改完一组就跑一次 `npm run dev` 看效果，最后 `npm run build` 验证。
>
> 建议顺序：**A → B → C → D → E → F**。A0 是其他步骤的前提，请先做。

---

## 准备

```powershell
cd C:\my-blog
npm run dev        # 边改边看，http://localhost:4321
```

> 你的 `AGENTS.md` 里约定用后台模式：`astro dev --background`，配合 `astro dev logs` / `astro dev stop`。

---

# 批次 A · 品牌清理 + 中文本地化

## A0. 先给 frontmatter 加字段（后面都要用）

**`src/content.config.ts`** —— 整文件替换：

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			draft: z.boolean().default(false), // 新增：草稿
			tags: z.array(z.string()).default([]), // 新增：标签
		}),
});

export const collections = { blog };
```

> 旧文章不用改也能构建——`default()` 会自动补上 `draft: false` / `tags: []`。

## A1. 站点信息

**`src/consts.ts`** —— 整文件替换（把名字改成你的）：

```ts
// 站点全局信息：改这里，全站生效
export const SITE_TITLE = '糖油糍粑的blog';
export const SITE_DESCRIPTION = '记录学习、项目复盘与日常思考。';
export const SITE_AUTHOR = '糖油糍粑'; // ← 改成你的名字/昵称
export const SITE_URL = 'https://tangyou-blog.pages.dev'; // 绑自定义域名后，这里和 astro.config.mjs 一起改
```

## A2. 首页换成真正的首页

**`src/pages/index.astro`** —— 整文件替换：

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import FormattedDate from '../components/FormattedDate.astro';
import { getCollection } from 'astro:content';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';

const posts = (await getCollection('blog'))
	.filter((p) => !p.data.draft)
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	.slice(0, 5);
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />
		<main id="main-content">
			<h1>你好，我是{SITE_AUTHOR} 👋</h1>
			<p>{SITE_DESCRIPTION}</p>
			<p>
				<a href="/blog/">查看全部文章 →</a>
			</p>
			<hr />
			<h2>最新文章</h2>
			<ul class="post-list">
				{posts.map((post) => (
					<li>
						<a href={`/blog/${post.id}/`}>{post.data.title}</a>
						<span class="date">
							<FormattedDate date={post.data.pubDate} />
						</span>
					</li>
				))}
			</ul>
		</main>
		<Footer />
	</body>
</html>

<style>
	.post-list {
		list-style: none;
		padding: 0;
	}
	.post-list li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5em 0;
		border-bottom: 1px solid rgb(var(--gray-light));
	}
	.post-list .date {
		color: rgb(var(--gray));
		white-space: nowrap;
	}
</style>
```

## A3. About 页写真实内容

**`src/pages/about.astro`** —— 整文件替换（这样它也不再假借「博文」布局）：

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import { SITE_AUTHOR } from '../consts';
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title={`关于 · ${SITE_AUTHOR}`} description="关于我和这个博客" />
	</head>
	<body>
		<Header />
		<main id="main-content">
			<h1>关于</h1>
			<p>在这里写你是谁、在做什么、为什么写博客。</p>
			<p>
				联系方式：<a href="mailto:you@example.com">you@example.com</a>
			</p>
		</main>
		<Footer />
	</body>
</html>
```

## A4. 页脚换成你自己的

**`src/components/Footer.astro`** —— 把第 6 行和第 8/23/38 行替换：

第 6 行：

```astro
&copy; {today.getFullYear()} {SITE_AUTHOR}. All rights reserved.
```

顶部加 import：

```astro
---
import { SITE_AUTHOR } from '../consts';
const today = new Date();
---
```

三个社交 `<a>` 的 `href` 换成你的主页，并统一加 `rel`：

```astro
<a href="https://github.com/X-Daylily" target="_blank" rel="noopener noreferrer">
```

> 图标建议改成你真正在用的平台；不需要的直接删掉整段 `<a>…</a>`。

## A5. 导航中文化 + 社交链接

**`src/components/Header.astro`** —— 第 12–14 行：

```astro
<HeaderLink href="/">首页</HeaderLink>
<HeaderLink href="/blog">文章</HeaderLink>
<HeaderLink href="/about">关于</HeaderLink>
```

社交链接同 A4：换成你的 URL + `rel="noopener noreferrer"`。

## A6. 语言标记改成中文（3 处）

把 `lang="en"` 改成 `lang="zh-CN"`：

- `src/pages/index.astro`（A2 已包含）
- `src/pages/about.astro`（A3 已包含）
- `src/layouts/BlogPost.astro`（批次 B2 会替换）
- `src/pages/blog/index.astro`（批次 B 里改）

**一键检查有没有漏网：**

```powershell
Select-String -Path src\**\*.astro -Pattern 'lang="en"'
```

## A7. 日期中文化

**`src/components/FormattedDate.astro`** —— 第 10 行的 `'en-us'` 改成：

```astro
{date.toLocaleDateString('zh-CN', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
})}
```

效果：`2026年10月13日`

---

# 批次 B · SEO 与可发现性

## B1. 重写 BaseHead（og:type / twitter / author / noindex）

先准备一张 **1200×630 的默认分享图**，放到 `src/assets/og-default.jpg`。
（临时可先用现有的 `blog-placeholder-1.jpg`。）

**`src/components/BaseHead.astro`** —— 整文件替换：

```astro
---
import '../styles/global.css';
import type { ImageMetadata } from 'astro';
import FallbackImage from '../assets/og-default.jpg'; // 没有就改成 blog-placeholder-1.jpg
import { SITE_AUTHOR, SITE_TITLE } from '../consts';
import { Font } from 'astro:assets';

interface Props {
	title: string;
	description: string;
	image?: ImageMetadata;
	type?: 'website' | 'article';
	noindex?: boolean;
}

const {
	title,
	description,
	image = FallbackImage,
	type = 'website',
	noindex = false,
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL(image.src, Astro.site); // 统一用 Astro.site 拼绝对地址
---

<!-- 基础 -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" href="/favicon.ico" />
<link rel="sitemap" href="/sitemap-index.xml" />
<link
	rel="alternate"
	type="application/rss+xml"
	title={SITE_TITLE}
	href={new URL('rss.xml', Astro.site)}
/>
<meta name="generator" content={Astro.generator} />
<meta name="author" content={SITE_AUTHOR} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<Font cssVariable="--font-atkinson" preload />

<!-- Canonical -->
<link rel="canonical" href={canonicalURL} />

<!-- 主 meta -->
<title>{title}</title>
<meta name="description" content={description} />

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:locale" content="zh_CN" />
<meta property="og:site_name" content={SITE_TITLE} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

## B2. 重写文章布局（article + JSON-LD + 目录 + 阅读时长 + 上下篇）

**`src/layouts/BlogPost.astro`** —— 整文件替换：

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import FormattedDate from '../components/FormattedDate.astro';
import Header from '../components/Header.astro';
import { SITE_AUTHOR, SITE_TITLE } from '../consts';

interface PostLink {
	title: string;
	id: string;
}

interface Props extends CollectionEntry<'blog'>['data'] {
	headings?: MarkdownHeading[];
	readingTime?: string;
	prev?: PostLink | null;
	next?: PostLink | null;
}

const {
	title,
	description,
	pubDate,
	updatedDate,
	heroImage,
	headings = [],
	readingTime,
	prev,
	next,
	draft,
} = Astro.props;

const toc = headings.filter((h) => h.depth > 1 && h.depth <= 3);

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	headline: title,
	description,
	image: heroImage ? new URL(heroImage.src, Astro.site).href : undefined,
	datePublished: pubDate.toISOString(),
	dateModified: (updatedDate ?? pubDate).toISOString(),
	author: { '@type': 'Person', name: SITE_AUTHOR },
	publisher: { '@type': 'Organization', name: SITE_TITLE },
	mainEntityOfPage: new URL(Astro.url.pathname, Astro.site).href,
};
---
<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead
			title={title}
			description={description}
			image={heroImage}
			type="article"
			noindex={import.meta.env.PROD && draft}
		/>
		<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
		<style>
			main {
				width: calc(100% - 2em);
				max-width: 100%;
				margin: 0;
			}
			.hero-image {
				width: 100%;
			}
			.hero-image img {
				display: block;
				margin: 0 auto;
				border-radius: 12px;
				box-shadow: var(--box-shadow);
			}
			.prose {
				width: 720px;
				max-width: calc(100% - 2em);
				margin: auto;
				padding: 1em;
				color: rgb(var(--gray-dark));
			}
			.title {
				margin-bottom: 1em;
				padding: 1em 0;
				text-align: center;
				line-height: 1;
			}
			.title h1 {
				margin: 0 0 0.5em 0;
			}
			.date {
				margin-bottom: 0.5em;
				color: rgb(var(--gray));
			}
			.last-updated-on {
				font-style: italic;
			}
			.toc {
				margin: 2em 0;
				padding: 1em 1.5em;
				background: rgb(var(--gray-light) / 0.4);
				border-radius: 8px;
			}
			.toc h2 {
				margin: 0 0 0.5em 0;
				font-size: 1.1em;
			}
			.toc ul {
				margin: 0;
				padding-left: 1.2em;
			}
			.toc .toc-depth-3 {
				margin-left: 1em;
			}
			.post-nav {
				display: flex;
				justify-content: space-between;
				gap: 1em;
				margin-top: 3em;
				padding-top: 1.5em;
				border-top: 1px solid rgb(var(--gray-light));
			}
			.post-nav .next {
				margin-left: auto;
				text-align: right;
			}
		</style>
	</head>

	<body>
		<Header />
		<main id="main-content">
			<article>
				{heroImage && (
					<div class="hero-image">
						<Image
							src={heroImage}
							alt={title}
							priority
							layout="constrained"
							width={1020}
							height={510}
						/>
					</div>
				)}
				<div class="prose">
					<div class="title">
						<div class="date">
							<FormattedDate date={pubDate} />
							{readingTime && <span> · 约 {readingTime}</span>}
							{updatedDate && (
								<div class="last-updated-on">
									最后更新于 <FormattedDate date={updatedDate} />
								</div>
							)}
						</div>
						<h1>{title}</h1>
						<hr />
					</div>

					{toc.length > 0 && (
						<nav class="toc">
							<h2>目录</h2>
							<ul>
								{toc.map((h) => (
									<li class={`toc-depth-${h.depth}`}>
										<a href={`#${h.slug}`}>{h.text}</a>
									</li>
								))}
							</ul>
						</nav>
					)}

					<slot />

					{(prev || next) && (
						<nav class="post-nav">
							{prev && <a class="prev" href={`/blog/${prev.id}/`}>← {prev.title}</a>}
							{next && <a class="next" href={`/blog/${next.id}/`}>{next.title} →</a>}
						</nav>
					)}
				</div>
			</article>
		</main>
		<Footer />
	</body>
</html>
```

## B3. 文章路由：过滤草稿 + 传目录/阅读时长/上下篇

**`src/pages/blog/[...slug].astro`** —— 整文件替换：

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';
import { getReadingTime } from '../../utils/reading-time';

export async function getStaticPaths() {
	const posts = (await getCollection('blog'))
		.filter((post) => (import.meta.env.PROD ? !post.data.draft : true))
		.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());

	return posts.map((post, i) => ({
		params: { slug: post.id },
		props: {
			post,
			prev: posts[i - 1] ? { title: posts[i - 1].data.title, id: posts[i - 1].id } : null,
			next: posts[i + 1] ? { title: posts[i + 1].data.title, id: posts[i + 1].id } : null,
		},
	}));
}

type Props = {
	post: CollectionEntry<'blog'>;
	prev: { title: string; id: string } | null;
	next: { title: string; id: string } | null;
};

const { post, prev, next } = Astro.props;
const { Content, headings } = await render(post);
---

<BlogPost
	{...post.data}
	headings={headings}
	readingTime={getReadingTime(post.body)}
	prev={prev}
	next={next}
>
	<Content />
</BlogPost>
```

**`src/utils/reading-time.ts`** —— 新建：

````ts
// 粗略估算阅读时长：中文按字数、英文按词数
export function getReadingTime(body: string | undefined): string {
	if (!body) return '1 分钟';
	const text = body.replace(/```[\s\S]*?```/g, ''); // 去掉代码块
	const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
	const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
	const minutes = Math.max(1, Math.round(cjk / 350 + words / 200));
	return `${minutes} 分钟`;
}
````

## B4. 文章列表：中文 + 过滤草稿 + 响应式图片

**`src/pages/blog/index.astro`** —— 替换「frontmatter」「`<html lang>`」「`<main>`」三处：

frontmatter（第 10–12 行）：

```astro
const posts = (await getCollection('blog')) .filter((post) => !post.data.draft) .sort((a, b) =>
b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

`<html lang="en">` → `<html lang="zh-CN">`

`<main>` → `<main id="main-content">`

列表里的图片（第 97–99 行）改成：

```astro
{post.data.heroImage && (
	<Image
		src={post.data.heroImage}
		alt={post.data.title}
		layout="constrained"
		width={720}
		height={360}
	/>
)}
```

## B5. RSS：排序 + 语言

**`src/pages/rss.xml.js`** —— 整文件替换：

```js
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: '<language>zh-cn</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
		})),
	});
}
```

---

# 批次 C · 性能

## C1. 字体换 woff2（立省 30–50% 字体体积）

1. 下载 Atkinson Hyperlegible 的 **woff2**：
   - 官方仓库：`https://github.com/googlefonts/atkinson-hyperlegible`（或 Google Fonts 站点导出 woff2）
2. 放到 `src/assets/fonts/`，命名 `atkinson-regular.woff2`、`atkinson-bold.woff2`
3. 删掉旧的 `.woff`
4. **`astro.config.mjs`** 全文件替换：

```js
// @ts-check
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://tangyou-blog.pages.dev',
	prefetch: true, // 站内链接预取，跳转更快
	integrations: [
		mdx(),
		sitemap({
			// 排除不想被收录的页面（按需增删）
			filter: (page) => !page.endsWith('/about/'),
			serialize(item) {
				if (item.url.includes('/blog/')) {
					item.changefreq = ChangeFreqEnum.WEEKLY;
					item.priority = 0.8;
				} else {
					item.changefreq = ChangeFreqEnum.MONTHLY;
					item.priority = 0.5;
				}
				item.lastmod = new Date().toISOString();
				return item;
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			// 中文回退栈：让中文用系统中文字体
			fallbacks: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff2'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
```

## C2. 图片（B2 / B4 已包含）

- **头图**：`priority` → 自动 `loading="eager"` + `fetchpriority="high"`，改善 LCP
- **响应式**：`layout="constrained"` → 自动生成多尺寸 `srcset`
- 列表图给了有意义的 `alt`

---

# 批次 D · 无障碍 + 深色模式

## D1. 深色模式（改 `src/styles/global.css`）

把开头 `:root { ... }` 整块替换为：

```css
:root {
	--accent: #2337ff;
	--accent-dark: #000d8a;
	--black: 15, 18, 25;
	--gray: 70, 85, 120; /* 调深一点，保证正文对比度达 WCAG AA */
	--gray-light: 229, 233, 240;
	--gray-dark: 34, 41, 57;
	--gray-gradient: rgba(var(--gray-light), 50%), #fff;
	--surface: #ffffff; /* 顶栏/卡片底色 */
	--box-shadow:
		0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%),
		0 16px 32px rgba(var(--gray), 33%);
	color-scheme: light;
}

@media (prefers-color-scheme: dark) {
	:root {
		--accent: #8aa2ff;
		--accent-dark: #b6c4ff;
		--black: 236, 239, 245;
		--gray: 156, 168, 194;
		--gray-light: 42, 48, 62;
		--gray-dark: 222, 227, 236;
		--gray-gradient: rgba(var(--gray-light), 50%), #0f1219;
		--surface: #161a23;
		color-scheme: dark;
	}
	body {
		background-color: #0f1219;
	}
}
```

然后在文件**末尾**追加（焦点可见 + 跳到正文链接）：

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
	outline: 3px solid var(--accent);
	outline-offset: 2px;
	border-radius: 4px;
}

.skip-link {
	position: absolute;
	left: -9999px;
	top: 0;
	z-index: 100;
	background: var(--surface);
	color: rgb(var(--black));
	padding: 0.6em 1em;
	border: 1px solid rgb(var(--gray-light));
	border-radius: 0 0 6px 0;
}
.skip-link:focus {
	left: 0;
}
```

## D2. Header：底色用变量 + 跳到正文 + 移动端不再消失

**`src/components/Header.astro`** 做三处改动：

1. `<header>` 内第一行加跳转链接：

```astro
<header>
	<a href="#main-content" class="skip-link">跳到正文</a>
	<nav>
		...
```

2. 样式里 `background: white;` → `background: var(--surface);`

3. 删掉移动端隐藏社交链接的规则，改成缩小尺寸：

```css
@media (max-width: 720px) {
	.social-links svg {
		width: 24px;
		height: 24px;
	}
}
```

> 记得给所有 `target="_blank"` 的链接补上 `rel="noopener noreferrer"`（A4/A5 已提）。

## D3. 语义与结构（可选）

- Header 里站点名用了 `<h2>`，可改成 `<p class="site-title">` 避免和正文标题层级打架
- `<main>` 统一加 `id="main-content"`（A2/A3/B2/B4 已包含）

---

# 批次 E · 内容与写作体验

## E1. 草稿 / 标签（A0 已加字段）

用法：

```md
---
title: '我的新文章'
description: '一句话摘要'
pubDate: '2026-10-15'
draft: true # 本地可见，线上构建自动排除 + noindex
tags: ['astro', '笔记']
---
```

## E2. 目录 / 阅读时长 / 上下篇

已在 **B2 + B3** 实现，无需额外操作。

## E3. 标签页（可选）

**`src/pages/tags/[tag].astro`** —— 新建：

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import Footer from '../../components/Footer.astro';
import FormattedDate from '../../components/FormattedDate.astro';
import Header from '../../components/Header.astro';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
	return tags.map((tag) => ({
		params: { tag },
		props: { posts: posts.filter((p) => p.data.tags.includes(tag)) },
	}));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title={`标签：${tag}`} description={`标签 ${tag} 下的全部文章`} />
	</head>
	<body>
		<Header />
		<main id="main-content">
			<h1>标签：{tag}</h1>
			<ul>
				{posts.map((post) => (
					<li>
						<a href={`/blog/${post.id}/`}>{post.data.title}</a>
						<FormattedDate date={post.data.pubDate} />
					</li>
				))}
			</ul>
		</main>
		<Footer />
	</body>
</html>
```

在文章页显示标签（`BlogPost.astro` 的标题区加）：

```astro
{tags.length > 0 && (
	<ul class="tags">
		{tags.map((tag) => (
			<li>
				<a href={`/tags/${tag}/`}>#{tag}</a>
			</li>
		))}
	</ul>
)}
```

（记得从 `Astro.props` 里解构出 `tags`。）

## E4. 代码高亮主题（可选）

**`astro.config.mjs`** 里加：

```js
export default defineConfig({
	// ...
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
	},
});
```

想要自动适配明暗主题，可用 `themes: { light: 'github-light', dark: 'github-dark' }`。

---

# 批次 F · 工程结构

## F1. 抽出重复的社交链接组件

**`src/components/SocialLinks.astro`** —— 新建，把 `Header.astro` 与 `Footer.astro` 里重复的那三个 `<a>…</a>` 剪进来：

```astro
---
// 只保留一份社交链接，Header 和 Footer 都引用它
---

<div class="social-links"><!-- 把原来的三个 <a>…</a> 粘到这里，href 改成你的 --></div>
```

Header/Footer 里改成：

```astro
import SocialLinks from './SocialLinks.astro'; ...
<SocialLinks />
```

## F2. 加类型检查 + 格式化

```powershell
npm i -D @astrojs/check typescript prettier prettier-plugin-astro
```

**`package.json`** 的 `scripts` 加：

```json
"check": "astro check",
"format": "prettier --write ."
```

**`.prettierrc`** —— 新建（沿用当前代码的 tab 缩进）：

```json
{
	"useTabs": true,
	"semi": true,
	"singleQuote": true,
	"printWidth": 100,
	"plugins": ["prettier-plugin-astro"],
	"overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

## F3. 加 CI（可选，保证每次提交都能构建）

**`.github/workflows/ci.yml`** —— 新建：

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
```

## F4. 清理

- `README.md`：把 Astro 模板说明改成你的项目介绍
- `CLAUDE.md`：是 0 字节空文件，删掉或写点内容
- `.gitignore`：补一行 `.wrangler/`
- `.nvmrc` 是 `22.12.0`，你本地是 Node 24 —— 建议统一（Cloudflare Pages 里也设置成同一个版本）

---

# 收尾自检清单

改完后逐项确认：

```powershell
npm run check          # 类型检查通过
npm run build          # 构建通过
npm run preview        # 本地预览成品
```

- [x] 首页 / 关于 / 页脚 / 社交链接都是你自己的内容
- [x] `lang="zh-CN"` 无遗漏、日期显示为中文
- [x] 文章页分享预览是 `article` 类型且带正确 OG 图
- [x] 构建产物里没有 draft 文章，draft 带 `noindex`
- [x] 暗色系统下页面可读、不刺眼
- [x] Tab 键能看见焦点、有「跳到正文」
- [x] 字体是 `.woff2`、头图是 eager/fetchpriority high

---

## 需要补充的信息

批次 A 里这几处已于 2026-10-18 填好：

1. **名字/昵称** → `src/consts.ts` 的 `SITE_AUTHOR`：糖油糍粑
2. **社交链接** → `src/consts.ts` 的 `SOCIALS`（GitHub + RSS，增删改这一个数组即可）
3. **站点简介** → `SITE_DESCRIPTION`

---

# 批次 G · 工程化与部署加固（2026-10-18 已完成）

> 这一批是后来补做的；和前面 A–F 的代码冲突时，以这一批为准。

## G1. 类型检查 + 格式化

```powershell
npm run check          # astro check
npm run format         # Prettier 格式化
npm run format:check   # 只检查不改文件（CI 用）
```

配置在 `.prettierrc`：tab 缩进、单引号、`printWidth: 100`、Astro 插件。

## G2. CI

`.github/workflows/ci.yml`：push 到 `main` 或开 PR 时自动执行 `npm ci` → `npm run check` → `npm run build`。构建失败会直接标在提交旁边。

## G3. 部署缓存与安全头

`public/_headers` 会被 Cloudflare Pages 自动读取：

- `/_astro/*`：一年 `immutable` 强缓存（文件名带哈希，内容变则换名）
- `sitemap.xml` / `rss.xml`：1 小时
- 全站：`nosniff`、`SAMEORIGIN`、`strict-origin-when-cross-origin`、关闭地理定位等权限

## G4. 站点地图改为自定义路由

`@astrojs/sitemap` 已移除（不要再加回来）。改用 `src/pages/sitemap.xml.ts`：

- 文章用真实的 `pubDate` / `updatedDate` 作为 `lastmod`
- 列表页、标签页取该页最新文章的日期
- 静态页（关于）不写 `lastmod`，避免每次构建都告诉搜索引擎「全站更新」

`robots.txt` 与 `BaseHead` 里的 sitemap 地址已同步为 `/sitemap.xml`。

## G5. 结构化数据

- 首页：`WebSite` + `Person`（`sameAs` 取自 `SOCIALS` 中的外链）
- 文章页：`BlogPosting` + `BreadcrumbList`，带 `inLanguage` / `keywords` / `isPartOf`

## G6. 其他修复

- `/tags/` 之前会把草稿文章的标签也统计进去（点开却是 404），已过滤 draft
- `SOCIALS` 增加 `SocialIcon` 类型，以后加 `mail` 图标不会再类型报错
- 站内 RSS 链接不再 `target="_blank"`
- 导航当前页加 `aria-current="page"`
- 删除 starter 遗留的 6 张未使用占位图（约 190 KB）
- 删除空的 `CLAUDE.md`

# 批次 H · 漂浮美食背景（2026-10-18 已完成）

> 对应需求：「博客周围再铺上一些漂浮的美食」。

新增 **`src/components/FloatingFood.astro`**，由 `Header.astro` 的环境层（`.ambient`）引入，全站生效。

## H1. 做法

- 6 种手绘 SVG：糖油糍粑 / 糖葫芦 / 包子 / 饺子 / 奶茶 / 月饼，统一 32×32 线稿
- 14 个位置 + 4 颗四角星，位置用正弦伪随机（确定性），每次构建不跳位
- 三层动效：
  - `food-float`：22–38 秒一次的缓慢上下浮动 + 轻微旋转
  - `food-breathe`：7–12 秒的明暗呼吸
  - `spark-twinkle`：星星明灭
- 鼠标视差：`Header` 的 `pointermove` 更新 `--px/--py`，远景图标位移更小（`--depth: .55`），有前后层次
- 每个图标背后一团径向柔光（`::before`），暗色主题自动提亮（`--mul: 1.2`）

## H2. 响应式

| 宽度     | 表现                                                 |
| -------- | ---------------------------------------------------- |
| > 1180px | 14 个 + 4 颗星全开                                   |
| ≤ 1180px | 隐藏内圈 6 个，避免压到 720px 正文                   |
| ≤ 720px  | 只留四角 4 个，位置/尺寸单独用 `--mx/--my/--ms` 控制 |

`prefers-reduced-motion: reduce` 下所有动画停止，视差脚本也不启动。

## H3. 想自己调

- **数量/位置**：`FloatingFood.astro` 的 `SLOTS`（`x/y` 是视口百分比，`far` 是远景，`inner` 是窄屏隐藏）
- **大小**：`size`（桌面）/ `ms`（手机）
- **浓淡**：`items` 里的 `op` 计算；暗色是 `--mul: 1.2`，手机是 `0.72`
- **漂浮幅度/速度**：`--dx/--dy`、`--dur`、`--breathe`
- **视差强度**：脚本里的 `* 26` / `* 18`（像素）

## 维护提醒

- 新增文章不用手改 sitemap，构建时自动收录
- 换域名：同时改 `astro.config.mjs` 的 `site` 和 `src/consts.ts` 的 `SITE_URL`
- Cloudflare Pages：构建命令 `npm run build`，输出目录 `dist`
