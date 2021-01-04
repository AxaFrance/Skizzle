<script lang="ts">
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import AccountTitle from 'components/AccountTitle';
	import { projects, repositories } from 'shared/stores/default.store';

	let numberOfProjectsFields: number = 1;
	let numberOfRepositoriesFields: number = 1;

	let listName: string;
	let projectsIds: string[] = [];
	let repositoriesIds: string[] = [];

	const onSubmit = event => {
		event.preventDefault();
		console.log({ listName, repositoriesIds });
	};

	console.log({ $repositories });
</script>

<style>
	fieldset:not(:last-child) {
		margin-bottom: 2rem;
	}
	label {
		display: block;
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
			<div>
				<label for="project">Afficher uniquement les pull requests de ces projets</label>
				<select id="project">
					{#each $projects as project}
						<option value={project.projectId}>{project.name}</option>
					{/each}
				</select>
			</div>
		</fieldset>
	{/if}

	{#if $repositories.length}
		<fieldset>
			<div>
				<label for="repos">Afficher uniquement les pull requests de ces repositories</label>
				<select
					value={repositoriesIds[0]}
					id="repos"
					on:blur={e => {
						repositoriesIds.push(e.target.value);
					}}>
					{#each $repositories.filter(({ checked }) => checked) as repository}
						<option value={repository.repositoryId}>{repository.name}</option>
					{/each}
				</select>
			</div>
		</fieldset>
	{/if}

	<input disabled={!listName} type="submit" value="Créer la liste" />
</form>
