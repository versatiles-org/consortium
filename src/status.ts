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
			members: [],
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
