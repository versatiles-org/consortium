// Campaign status — the single source of truth for the seat counter. Maintained by hand.

interface CampaignStatus {
	memberTarget: number;
	/** In join order — one counter slot each. */
	foundingMembers: {
		name: string;
		url?: string;
		/** Key in the logo map in src/lib/content.ts; without one the slot shows the name. */
		logo?: string;
	}[];
}

export const campaignStatus: CampaignStatus = {
	memberTarget: 10,
	foundingMembers: [{ name: 'ida', url: 'https://www.ida.me', logo: 'ida' }],
};
