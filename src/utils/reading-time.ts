/**
 * 粗略估算阅读时长：中文按字数、英文按词数。
 * 代码块不计入。
 */
export function getReadingTime(body: string | undefined): string {
	if (!body) return '1 分钟';

	const text = body.replace(/```[\s\S]*?```/g, '');
	const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
	const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
	const minutes = Math.max(1, Math.round(cjk / 350 + words / 200));

	return `${minutes} 分钟`;
}
