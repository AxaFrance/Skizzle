<script>
	import { language } from '../../shared/store';

	export let retry;
	export let label;
</script>

<style src="./ErrorMessage.scss">

</style>

<div class="skz-error-message">
	<p>{label}</p>
	<button on:click={retry}>{language.getWord('Retry')}</button>
</div>
