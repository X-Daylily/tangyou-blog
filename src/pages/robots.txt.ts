import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL(SITE_URL);
	const sitemap = new URL('sitemap.xml', base);

	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
