<script>
	export let data;
	export let onChange;
	export let current;
</script>

<style>
	nav {
		display: flex;
		padding: 1rem 1rem 0;
	}

	button {
		padding: 1rem;
		color: #fff;
		border: none;
		border-radius: 8px 8px 0 0;
		background-color: #3d3d3d;
	}

	button:not(:first-child) {
		margin-left: 4px;
	}

	.current {
		background-color: #4e4e4e;
	}
</style>

<nav>
	{#each Object.keys(data) as tab}
		<button class:current={current === tab} on:click={() => onChange(tab)}>
			{data[tab]}
		</button>
	{/each}
</nav>
