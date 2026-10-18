import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';

type Entry = {
	path: string;
	lastmod?: string;
	changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
	priority: string;
};

const toDate = (date: Date | undefined) => (date ? date.toISOString() : undefined);

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL(SITE_URL);

	const posts = (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const latestPost = posts[0];
	const latestDate = toDate(latestPost?.data.updatedDate ?? latestPost?.data.pubDate);

	const tags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();

	const entries: Entry[] = [
		{ path: '/', lastmod: latestDate, changefreq: 'daily', priority: '1.0' },
		{ path: '/blog/', lastmod: latestDate, changefreq: 'daily', priority: '0.9' },
		{ path: '/about/', changefreq: 'yearly', priority: '0.5' },
		{ path: '/tags/', changefreq: 'weekly', priority: '0.4' },
		...posts.map((post) => ({
			path: `/blog/${post.id}/`,
			lastmod: toDate(post.data.updatedDate ?? post.data.pubDate),
			changefreq: 'monthly' as const,
			priority: '0.8',
		})),
		...tags.map((tag) => {
			const tagged = posts.filter((post) => post.data.tags.includes(tag));
			const newest = tagged[0];
			return {
				path: `/tags/${tag}/`,
				lastmod: toDate(newest?.data.updatedDate ?? newest?.data.pubDate),
				changefreq: 'weekly' as const,
				priority: '0.3',
			};
		}),
	];

	const body = entries
		.map((entry) => {
			const loc = new URL(entry.path, base).href;
			const parts = [
				`<loc>${loc}</loc>`,
				entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '',
				`<changefreq>${entry.changefreq}</changefreq>`,
				`<priority>${entry.priority}</priority>`,
			];
			return `	<url>${parts.filter(Boolean).join('')}</url>`;
		})
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
		{
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
			},
		},
	);
};
