<script>
	import WindowsBar from './WindowsBar.svelte';
	import MacosBar from './MacosBar.svelte';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'windows' : 'others';
	let isMaximized: boolean = window.remote.invoke('isMaximized') as boolean;

	window.remote.receive('change-maximisze', (args: boolean) => {
		isMaximized = args
	});
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
