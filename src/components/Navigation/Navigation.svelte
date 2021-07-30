<script lang="ts">
	import Icons from 'components/icons';
	import { Views } from 'models/skizzle';

	export let currentView: Views;
	export let onViewChange: Function;

	const setView = (view: Views) => () => onViewChange(view);
	$: getClass = (view: Views) =>
		`${view} ${currentView === view ? 'selected' : ''}`;
	$: getColor = (view: Views) => (currentView === view ? `#fff` : '#d3d3d3');
</script>

<style>
	nav {
		flex: 0 0 8rem;
		display: flex;
		flex-direction: column;
		width: 8rem;
		height: 100%;
		background-color: #444;
	}

	button {
		display: flex;
		justify-content: start;
		align-items: center;
		width: 100%;
		height: 2.5rem;
		padding: 1rem;
		cursor: pointer;
		outline: none;
		font-weight: bold;
		color: #fff;
		border: 0;
		background-color: transparent;
		transition: background-color linear 0.1s;
	}

	button :global(svg) {
		margin-right: 0.5rem;
	}

	button:hover:not(.selected) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	button:focus:not(.selected) {
		background-color: var(--color-focus);
	}

	.selected {
		background-color: var(--color);
	}

	.settings {
		margin-top: auto;
	}
</style>

<nav>
	<button title="Listes" role="tab" on:click={setView(Views.Main)} class={getClass(Views.Main)}>
		<Icons.List color={getColor(Views.Main)} />
		Listes
	</button>
	<button title="Comptes" role="tab" on:click={setView(Views.Accounts)} class={getClass(Views.Accounts)}>
		<Icons.Accounts color={getColor(Views.Accounts)} />
		Comptes
	</button>
	<button title="Réglages" role="tab" on:click={setView(Views.Settings)} class={getClass(Views.Settings)}>
		<Icons.Settings color={getColor(Views.Settings)} />
		Réglages
	</button>
</nav>
