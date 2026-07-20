<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { locales } from '$lib/content.js';

	// Static site: pick the language client-side from the browser, then redirect.
	// Prefer German; otherwise the first available locale (English is currently off).
	onMount(() => {
		const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
		const prefersDe = langs.some((l) => l?.toLowerCase().startsWith('de'));
		const pick = prefersDe ? 'de' : 'en';
		const target = (locales as string[]).includes(pick) ? pick : locales[0];
		goto(`${base}/${target}`, { replaceState: true });
	});
</script>

<svelte:head>
	<title>VersaTiles Consortium</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="redirect">
	<p>Weiterleitung … / Redirecting …</p>
	<noscript>
		<p>
			{#each locales as l (l)}<a href="{base}/{l}">{l}</a>
			{/each}
		</p>
	</noscript>
</div>

<style>
	.redirect {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
	}
</style>
