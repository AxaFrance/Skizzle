<script lang="ts">
	import { checkProject, checkRepository } from 'utils';
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import type { ProjectType } from 'models/skizzle/ProjectType';
	import Icons from 'components/icons';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import type { RepositoryType } from 'models/skizzle/RepositoryType';

	export let provider;
	export let search: string;
	export let projects: ProjectType[];

	export let repos: RepositoryType[];
</script>

<style>
	ul {
		list-style: none;
	}

	h2 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	h2 b {
		font-style: italic;
		color: #ff8a00;
	}

	.container {
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.projects > li {
		margin-bottom: 0.5rem;
	}

	.project {
		position: relative;
	}

	.project label {
		display: block;
		padding: 1rem;
		cursor: pointer;
		border-radius: 8px;
		background-color: #6b6b6b;
		transition: background-color linear 0.2s;
	}

	.project label:hover {
		background-color: #7d7d7d;
	}

	.project input {
		display: none;
	}

	.project :global(svg) {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		transition: transform linear 0.2s;
	}

	.open :global(svg) {
		transform: translateY(-50%) rotate(180deg);
	}

	.repos {
		padding-left: 1rem;
	}

	.repo {
		position: relative;
		display: flex;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		border-left: 4px solid #ff8a00;
	}

	.repo:before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 8px;
		height: 4px;
		border-radius: 0 8px 8px 0;
		background-color: #ff8a00;
		transform: translateY(-50%);
	}

	.repo input {
		display: none;
	}

	.repo label {
		font-size: 0.8rem;
		text-decoration: underline;
		color: #ff8a00;
		cursor: pointer;
	}

	.repo label:hover {
		text-decoration: none;
	}

	.name {
		margin-right: auto;
	}

	.repo-project {
		display: flex;
		padding: 1rem;
		border-radius: 8px;
		background-color: #6b6b6b;
	}

	.repo-project input {
		display: none;
	}

	.repo-project:not(:last-child) {
		margin-bottom: 0.5rem;
	}

	.follow {
		font-size: 0.8rem;
		text-decoration: underline;
		color: #ff8a00;
		cursor: pointer;
	}

	.follow:hover {
		text-decoration: none;
	}
</style>

<div class="container">
	<h2>Résultats pour "<b>{search}</b>"</h2>
	{#if projects}
		<ul class="projects">
			{#each projects as project}
				<li>
					<div class="project" class:open={project.checked}>
						<input
							type="checkbox"
							id={project.projectId}
							checked={project.checked}
							on:change={event => checkProject(event, project)}
							disabled={$isFetchingData} />
						<label for={project.projectId}> {project.name} </label>
						<Icons.ArrowDown />
					</div>
					<ul class="repos">
						{#each $repositories.filter(x => x.projectId === project.projectId) as repository}
							<li class="repo">
								<span class="name">{repository.name}</span>
								<input
									type="checkbox"
									id={repository.repositoryId}
									checked={repository.checked}
									on:change={event => checkRepository(event, repository)}
									disabled={$isFetchingData} />
								<label
									for={repository.repositoryId}>{repository.checked ? 'Ne plus suivre' : 'Suivre'}</label>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	{/if}

	{#if repos}
		<ul class="repo-projects">
			{#each repos as repository}
				<li class="repo-project">
					<span class="name">{repository.fullName || repository.name}</span>
					<input
						type="checkbox"
						id={repository.repositoryId}
						checked={$repositories.some(x => x.repositoryId === repository.repositoryId && x.checked)}
						on:change={event => checkRepository(event, repository)}
						disabled={$isFetchingData} />
					<label
						class="follow"
						for={repository.repositoryId}>{$repositories.some(x => x.repositoryId === repository.repositoryId && x.checked) ? 'Ne plus suivre' : 'Suivre'}</label>
				</li>
			{/each}
		</ul>
	{/if}
</div>
