// @ts-check

import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://tangyou-blog.pages.dev',
	// 站内链接预取，跳转更快
	prefetch: true,
	integrations: [
		mdx(),
		sitemap({
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
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			// 中文回退栈
			fallbacks: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
