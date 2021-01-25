<script lang="ts">
	import Icons from 'components/icons';
	import type { ReviewType } from 'models/skizzle/ReviewType';

	export let reviews: ReviewType;

	const icons = {
		approved: Icons.DoubleCheck,
		approvedWithSuggestions: Icons.Check,
		pending: Icons.Wait,
		comment: Icons.Bubble,
		requestChange: Icons.Change,
		rejected: Icons.Rejected,
	};
</script>

<style>
	div {
		display: flex;
		align-items: center;
		padding: 0.2rem;
		font-size: 0.8rem;
		border-radius: 4px;
		background-color: #555;
	}

	div:not(:last-child) {
		margin-right: 0.5rem;
	}

	div :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	span {
		margin-left: 0.5rem;
		line-height: 1;
	}
</style>

{#each Object.entries(reviews) as [key, value]}
	{#if key !== 'other'}
		<div>
			<svelte:component this={icons[key]} color="#fff" />
			<span>{value}</span>
		</div>
	{/if}
{/each}