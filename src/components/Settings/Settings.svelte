<script lang="ts">
	import AccountTitle from '../AccountTitle';
	import { ThemeEnum } from 'models/skizzle/ThemeEnum';
	import { settings } from 'shared/stores/default.store';
	import Icons from 'components/icons';
</script>

<style>
	.content {
		flex: 1 0 auto;
		padding: 1rem;
	}

	.field {
		display: flex;
	}

	.field :global(svg) {
		display: block;
		width: 15rem;
		height: auto;
		border: 4px solid #fff;
	}

	[type='radio'] {
		display: none;
	}

	label {
		opacity: 0.5;
		margin-right: 1rem;
		cursor: pointer;
		transition: opacity linear 0.2s, box-shadow linear 0.2s;
	}

	label:hover {
		opacity: 1;
	}

	input:checked + label {
		opacity: 1;
		box-shadow: 0 0 0 4px var(--color);
	}

	legend {
		font-family: 'roboto slab', serif;
	}

	fieldset {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #555;
	}

	fieldset:not(:last-child) {
		margin-bottom: 2rem;
	}

	.intro {
		font-size: 0.8rem;
	}

	.intro:not(:last-child) {
		margin-bottom: 1rem;
	}

	form :global(h1) {
		margin-bottom: 2rem;
	}
</style>

<div class="content">
	<form>
		<AccountTitle>Réglages</AccountTitle>

		<!-- <p>Délai de rafraichissement : {$settings.refresh_delay} minute(s)</p>
	<p>Configuration du proxy : {$settings.proxy}</p>
	<p>Lancement au démarrage : {$settings.launch_at_startup}</p>
	<p>Langage: {$settings.language}</p> -->

		<fieldset>
			<legend>Theme</legend>
			<p class="intro">Choisissez un theme pour l'interface de Skizzle.</p>
			<div class="field">
				{#each Object.entries(ThemeEnum) as [key, value]}
					<input
						name="color"
						id={value}
						type="radio"
						checked={$settings.theme === value}
						on:change={() => settings.update(settings => ({
								...settings,
								theme: value,
							}))} />
					<label for={value}>
						<Icons.UI color={value} />
					</label>
				{/each}
			</div>
		</fieldset>
	</form>
</div>
