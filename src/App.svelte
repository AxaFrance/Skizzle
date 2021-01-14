<script lang="ts">
	import Accounts from 'components/Accounts';
	import Main from 'components/Main';
	import Settings from 'components/Settings';
	import Header from 'components/Header';
	import Navigation from 'components/Navigation';
	import { Views } from 'models/skizzle/ViewsEnum';
	import { settings } from 'shared/stores/default.store';

	const views = {
		[Views.Main]: Main,
		[Views.Accounts]: Accounts,
		[Views.Settings]: Settings,
	};

	let currentView: Views = Views.Main;
	const onViewChange = (view: Views) => (currentView = view);
</script>

<style>
	@font-face {
		font-family: 'roboto slab';
		src: url('../assets/fonts/RobotoSlab-SemiBold.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'roboto';
		src: url('../assets/fonts/Roboto-Regular.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

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
		font-family: 'roboto', sans-serif;
		color: #fff;
		background-color: #333;
	}

	:global(button, input) {
		font-family: 'roboto', sans-serif;
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
		overflow: auto;
	}
</style>

<Header />
<main style="--color:{$settings.theme}; --color-focus:{$settings.theme}80">
	<Navigation {currentView} {onViewChange} />
	<div>
		<svelte:component this={views[currentView]} />
	</div>
</main>
