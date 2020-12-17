<script lang="ts">
	import Accounts from 'components/Accounts';
	import List from 'components/List';
	import Settings from 'components/Settings';
	import Header from 'components/Header';
	import Navigation from 'components/Navigation';
	import { Views } from 'models/skizzle/ViewsEnum';

	const views = {
		[Views.List]: List,
		[Views.Accounts]: Accounts,
		[Views.Settings]: Settings,
	};

	let currentView: Views = Views.Accounts;
	const onViewChange = (view: Views) => (currentView = view);
</script>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		display: flex;
		overflow: hidden;
		flex-direction: column;
		font-family: sans-serif;
		color: #fff;
		background-color: #333;
	}

	main {
		display: flex;
		flex: 1 0 auto;
		height: calc(100vh - 2rem);
	}

	div {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 1 1 auto;
	}
</style>

<Header />
<main>
	<Navigation {currentView} {onViewChange} />
	<div>
		<svelte:component this={views[currentView]} />
	</div>
</main>
