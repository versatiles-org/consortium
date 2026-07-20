<script lang="ts">
	import { base } from '$app/paths';
	import { heroVisual } from '$lib/content.js';

	let heroVideoEl: HTMLVideoElement | undefined = $state();
	// The loop autoplays natively (autoplay + muted + playsinline), so it also runs
	// without JavaScript. JS is only used to *stop* it for users who asked for
	// reduced motion — i.e. progressive enhancement, not a requirement.
	$effect(() => {
		if (heroVideoEl && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			heroVideoEl.pause();
		}
	});
</script>

{#if heroVisual.src || heroVisual.poster}
	<section class="hero-visual-wrap">
		<div class="container">
			<figure class="hero-visual">
				{#if heroVisual.src}
					<video
						bind:this={heroVideoEl}
						autoplay
						muted
						loop
						playsinline
						poster={heroVisual.poster ? `${base}/${heroVisual.poster}` : undefined}
					>
						<source
							src={heroVisual.src.startsWith('http') ? heroVisual.src : `${base}/${heroVisual.src}`}
							type="video/mp4"
						/>
					</video>
				{:else}
					<img src="{base}/{heroVisual.poster}" alt="VersaTiles: Karten von Straße über Satellit bis 3D" />
				{/if}
				<img class="hero-visual__logo" src="{base}/versatiles.svg" alt="" aria-hidden="true" />
			</figure>
		</div>
	</section>
{/if}

<style>
	.hero-visual-wrap {
		padding-bottom: clamp(2rem, 5vw, 3.5rem);
	}
	.hero-visual {
		position: relative;
		margin: 0;
		border-radius: 14px;
		background: var(--brand-gradient);
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}
	@media (min-width: 720px) {
		.hero-visual {
			aspect-ratio: 21 / 9;
		}
	}
	.hero-visual > video {
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		object-fit: cover;
		border-radius: 12px;
		background: #000;
	}
	/* VersaTiles brand mark, over the loop */
	.hero-visual .hero-visual__logo {
		position: absolute;
		top: 0;
		left: 0;
		width: 8%;
		aspect-ratio: 1;
		object-fit: contain;
		border-radius: 0;
		background: none;
		transform: translate(20%, 20%);
		filter: drop-shadow(0 0px 10px rgba(0, 0, 0, 0.5));
		pointer-events: none;
		z-index: 2;
	}

	/* Mobile: full-bleed video – no side gaps, no gradient frame, no rounded corners */
	@media (max-width: 719px) {
		.hero-visual {
			margin-inline: -1.5rem;
			border-radius: 0;
		}
		.hero-visual > video {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 0;
		}
	}
</style>
