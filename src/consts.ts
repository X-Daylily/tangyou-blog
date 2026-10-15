// 站点全局信息：改这里，全站生效
export const SITE_TITLE = '糖油糍粑的blog';
export const SITE_DESCRIPTION = '记录学习、项目复盘与日常思考。';
export const SITE_AUTHOR = '糖油糍粑';

// 站点根地址（绑自定义域名后，记得和 astro.config.mjs 的 site 一起改）
export const SITE_URL = 'https://tangyou-blog.pages.dev';

// 顶部/页脚的社交入口：想增删就改这个数组，
// 可用图标见 src/components/SocialLinks.astro（github / rss / mail）
export const SOCIALS = [
	{ label: 'GitHub', href: 'https://github.com/X-Daylily', icon: 'github' },
	{ label: 'RSS', href: '/rss.xml', icon: 'rss' },
] as const;
