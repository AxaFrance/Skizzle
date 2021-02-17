<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import { isFetchingData, isLoading } from 'shared/stores/default.store';
	import { authorize } from 'shared/token';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import AccountSummary from 'components/AccountSummary';
	import SearchResults from 'components/SearchResults';
	import FollowedRepositories from 'components/FollowedRepositories';
	import Search from 'components/Search';
	import type { RepositoryType } from 'models/skizzle';

	let search: string = '';

	const onSearchSubmit = (repositories: RepositoryType[]) => (
		query: string,
	): void => {
		search = query;

		fetchedAzureDevOpsRepositories = repositories.filter(
			({ projectName, name }) =>
				name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
				projectName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
		);
	};

	const onSearchCancel = (): void => {
		search = '';
	};

	$: fetchedAzureDevOpsRepositories = [] as RepositoryType[];
</script>

{#if $isLoading}
	<p class="loader">Chargement de l'application...</p>
{:else if $clientAuthenticated.isAzureDevOpsAuthenticated}
	{#await Service.getProfile(ProviderEnum.AzureDevOps)}
		<p class="loader">Chargement du profile...</p>
	{:then profile}
		{#await Service.getRepositories(ProviderEnum.AzureDevOps, { profile })}
			<p class="loader">Chargement de la liste des repositories...</p>
		{:then repositories}
			<section>
				<AccountTitle>Votre compte Azure DevOps</AccountTitle>
				<AccountSummary {profile} />
			</section>
			<div>
				<section>
					<AccountTitle>Suivre un nouveau repository</AccountTitle>
					<p class="intro">
						Cherchez le nom de son projet et/ou repository associé.
					</p>
					<Search
						onSubmit={onSearchSubmit(repositories)}
						onCancel={onSearchCancel}
						disabled={$isFetchingData}
						placeholder="Rechercher un projet ou un repos"
					/>

					{#if search}
						<SearchResults {search} repos={fetchedAzureDevOpsRepositories} />
					{/if}
				</section>
				<section>
					<FollowedRepositories {profile} />
				</section>
			</div>
		{:catch}
			<p class="error">Fetching profile failed.</p>
		{/await}
	{:catch}
		<p class="error">Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Azure DevOps"
		onClick={() => authorize(ProviderEnum.AzureDevOps)}
	/>
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	div {
		display: flex;
	}

	div section {
		flex: 0 0 50%;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	div section:first-child {
		padding-left: 0;
	}

	div section:last-child {
		padding-right: 0;
	}

	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}
</style>
