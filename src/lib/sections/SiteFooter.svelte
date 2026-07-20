<script lang="ts">
	import { base } from '$app/paths';

	let { t }: { t: string } = $props();
</script>

<footer class="site-footer">
	<div class="container">
		<a href="https://versatiles.org" aria-label="VersaTiles"><img src="{base}/versatiles.svg" alt="VersaTiles" /></a>
		<p>{t} · <a href="https://versatiles.org">versatiles.org</a></p>
	</div>
</footer>

<style>
	.site-footer {
		padding: 2.5rem 0 3.5rem;
		border-top: 1px solid var(--line);
		color: var(--text-muted);
		font-size: 0.9rem;
	}
	.site-footer .container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.site-footer img {
		height: 28px;
		width: auto;
	}
</style>
