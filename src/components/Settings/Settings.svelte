<script lang="ts">
	import Fieldset from 'components/Fieldset';
	import Icons from 'components/icons';
	import Range from 'components/Range';
	import Switch from 'components/Switch';
	import { ThemeEnum } from 'models/skizzle';
	import SkizzleCache from 'shared/cache';
	import { remote } from 'shared/remote';
	import { isElectron, settings } from 'shared/stores/default.store';
	import { bytesToSize } from 'shared/utils';
	import { onMount } from 'svelte';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'Windows' : 'macOS';
	let update: boolean = false;
	let version: string;

	$: progressState = { enabled: false, percent: 0, bytesPerSecond: 0 } as {
		enabled: boolean;
		percent: number;
		bytesPerSecond: number;
	};

	onMount(() => {
		if ($isElectron) {
			setInterval(async () => {
				version = await remote.checkForUpdateRequest();
			}, 60000);

			remote.receive('check-for-update-response', () => (update = true));
			remote.receive('download-progress-response', progress => {
				progressState = {
					enabled: true,
					percent: progress.percent,
					bytesPerSecond: progress.bytesPerSecond
				};

				if (progress.percent === 100) {
					setTimeout(() => {
						progressState = {
							enabled: false,
							percent: 0,
							bytesPerSecond: 0
						};
						update = true;
					}, 1000);
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
		{#if update && $isElectron}
			<div class="update">
				<h2>Une nouvelle version est disponible ! 🎉</h2>
				<p>Elle sera installée automatiquement au prochain démarrage de Skizzle.</p>
				<button on:click={checkForUpdateRestart}>Redémarrer Skizzle</button>
			</div>
		{/if}
		{#if progressState.enabled && $isElectron}
			<div class="downloaded">
				<p>Téléchargement de la nouvelle version de Skizzle (v.{version}).</p>
				<p>
					{progressState.percent.toFixed(0)}% {bytesToSize(progressState.bytesPerSecond)}
				</p>
			</div>
		{/if}
	</div>
	<form>
		<Fieldset
			title="Rafraichissement"
			intro="Réglez ici le délai qu'utilisera Skizzle pour rafraichir les données."
			outro={`Skizzle rafraichira les données toutes les ${
				$settings.refresh_delay !== 1 ? `${$settings.refresh_delay} minutes` : '60 secondes'
			}`}
		>
			<div class="field">
				<Range bind:value={$settings.refresh_delay} min={5} step={5} max={30} />
			</div>
		</Fieldset>

		{#if $isElectron}
			<Fieldset
				title="Au démarrage"
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
				title="Pré-version"
				intro="Ce paramètre permet d'accèder aux pré-version (Attention: ces versions peuvent être instables)."
			>
				<Switch bind:active={$settings.preRelease} label="Pré-version" />
			</Fieldset>
		{/if}

		<Fieldset title="Langue" intro="Choisissez ici la langue de l'interface de Skizzle.">
			<select>
				<option value={$settings.language}>{$settings.language}</option>
			</select>
		</Fieldset>

		{#if $isElectron}
			<Fieldset title="Proxy" intro="URL du serveur de proxy">
				<input id="proxy" type="url" bind:value={$settings.proxy} />
			</Fieldset>
		{/if}

		<Fieldset title="Cache" intro="Vider le cache de l'application.">
			<button on:click={() => SkizzleCache.clear()}>Vider le cache</button>
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

	.update button {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
		transform: translateY(-50%);
	}
</style>
