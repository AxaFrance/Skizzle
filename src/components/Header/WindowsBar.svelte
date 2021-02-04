<script>
	import { WindowEnum } from "models/skizzle";
	const app = require('electron').ipcRenderer;

	export let isMaximized: boolean;
</script>

<style src="./WindowsBar.scss">

</style>

<div class="window-controls">
	<button
		on:click={() => app.send('state', { state: WindowEnum.Minimize })}
		class="button min-button">
		<svg width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M11 4.399V5.5H0V4.399h11z" fill="#444" />
		</svg>
	</button>
	{#if !isMaximized}
		<button
			on:click={() =>  app.send('state', { state: WindowEnum.Maximize })}
			class="button max-button">
			<svg width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z" fill="#444" />
			</svg>
		</button>
	{:else}
		<button
			on:click={() =>  app.send('state', { state: WindowEnum.Unmaximize })}
			class="button restore-button">
			<svg width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M11
					8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9
					1.1H3.298v1.101h5.5v5.5h1.1v-6.6z"
					fill="#444" />
			</svg>
		</button>
	{/if}
	<button
		on:click={() =>  app.send('state', { state: WindowEnum.Hide })}
		class="button close-button">
		<svg
			class="close"
			width="13"
			height="13"
			viewBox="0 0 11 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0
				.779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"
				fill="#444" />
		</svg>
	</button>
</div>
