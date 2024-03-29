<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icons from 'components/icons';

	export let data: any;
	export let current: string;
	export let withAddButton: boolean = false;

	let width;

	const dispatch = createEventDispatcher();
	const onChange = tab => () => dispatch('change', { tab });
	const onSelectChange = e => onChange(e.target.value)();
	const onAdd = () => dispatch('add');

	$: sortedTabs = Object.keys(data).sort((a, b) =>
		data[a].order < data[b].order ? -1 : 1
	);
</script>

<div class="tabs" bind:clientWidth={width}>
	<nav>
		{#if width > 300}
			{#each sortedTabs as tab}
				<button
					title={data[tab].label}
					class="tab"
					role="tab"
					class:fixed={tab === 'all'}
					class:current={current === tab || Object.keys(data).length === 1}
					on:click={onChange(tab)}
					disabled={data[tab].disabled}
				>
					<span>
						{#if data[tab].icon}
							<svelte:component this={data[tab].icon} />
						{/if}

						{data[tab].label}
					</span>
					{#if data[tab].counter}<small>{data[tab].counter}</small>{/if}
				</button>
			{/each}
			{#if withAddButton}
				<button on:click={onAdd} title="New list" class="add">
					<Icons.Plus />
				</button>
			{/if}
		{:else}
			<select class="select" aria-label="Select" value={current} on:change={onSelectChange}>
				{#each sortedTabs as tab}
					<option value={tab}>
						{data[tab].label}
						{#if data[tab].counter}
							({data[tab].counter})
						{/if}
					</option>
				{/each}
			</select>
		{/if}
	</nav>
</div>

<style>
	nav {
		width: 100%;
		overflow: hidden;
		display: flex;
		padding: 1rem 1rem 0;
	}

	.tab:not(.fixed) {
		flex: 1 1 5rem;
	}

	.fixed {
		flex: none;
	}

	.tab {
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		max-width: 10rem;
		padding: 1rem;
		font-size: 1rem;
		line-height: 1;
		color: #fff;
		cursor: pointer;
		border: none;
		border-radius: 8px 8px 0 0;
		background-color: #3d3d3d;
		transition: opacity linear 0.2s;
	}

	.tab:not(.current):hover {
		opacity: 0.5;
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
		flex: 0 0 auto;
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

	span {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.select {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		cursor: pointer;
		font-family: 'Source sans pro', sans-serif;
		border: 0;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	.select:hover {
		opacity: 0.8;
	}

	@media only screen and (max-width: 300px) {
		nav {
			padding: 0.5rem;
		}
	}
</style>
