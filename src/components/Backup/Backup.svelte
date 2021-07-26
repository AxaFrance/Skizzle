<script lang="ts">
	const onImport = event => {
		event.preventDefault();
		console.log('Import');
	};
	const onExport = event => {
		event.preventDefault();
		console.log('Export');
	};
</script>

<button on:click={onImport} class="button">Importer</button>

<button on:click={onExport} class="button">Exporter</button>
