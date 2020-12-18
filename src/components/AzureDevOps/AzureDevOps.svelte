<script lang="ts">
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import {
		isFetchingData,
		isLoading,
		projects,
		repositories,
	} from 'shared/stores/default.store';
	import Icons from 'components/icons';
	import { authorize } from 'shared/token';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import AccountSummary from 'components/AccountSummary';
	import SearchResults from 'components/SearchResults';
	import FollowedRepositories from 'components/FollowedRepositories';

	let query: string = '';
	let search: string = '';

	$: fetchedProjects = $projects.filter(x =>
		x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
	);
</script>

<style>
	.search {
		position: relative;
		width: 20rem;
		margin-bottom: 2rem;
	}

	.search > :global(svg) {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.search input {
		width: 100%;
		padding: 1rem 2.5rem;
		color: #fff;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #848484;
	}

	.search input::placeholder {
		color: #4e4e4e;
	}

	.delete {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background-color: transparent;
		transform: translateY(-50%);
	}

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
			<AccountSummary {profile} />
		</section>
		<div>
			<section>
				<AccountTitle>Suivre un nouveau repository</AccountTitle>
				<p class="intro">Cherchez le nom de son projet associé.</p>
				<div class="search">
					<Icons.Search color="#4e4e4e" />
					<input
						bind:value={search}
						disabled={$isFetchingData}
						placeholder="Rechercher un projet" />
					{#if search}
						<button on:click={() => (search = '')} class="delete">
							<Icons.Delete color="#4e4e4e" />
						</button>
					{/if}
				</div>
				{#if search}
					<SearchResults {search} projects={fetchedProjects} />
				{/if}
			</section>
			<section>
				<AccountTitle>Vos repositories suivis</AccountTitle>
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
