<script lang="ts">
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import AccountTitle from 'components/AccountTitle';
	import { repositories, customLists } from 'shared/stores/default.store';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import Icons from 'components/icons';

	let listName: string;

	let selectedRepoId: string;
	let repositoriesIds: string[] = [];

	const onSubmit = event => {
		event.preventDefault();

		function uuidv4() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
				(
					c ^
					(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
				).toString(16),
			);
		}

		const list: CustomListType = {
			id: uuidv4(),
			name: listName,
			repositoriesIds,
		};

		customLists.update(_list => [..._list, list]);
	};

	const deleteRepository = id => {
		const newRepositoriesIds = repositoriesIds.filter(repo => repo !== id);
		repositoriesIds = [...newRepositoriesIds];
	};
</script>

<style>
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

	form :global(h1) {
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

	[type='text'] {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: #fff;
	}

	[type='submit'] {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	[type='submit']:disabled {
		opacity: 0.5;
	}

	.bar {
		display: flex;
		justify-content: flex-end;
	}
</style>

<form on:submit={onSubmit}>
	<AccountTitle>Nouvelle liste</AccountTitle>
	<fieldset>
		<legend>Nom de la liste</legend>
		<p class="intro">
			Choisissez un nom pour votre liste, il apparaitra dans l'onglet.
		</p>
		<input autofocus bind:value={listName} id="list-name" type="text" />
	</fieldset>

	{#if $repositories.length}
		<fieldset>
			<legend>Repositories</legend>
			<p class="intro">
				Choisissez parmi les repositories auxquels vous êtes abonnés. Skizzle
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
							{#if $repositories.find(({ repositoryId }) => repo == repositoryId).projectName}
								{$repositories.find(({ repositoryId }) => repo == repositoryId).projectName}
								/
							{/if}
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
	<div class="bar">
		<input disabled={!listName} type="submit" value="Créer la liste" />
	</div>
</form>
