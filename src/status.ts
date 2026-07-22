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
			members: [
				{ name: 'Süddeutsche Zeitung', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Madsack Mediengruppe', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Funke Mediengruppe', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DER SPIEGEL', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Hubert Burda Media', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Zeit Online', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DvH Medien', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Handelsblatt', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Tagesspiegel', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'FAZ', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Ippen Digital', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Münchner Merkur', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DuMont Mediengruppe', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Rheinische Post Mediengruppe', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Augsburger Allgemeine', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'NOZ / mh:n Medien', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 't-online/Ströer', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Der Standard', history: [{ status: 'contacted', date: '2026-07-20' }] },
			],
		},
		{
			id: 'companies',
			members: [
				{ name: 'DB Fernverkehr AG', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DB InfraGO AG', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Deutsche Telekom', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DHL Group', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'DPD', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Flix', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Hermes', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'ImmoScout24', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'PLANET IC', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'publicplan', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Sixt', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'Wire', history: [{ status: 'contacted', date: '2026-07-20' }] },
				{ name: 'init AG', history: [{ status: 'contacted', date: '2026-07-20' }] },
			],
		},
		{
			id: 'authorities',
			members: [
				{ name: 'AKDB', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'BBK', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'Dataport', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'DVZ M-V', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'DWD', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'ekom21', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'ITDZ Berlin', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'kdvz Rhein-Erft-Rur', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'Komm.ONE', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'regio iT', history: [{ status: 'contacted', date: '2026-07-21' }] },
				{ name: 'THW', history: [{ status: 'contacted', date: '2026-07-21' }] },
			],
		},
	],
};
