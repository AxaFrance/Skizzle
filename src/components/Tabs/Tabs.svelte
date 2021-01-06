<script lang="ts">
	import Icons from 'components/icons';
	export let data;
	export let onChange;
	export let current;
	export let onCreation: () => void;
</script>

<style>
	nav {
		display: flex;
		padding: 1rem 1rem 0;
	}

	.tab {
		display: flex;
		align-items: center;
		padding: 1rem;
		font-size: 1rem;
		line-height: 1;
		color: #fff;
		cursor: pointer;
		border: none;
		border-radius: 8px 8px 0 0;
		background-color: #3d3d3d;
	}

	.tab:not(:first-child) {
		margin-left: 4px;
	}

	.current {
		background-color: #4e4e4e;
	}

	.add {
		align-self: center;
		width: 2rem;
		height: 2rem;
		margin-left: 0.5rem;
		cursor: pointer;
		border-radius: 50%;
		border: none;
		background-color: #4e4e4e;
		transition: background-color linear 0.2s;
	}

	.add:hover {
		background-color: #3d3d3d;
	}

	.tab :global(svg) {
		width: 1rem;
		height: auto;
		margin-right: 0.5rem;
	}

	small {
		margin-left: 0.2rem;
		color: #ff8a00;
	}
</style>

<nav>
	{#each Object.keys(data).sort((a, b) =>
		data[a].order < data[b].order ? -1 : 1,
	) as tab}
		<button
			class="tab"
			class:current={current === tab || Object.keys(data).length === 1}
			on:click={() => onChange(tab)}>
			{#if data[tab].icon}
				<svelte:component this={data[tab].icon} />
			{/if}
			{data[tab].label}
			{#if data[tab].counter}<small>({data[tab].counter})</small>{/if}
		</button>
	{/each}
	{#if onCreation}
		<button
			on:click={onCreation}
			title="Créer une nouvelle liste"
			class="add"><Icons.Plus /></button>
	{/if}
</nav>
