<script>
	import {
		refreshDelay,
		organizations,
		theme,
		language,
	} from '../../shared/store';
	import { addItem } from '../../shared/storage';

	export let init;
	export let title;

	let themes = [1, 2, 3];
	let chosenTheme = themes.find(id => id === $theme);

	$: {
		theme.set(chosenTheme);
		addItem('theme', chosenTheme);
	}
</script>

<style src="./Settings.scss">

</style>

<button class="skz-settings-back" on:click={init}>
	{language.getWord('Back')}
</button>
<h1 class="skz-settings-title">{title}</h1>
<p class="skz-organizations__intro">{language.getWord('ConfigTheme')}</p>
<ul class="skz-themes">
	{#each themes as themeItem}
		<li class="skz-theme">
			<input
				id={themeItem}
				type="radio"
				bind:group={chosenTheme}
				value={themeItem} />
			<label
				for={themeItem}
				class="skz-theme__gradient skz-theme__gradient--{themeItem}" />
		</li>
	{/each}
</ul>
