import { campaignStatus } from '../status.js';
import idaLogo from '#lib/assets/logos/ida.svg';
import type { AssetPath } from '$app/types';

/** Member logos, keyed by the `logo` field in src/status.ts. */
const memberLogos: Record<string, string> = { ida: idaLogo };

export type Locale = 'de' | 'en';
export const locales: Locale[] = ['de'];

export const siteUrl = 'https://versatiles.org/consortium';

export interface FoundingMember {
	name: string | null;
	url?: string;
	/** Resolved asset URL of the member's logo, if we have one. */
	logo?: string;
}

export const MEMBER_TARGET: number = campaignStatus.memberTarget;

export const foundingMembers: FoundingMember[] = campaignStatus.foundingMembers.map(({ name, url, logo }) => ({
	name,
	url,
	logo: logo ? memberLogos[logo] : undefined,
}));

export interface DemoVideo {
	id: string;
	url: string;
	poster: AssetPath;
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

export const heroVisual: { src: string; poster: AssetPath } = {
	src: 'https://cdn.versatiles.cloud/video/hero-loop.mp4', // built by scripts/build-hero-loop.sh, hosted on the CDN
	poster: 'poster-hero.jpg',
};
