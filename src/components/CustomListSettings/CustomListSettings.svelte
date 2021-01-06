<script lang="ts">
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import AccountTitle from 'components/AccountTitle';
	import { projects, repositories } from 'shared/stores/default.store';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import Icons from 'components/icons';

	let numberOfProjectsFields: number = 1;
	let numberOfRepositoriesFields: number = 1;

	let listName: string;
	let projectsIds: string[] = [];

	let selectedRepoId: string;
	let repositoriesIds: string[] = [];

	const onSubmit = event => {
		event.preventDefault();
		console.log({ listName, projectsIds, repositoriesIds });
	};

	console.log({ $repositories });

	const deleteRepository = id => {
		const newRepositoriesIds = repositoriesIds.filter(repo => repo !== id);
		repositoriesIds = [...newRepositoriesIds];
		console.log({ repositoriesIds });
	};
</script>

<style>
	form {
		height: 100%;
		overflow: auto;
	}

	legend {
		font-family: 'roboto slab', serif;
	}

	fieldset {
		padding: 1rem;
		border: none;
		background-color: #555;
	}

	fieldset:not(:last-child) {
		margin-bottom: 2rem;
	}

	label {
		display: block;
	}

	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
	}

	.items-list {
		flex-wrap: wrap;
		list-style: none;
		display: flex;
	}

	.item {
		display: flex;
		align-items: center;
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		padding: 0.5rem;
		color: #fff;
		border-radius: 4px;
		background-color: var(--color);
	}

	.add {
		margin-left: 0.5rem;
		color: var(--color);
		cursor: pointer;
		background-color: transparent;
		border: none;
		transition: opacity linear 0.2s;
	}

	.add:hover {
		opacity: 0.8;
	}

	.add:disabled {
		opacity: 0.5;
	}

	.field {
		margin-bottom: 1rem;
	}

	.remove {
		margin-left: 0.5rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	.remove:hover {
		opacity: 0.5;
	}

	.remove :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	select {
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
	}
</style>

<form on:submit={onSubmit}>
	<AccountTitle>Nouvelle liste</AccountTitle>
	<fieldset>
		<div class="field">
			<label for="list-name">Nom de la liste</label>
			<input bind:value={listName} id="list-name" type="text" />
		</div>
	</fieldset>

	{#if $projects.length}
		<fieldset>
			<legend>Projets</legend>
			<div>
				<label for="project">Afficher uniquement les pull requests de ces projets</label>
				<select
					id="project"
					on:blur={e => {
						projectsIds.push(e.target.value);
					}}>
					{#each $projects as project}
						<option value={project.projectId}>{project.name}</option>
					{/each}
				</select>
			</div>
		</fieldset>
	{/if}

	{#if $repositories.length}
		<fieldset>
			<legend>Repositories</legend>
			<p class="intro">
				Choisissez parmi les repositories auxquels voue êtes abonnés. Skizzle
				n'affichera que des pull requests de ces repositories dans votre liste{listName ? ` "${listName}"` : ''}.
			</p>
			<div class="field">
				<select
					value={selectedRepoId}
					id="repos"
					on:change={e => {
						selectedRepoId = e.target.value;
					}}>
					{#if !selectedRepoId}
						<option>Selectionnez</option>
					{/if}
					{#if $repositories.filter(repo => repo.provider === ProviderEnum.AzureDevOps).length}
						<optgroup label="Azure Devops">
							{#each $repositories
								.filter(({ checked }) => checked)
								.filter(
									repo => repo.provider === ProviderEnum.AzureDevOps,
								) as repository}
								<option
									disabled={repositoriesIds.includes(repository.repositoryId)}
									value={repository.repositoryId}>
									{repository.projectName}
									/
									{repository.name}
								</option>
							{/each}
						</optgroup>
					{/if}
					{#if $repositories.filter(repo => repo.provider === ProviderEnum.Github).length}
						<optgroup label="Github">
							{#each $repositories
								.filter(({ checked }) => checked)
								.filter(repo => repo.provider === ProviderEnum.Github) as repository}
								<option
									disabled={repositoriesIds.includes(repository.repositoryId)}
									value={repository.repositoryId}>
									{repository.name}
								</option>
							{/each}
						</optgroup>
					{/if}
				</select>
				<button
					class="add"
					disabled={!selectedRepoId || repositoriesIds.includes(selectedRepoId)}
					on:click={() => {
						repositoriesIds = [...repositoriesIds, selectedRepoId];
					}}>Ajouter</button>
			</div>
			{#if repositoriesIds.length}
				<p class="intro">
					{repositoriesIds.length}
					{repositoriesIds.length > 1 ? 'repositories sélectionnés' : 'repository sélectionné'}
				</p>
				<ul class="items-list">
					{#each repositoriesIds as repo}
						<li class="item">
							{$repositories.find(({ repositoryId }) => repo == repositoryId).name}
							<button
								class="remove"
								on:click={() => deleteRepository(repo)}><Icons.Delete /></button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="intro">Il n'y a aucun repository selectionné</p>
			{/if}
		</fieldset>
	{/if}

	<input disabled={!listName} type="submit" value="Créer la liste" />
</form>
