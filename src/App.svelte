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

	let currentView: Views = Views.List;
	const onViewChange = (view: Views) => (currentView = view);
</script>

<style>
	main {
		display: flex;
		flex: 1 0 auto;
	}

	div {
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
