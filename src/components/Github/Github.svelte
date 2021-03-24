<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import { isLoading } from 'shared/stores/default.store';
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
	let isLoadingRepositories = false;

	$: fetchedGithubRepositories = [] as RepositoryType[];

	const onSearchSubmit = async (query: string) => {
		isLoadingRepositories = true;

		search = query;
		fetchedGithubRepositories = await Service.getRepositories(
			ProviderEnum.Github,
			{
				query,
			},
		);

		isLoadingRepositories = false;
	};

	const onSearchCancel = () => {
		search = '';
	};
</script>

{#if $isLoading}
	<p class="loader">Chargement...</p>
{:else if $clientAuthenticated.isGithubAuthenticated}
	{#await Service.getProfile(ProviderEnum.Github)}
		<p class="loader">Chargement...</p>
	{:then profile}
		<section>
			<AccountTitle>Votre compte Github</AccountTitle>
			<AccountSummary {profile} />
		</section>
		<div>
			<section>
				<AccountTitle>Suivre un nouveau repository</AccountTitle>
				<p class="intro">Cherchez le nom d'un repository.</p>

				<Search
					onSubmit={onSearchSubmit}
					onCancel={onSearchCancel}
					disabled={isLoadingRepositories}
					placeholder="Rechercher un repository"
				/>

				{#if search}
					{#if isLoadingRepositories}
						<p>Recherche en cours...</p>
					{:else}
						<SearchResults {search} repos={fetchedGithubRepositories} />
					{/if}
				{/if}
			</section>
			<FollowedRepositories {profile} />
		</div>
	{:catch}
		<p class="error">Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Github"
		onClick={() => authorize(ProviderEnum.Github)}
	/>
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	div {
		display: flex;
	}

	div :global(section) {
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
