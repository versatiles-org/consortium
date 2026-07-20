<script lang="ts">
	import { base } from '$app/paths';
	import { ext } from '$lib/links.js';
	import type { Locale } from '$lib/content.js';

	interface FooterCopy {
		text: string;
		fix: string;
		repo: string;
		letter: string;
	}

	let { t, lang }: { t: FooterCopy; lang: Locale } = $props();

	const repoUrl = 'https://github.com/versatiles-org/consortium';
	const letterUrl = $derived(`${repoUrl}/blob/main/src/content/${lang}/letter.md`);
</script>

<footer class="site-footer">
	<div class="container">
		<a href="https://versatiles.org" aria-label="VersaTiles"><img src="{base}/versatiles.svg" alt="VersaTiles" /></a>
		<p>{t.text} · <a href="https://versatiles.org">versatiles.org</a></p>
		<p class="source">
			{t.fix}
			<a href={repoUrl} {...ext(repoUrl)}>{t.repo}</a>
			· <a href={letterUrl} {...ext(letterUrl)}>{t.letter}</a>
		</p>
	</div>
</footer>

<style>
	.site-footer {
		padding: 2.5rem 0 3.5rem;
		border-top: 1px solid var(--line);
		color: var(--text-muted);
		font-size: 0.9rem;
	}
	.site-footer .container {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}
	.site-footer img {
		height: 28px;
		width: auto;
	}
	.site-footer .source {
		margin-left: auto;
	}
</style>
