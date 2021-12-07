<script lang="ts">
	import Fieldset from 'components/Fieldset';
	import Icons from 'components/icons';
	import Range from 'components/Range';
	import Switch from 'components/Switch';
	import { ThemeEnum } from 'models/skizzle';
	import SkizzleCache from 'shared/cache';
	import { remote } from 'shared/remote';
	import { isElectron, settings } from 'shared/stores/default.store';
	import { onMount } from 'svelte';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'Windows' : 'macOS';

	$: progressState = { enabled: false, percent: 50 } as {
		enabled: boolean;
		percent: number;
	};

	onMount(() => {
		console.log('settings');
		if ($isElectron) {
			setInterval(async () => {
				await remote.checkForUpdateRequest();
			}, 60000);

			remote.receive('check-for-update-response', () =>
				settings.update(x => ({ ...x, updateAvailable: true }))
			);
			remote.receive('download-progress-response', progress => {
				settings.update(x => ({ ...x, updateAvailable: false }));
				progressState = {
					enabled: true,
					percent: progress.percent
				};

				if (progress.percent === 100) {
					progressState = {
						enabled: false,
						percent: 0
					};
					settings.update(x => ({ ...x, updateAvailable: true }));
				}
			});
		}
	});

	const checkForUpdateRestart = () => remote.checkForUpdateRestart();
</script>

<div class="content">
	<div class="infos">
		<Icons.Logo />
		{#await remote.getVersion() then version}
			<p class="version"><b>Version</b> : {version}</p>
		{/await}
		{#if ($settings.updateAvailable || progressState.enabled) && $isElectron}
			<div class="update">
				<div class="info">
					<h2>Une nouvelle version est disponible ! 🎉</h2>
					{#if progressState.enabled}
						<p>Téléchargement de la nouvelle version de Skizzle.</p>
					{:else}
						<p>Elle sera installée automatiquement au prochain démarrage de Skizzle.</p>
					{/if}
				</div>
				<div class="state">
					{#if progressState.enabled}
						<div class="progress">
							<div class="progress--bar" style="width: {progressState.percent.toFixed(0)}%;" />
						</div>
						<p>
							{progressState.percent.toFixed(0)}%
						</p>
					{:else}
						<button class="button" on:click={checkForUpdateRestart}>Redémarrer Skizzle</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<form>
		<Fieldset
			title="Rafraichissement"
			intro="Réglez ici le délai qu'utilisera Skizzle pour rafraichir les données."
			outro={`Skizzle rafraichira les données toutes les ${
				$settings.refresh_delay !== 1 ? `${$settings.refresh_delay} minutes` : '60 secondes'
			}.`}
		>
			<div class="field">
				<Range bind:value={$settings.refresh_delay} min={5} step={5} max={30} />
			</div>
		</Fieldset>

		{#if $isElectron}
			<Fieldset
				title="Au démarrage"
				intro={`Si vous le souhaitez, Skizzle peut se lancer automatiquement au démarrage de votre ${
					currentPlatform === 'macOS' ? 'Mac' : 'PC'
				}.`}
				outro={`${
					$settings.launch_at_startup
						? 'Skizzle se lancera automatiquement à chaque démarrage de '
						: 'Skizzle ne se lancera pas au démarrage de '
				} ${currentPlatform}.`}
			>
				<Switch
					vspace={2}
					bind:active={$settings.launch_at_startup}
					label="Lancer Skizzle au démarrage"
				/>
				<p class="text" />
			</Fieldset>
		{/if}

		<Fieldset
			title="Menu compact"
			intro="Ce paramètre permet de réduire la largeur de la barre latérale de navigation."
		>
			<Switch bind:active={$settings.compact} label="Mode compact" />
		</Fieldset>

		{#if $isElectron}
			<Fieldset
				title="Versions avancées"
				intro="Installer automatiquement les mises à jour des versions avancées de Skizzle (Attention: ces versions peuvent être instables)."
			>
				<Switch
					bind:active={$settings.preRelease}
					label="Installer les versions avancées de Skizzle"
				/>
			</Fieldset>
		{/if}

		<Fieldset title="Langue" intro="Choisissez la langue de l'interface de Skizzle.">
			<select>
				<option value={$settings.language}>{$settings.language}</option>
			</select>
		</Fieldset>

		<Fieldset
			title="Cache"
			intro="Si vous rencontrez des dysfonctionnements avec Skizzle, il peut être nécessaire de vider le cache de l'application."
		>
			<button class="button" on:click={() => SkizzleCache.clear()}>Vider le cache</button>
		</Fieldset>

		<Fieldset title="Theme" intro="Choisissez un theme pour l'interface de Skizzle.">
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
								theme: value
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
	.infos {
		margin-bottom: 2rem;
	}

	.version {
		margin-bottom: 1rem;
		font-size: 12px;
	}

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
		margin-bottom: 1rem;
	}

	.field {
		margin-bottom: 1rem;
	}

	.update {
		position: relative;
		padding: 1rem 1rem 1rem 1.5rem;
		border-radius: 8px;
		background-color: #444;
		display: flex;
		justify-content: space-between;
	}

	.update:before {
		content: '';
		position: absolute;
		left: 0.5rem;
		top: 0.5rem;
		bottom: 0.5rem;
		width: 3px;
		border-radius: 8px;
		background-color: var(--color);
	}

	.update h2 {
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
		font-family: 'Roboto slab', serif;
	}

	.update p {
		font-size: 0.8rem;
	}

	.update .button {
		position: absolute;
		right: 1rem;
		top: 50%;

		transform: translateY(-50%);
	}

	.button {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	[type='url'] {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	.progress {
		text-align: center;
		background-color: #666;
		position: relative;
		height: 0.5rem;
		width: 200px;
		border-radius: 5px;
	}

	.progress--bar {
		height: 100%;
		background-color: var(--color);
		border-radius: 5px;
	}

	.state {
		display: flex;
		align-items: center;
	}

	.state p {
		margin-left: 0.5rem;
	}
</style>
