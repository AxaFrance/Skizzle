<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import AccountTitle from 'components/AccountTitle';
	import Fieldset from 'components/Fieldset';
	import {
		repositories,
		customLists,
		notifications,
	} from 'shared/stores/default.store';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import Icons from 'components/icons';
	const app = require('electron').ipcRenderer;

	export let onDone: () => void;
	export let id: string;

	let tags: string[] = $customLists.find(list => list.id === id)?.tags ?? [];

	let listName: string = $customLists.find(list => list.id === id)
		? $customLists.find(list => list.id === id).name
		: null;

	let selectedRepoId: string;
	let repositoriesIds: string[] = $customLists.find(list => list.id === id)
		? $customLists.find(list => list.id === id).repositoriesIds
		: [];

	let tag: string;

	const onImport = async () => {
		const result: any = await app.invoke('file-import');

		if (result) {
			const data = JSON.parse(result) as CustomListType;

			const list: CustomListType = {
				id: uuidv4(),
				...data,
			};

			customLists.update(_list => [..._list, list]);

			notifications.update(notifications => [
				...notifications,
				{
					text: 'Liste importée.',
					id: uuidv4(),
				},
			]);

			onDone();
		}
	};

	const onSubmit = (event): void => {
		event.preventDefault();

		if (event.submitter.id !== 'import') {
			if (id) {
				const list: CustomListType = {
					id,
					name: listName,
					repositoriesIds,
					tags,
				};

				customLists.update(_list =>
					_list.map(__list => {
						if (__list.id === id) {
							return list;
						}

						return __list;
					}),
				);
			} else {
				const list: CustomListType = {
					id: uuidv4(),
					name: listName,
					repositoriesIds,
					tags,
				};

				customLists.update(_list => [..._list, list]);
				notifications.update(notifications => [
					...notifications,
					{
						text: 'Liste crée.',
						id: uuidv4(),
					},
				]);
			}
			onDone();
		}
	};

	const onAddTag = (event: KeyboardEvent): void => {
		event.preventDefault();

		if (event.key === ';') {
			console.log(tag, tags, event.key);
			const result = tag.substring(0, tag.indexOf(';'));

			if (result) {
				tags = [...tags, result];
			}

			tag = '';
		} else if (event.key === 'Backspace' && !tag) {
			const result = tags.slice(0, tags.length - 1);

			tags = [...result];
		}
	};

	const deleteRepository = (id: string): void => {
		const newRepositoriesIds = repositoriesIds.filter(repo => repo !== id);
		repositoriesIds = [...newRepositoriesIds];
	};
</script>

<!-- svelte-ignore a11y-no-onchange a11y-autofocus -->
<form on:submit={onSubmit}>
	<AccountTitle>
		{id ? 'Modifier la liste' : 'Nouvelle liste'}
		<input
			id="import"
			on:click={onImport}
			type="submit"
			value={'Charger une liste'}
		/>
	</AccountTitle>
	<Fieldset
		title="Nom de la liste"
		intro="Choisissez un nom pour votre liste, il apparaitra dans l'onglet."
	>
		<input autofocus bind:value={listName} id="list-name" type="text" />
	</Fieldset>

	{#if $repositories.length}
		<Fieldset
			title="Repositories"
			intro={`Choisissez parmi les repositories auxquels vous êtes abonnés. Skizzle
				n'affichera que des pull requests de ces repositories dans votre liste${
					listName ? ` "${listName}"` : ''
				}.`}
		>
			<div class="field">
				<select bind:value={selectedRepoId} id="repos">
					{#if !selectedRepoId}
						<option default value="">Selectionnez un repository</option>
					{/if}
					{#if $repositories.filter(repo => repo.provider === ProviderEnum.AzureDevOps).length}
						<optgroup label="Azure Devops">
							{#each $repositories
								.filter(repo => repo.provider === ProviderEnum.AzureDevOps)
								.sort((a, b) => (a.projectName > b.projectName ? 1 : -1)) as repository}
								<option
									disabled={repositoriesIds.includes(repository.repositoryId)}
									value={repository.repositoryId}
								>
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
								.filter(repo => repo.provider === ProviderEnum.Github)
								.sort((a, b) => (a.name > b.name ? 1 : -1)) as repository}
								<option
									disabled={repositoriesIds.includes(repository.repositoryId)}
									value={repository.repositoryId}
								>
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
					}}
				>
					Ajouter
				</button>
			</div>
			{#if repositoriesIds.length}
				<p class="intro">
					{repositoriesIds.length}
					{repositoriesIds.length > 1
						? 'repositories sélectionnés'
						: 'repository sélectionné'}
				</p>
				<ul class="items-list">
					{#each repositoriesIds as repo}
						<li class="item">
							{#if $repositories.find(({ repositoryId }) => repo == repositoryId).projectName}
								{$repositories.find(({ repositoryId }) => repo == repositoryId)
									.projectName}
								/
							{/if}
							{$repositories.find(({ repositoryId }) => repo == repositoryId).name}
							<button
								class="remove"
								on:click={e => {
									e.preventDefault();
									deleteRepository(repo);
								}}
							>
								<Icons.Delete />
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="intro">Il n'y a aucun repository selectionné</p>
			{/if}
		</Fieldset>
	{/if}

	<Fieldset title="Tag" intro="Choisissez un tag, il apparaitra dans l'onglet.">
		<input id="list-name" type="text" bind:value={tag} on:keyup={onAddTag} />
	</Fieldset>

	<div class="bar">
		<input
			disabled={!listName}
			type="submit"
			value={id ? 'Modifier la liste' : 'Créer la liste'}
		/>
	</div>
</form>

<style>
	.intro {
		font-size: 0.8rem;
	}

	.intro:not(:last-child) {
		margin-bottom: 1rem;
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
