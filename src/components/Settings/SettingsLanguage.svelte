<script>
	import { language, languages } from '../../shared/store';
	import Select from '../Select';

	export let init;
	export let title;
</script>

<style src="./Settings.scss">
</style>

<button class="skz-settings-back" on:click={init}>
	{language.getWord('Back')}
</button>
<h1 class="skz-settings-title">{title}</h1>
{#if $languages}
	<p class="skz-organizations__intro">{language.getWord('ChooseLanguage')}</p>
	<Select
		bind:binding={$language.code}
		optionalValue={true}
		options={$languages}
		defaultMessage={language.getWord('ChooseLanguage')} />
{/if}
