<script lang="ts">
	import Boundary from 'components/ErrorBoundary';
	import Accounts from 'components/Accounts';
	import Main from 'components/Main';
	import Settings from 'components/Settings';
	import Navigation from 'components/Navigation';
	import Notification from 'components/Notification';
	import { Views } from 'models/skizzle/ViewsEnum';
	import Loader from 'components/Loader';
	import { offline, settings, needIntro, isElectron } from 'shared/stores/default.store';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import Intro from 'views/Intro';
	import { onMount } from 'svelte';
	import { remote } from 'shared/remote';

	const views = {
		[Views.Main]: Main,
		[Views.Accounts]: Accounts,
		[Views.Settings]: Settings
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
		if ($isElectron) {
			setInterval(async () => {
				await remote.checkForUpdateRequest();
			}, 60000);

			remote.receive('check-for-update-response', () =>
				settings.update(x => ({ ...x, updateAvailable: true }))
			);
		}
	});
</script>

<main style="--color:{$settings.theme}; --color-focus:{$settings.theme}80">
	<Boundary onError={console.error}>
		{#if $needIntro}
			<Intro />
		{:else}
			<Loader />
			<Navigation {currentView} {onViewChange} />
			<div>
				<svelte:component this={views[currentView]} />
			</div>
			<Notification />
		{/if}
	</Boundary>
</main>

<style lang="scss">
	@font-face {
		font-family: 'Icons';
		src: url('../assets/icons.woff');
	}

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

	:global(::-webkit-scrollbar) {
		width: 10px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #444;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: #666;
		border-radius: 20px;
		border: 3px solid #444;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		border: 0;
		vertical-align: baseline;
		box-sizing: border-box;
	}

	:global(html),
	:global(body) {
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

	:global(button),
	:global(input) {
		font-family: 'roboto', sans-serif;
	}

	:global(button) {
		cursor: pointer;
	}

	:global(*:disabled) {
		cursor: not-allowed;
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

	@media only screen and (max-width: 300px) {
		main {
			flex-direction: column-reverse;
		}
	}

	:global(button:disabled) {
		opacity: 0.5;
	}
</style>
