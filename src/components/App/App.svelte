<script>
	// @ts-ignore
	const { ipcRenderer } = require('electron');
	import { onMount } from 'svelte';
	import Login from '../../layouts/Login';
	import Home from '../../layouts/Home';
	import Header from '../Header';
	import { getToken } from '../../shared/requester';
	import { clientToken, isOffline } from '../../shared/store';

	onMount(() => {
		ipcRenderer.on('getToken', async (_, args) => await getToken(args));
	});

	window.addEventListener('online', () => isOffline.set(false));
	window.addEventListener('offline', () => isOffline.set(true));
</script>

<style src="./App.scss">

</style>

<Header />
{#if $isOffline}
	<div class="skz-offline-banner">
		<p>
			Vous n'êtes pas connecté à Internet. Il est impossible de rafraîchir la liste
			et certaines fonctionnalités sont désactivées.
		</p>
	</div>
{/if}
{#if $clientToken && $clientToken.clientToken}
	<Home />
{:else}
	<Login />
{/if}
