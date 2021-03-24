<script lang="ts">
	import Accounts from 'components/Accounts';
	import Main from 'components/Main';
	import Settings from 'components/Settings';
	import Header from 'components/Header';
	import Navigation from 'components/Navigation';
	import Notification from 'components/Notification';
	import { Views } from 'models/skizzle/ViewsEnum';
	import { offline, settings } from 'shared/stores/default.store';
	import { onMount } from 'svelte';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import Loader from 'components/Loader';

	let update: boolean = false;
	let version: string;

	const views = {
		[Views.Main]: Main,
		[Views.Accounts]: Accounts,
		[Views.Settings]: Settings,
	};

	let currentView: Views =
		$clientAuthenticated.isGithubAuthenticated ||
		$clientAuthenticated.isAzureDevOpsAuthenticated
			? Views.Main
			: Views.Accounts;
	const onViewChange = (view: Views) => (currentView = view);

	window.addEventListener('online', () => offline.set(false));
	window.addEventListener('offline', () => offline.set(true));

	onMount(() => {
		setInterval(async () => {
			version = await window.remote.invoke('check-for-update-request');
		}, 60000);

		window.remote.receive('check-for-update-response', () => update = true);
	});

	const checkForUpdateRestart = () => window.remote.invoke('check-for-update-restart')
</script>

<Header />
{#if update}
	<h1>{version}</h1>
	<p>A new version has been downloaded.</p>
	<p>Restart the application to apply the updates.</p>
	<button>Later</button>
	<button on:click={() => checkForUpdateRestart()}>Restart</button>
{/if}
<main style="--color:{$settings.theme}; --color-focus:{$settings.theme}80">
	<Loader />
	<Navigation {currentView} {onViewChange} />
	<div>
		<svelte:component this={views[currentView]} />
	</div>
	<Notification />
</main>

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

	:global(button:disabled) {
		opacity: 0.5;
	}
</style>
