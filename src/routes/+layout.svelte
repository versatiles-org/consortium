<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { locales } from '$lib/content.js';
	import interFont from '$lib/fonts/inter-latin.woff2?url';
	import '../styles/global.scss';

	let { children } = $props();

	const lang = $derived(page.params.lang);
	const hash = $derived(page.url.hash);

	// /og/<lang> is the sharing-card renderer (screenshotted at build time, see
	// scripts/og-shot.js). It is a bare canvas — no site chrome.
	const isOgCard = $derived(page.route.id === '/og/[lang]');

	// Collapsed <details> (the FAQ) print empty — a browser hides their content in a way
	// CSS `display` can't override. So open them all while printing and restore after.
	// matchMedia('print') covers Safari too (it fires beforeprint unreliably). Progressive:
	// without JS the FAQ just prints collapsed.
	$effect(() => {
		const mq = window.matchMedia('print');
		const sync = (matches: boolean) => {
			if (matches) {
				for (const d of document.querySelectorAll<HTMLDetailsElement>('details:not([open])')) {
					d.dataset.printReopen = '';
					d.open = true;
				}
			} else {
				for (const d of document.querySelectorAll<HTMLDetailsElement>('details[data-print-reopen]')) {
					delete d.dataset.printReopen;
					d.open = false;
				}
			}
		};
		const onChange = (e: MediaQueryListEvent) => sync(e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
</script>

<svelte:head>
	<!-- Headings swap to Inter; preloading keeps the hero from reflowing after first paint. -->
	<link rel="preload" href={interFont} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#if !isOgCard}
	<header class="site-nav">
		<nav>
			<a class="site-nav__logo" href="https://versatiles.org" aria-label="VersaTiles">
				<img src="{base}/versatiles.svg" alt="VersaTiles" />
			</a>
			{#if lang && locales.length > 1}
				<div class="lang">
					<a href="{base}/de{hash}" class:active={lang === 'de'}>Deutsch</a>
					<span class="lang__sep">/</span>
					<a href="{base}/en{hash}" class:active={lang === 'en'}>English</a>
				</div>
			{/if}
		</nav>
	</header>
{/if}

{@render children()}

<style>
	/* ---- Site nav ---- */
	.site-nav nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: 76px;
	}
	.site-nav__logo {
		display: flex;
		align-items: center;
		height: 100%;
		aspect-ratio: 1 / 1;
		text-decoration: none;
		justify-content: center;
	}
	.site-nav__logo img {
		height: 50px;
		width: auto;
		display: block;
	}
	.lang {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
	}
	.lang a {
		text-decoration: none;
		color: var(--text-muted);
	}
	.lang a:hover {
		color: var(--text-strong);
	}
	.lang a.active {
		color: var(--text-strong);
		font-weight: 600;
	}
	.lang__sep {
		color: var(--line);
	}
</style>
