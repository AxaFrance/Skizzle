<script lang="ts">
	import AccountSummary from 'components/AccountSummary';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import FollowedRepositories from 'components/FollowedRepositories';
	import SearchRepos from 'components/SearchRepos';
	import type { ProfileType } from 'models/skizzle';
	import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import { isLoading } from 'shared/stores/default.store';
	import { authorize } from 'shared/token';

	export let provider: ProviderEnum = null;
	export let light = false;
	export let follow = false;

	let profile: ProfileType;

	$: fetchProfile = Service.getProfile(provider);
	$: fetchProfile.then(results => (profile = results));
</script>

{#if $isLoading}
	<p class="loader">Chargement ...</p>
{:else if $clientAuthenticated[`is${provider}Authenticated`]}
	{#await fetchProfile}
		<p class="loader">Chargement du profil ...</p>
	{:then}
		{#if follow}
			<SearchRepos {profile} />
		{:else if light}
			<AccountSummary {profile} />
		{:else}
			<section>
				<AccountTitle>Votre compte {provider}</AccountTitle>
				<AccountSummary {profile} />
			</section>
			<div class="content">
				<section>
					<AccountTitle>Suivre un nouveau repository</AccountTitle>
					<p class="intro">Cherchez le nom d'un projet ou repository.</p>
					<SearchRepos {profile} />
				</section>
				<FollowedRepositories {profile} />
			</div>
		{/if}
	{:catch}
		<p class="error">
			Impossible de récupérer votre profil à cause d'une erreur technique.
		</p>
	{/await}
{:else}
	<AddAccount
		text={`Ajouter un compte ${provider}`}
		onClick={() => authorize(provider)}
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

	.content {
		position: relative;
		flex: 1 0 auto;
	}
</style>
