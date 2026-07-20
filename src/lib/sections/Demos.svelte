<script lang="ts">
	import { base } from '$app/paths';
	import { demoVideos } from '$lib/content.js';
	import { ext } from '$lib/links.js';
	import type { Copy } from '$lib/copy.js';

	let { t }: { t: Copy['demos'] } = $props();
</script>

<section id="demos" class="demos">
	<div class="container">
		<h2>{t.heading}</h2>

		<div class="videos">
			{#each demoVideos as video (video.id)}
				{@const meta = t.videos[video.id]}
				{#if meta}
					<figure class="video">
						<header class="video__head">
							<h3>{meta.title}</h3>
							<p>{meta.description}</p>
						</header>

						<div class="video__player">
							<video controls preload="none" poster="{base}/{video.poster}">
								<source src={video.url} type="video/mp4" />
								<a href={video.url} {...ext(video.url)}>Download</a>
							</video>
						</div>

						<div class="video__links">
							<h4>{t.linksHeading}</h4>
							<ul class="links">
								{#each meta.links as link (link.label)}
									{#if 'url' in link}
										<li><a href={link.url} {...ext(link.url)}>{link.label}</a></li>
									{:else}
										<li class="group">
											<span class="group__label">{link.label}</span>
											<ul>
												{#each link.links as sub (sub.url)}
													<li><a href={sub.url} {...ext(sub.url)}>{sub.label}</a></li>
												{/each}
											</ul>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					</figure>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.demos {
		padding: clamp(2.5rem, 6vw, 4rem) 0;
		background: #17171a;
		border-top: 1px solid var(--line);
		text-align: center;
	}
	.demos h2 {
		font-size: clamp(1.4rem, 3vw, 1.9rem);
	}

	.videos {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 52rem;
		margin: 1.5rem auto 0;
	}

	/* Each block is a vertical stack: title/description, then the full-width video,
	   then the links flowing into columns below. */
	.video {
		margin: 0;
		padding: 1.25rem;
		text-align: left;
		background: var(--surface);
		border-radius: var(--radius);
	}

	.video__head h3 {
		margin: 0 0 0.35rem;
		font-size: 1.15rem;
	}
	.video__head p {
		margin: 0 0 1rem;
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	.video__player video {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #000;
		border-radius: 6px;
	}

	.video__links {
		margin-top: 1.1rem;
	}
	.video__links h4 {
		margin: 0 0 0.6rem;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-muted);
	}

	/* Links flow into responsive columns; a group (e.g. "Implementierungen") is kept
	   whole via break-inside. gap does not apply inside multicol, so items use margins. */
	.links {
		list-style: none;
		margin: 0;
		padding: 0;
		columns: 15rem;
		column-gap: 1.75rem;
	}
	.links > li {
		break-inside: avoid;
		margin-bottom: 0.4rem;
	}
	.video__links a {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 0.95rem;
		font-weight: 500;
		text-decoration: none;
		color: var(--text);
	}
	.video__links a:hover {
		color: var(--text-strong);
	}
	.video__links a::before {
		content: '↗';
		color: var(--purple);
		font-size: 0.85em;
	}

	/* A labelled group of links. */
	.group {
		margin-bottom: 0.7rem;
	}
	.group__label {
		display: block;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 0.35rem;
	}
	.group ul {
		list-style: none;
		margin: 0;
		padding-left: 0.9rem;
		border-left: 1px solid var(--line);
	}
	.group ul li {
		margin-bottom: 0.35rem;
	}
</style>
