<script lang="ts">
	// Renders a copy string with the small markup from rich.ts (paragraphs, numbered
	// lists, links) as real elements — no {@html}, so escaping and scoped CSS both work.
	// The caller styles the output from its own <style> block.
	import { parseRich } from '$lib/rich.js';
	import { ext } from '$lib/links.js';

	let { text }: { text: string } = $props();

	const blocks = $derived(parseRich(text));
</script>

{#each blocks as block, i (i)}
	{#if block.type === 'ol'}
		<ol>
			{#each block.items as parts, j (j)}
				<li>
					{#each parts as part, k (k)}
						{#if part.href}<a href={part.href} {...ext(part.href)}>{part.text}</a>{:else}{part.text}{/if}
					{/each}
				</li>
			{/each}
		</ol>
	{:else}
		<p>
			{#each block.parts as part, k (k)}
				{#if part.href}<a href={part.href} {...ext(part.href)}>{part.text}</a>{:else}{part.text}{/if}
			{/each}
		</p>
	{/if}
{/each}
