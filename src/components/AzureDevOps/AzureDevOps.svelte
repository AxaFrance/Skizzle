<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import {
		isFetchingData,
		isLoading,
		projects,
		repositories,
		pullRequests,
	} from 'shared/stores/default.store';
	import { authorize } from 'shared/token';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import {
		checkOrganization,
		checkProject,
		checkRepository,
		deleteRepository,
	} from 'utils';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import AccountSummary from 'components/AccountSummary';

	let query: string = '';
	let search: string = '';

	const searchRepositories = async (provider: ProviderEnum) => {
		fetchedGithubRepositories = await Service.getRepositories(provider, {
			query,
		});
	};

	$: fetchedProjects = $projects.filter(x =>
		x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
	);
	$: fetchedGithubRepositories = [];
</script>

<style>
</style>

<AccountTitle>Votre compte Azure DevOps</AccountTitle>
{#if $isLoading}
	<p>Chargement...</p>
{:else if $clientAuthenticated.isAzureDevOpsAuthenticated}
	{#await Service.getProfile(ProviderEnum.AzureDevOps)}
		<p>Chargement...</p>
	{:then profile}
		<AccountSummary {profile} />
		{#if fetchedProjects.length > 0 || $repositories.filter(x => x.provider === ProviderEnum.AzureDevOps).length > 0}
			<h3>Azure Repositories</h3>
			<input bind:value={search} disabled={$isFetchingData} />
		{/if}

		{#if fetchedProjects.length > 0}
			<h3>Azure Projects</h3>
			<ul>
				{#each fetchedProjects as project}
					<li>
						<label for={project.projectId}>
							{project.name}
							<input
								type="checkbox"
								id={project.projectId}
								checked={project.checked}
								on:change={event => checkProject(event, project)}
								disabled={$isFetchingData} />
						</label>
						<ul>
							{#each $repositories.filter(x => x.projectId === project.projectId) as repository}
								<li>
									<label for={repository.repositoryId}>
										{repository.name}
										<input
											type="checkbox"
											id={repository.repositoryId}
											checked={repository.checked}
											on:change={event => checkRepository(event, repository)}
											disabled={$isFetchingData} />
									</label>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		{/if}
		{#each $repositories.filter(x => x.checked && x.provider === ProviderEnum.AzureDevOps) as repository}
			<label for={repository.repositoryId}>
				<strong>Name : {repository.name}</strong>
				<button
					on:click={() => deleteRepository(repository)}
					disabled={$isFetchingData}>
					Delete
				</button>
			</label>
		{/each}
	{:catch}
		<p>Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Azure DevOps"
		onClick={() => authorize(ProviderEnum.AzureDevOps)} />
{/if}
