<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import Fieldset from 'components/Fieldset';
	import Range from 'components/Range';
	import { ThemeEnum } from 'models/skizzle';
	import { settings } from 'shared/stores/default.store';
	import Icons from 'components/icons';

	let currentPlatform: string =
		navigator.platform === 'Win32' ? 'Windows' : 'macOS';
</script>

<div class="content">
	<form>
		<AccountTitle>Réglages</AccountTitle>

		<Fieldset
			title="Rafraichissement"
			intro="Réglez ici le délai qu'utilisera Skizzle pour rafraichir les données."
			outro={`Skizzle rafraichira les données toutes les ${
				$settings.refresh_delay !== 1
					? `${$settings.refresh_delay} minutes`
					: '60 secondes'
			}`}
		>
			<div class="field">
				<Range bind:value={$settings.refresh_delay} min={1} step={1} max={15} />
			</div>
		</Fieldset>

		<Fieldset
			title="Au démarrage"
			outro={`${
				$settings.launch_at_startup
					? 'Skizzle se lancera automatiquement à chaque démarrage de '
					: 'Skizzle ne se lancera pas au démarrage de '
			} ${currentPlatform}.`}
		>
			<div class="field checkbox">
				<input
					id="startup"
					type="checkbox"
					bind:checked={$settings.launch_at_startup}
				/>
				<label for="startup">Lancer Skizzle au démarrage</label>
			</div>
			<p class="text" />
		</Fieldset>

		<Fieldset
			title="Langue"
			intro="Choisissez ici la langue de l'interface de Skizzle."
		>
			<select>
				<option value={$settings.language}>{$settings.language}</option>
			</select>
		</Fieldset>

		<Fieldset
			title="Proxy"
		>
			<label for="proxy">Serveur et port (ex: http://localhost:3000) : </label>
			<input
				id="proxy"
				type="url"
				bind:value={$settings.proxy}
			/>
		</Fieldset>

		<Fieldset
			title="Theme"
			intro="Choisissez un theme pour l'interface de Skizzle."
		>
			<div class="field">
				{#each Object.values(ThemeEnum) as value}
					<input
						name="color"
						id={value}
						type="radio"
						checked={$settings.theme === value}
						on:change={() =>
							settings.update(settings => ({
								...settings,
								theme: value,
							}))}
					/>
					<label class="ui" for={value}>
						<Icons.UI color={value} />
					</label>
				{/each}
			</div>
		</Fieldset>
	</form>
</div>

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

	.field :global([type='range']) {
		max-width: 15rem;
	}

	.ui {
		opacity: 0.5;
		margin-right: 1rem;
		cursor: pointer;
		transition: opacity linear 0.2s, box-shadow linear 0.2s;
	}

	.ui:hover {
		opacity: 1;
	}

	input:checked + .ui {
		opacity: 1;
		box-shadow: 0 0 0 4px var(--color);
	}

	form :global(h1) {
		margin-bottom: 2rem;
	}

	.field {
		margin-bottom: 1rem;
	}

	.checkbox input {
		display: none;
	}

	.checkbox label {
		position: relative;
		display: flex;
		align-items: center;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.checkbox label:before {
		content: '';
		display: inline-block;
		width: 3rem;
		height: 1.5rem;
		margin-right: 0.5rem;
		background-color: #333;
		border-radius: 1rem;
		transition: background-color linear 0.2s;
	}

	.checkbox label:after {
		content: '';
		position: absolute;
		left: 1px;
		top: 1px;
		width: calc(1.5rem - 2px);
		height: calc(1.5rem - 2px);
		border-radius: 50%;
		background-color: #fff;
		transition: transform ease-in-out 0.2s;
	}

	.checkbox input:checked + label:before {
		background-color: var(--color);
	}

	.checkbox input:checked + label:after {
		transform: translateX(calc(100% + 2px));
	}
</style>
