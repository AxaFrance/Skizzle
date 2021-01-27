<script>
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import { deleteRepository } from 'utils';
	import Icons from 'components/icons';
	import AccountTitle from 'components/AccountTitle';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import type { ProfileType } from 'models/skizzle';
	import Modale from 'components/Modale';
	import { HighlightSvelte } from "svelte-highlight";
	import { a11yDark } from "svelte-highlight/styles";
  import { json } from "svelte-highlight/languages";
	import Tabs from 'components/Tabs';
	import { copyToClipboard } from 'shared/utils';

	export let profile: ProfileType;
	let shareDisplayed:boolean = false;
	let currentTab:string = 'export';

	const changeTab = (tab:string) => currentTab = tab;

	$: followedRepositories = $repositories.filter(
		({ checked, provider }) => checked && provider === profile.provider,
	);

</script>

<svelte:head>
  {@html a11yDark}
</svelte:head>
<section>
	<AccountTitle>
		Vos repositories suivis
		<button title="Partager votre liste" on:click={() => shareDisplayed = true}><Icons.Share /></button>
	</AccountTitle>
	<p class="intro">
		Vous suivez actuellement <b>{followedRepositories.length}</b>
		repositories sur {ProviderEnum[profile.provider]}.
	</p>
	<ul>
		{#each followedRepositories as repository}
			<li>
				{#if repository.projectName}
					<span class="project">{repository.projectName}</span>
				{/if}
				{#if repository.fullName}
					<span class="repository">{repository.fullName}</span>
				{:else}<span class="repository">{repository.name}</span>{/if}
				{#if repository.gitUrl}
				<button
					on:click={() => copyToClipboard(repository.gitUrl, `L'url du repository est copiée dans le presse-papiers.`)}
					disabled={$isFetchingData}
					title="Copier l'url de ce repository"
				>
					<Icons.Copy />
				</button>
				{/if}
				<button
					title="Se désabonner de ce repository"
					on:click={() => deleteRepository(repository)}
					disabled={$isFetchingData}
				>
					<Icons.Delete />
				</button>
			</li>
		{/each}
	</ul>
	{#if shareDisplayed}
	<Modale onClose={() => shareDisplayed = false} fullHeight={false}>
		<AccountTitle>Importer / Exporter une liste de repositories.</AccountTitle>
		<p class="intro">Skizzle permet d'importer et d'exporter une liste de repositories suivis. Vous pouvez partager votre liste avec les autres membres de votre équipe.</p>
		<Tabs
			onChange={changeTab}
			current={currentTab}
			data={{ import: { order: 1, label: 'Importer' }, export : { order: 0, label: 'Exporter' }}}
		/>
		<div class="container">
			{#if currentTab === 'export'}
			<p class="intro">Copiez le code JSON et importez-le dans une autre instance de Skizzle.</p>
			<div class="code">

				<HighlightSvelte language={json} code={JSON.stringify(followedRepositories, undefined, 2)} />
				<button
				class="copy"
						on:click={() => copyToClipboard(JSON.stringify(followedRepositories, undefined, 2), 'Code copié dans le presse-papier.')}
						disabled={$isFetchingData}
						title="Copier l'url de ce repository"
					>
					<Icons.Copy />
				</button>
			</div>
			{:else}
				<p class="intro">Collez le code JSON provenant d'une autre instance de Skizzle.</p>
				<textarea placeholder="Collez ici votre code JSON"></textarea>
				<div class="bar">
					<input type="submit" class="import-button" value="Importer les repositories" />
				</div>
			{/if}
		</div>
	</Modale>
	{/if}
</section>

<style>
	textarea {
		margin-bottom: 0.5rem;
		color: #fff;
		width: 100%;
		height: 10rem;
		resize: vertical;
		padding: 1rem;
		border: none;
		border-radius: 4px;
		background-color: #2b2b2b;
	}

	.import-button {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}
	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}

	b {
		color: var(--color);
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.project {
		margin-right: 0.5rem;
	}

	.project:after {
		content: '/';
		margin-left: 0.5rem;
		color: #ccc;
	}

	.repository {
		margin-right: auto;
	}

	button {
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.5;
	}

	button:last-child {
		margin-left: 1rem;
	}

	section :global(nav) {
		margin-right: -2rem;
		margin-left: -2rem;
	}

	.container {
		margin-left: -2rem;
		margin-right: -2rem;
		margin-bottom: -2rem;
		padding: 1rem;
		border-radius: 0 0 8px 8px;
		background-color: #4e4e4e;
	}

	.code {
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}

	.copy {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	:global(.modale) :global(h1) {
		margin-bottom: 1rem;
	}

	:global(.modale) :global(.content) {
		display: flex;
		flex-direction: column;
	}

	.bar {
		display: flex;
		justify-content: flex-end;
	}
</style>
