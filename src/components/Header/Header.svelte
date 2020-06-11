<script>
	const { getCurrentWindow } = require('electron').remote;
	import WindowsBar from './WindowsBar.svelte';
	import MacosBar from './MacosBar.svelte';
    
	let currentPlatform = navigator.platform === 'Win32' ? 'windows' : 'others';
	let isMaximized = getCurrentWindow().isMaximized();
	
	getCurrentWindow().on('maximize', () => isMaximized = true);
	getCurrentWindow().on('unmaximize', () => isMaximized = false);
</script>

<style src="./Header.scss"></style>

<header class="titlebar">
	<div class="drag-region {currentPlatform ? `drag-region--${currentPlatform}` : ''}">
		{#if currentPlatform === 'others'}
			<MacosBar bind:isMaximized />
		{:else}
			<WindowsBar bind:isMaximized />
		{/if}
	</div>
</header>