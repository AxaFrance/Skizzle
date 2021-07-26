<script lang="ts">
	import { Service } from '../../services/Service';
	import { clientAuthenticated } from '../../shared/stores/authentication.store';
	import { isLoading } from '../../shared/stores/default.store';
	import { ProviderEnum } from '../../models/skizzle/ProviderEnum';
	import AccountTitle from '../AccountTitle';
	import AddAccount from '../AddAccount';
	import AccountSummary from '../AccountSummary';
	import SearchResults from '../SearchResults';
	import FollowedRepositories from '../FollowedRepositories';
	import Search from '../Search';
	import type { ProfileType, RepositoryType } from '../../models/skizzle';

	let search: string = '';
	let isLoadingRepositories = false;
	
	const onSearchSubmit = (profile: ProfileType) => async (query: string) => {
		search = query;

		isLoadingRepositories = true;
		const result = await Service.getRepositories(ProviderEnum.AzureDevOps, {
			profile,
		});

		fetchedAzureDevOpsRepositories = result.filter(
			({ projectName, name }) =>
				name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
				projectName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
		);

		isLoadingRepositories = false;
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
		<p class="loader">Chargement du profil...</p>
	{:then profile}
		{#if profile}
			<section>
				<AccountTitle>Votre compte Azure DevOps</AccountTitle>
				<AccountSummary {profile} />
			</section>
			<div class="content">
				<section>
					<AccountTitle>Suivre un nouveau repository</AccountTitle>
					<p class="intro">Cherchez le nom de son projet et/ou repository associé.</p>
					<Search
						onSubmit={onSearchSubmit(profile)}
						onCancel={onSearchCancel}
						disabled={isLoadingRepositories}
						placeholder="Rechercher un projet ou un repos"
					/>

					{#if search}
						{#if isLoadingRepositories}
							<p>Recherche en cours...</p>
						{:else}
							<SearchResults {search} repos={fetchedAzureDevOpsRepositories} />
						{/if}
					{/if}
				</section>
				<section>
					<FollowedRepositories {profile} />
				</section>
			</div>
		{:else}
			<p class="error">Fetching profile failed.</p>
		{/if}
	{:catch}
		<p class="error">Fetching profile failed.</p>
	{/await}
{:else}
	<AddAccount
		text="Ajouter un compte Azure DevOps"
		provider={ProviderEnum.AzureDevOps}
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

	.content {
		position: relative;
		flex: 1 0 auto;
	}
</style>
