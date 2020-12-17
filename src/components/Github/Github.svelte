<!--<script lang="ts">
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
	import AzureDevOps from 'components/AzureDevOps';
	import Github from 'components/Github';

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
</script>-->

<p>Github</p>
<!-- <button
	on:click={() => authorize(ProviderEnum.Github)}
	disabled={$clientAuthenticated.isGithubAuthenticated}>
	{#if $clientAuthenticated.isGithubAuthenticated}
		Connected on Github
	{:else}Login Github{/if}
</button>
{#if $clientAuthenticated.isGithubAuthenticated}
	<h3>Github Profile</h3>
	{#await Service.getProfile(ProviderEnum.Github)}
		<p>Chargement...</p>
	{:then profile}
		<img width="64" height="64" src={profile.avatar} alt={profile.name} />
		<p>Id: {profile.id}</p>
		<p>Name: {profile.name}</p>
		<p>Email: {profile.email}</p>

		<h3>Github repositories</h3>
		<form
			on:submit|preventDefault={() => searchRepositories(ProviderEnum.Github)}>
			<input bind:value={query} disabled={$isFetchingData} />
		</form>
		<ul>
			{#each fetchedGithubRepositories as repository}
				<li>
					<label for={repository.repositoryId}>
						Name : {repository.name} FullName : {repository.fullName}
						<input
							type="checkbox"
							id={repository.repositoryId}
							checked={$repositories.some(x => x.repositoryId === repository.repositoryId && x.checked)}
							on:change={event => checkRepository(event, repository)}
							disabled={$isFetchingData} />
					</label>
				</li>
			{/each}
			{#each $repositories.filter(x => x.provider === ProviderEnum.Github) as repository}
				<li>
					<label for={repository.repositoryId}>
						<strong>Name : {repository.name}</strong> FullName : {repository.fullName}
						<button
							on:click={() => deleteRepository(repository)}
							disabled={$isFetchingData}>
							Delete
						</button>
					</label>
				</li>
			{/each}
		</ul>
	{:catch}
		<p>Fetching profile failed.</p>
	{/await}
{/if} -->
