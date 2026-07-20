<script lang="ts">
	import Lines from '$lib/Lines.svelte';
	import type { Copy } from '$lib/copy.js';

	let { t }: { t: Copy['hero'] } = $props();
</script>

<header class="hero">
	<div class="container">
		<p class="kicker">{t.kicker}</p>
		<h1>
			<span class="hero__title"><Lines text={t.title1} /></span>
			<span class="hero__accent"><Lines text={t.title2} /></span>
		</h1>
		<p class="lead"><Lines text={t.lead} /></p>
		<!--
		<div class="actions">
			<a class="btn btn--primary" href="#aufruf">{t.ctaPrimary}</a>
			<a class="btn btn--ghost" href={contact.versatiles}>{t.ctaSecondary}</a>
		</div>
		-->
	</div>
</header>

<style>
	.hero {
		position: relative;
		padding: clamp(3rem, 8vw, 5.5rem) 0 clamp(2.5rem, 6vw, 4rem);
		text-align: center;
		overflow: hidden;
	}
	.hero::before {
		content: '';
		position: absolute;
		inset: -40% 0 auto 0;
		height: 500px;
		background: radial-gradient(600px 300px at 50% 0, rgba(157, 53, 255, 0.14), transparent 70%);
		pointer-events: none;
	}
	.hero .container {
		position: relative;
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--purple);
		margin: 0 0 1rem;
	}
	.hero h1 {
		font-size: clamp(2rem, 5.5vw, 3.3rem);
		max-width: 22ch;
		margin-inline: auto;
	}
	/* Both title parts sit on their own line (this replaces the former <br>). */
	.hero__title,
	.hero__accent {
		display: block;
	}
	.hero__accent {
		margin-top: 0.35em;
		font-size: 0.62em;
		color: var(--text-muted);
		font-weight: 600;
	}
	.lead {
		font-size: clamp(1.05rem, 2.2vw, 1.25rem);
		color: var(--text);
		max-width: 58ch;
		margin: 1.25rem auto 0;
	}
	/*
	.hero .actions {
		justify-content: center;
	}
	*/
</style>
