<script>
	const app = require('electron').ipcRenderer;
	import { onMount } from 'svelte';
	import Login from '../../layouts/Login';
	import Home from '../../layouts/Home';
	import Header from '../Header';
	import { getToken } from '../../shared/requester';
	import { clientToken, isOffline, language } from '../../shared/store';

	onMount(() => {
		app.on('getToken', async (_, args) => await getToken(args));
	});

	window.addEventListener('online', () => isOffline.set(false));
	window.addEventListener('offline', () => isOffline.set(true));
</script>

<style src="./App.scss">

</style>

<Header />
{#if $isOffline}
	<div class="skz-offline-banner">
		<p>{language.getWord('Offline')}</p>
	</div>
{/if}
{#if $clientToken && $clientToken.clientToken}
	<Home />
{:else}
	<Login />
{/if}
