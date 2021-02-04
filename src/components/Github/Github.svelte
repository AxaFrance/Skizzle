<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import {
		isFetchingData,
		isLoading,
	} from 'shared/stores/default.store';
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

	$: fetchedGithubRepositories = [] as RepositoryType[];

	const onSearchSubmit = async (query: string) => {
		search = query;
		fetchedGithubRepositories = await Service.getRepositories(
			ProviderEnum.Github,
			{
				query,
			},
		);
	};

	const onSearchCancel = () => {
		search = '';
	};
</script>

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

{#if $isLoading}
	<p>Chargement...</p>
{:else if $clientAuthenticated.isGithubAuthenticated}
	{#await Service.getProfile(ProviderEnum.Github)}
		<p>Chargement...</p>
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
					disabled={$isFetchingData}
					placeholder="Rechercher un repository" />

				{#if search}
					<SearchResults
						{search}
						repos={fetchedGithubRepositories} />
				{/if}
			</section>
			<FollowedRepositories {profile} />
		</div>
	{:catch}
		<p>Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Github"
		onClick={() => authorize(ProviderEnum.Github)} />
{/if}
