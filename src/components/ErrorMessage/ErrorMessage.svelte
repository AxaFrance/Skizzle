<script>
	export let retry: any;
	export let label: string;
</script>

<style src="./ErrorMessage.scss">

</style>

<div class="skz-error-message">
	<p>{label}</p>
	<button on:click={retry}>Réessayer</button>
</div>
