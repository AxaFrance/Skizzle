<script lang="ts">
	import Icons from '../icons';
	export let onSubmit: (string) => void;
	export let onCancel: () => void;
	export let disabled: boolean;
	export let placeholder: string = '';

	let query: string = '';

	const search = event => {
		event.preventDefault();
		onSubmit(query);
	};

	const cancel = event => {
		event.preventDefault();
		query = '';
		onCancel();
	};
</script>

<style>
	form {
		width: 100%;
	}

	[type='submit'] {
		display: none;
	}

	.search {
		position: relative;
		width: 20rem;
		margin-bottom: 2rem;
	}

	.search > :global(svg) {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.search input {
		width: 100%;
		padding: 1rem 2.5rem;
		color: #fff;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #848484;
	}

	.search input::placeholder {
		color: #4e4e4e;
	}

	.delete {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background-color: transparent;
		transform: translateY(-50%);
	}
</style>

<div class="search">
	<Icons.Search color="#4e4e4e" />
	<form on:submit={search}>
		<input bind:value={query} {disabled} {placeholder} />
		<input type="submit" />
		{#if query}
			<button on:click={cancel} class="delete">
				<Icons.Delete color="#4e4e4e" />
			</button>
		{/if}
	</form>
</div>
