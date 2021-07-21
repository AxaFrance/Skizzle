<script lang="ts">
	import { checkRepository } from '../../utils';
	import { repositories } from '../../shared/stores/default.store';
	import type { RepositoryType } from '../../models/skizzle/RepositoryType';

	export let search: string;
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
		color: var(--color);
	}

	.container {
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
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
		color: var(--color);
		cursor: pointer;
	}

	.follow:hover {
		text-decoration: none;
	}
</style>

<div class="container">
	<h2>Résultats pour "<b>{search}</b>"</h2>
	{#if repos}
		<ul class="repo-projects">
			{#each repos as repository}
				<li class="repo-project">
					<span class="name">{repository.fullName || (repository.projectName ? repository.projectName + ' / ' : '') + repository.name}</span>
					<input
						type="checkbox"
						id={repository.repositoryId}
						checked={$repositories.some(x => x.repositoryId === repository.repositoryId)}
						on:change={event => checkRepository(event, repository)} />
					<label
						class="follow"
						for={repository.repositoryId}
					>
						{$repositories.some(x => x.repositoryId === repository.repositoryId) ? 'Ne plus suivre' : 'Suivre'}
					</label>
				</li>
			{/each}
		</ul>
	{/if}
</div>
