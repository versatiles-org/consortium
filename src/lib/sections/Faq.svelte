<script lang="ts">
	import Rich from '$lib/Rich.svelte';
	import type { Copy } from '$lib/copy.js';

	let { t }: { t: Copy['faq'] } = $props();
</script>

<!--
  The FAQ is aimed at the person who has to defend this internally: money, commitment,
  risk, what you get, who decides. Native <details>, so it works without JavaScript and
  is searchable in-page by the browser.
-->
<section id="faq" class="faq">
	<div class="container container--narrow">
		<h2>{t.heading}</h2>

		<ul class="faq__list">
			{#each t.items as item (item.q)}
				<li>
					<details>
						<summary>{item.q}</summary>
						<div class="answer"><Rich text={item.a} /></div>
					</details>
				</li>
			{/each}
		</ul>

		<p class="faq__contact">
			{t.contactText}
			<a href="mailto:mail@versatiles.org?subject=FAQ">{t.contactCta}</a>
		</p>
	</div>
</section>

<style>
	.faq {
		padding: clamp(3rem, 6vw, 4.5rem) 0;
		border-top: 1px solid var(--line);
	}
	.faq h2 {
		font-size: clamp(1.5rem, 3.5vw, 2.1rem);
		margin-bottom: 1.5rem;
	}
	.faq__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.faq__list li {
		border-bottom: 1px solid var(--line);
	}
	.faq__list li:first-child {
		border-top: 1px solid var(--line);
	}

	summary {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		padding: 1rem 0;
		cursor: pointer;
		font-family: var(--font-heading);
		font-weight: 600;
		color: var(--text-strong);
		list-style: none; /* the default marker sits badly next to a flex row */
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::before {
		content: '+';
		flex: none;
		width: 1rem;
		color: var(--purple);
		font-weight: 700;
	}
	details[open] summary::before {
		content: '–';
	}
	summary:hover {
		color: var(--purple);
	}

	/* :global, because <Rich> renders these in its own component scope. */
	.answer {
		margin: 0 0 1.1rem 1.75rem; /* aligns with the question, past the +/– marker */
		color: var(--text);
	}
	.answer :global(p) {
		margin: 0 0 0.7rem;
	}
	.answer :global(p:last-child) {
		margin-bottom: 0;
	}
	.answer :global(ol) {
		margin: 0;
		padding-left: 1.2rem;
	}
	.answer :global(li) {
		margin-bottom: 0.5rem;
	}
	.answer :global(li:last-child) {
		margin-bottom: 0;
	}

	.faq__contact {
		margin-top: 1.75rem;
		color: var(--text-muted);
	}
	.faq__contact a {
		color: var(--text-strong);
	}
</style>
