<script lang="ts">
	import Icons from '../icons';
	export let data: any;
	export let onChange: (value: any) => void;
	export let current: any;
	export let onCreation: () => void = undefined;
</script>

<nav>
	{#each Object.keys(data).sort((a, b) =>
		data[a].order < data[b].order ? -1 : 1,
	) as tab}
		<button
			class="tab"
			class:current={current === tab || Object.keys(data).length === 1}
			on:click={() => onChange(tab)}
		>
			{#if data[tab].icon}
				<svelte:component this={data[tab].icon} />
			{/if}
			{data[tab].label}
			{#if data[tab].counter}<small>({data[tab].counter})</small>{/if}
		</button>
	{/each}
	{#if onCreation}
		<button on:click={onCreation} title="Créer une nouvelle liste" class="add">
			<Icons.Plus />
		</button>
	{/if}
</nav>

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
		position: relative;
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

	.add :global(svg) {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
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
		color: var(--color);
	}
</style>
