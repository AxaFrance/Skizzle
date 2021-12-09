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
		if ($isElectron) {
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
					<h2>New version available! 🎉</h2>
					{#if progressState.enabled}
						<p>Downloading new version...</p>
					{:else}
						<p>It will be installed at next Skizzle restart.</p>
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
						<button class="button" on:click={checkForUpdateRestart}>Restart Skizzle</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<form>
		<Fieldset
			title="Refresh"
			intro="Set the refresh pull request lists delay."
			outro={`Skizzle will refresh data every ${
				$settings.refresh_delay !== 1 ? `${$settings.refresh_delay} minutes` : '60 seconds'
			}.`}
		>
			<div class="field">
				<Range bind:value={$settings.refresh_delay} min={5} step={5} max={30} />
			</div>
		</Fieldset>

		{#if $isElectron}
			<Fieldset
				title="Launch on startup"
				intro={`Skizzle can launch itself at your ${
					currentPlatform === 'macOS' ? 'Mac' : 'PC'
				} startup.`}
				outro={`${
					$settings.launch_at_startup
						? 'Skizzle will launch on '
						: 'Skizzle will not launch on '
				} ${currentPlatform} startup.`}
			>
				<Switch
					vspace={2}
					bind:active={$settings.launch_at_startup}
					label="Launch Skizzle at startup"
				/>
				<p class="text" />
			</Fieldset>
		{/if}

		<Fieldset
			title="Compact navigation"
			intro="Reduce the sidebar width."
		>
			<Switch bind:active={$settings.compact} label="Compact mode" />
		</Fieldset>

		{#if $isElectron}
			<Fieldset
				title="Advanced versions"
				intro="Automatically install Skizzle advanced updates. Warning: this could bring instability."
			>
				<Switch
					bind:active={$settings.preRelease}
					label="Install Skizzle advanced versions"
				/>
			</Fieldset>
		{/if}

		<Fieldset
			title="Cache"
			intro="If you encounter any dysfunctional behavior from Skizzle, cleaning the application is maybe necessary."
		>
			<button class="button" on:click={() => SkizzleCache.clear()}>Clean the cache</button>
		</Fieldset>

		<Fieldset title="Theme" intro="Change Skizzle user interface main color.">
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
