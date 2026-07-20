<script lang="ts">
	import Lines from '$lib/Lines.svelte';
	import { costSeries, MAX_USERS, LIST_PRICE_LIMIT } from '$lib/costModel.js';

	interface ChartCopy {
		title: string;
		axisX: string;
		axisY: string;
		note: string;
		consortiumName: string;
		listPriceLimit: string;
	}
	let { t, lang }: { t: ChartCopy; lang: string } = $props();

	// ── geometry (viewBox units) ──
	// The SVG is scaled to its container, so a 760-unit viewBox on a 350px phone shrinks
	// every label to ~45% — unreadable, and you cannot fix that by enlarging the type
	// (it would then blow out the margins). Instead the viewBox itself gets narrower on
	// phones, so it renders near 1:1 and the type keeps its intended size.
	let narrow = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 640px)');
		const sync = () => (narrow = mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	const W = $derived(narrow ? 400 : 760);
	const H = $derived(narrow ? 340 : 430);
	// On phones the direct labels at the line ends are dropped — there is no room, and the
	// legend right below the plot carries the identity instead. Hence the tiny right margin.
	const M = $derived(
		narrow ? { top: 14, right: 14, bottom: 42, left: 72 } : { top: 16, right: 110, bottom: 42, left: 62 }
	);
	const iw = $derived(W - M.left - M.right);
	const ih = $derived(H - M.top - M.bottom);

	// "VersaTiles-Konsortium" is too long for one line at the end of its line — break it
	// after the hyphen. Anything short stays on one line.
	const wrap = (name: string): string[] => (name.length > 12 && name.includes('-') ? name.split(/(?<=-)/) : [name]);

	// ── data ──
	const N = 200;
	// Vendor names are proper nouns and stay as they are; only our own series is copy.
	// Derived, so the label follows a language change instead of freezing at mount.
	const sample = $derived(
		costSeries.map((s) => ({
			...s,
			name: s.brand ?? t.consortiumName,
			pts: Array.from({ length: N + 1 }, (_, i) => {
				const u = (i / N) * MAX_USERS;
				return { u, c: s.fn(u) };
			}),
		}))
	);

	const rawMax = Math.max(...costSeries.map((s) => s.fn(MAX_USERS)));
	// "nice" round step so the y-axis lands on clean values at any scale (~4 gridlines)
	const niceStep = (x: number) => {
		const mag = Math.pow(10, Math.floor(Math.log10(x)));
		const n = x / mag;
		return (n >= 5 ? 10 : n >= 2 ? 5 : 2) * mag;
	};
	const stepY = niceStep(rawMax / 4);
	const yMax = Math.ceil(rawMax / stepY) * stepY;
	const yTicks = Array.from({ length: Math.round(yMax / stepY) + 1 }, (_, i) => i * stepY);
	const xStep = MAX_USERS / 5;
	const xTicks = Array.from({ length: 6 }, (_, i) => i * xStep);

	const sx = $derived((u: number) => M.left + (u / MAX_USERS) * iw);
	const sy = $derived((c: number) => M.top + ih - (c / yMax) * ih);

	const path = (pts: { u: number; c: number }[]) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.u).toFixed(1)},${sy(p.c).toFixed(1)}`).join('');

	// Solid where the providers publish prices, dashed beyond — above LIST_PRICE_LIMIT
	// they say "contact sales", so those points are an extrapolation, not a quote.
	// Our own line is the membership fee, which is known at any volume: never dashed.
	const paths = $derived(
		sample.map((s) => {
			const extrapolated = s.brand !== undefined;
			return {
				...s,
				dSolid: path(extrapolated ? s.pts.filter((p) => p.u <= LIST_PRICE_LIMIT) : s.pts),
				dDashed: extrapolated ? path(s.pts.filter((p) => p.u >= LIST_PRICE_LIMIT)) : '',
			};
		})
	);

	// ── formatting ──
	const euro = (n: number) =>
		new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
	const count = (n: number) =>
		n >= 1_000_000
			? `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`
			: n >= 1000
				? `${Math.round(n / 1000)}k`
				: `${Math.round(n)}`;

	// ── hover ──
	let plot: SVGRectElement | undefined = $state();
	let hoverU: number | null = $state(null);
	function move(e: PointerEvent) {
		if (!plot) return;
		const r = plot.getBoundingClientRect();
		hoverU = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * MAX_USERS;
	}
	const hover = $derived(
		hoverU === null
			? null
			: {
					u: hoverU,
					rows: sample.map((s) => ({ ...s, c: s.fn(hoverU!) })),
				}
	);
	const ttFlip = $derived(hover ? sx(hover.u) > M.left + iw * 0.58 : false);
	// Screen-reader summary; was a hardcoded list that would have gone stale with the labels.
	const seriesLabel = $derived(`${t.axisY} — ${sample.map((s) => s.name).join(', ')}`);
</script>

<figure class="cost-chart">
	<h3 class="cc-title"><Lines text={t.title} /></h3>

	<svg viewBox="0 0 {W} {H}" class="cc-svg" role="img" aria-label={seriesLabel}>
		<!-- y grid + labels -->
		{#each yTicks as v (v)}
			<line class="cc-grid" x1={M.left} x2={M.left + iw} y1={sy(v)} y2={sy(v)} />
			<text class="cc-tick" x={M.left - 8} y={sy(v)} text-anchor="end" dominant-baseline="middle">{euro(v)}</text>
		{/each}

		<!-- x ticks -->
		{#each xTicks as v (v)}
			<text class="cc-tick" x={sx(v)} y={M.top + ih + 20} text-anchor="middle">{count(v)}</text>
		{/each}
		<text class="cc-axis" x={M.left + iw / 2} y={H - 4} text-anchor="middle">{t.axisX}</text>

		<!-- axes lines + pointer overlay -->
		<line class="cc-ax" x1={M.left} x2={M.left} y1={M.top} y2={M.top + ih} />
		<line class="cc-ax" x1={M.left} x2={M.left + iw} y1={M.top + ih} y2={M.top + ih} />

		<!-- end of the published price lists: everything to the right is extrapolated -->
		<line class="cc-limit" x1={sx(LIST_PRICE_LIMIT)} x2={sx(LIST_PRICE_LIMIT)} y1={M.top} y2={M.top + ih} />
		<text class="cc-limit-label" x={sx(LIST_PRICE_LIMIT) + 6} y={M.top + 12}>{t.listPriceLimit}</text>

		<!-- series -->
		{#each paths as s (s.key)}
			<path class="cc-line" d={s.dSolid} style:stroke={s.color} style:stroke-width={s.width} />
			{#if s.dDashed}
				<path class="cc-line cc-line--est" d={s.dDashed} style:stroke={s.color} style:stroke-width={s.width} />
			{/if}
			{#if !narrow}
				{@const lines = wrap(s.name)}
				<text class="cc-end" y={sy(s.fn(MAX_USERS))} dominant-baseline="middle" style:fill={s.color}>
					{#each lines as line, i (i)}
						<tspan x={M.left + iw + 6} dy={i === 0 ? (lines.length > 1 ? -7 : 0) : 14}>{line}</tspan>
					{/each}
				</text>
			{/if}
		{/each}

		<!-- hover -->
		{#if hover}
			<line class="cc-cross" x1={sx(hover.u)} x2={sx(hover.u)} y1={M.top} y2={M.top + ih} />
			{#each hover.rows as r (r.key)}
				<circle cx={sx(hover.u)} cy={sy(r.c)} r="4" fill={r.color} stroke="var(--bg)" stroke-width="1.5" />
			{/each}
			<foreignObject x={ttFlip ? sx(hover.u) - 232 : sx(hover.u) + 12} y={M.top + 4} width="220" height="150">
				<div class="cc-tt" xmlns="http://www.w3.org/1999/xhtml">
					<div class="cc-tt-h">{count(hover.u)} {t.axisX}</div>
					{#each hover.rows as r (r.key)}
						<div class="cc-tt-row">
							<span class="cc-sw" style:background={r.color}></span><span class="cc-tt-name" style:color={r.color}
								>{r.name}</span
							>
							<span class="cc-tt-val" style:color={r.color}>{euro(r.c)}</span>
						</div>
					{/each}
				</div>
			</foreignObject>
		{/if}

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<rect
			bind:this={plot}
			x={M.left}
			y={M.top}
			width={iw}
			height={ih}
			fill="transparent"
			onpointermove={move}
			onpointerleave={() => (hoverU = null)}
		/>
	</svg>

	<!-- Legend sits between the plot and the note: the lines are already labelled directly,
	     so it is a recap, not a key you need before reading. -->
	<ul class="cc-legend">
		{#each sample as s (s.key)}
			<li><span class="cc-sw" style:background={s.color}></span>{s.name}</li>
		{/each}
	</ul>

	<figcaption class="cc-note">{t.note}</figcaption>
</figure>

<style>
	.cost-chart {
		margin: 2rem 0;
		font-size: 0.9rem;
	}
	/* The takeaway, not a description of the axes — the chart's job in one sentence. */
	.cc-title {
		font-size: 1.15rem;
		line-height: 1.3;
		margin: 0 0 0.9rem;
	}
	.cc-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
		color: var(--text-muted);
		justify-content: center;
	}
	.cc-legend li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		/* On the <ul> these would only be inherited — and `.letter li` in global.scss hits
		   the <li> directly, which beats inheritance. The chart sits inside the letter, so
		   the values have to land on the <li> itself. */
		font-size: 0.8rem;
		line-height: 1.5;
		margin-bottom: 0;
	}
	.cc-sw {
		width: 11px;
		height: 11px;
		border-radius: 3px;
		flex: none;
		display: inline-block;
	}
	.cc-svg {
		width: 100%;
		height: auto;
		display: block;
		touch-action: none;
	}
	.cc-grid {
		stroke: var(--line);
		stroke-width: 1;
		opacity: 0.5;
	}
	.cc-ax {
		stroke: var(--line);
		stroke-width: 1.5;
	}
	.cc-tick {
		fill: var(--text-muted);
		font-size: 12px;
	}
	.cc-axis {
		fill: var(--text-muted);
		font-size: 12px;
	}
	.cc-line {
		fill: none;
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	/* Dashed = beyond the published price list, i.e. extrapolated, not quoted. */
	.cc-line--est {
		stroke-dasharray: 7 5;
	}
	.cc-limit {
		stroke: var(--line);
		stroke-width: 1;
	}
	.cc-limit-label {
		fill: var(--text-muted);
		font-size: 11px;
	}
	.cc-end {
		font-size: 12.5px;
		font-weight: 600;
	}
	.cc-cross {
		stroke: var(--text-muted);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}
	.cc-tt {
		width: max-content;
		max-width: 100%;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 0.4rem 0.55rem;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--text);
	}
	.cc-tt-h {
		color: var(--text-muted);
		font-size: 11.5px;
		margin-bottom: 0.15rem;
	}
	.cc-tt-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.cc-tt-name {
		flex: 1;
	}
	.cc-tt-val {
		font-weight: 600;
		color: var(--text-strong);
		font-variant-numeric: tabular-nums;
	}
	.cc-note {
		margin-top: 0.6rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	/* Matches the `narrow` breakpoint in the script, where the viewBox shrinks to ~400
	   units: the SVG then renders near 1:1, so the type only needs a nudge. */
	@media (max-width: 640px) {
		.cc-tick,
		.cc-axis {
			font-size: 13px;
		}
		.cc-limit-label {
			font-size: 11px;
		}
	}
</style>
