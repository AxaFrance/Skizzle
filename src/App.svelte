<script lang="ts">
	import Header from './components/Header';
	import { Service } from 'services/Service';
	import { clientAuthenticated } from './shared/stores/authentication.store';
	import { isFetchingData, isLoading, projects, repositories, pullRequests } from './shared/stores/default.store';
	import { authorize } from './shared/token';
	import { ProviderEnum } from './models/skizzle/ProviderEnum';
	import { checkOrganization, checkProject, checkRepository, deleteRepository } from './utils';
	import { Home } from './pages';

	let tabs: string = 'azure';
	let query: string = '';
	let search: string = '';

	const searchRepositories = async (provider: ProviderEnum) => {
		fetchedGithubRepositories = await Service.getRepositories(provider, { query });
	}

	$: fetchedProjects = $projects.filter(x => x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
	$: fetchedGithubRepositories = [];
</script>

<style src="./App.scss"></style>

<Header />
<main>
	<div>
		<h1>Authenticated</h1>
		<div>
			<button on:click={() => tabs = "azure"} disabled={tabs === "azure"}>Azure</button>
			<button on:click={() => tabs = "github"} disabled={tabs === "github"}>Github</button>
			{#if $pullRequests.length > 0}
				<button on:click={() => tabs = "prs"} disabled={tabs === "prs"}>PullRequests</button>
			{/if}
		</div>
			{#if $isLoading}
				<p>Chargement...</p>
			{:else}
			{#if tabs === 'azure'}
			<button on:click={() => authorize(ProviderEnum.AzureDevOps)} disabled={$clientAuthenticated.isAzureDevOpsAuthenticated}>
				{#if $clientAuthenticated.isAzureDevOpsAuthenticated}
					Connected on Azure Dev Ops
				{:else}
					Login Azure Dev Ops
				{/if}
			</button>
			{#if $clientAuthenticated.isAzureDevOpsAuthenticated}
				{#await Service.getProfile(ProviderEnum.AzureDevOps)}
					<p>Chargement...</p>	
				{:then profile}
						<h3>Azure Profile</h3>
						<img width="64" height="64" src={profile.avatar} alt={profile.name} />
						<p>Id: {profile.id}</p>
						<p>Name: {profile.name}</p>
						<p>Email: {profile.email}</p>
						{#await Service.getOrganizations(ProviderEnum.AzureDevOps, { profile })}
							<p>Chargement...</p>
						{:then organizations} 
							<h3>Azure Organizations</h3>
							<ul>
							{#each organizations as organization}
								<li>
									<label for={organization.organizationName}>
										{organization.organizationName}
										<input 
											type="checkbox" 
											id={organization.organizationName}
											checked={organization.checked}
											on:change={(event) => checkOrganization(event, organization)}
											disabled= {$isFetchingData}
										/>
									</label>
								</li>
							{/each}
							</ul>
						{/await}
				{:catch}
					<p>Fetching profile failed.</p>
				{/await}
				
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
										on:change={(event) => checkProject(event, project)}
										disabled={$isFetchingData}
									/>
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
												on:change={(event) => checkRepository(event, repository)}
												disabled={$isFetchingData}
											/>
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
			{/if}
		{:else if tabs === 'github'}
			<button on:click={() => authorize(ProviderEnum.Github)} disabled={$clientAuthenticated.isGithubAuthenticated}>
				{#if $clientAuthenticated.isGithubAuthenticated}
					Connected on Github
				{:else}
					Login Github
				{/if}
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
					<form on:submit|preventDefault={() => searchRepositories(ProviderEnum.Github)}>
						<input bind:value={query} disabled={$isFetchingData} />
					</form>
					<ul>
						{#each fetchedGithubRepositories as repository}
							<li>
								<label for={repository.repositoryId}>
									Name : {repository.name}
									FullName : {repository.fullName}
									<input 
										type="checkbox" 
										id={repository.repositoryId}
										checked={$repositories.some(x => x.repositoryId === repository.repositoryId && x.checked)}
										on:change={(event) => checkRepository(event, repository)}
										disabled={$isFetchingData}
									/>
								</label>
							</li>
						{/each}
						{#each $repositories.filter(x => x.provider === ProviderEnum.Github) as repository}
							<li>
								<label for={repository.repositoryId}>
									<strong>Name : {repository.name}</strong>
									FullName : {repository.fullName}
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
			{/if}
		{:else}
			<Home />
		{/if}
		

		{/if}
		
	</div>
</main>