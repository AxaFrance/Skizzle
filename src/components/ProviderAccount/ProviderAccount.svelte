<script lang="ts">
	import AccountSummary from 'components/AccountSummary';
	import AccountTitle from 'components/AccountTitle';
	import AddAccount from 'components/AddAccount';
	import FollowedRepositories from 'components/FollowedRepositories';
	import SearchRepos from 'components/SearchRepos';
	import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { Service } from 'services/Service';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import { isLoading } from 'shared/stores/default.store';

	export let provider: ProviderEnum = null;
	export let light = false;
	export let follow = false;
</script>

{#if $isLoading}
	<p class="loader">Loading ...</p>
{:else if $clientAuthenticated[`is${provider}Authenticated`]}
	{#await Service.getProfile(provider)}
		<p class="loader">Loading your profile ...</p>
	{:then profile}
		{#if profile}
			{#if follow}
				<SearchRepos {profile} />
			{:else if light}
				<AccountSummary {profile} />
			{:else}
				<section>
					<AccountTitle>Your {provider} account</AccountTitle>
					<AccountSummary {profile} />
				</section>
				<div class="content">
					<section>
						<AccountTitle>Follow a repository</AccountTitle>
						<p class="intro">Search for a project or repository name.</p>
						<SearchRepos {profile} />
					</section>
					<FollowedRepositories {profile} />
				</div>
			{/if}
		{/if}
	{:catch}
		<p class="error">Unable to get your profile because of a technical error.</p>
	{/await}
{:else}
	<AddAccount text={`Add a ${provider} account`} {provider} />
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
