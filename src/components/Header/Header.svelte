<script>
	const app = require('electron').ipcRenderer;
	import WindowsBar from './WindowsBar.svelte';
	import MacosBar from './MacosBar.svelte';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'windows' : 'others';
	let isMaximized: boolean;

	app.on('change-maximisze', (event: any, args: boolean) => isMaximized = args);
</script>

<style src="./Header.scss"></style>

<header class="titlebar">
	<div
		class="drag-region {currentPlatform ? `drag-region--${currentPlatform}` : ''}">
		{#if currentPlatform === 'others'}
			<MacosBar bind:isMaximized />
		{:else}
			<WindowsBar bind:isMaximized />
		{/if}
	</div>
</header>
