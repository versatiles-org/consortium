<script lang="ts">
	import Lines from '$lib/Lines.svelte';
	import {
		MEMBER_TARGET,
		foundingMembers,
		sectorStatus,
		STATUS_ORDER,
		type SectorStatus,
		type SectorMember,
	} from '$lib/content.js';
	import type { Copy } from '$lib/copy.js';

	let { t, lang }: { t: Copy['banner']; lang: string } = $props();

	// Visual counter: one slot per target seat, filled in join order.
	const slots = Array.from({ length: MEMBER_TARGET }, (_, i) => foundingMembers[i] ?? null);
	const filled = foundingMembers.length;

	const boxLabel = (row: SectorStatus) => STATUS_ORDER.map((s) => `${row.counts[s]} ${t.legend[s]}`).join(', ');

	const fmtDate = (iso: string) =>
		new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

	// Hover/focus tooltip: one organisation's name + chronological history.
	// position: fixed, so it can never be clipped or widen the page.
	let tip: { member: SectorMember; x: number; y: number } | null = $state(null);
	function showTip(e: Event, member: SectorMember) {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = Math.min(Math.max(r.left + r.width / 2, 110), window.innerWidth - 110);
		tip = { member, x, y: r.top };
	}
	const hideTip = () => (tip = null);
</script>

<section id="aufruf" class="banner">
	<div class="container">
		<h2><Lines text={t.heading} /></h2>

		<div class="counter" role="img" aria-label={`${filled} / ${MEMBER_TARGET}`}>
			{#each slots as member, i (i)}
				<div class="slot" class:slot--filled={member}>
					{#if member}
						<span class="slot__name">{member.name ?? '✓'}</span>
					{:else}
						<span class="slot__num">{i + 1}</span>
					{/if}
				</div>
			{/each}
		</div>
		<p class="counter__count"><strong>{filled} / {MEMBER_TARGET}</strong> {t.countLabel}</p>

		<div class="sectors">
			<h3>{t.sectorsHeading}</h3>
			<ul class="sectors-list">
				{#each sectorStatus as row (row.id)}
					<li class="sector" aria-label={boxLabel(row)}>
						<span class="sector__name">{t.sectorGroups[row.id]}:</span>
						{#each row.members as m, i (m.name)}<button
								type="button"
								class="member"
								aria-label="{m.name}: {t.legend[m.status]}"
								onpointerenter={(e) => showTip(e, m)}
								onpointerleave={hideTip}
								onfocus={(e) => showTip(e, m)}
								onblur={hideTip}
							><span class="box box--{m.status}"></span>{m.name}{#if i < row.members.length - 1},{/if}</button>{#if i < row.members.length - 1}{' '}{/if}{/each}
					</li>
				{/each}
			</ul>
			<ul class="legend">
				<li><span class="box box--contacted"></span>{t.legend.contacted}</li>
				<li><span class="box box--discussion"></span>{t.legend.discussion}</li>
				<li><span class="box box--accepted"></span>{t.legend.accepted}</li>
				<li><span class="box box--declined"></span>{t.legend.declined}</li>
			</ul>
		</div>
	</div>

	{#if tip}
		<div class="box-tip" style="left: {tip.x}px; top: {tip.y}px">
			<strong class="box-tip__name">{tip.member.name}</strong>
			<ul class="box-tip__history">
				{#each tip.member.history as h (h.date + h.status)}
					<li>
						<span class="box-tip__date">{fmtDate(h.date)}</span>
						<span class="box-tip__status">{t.legend[h.status]}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
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
		margin: 0 0 2rem;
	}
	.counter__count strong {
		color: var(--text-strong);
	}

	.sectors {
		max-width: 40rem;
		margin: 0 auto;
		text-align: left;
	}
	.sectors-list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.95rem;
	}
	/* Each sector is one line of running text: "label: ☐ ARD, ☐ BR, …".
	   The organisations wrap naturally like words in a paragraph. */
	.sector {
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--line);
		line-height: 1.9;
	}
	.sector__name {
		font-weight: 600;
		color: var(--text-strong);
		margin-right: 0.35rem;
	}
	/* box + organisation name are one hover/focus target; wraps happen at the comma.
	   It is a <button> for keyboard focus, but must read as plain label text – so all
	   the UA chrome (and the pointer cursor) is stripped. */
	.member {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		white-space: nowrap;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		cursor: inherit;
	}

	/* One box per organisation, styled by outreach status. */
	.box {
		box-sizing: border-box;
		width: 14px;
		height: 14px;
		border-radius: 3px;
		flex: none;
	}

	/* Tooltip: organisation name + chronological history */
	.box-tip {
		position: fixed;
		z-index: 20;
		transform: translate(-50%, calc(-100% - 10px));
		min-width: 11rem;
		max-width: 16rem;
		padding: 0.5rem 0.65rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: 0 6px 20px rgb(0 0 0 / 45%);
		text-align: left;
		font-size: 0.85rem;
		line-height: 1.45;
		pointer-events: none;
	}
	.box-tip__name {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--text-strong);
	}
	.box-tip__history {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.box-tip__history li {
		display: flex;
		gap: 0.5rem;
	}
	.box-tip__date {
		flex: none;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}
	.box-tip__status {
		color: var(--text);
	}
	.box--contacted,
	.box--discussion,
	.box--accepted,
	.box--declined {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	/* in talks – filled, but no outcome glyph yet */
	.box--discussion {
		background: var(--discuss);
	}
	.box--contacted::after,
	.box--accepted::after,
	.box--declined::after {
		font-size: 10px;
		font-weight: 700;
		line-height: 1;
		color: #fff;
	}
	.box--contacted {
		border: 1.5px solid var(--text-muted);
		opacity: 0.6;
	}
	.box--contacted::after {
		content: none;
	}
	.box--accepted {
		background: var(--accept);
	}
	.box--accepted::after {
		content: '✓';
	}
	.box--declined {
		background: var(--decline);
		opacity: 0.3;
	}
	.box--declined::after {
		content: '✗';
	}
	.boxes__empty {
		color: var(--text-muted);
	}

	.legend {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
		margin: 1rem 0 0;
		padding: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.legend li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.legend .box {
		width: 12px;
		height: 12px;
	}
</style>
