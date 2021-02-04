<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import {
		isFetchingData,
		isLoading,
		projects
	} from 'shared/stores/default.store';
	import { authorize } from 'shared/token';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import AccountSummary from 'components/AccountSummary';
	import SearchResults from 'components/SearchResults';
	import FollowedRepositories from 'components/FollowedRepositories';
	import Search from 'components/Search';

	let search: string = '';

	$: fetchedProjects = $projects.filter(x =>
		x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
	);

	const onSearchSubmit = (query: string): void => {
		search = query;
	};

	const onSearchCancel = (): void => {
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

{#if $isLoading}
	<p>Chargement...</p>
{:else if $clientAuthenticated.isAzureDevOpsAuthenticated}
	{#await Service.getProfile(ProviderEnum.AzureDevOps)}
		<p>Chargement...</p>
	{:then profile}
		<section>
			<AccountTitle>Votre compte Azure DevOps</AccountTitle>
			<AccountSummary {profile} withSettings={true} />
		</section>
		<div>
			<section>
				<AccountTitle>Suivre un nouveau repository</AccountTitle>
				<p class="intro">Cherchez le nom de son projet associé.</p>
				<Search
					onSubmit={onSearchSubmit}
					onCancel={onSearchCancel}
					disabled={$isFetchingData}
					placeholder="Rechercher un projet" />

				{#if search}
					<SearchResults
						{search}
						projects={fetchedProjects} />
				{/if}
			</section>
			<section>
				<FollowedRepositories {profile} />
			</section>
		</div>
	{:catch}
		<p>Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Azure DevOps"
		onClick={() => authorize(ProviderEnum.AzureDevOps)} />
{/if}
