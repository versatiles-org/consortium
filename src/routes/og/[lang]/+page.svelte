<!--
  The Open Graph sharing card, 1200×630. This page is not for humans: `npm run build`
  prerenders it and scripts/og-shot.js screenshots it into static-served og-image.<lang>.jpg.
  It is a route rather than a standalone HTML file so that it uses the same brand tokens,
  the same Inter webfont and the same content pipeline as the site — the text comes from
  src/content/<lang>/ui.yaml (meta.ogImage) and cannot drift from og:image:alt.

  To preview while editing: `npm run dev` → http://localhost:5173/og/de
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { siteUrl } from '$lib/content.js';
	import bg from '$lib/assets/og-bg.jpg';

	let { data } = $props();
	const og = $derived(data.og);

	const urlLabel = siteUrl.replace(/^https?:\/\//, '');
</script>

<svelte:head>
	<title>OG card</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="card" style="--bg-image: url({bg})">
	<div class="bg"></div>
	<div class="scrim"></div>

	<!-- base, not siteUrl: this is screenshotted from the local build, which is not deployed yet. -->
	<img class="logo" src="{base}/versatiles.svg" alt="" />

	<div class="main">
		<h1>
			<span class="line line--strong">{og.line1}</span>
			<span class="line line--muted">{og.line2}</span>
			<!-- Back to full white: the contrast between "everyone uses it" and
			     "somebody pays for it" is the whole argument. -->
			<span class="line line--strong">{og.line3}</span>
		</h1>
		<p class="sub">{og.sub}</p>
	</div>

	<footer>{urlLabel}</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
		line-height: 1;
	}

	.card {
		position: relative;
		width: 1200px;
		height: 630px;
		padding: 72px 80px;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		font-family: var(--font-heading);
	}

	.bg {
		position: absolute;
		inset: 0;
		background: var(--bg-image) center / cover;
		filter: saturate(0.9) brightness(0.86);
	}

	/* Dark at the top where the type sits, map emerging towards the bottom. A horizontal
	   scrim would need to be so heavy that the map turns into noise. */
	.scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgb(27 27 31 / 100%) 0%, rgb(27 27 31 / 50%) 100%),
			radial-gradient(680px 320px at 42% -10%, rgb(157 53 255 / 24%), transparent 70%);
	}

	.logo,
	.main,
	footer {
		position: relative;
	}

	.logo {
		align-self: flex-start; /* the card is a flex column: without this the img stretches */
		width: auto;
		height: 70px;
	}

	/* Two-part shadow: a tight one for edge contrast, a wide halo to lift the type off
	   whatever map detail still shows through. A single soft glow does neither well. */
	h1 {
		margin: 36px 0 0;
		font-size: 52px;
		line-height: 1.3;
		font-weight: 700;
		letter-spacing: -0.015em;
		text-shadow:
			0 1px 2px rgb(0 0 0 / 60%),
			0 4px 30px rgb(0 0 0 / 85%);
	}
	.line {
		display: block;
	}
	.line--strong {
		color: var(--text-strong);
	}
	.line--muted {
		color: var(--text-muted);
	}

	.sub {
		margin: 30px 0 0;
		font-size: 28px;
		font-weight: 600;
		color: #c180ff;
		text-shadow:
			0 1px 2px rgb(0 0 0 / 70%),
			0 4px 24px rgb(0 0 0 / 90%);
	}

	footer {
		position: absolute;
		bottom: 30px;
		right: 30px;
		font-size: 25px;
		font-weight: 500;
		color: var(--text-strong);
		text-shadow:
			0 0 3px rgb(0 0 0 / 75%),
			0 0 14px rgb(0 0 0 / 50%);
	}
</style>
