// Monthly cost model for the pricing chart. All figures in EUR/month.
// Sources (list prices, checked 2026-07): Mapbox web "Map Loads" (50k free, then
// $5/$4/$3 per 1,000), MapTiler Cloud (5k sessions free, Flex $30 incl. 25k, then
// $2.50/1,000). VersaTiles = self-hosted on an OVH server (bandwidth included).
//
// EDIT THESE ASSUMPTIONS — they drive the whole chart:
export const assumptions = {
	usdToEur: 0.92, // FX rate for the USD-priced providers
	mbPerUser: 1, // traffic per map view, in MB
};

// Chart x-axis maximum: 5M map views/month. Enough to reach the five-digit monthly bill
// the letter claims (Mapbox ≈ 12,000 € there) without extrapolating far past the published
// price list — at 20M the dashed part would swallow the whole chart and the numbers would
// read as speculation.
export const MAX_USERS = 5_000_000;

// Above this, Mapbox and MapTiler stop publishing prices ("contact sales") and large
// customers negotiate discounts. The chart therefore draws the curves solid up to here
// and dashed beyond: solid = list price, dashed = extrapolation. Saying so outright is
// what makes the chart survive a reader who knows their own enterprise deal — the gap
// is so large (≈98% discount needed to undercut the consortium) that no discount closes it.
export const LIST_PRICE_LIMIT = 1_000_000;

/** VersaTiles consortium: the flat membership fee — hosting and development included. */
export function versatilesCost(_users: number): number {
	return 700;
}

/** Mapbox web map loads: 50k free, then tiered per 1,000 (USD → EUR). */
export function mapboxCost(users: number): number {
	const tiers: [number, number][] = [
		[50_000, 0.0],
		[100_000, 5.0],
		[200_000, 4.0],
		[1_000_000, 3.0],
		[Infinity, 2.5],
	];
	let prev = 0;
	if (users <= prev) return 0;
	let usd = 0;
	for (const [upto, rate] of tiers) {
		usd += (Math.max(0, Math.min(users, upto) - prev) * rate) / 1000;
		prev = upto;
		if (users <= upto) break;
	}
	return usd * assumptions.usdToEur;
}

/** MapTiler Cloud sessions: 5k free, Flex $30 incl. 25k, then $2.50/1,000 (USD → EUR). */
export function maptilerCost(users: number): number {
	if (users <= 5_000) return 0;
	const usd = 30 + (Math.max(0, users - 25_000) / 1000) * 2.5;
	return usd * assumptions.usdToEur;
}

export interface CostSeries {
	key: string;
	/** Vendor name. A proper noun, so it is never translated — unlike our own series,
	 *  whose label is copy (chart.consortiumName) and gets attached when rendering. */
	brand?: string;
	color: string;
	fn: (users: number) => number;
	width: number;
}

// Validated categorical colours (dataviz skill, dark surface).
export const costSeries: CostSeries[] = [
	{ key: 'mapbox', brand: 'Mapbox', color: '#e53b', fn: mapboxCost, width: 1 },
	{ key: 'maptiler', brand: 'MapTiler', color: '#e83b', fn: maptilerCost, width: 1 },
	{ key: 'versatiles', color: '#9cf', fn: versatilesCost, width: 5 },
];
