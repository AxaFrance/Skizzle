<style src="./Header.scss">

</style>

<script>
	import { onMount } from 'svelte';

	const { remote } = require('electron');

	let currentPlatform = 'Others';

	onMount(() => {
		init();

		if (navigator.platform === 'Win32') {
			currentPlatform = 'Windows';
		} else {
			currentPlatform = 'Others';
		}
	});

	const init = () => {
		let window = remote.getCurrentWindow();

		const minButton = document.getElementById('minimize');
		const maxButton = document.getElementById('maximize');
		const restoreButton = document.getElementById('restore');
		const closeButton = document.getElementById('close');

		minButton.addEventListener('click', event => {
			window = remote.getCurrentWindow();
			window.minimize();
		});

		maxButton.addEventListener('click', event => {
			window = remote.getCurrentWindow();
			window.maximize();
			toggleMaxRestoreButtons();
		});

		restoreButton.addEventListener('click', event => {
			window = remote.getCurrentWindow();
			window.unmaximize();
			toggleMaxRestoreButtons();
		});

		const toggleMaxRestoreButtons = () => {
			window = remote.getCurrentWindow();

			if (window.isMaximized()) {
				maxButton.style.display = 'none';
				restoreButton.style.display = 'flex';
			} else {
				restoreButton.style.display = 'none';
				maxButton.style.display = 'flex';
			}
		};

		toggleMaxRestoreButtons();
		window.on('maximize', toggleMaxRestoreButtons);
		window.on('unmaximize', toggleMaxRestoreButtons);

		closeButton.addEventListener('click', event => {
			window = remote.getCurrentWindow();
			window.hide();
		});
	};
</script>

<header class="titlebar">
	<div class="drag-region">
		<div class="window-controls">
			<button id="minimize" class="button min-button" data-icon="—"></button>
			<button id="maximize" class="button max-button" data-icon="➕"></button>
			<button
				id="restore"
				class="button restore-button"
				data-icon="➕"></button>
			<button id="close" class="button close-button" data-icon="❌"></button>
		</div>
	</div>
</header>
