// Campaign status — the single source of truth for the counter and the sector tallies.
// Maintained by hand. src/lib/content.ts derives the public view from this:
// a member's current status is the latest entry of its history.

interface CampaignStatus {
	memberTarget: number;
	foundingMembers: string[];
	sectors: {
		id: string;
		members: {
			name: string;
			history?: { status: 'planned' | 'contacted' | 'discussion' | 'accepted' | 'declined'; date: string }[];
		}[];
	}[];
}

export const campaignStatus: CampaignStatus = {
	memberTarget: 10,
	foundingMembers: [],
	sectors: [
		{
			id: 'public-broadcasters',
			members: [
				{ name: 'ARD', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'BR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'HR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'MDR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'NDR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'RBB', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'SR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'SWR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'WDR', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'ZDF', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'ORF', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'SRF', history: [{ status: 'contacted', date: '2026-07-20' }] },
			],
		},
		{
			id: 'private-media',
			members: [],
		},
		{
			id: 'companies',
			members: [],
		},
		{
			id: 'authorities',
			members: [],
		},
	],
};
