import { campaignStatus } from '../status.js';

export type Locale = 'de' | 'en';
export const locales: Locale[] = ['de'];

export const siteUrl = 'https://versatiles.org/consortium';

export interface FoundingMember {
	name: string | null;
	url?: string;
}
export const STATUS_ORDER = ['contacted', 'discussion', 'accepted', 'declined'] as const;
export type OutreachStatus = (typeof STATUS_ORDER)[number];

export interface OutreachEvent {
	status: OutreachStatus;
	date: string;
	/** Optional public remark for this event. */
	note?: string;
}
export interface SectorMember {
	name: string;
	/** Current status = the latest history entry. */
	status: OutreachStatus;
	/** Chronological, oldest first. */
	history: OutreachEvent[];
}
export interface SectorStatus {
	id: string;
	members: SectorMember[];
	counts: Record<OutreachStatus, number>;
}

export const MEMBER_TARGET: number = campaignStatus.memberTarget;

export const foundingMembers: FoundingMember[] = campaignStatus.foundingMembers.map((name) => ({
	name,
}));

export const sectorStatus: SectorStatus[] = campaignStatus.sectors.map((sector) => {
	const members: SectorMember[] = sector.members
		.map((member): SectorMember | null => {
			const history = [...(member.history ?? [])]
				.sort((a, b) => a.date.localeCompare(b.date))
				.filter((e) => e.status !== 'planned') as OutreachEvent[];

			// No history = not contacted yet, so no box.
			if (history.length === 0) return null;

			const latest = history[history.length - 1];
			return { name: member.name, status: latest.status, history };
		})
		.filter((m): m is SectorMember => m !== null)
		.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || a.name.localeCompare(b.name));

	const counts = { contacted: 0, discussion: 0, accepted: 0, declined: 0 };
	for (const m of members) counts[m.status]++;

	return { id: sector.id, members, counts };
});

export interface DemoVideo {
	id: string;
	url: string;
	poster: string;
}
export const demoVideos: DemoVideo[] = [
	{ id: 'intro', url: 'https://cdn.versatiles.cloud/video/demo.intro.de.mp4', poster: 'poster-intro.jpg' },
	{ id: 'server', url: 'https://cdn.versatiles.cloud/video/demo.server.de.mp4', poster: 'poster-server.jpg' },
	{ id: 'data', url: 'https://cdn.versatiles.cloud/video/demo.data.de.mp4', poster: 'poster-data.jpg' },
	{
		id: 'frontend',
		url: 'https://cdn.versatiles.cloud/video/demo.frontend.de.mp4',
		poster: 'poster-frontend.jpg',
	},
];

export const donate = {
	githubSponsors: 'https://github.com/sponsors/versatiles-org',
	openCollective: 'https://opencollective.com/versatiles',
};

export const heroVisual = {
	src: 'https://cdn.versatiles.cloud/video/hero-loop.mp4', // built by scripts/build-hero-loop.sh, hosted on the CDN
	poster: 'poster-hero.jpg',
};
