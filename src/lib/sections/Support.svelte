<script lang="ts">
	import { donate } from '$lib/content.js';
	import { ext } from '$lib/links.js';
	import type { Copy } from '$lib/copy.js';

	let { t }: { t: Copy['support'] } = $props();
</script>

<section id="support" class="support">
	<div class="container container--narrow">
		<h2>{t.heading}</h2>
		<p>{t.text}</p>
		<div class="support__buttons">
			<a class="btn btn--primary" href={donate.githubSponsors} {...ext(donate.githubSponsors)}>GitHub Sponsors</a>
			<a class="btn btn--primary" href={donate.openCollective} {...ext(donate.openCollective)}>Open Collective</a>
		</div>
	</div>
</section>

<style>
	.support {
		padding: clamp(3rem, 6vw, 4.5rem) 0;
		text-align: center;
		border-top: 1px solid var(--line);
	}
	.support h2 {
		font-size: clamp(1.4rem, 3vw, 1.9rem);
	}
	.support p {
		max-width: 46rem;
		margin: 0 auto;
		color: var(--text);
	}
	.support__buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}
</style>
