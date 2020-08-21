<script>
	import { addItem } from '../../shared/storage';
	export let init;
	import { theme } from '../../shared/store';

	let themes = [
		{
			id: 1,
			text: 'Bleu',
		},
		{
			id: 2,
			text: 'Orange',
		},
		{
			id: 3,
			text: 'Violet',
		},
	];

	let chosenTheme = themes.find(({ id }) => id === $theme).id;

	$: {
		theme.set(chosenTheme);
		addItem('theme', chosenTheme);
	}
</script>

<style src="./Settings.scss">

</style>

<button class="skz-settings-back" on:click={init}>Retour</button>
<p class="skz-organizations__intro">Choisissez votre thème.</p>

<ul class="skz-themes">
	{#each themes as themeItem}
		<li class="skz-theme">
			<input
				id={themeItem.id}
				type="radio"
				bind:group={chosenTheme}
				value={themeItem.id} />
			<label
				for={themeItem.id}
				class="skz-theme__gradient skz-theme__gradient--{themeItem.id}">
				{themeItem.text}
			</label>
		</li>
	{/each}
</ul>
