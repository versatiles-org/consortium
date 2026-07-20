<script lang="ts">
	import { siteUrl, locales } from '$lib/content.js';
	import Hero from '$lib/sections/Hero.svelte';
	import HeroVisual from '$lib/sections/HeroVisual.svelte';
	import Banner from '$lib/sections/Banner.svelte';
	import Letter from '$lib/sections/Letter.svelte';
	import Demos from '$lib/sections/Demos.svelte';
	import Support from '$lib/sections/Support.svelte';
	import Faq from '$lib/sections/Faq.svelte';
	import SiteFooter from '$lib/sections/SiteFooter.svelte';

	let { data } = $props();
	const t = $derived(data.t);
	const lang = $derived(data.lang);
</script>

<svelte:head>
	<title>{t.meta.title}</title>
	<meta name="description" content={t.meta.description} />
	<!-- hreflang must be fully-qualified (relative URLs are ignored), so these use siteUrl, not base. -->
	{#each locales as l (l)}
		<link rel="alternate" hreflang={l} href="{siteUrl}/{l}" />
	{/each}
	<link rel="alternate" hreflang="x-default" href="{siteUrl}/{locales[0]}" />
	<link rel="canonical" href="{siteUrl}/{lang}" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="VersaTiles" />
	<meta property="og:locale" content={lang === 'de' ? 'de_DE' : 'en_GB'} />
	<meta property="og:title" content={t.meta.title} />
	<meta property="og:description" content={t.meta.description} />
	<meta property="og:url" content="{siteUrl}/{lang}" />
	<!-- 1200×630 (1.91:1) – the ratio Facebook/LinkedIn/X render without cropping. The image
	     carries text, so it is per-locale; it is rendered from /og/{lang} at build time
	     (see scripts/og-shot.js), which is also where meta.ogImageAlt comes from. -->
	<meta property="og:image" content="{siteUrl}/og-image.{lang}.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={t.meta.ogImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- 1 — Hero -->
<Hero t={t.hero} />
<HeroVisual />

<!-- 2 — Aufruf-Banner mit Live-Zähler -->
<Banner t={t.banner} {lang} />

<!-- 3 — Offener Brief (mit Kostendiagramm) -->
<Letter letter={t.letter} chart={t.chart} {lang} />

<!-- 4 — FAQ -->
<Faq t={t.faq} />

<!-- 5 — Tech-Demos -->
<Demos t={t.demos} />

<!-- 6 — Direkte Unterstützung -->
<Support t={t.support} />

<SiteFooter t={t.footer} {lang} />
