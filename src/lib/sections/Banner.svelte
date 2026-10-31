<script lang="ts">
	import Lines from '#lib/Lines.svelte';
	import { MEMBER_TARGET, foundingMembers, type FoundingMember } from '#lib/content.js';
	import { ext } from '#lib/links.js';
	import type { Copy } from '#lib/copy.js';

	let { t }: { t: Copy['banner'] } = $props();

	// Visual counter: one slot per target seat, filled in join order.
	const slots = Array.from({ length: MEMBER_TARGET }, (_, i) => foundingMembers[i] ?? null);
	const filled = foundingMembers.length;
</script>

<section id="aufruf" class="banner">
	<div class="container">
		<h2><Lines text={t.heading} /></h2>

		<!-- A taken seat shows the member's logo and links to it; the logo's alt text names the
		     link. The empty seats are decoration – the count below says the same in words. -->
		{#snippet seat(member: FoundingMember)}
			{#if member.logo}
				<img class="slot__logo" src={member.logo} alt={member.name ?? ''} />
			{:else}
				<span class="slot__name">{member.name ?? '✓'}</span>
			{/if}
		{/snippet}

		<div class="counter">
			{#each slots as member, i (i)}
				{#if member?.url}
					<a class="slot slot--filled" class:slot--logo={member.logo} href={member.url} {...ext(member.url)}
						>{@render seat(member)}</a
					>
				{:else if member}
					<div class="slot slot--filled" class:slot--logo={member.logo}>{@render seat(member)}</div>
				{:else}
					<div class="slot" aria-hidden="true"><span class="slot__num">{i + 1}</span></div>
				{/if}
			{/each}
		</div>
		<p class="counter__count"><strong>{filled} / {MEMBER_TARGET}</strong> {t.countLabel}</p>
	</div>
</section>

<style>
	.banner {
		padding: clamp(2.5rem, 6vw, 4rem) 0;
		background: #17171a;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		text-align: center;
	}
	.banner h2 {
		font-size: clamp(1.3rem, 3vw, 1.85rem);
		max-width: 32ch;
		margin-inline: auto;
	}
	.counter {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
		margin: 1.75rem 0 0.75rem;
	}
	/* narrow (3 cols): centre the lone last slot – 10 slots → rows of 3, 3, 3, 1 */
	@media (max-width: 559.98px) {
		.slot:last-child:nth-child(3n + 1) {
			grid-column: 2;
		}
	}
	@media (min-width: 560px) {
		.counter {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
	@media (min-width: 840px) {
		.counter {
			grid-template-columns: repeat(10, minmax(0, 1fr));
		}
	}
	.slot {
		aspect-ratio: 3 / 2;
		min-width: 0;
		overflow: hidden;
		border: 2px dashed var(--line);
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0.4rem;
		color: var(--text-muted);
	}
	.slot--filled {
		border: 0;
		background: var(--accept);
		color: var(--text-strong);
	}
	/* A logo brings its own background, so it fills the whole slot. */
	.slot--logo {
		padding: 0;
	}
	/* A seat that links to its member: no underline (the logo is the label), and the same
	   lift on hover as .btn. */
	a.slot {
		text-decoration: none;
		transition:
			transform 0.08s ease,
			box-shadow 0.15s ease;
	}
	a.slot:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgb(0 0 0 / 45%);
	}
	@media (prefers-reduced-motion: reduce) {
		a.slot {
			transition: none;
		}
		a.slot:hover {
			transform: none;
		}
	}
	.slot__logo {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.slot__num {
		font-size: 1.1rem;
		font-weight: 700;
		opacity: 0.35;
	}
	.slot__name {
		font-size: 0.85rem;
		font-weight: 600;
	}
	.counter__count {
		color: var(--text-muted);
		margin: 0;
	}
	.counter__count strong {
		color: var(--text-strong);
	}
</style>
