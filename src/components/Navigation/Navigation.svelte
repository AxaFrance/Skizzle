<script lang="ts">
	import Icons from '../icons';
	import { Views } from 'models/skizzle/ViewsEnum';

	export let currentView: Views;
	export let onViewChange: Function;

	const setView = (view: Views) => () => onViewChange(view);
	$: getClass = (view: Views) =>
		`${view} ${currentView === view ? 'selected' : ''}`;
	$: getColor = (view: Views) => (currentView === view ? `#fff` : '#d3d3d3');
</script>

<style>
	nav {
		display: flex;
		flex-direction: column;
		width: 2.5rem;
		height: 100%;
		background-color: #444;
	}

	button {
		width: 100%;
		height: 2.5rem;
		font-size: 0;
		cursor: pointer;
		outline: none;
		border: 0;
		background-color: transparent;
		transition: background-color linear 0.1s;
	}

	button:hover:not(.selected) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	button:focus:not(.selected) {
		background-color: rgba(255, 138, 0, 0.5);
	}

	.selected {
		background-color: #ff8a00;
	}

	.settings {
		margin-top: auto;
	}
</style>

<nav>
	<button on:click={setView(Views.Main)} class={getClass(Views.Main)} title="Liste">
		<Icons.List color={getColor(Views.Main)} />
		Liste
	</button>
	<button on:click={setView(Views.Accounts)} class={getClass(Views.Accounts)} title="Comptes">
		<Icons.Accounts color={getColor(Views.Accounts)} />
		Comptes
	</button>
	<button on:click={setView(Views.Settings)} class={getClass(Views.Settings)} title="Réglages">
		<Icons.Settings color={getColor(Views.Settings)} />
		Réglages
	</button>
</nav>
