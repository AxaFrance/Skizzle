<script lang="ts">
	import WindowsBar from './WindowsBar.svelte';
	import MacosBar from './MacosBar.svelte';
	import { remote } from 'shared/remote';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'windows' : 'others';
	let isMaximized: boolean = remote.invoke('isMaximized') as boolean;

	remote.receive('change-maximisze', (args: boolean) => {
		isMaximized = args
	});
</script>

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

<style lang="scss">
	.titlebar {
		position: relative;
		display: block;
		height: 32px;
		border-bottom: 1px solid #444;
	}

	.titlebar .drag-region {
		width: 100%;
		height: 100%;
		-webkit-app-region: drag;
		display: flex;
		flex-direction: row;

		&--windows {
			justify-content: flex-end;
		}
	}
</style>