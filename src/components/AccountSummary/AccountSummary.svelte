<script>
	import { Service } from 'services/Service';
	import {
		isFetchingData,
		organizations,
		projects,
		pullRequests,
		repositories,
	} from 'shared/stores/default.store';
	import Modale from 'components/Modale';
	import AccountTitle from 'components/AccountTitle';
	import Icons from 'components/icons';
	import { checkOrganization } from 'utils';
	import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { client } from 'shared/stores/authentication.store';
	import type { ProfileType } from 'models/skizzle/ProfileType';

	export let profile: ProfileType;
	export let withSettings:boolean = false;
	let isSettingsDisplayed = false;

	const onModaleClose = () => (isSettingsDisplayed = false);

	const logout = (provider: ProviderEnum) => {
		organizations.reset(provider);
		projects.reset(provider);
		repositories.reset(provider);
		pullRequests.reset(provider);
		client.update(n => ({
			...n,
			[provider]: {},
		}));
	};
</script>

<style>
	.container {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.avatar {
		width: 3rem;
		height: 3rem;
		margin-right: 0.5rem;
		overflow: hidden;
		border-radius: 50%;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	span {
		display: block;
	}

	.name {
		font-size: 1rem;
		font-weight: bold;
	}

	.email {
		font-size: 0.8rem;
		color: #ccc;
	}

	button {
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.5;
	}

	button + button {
		margin-left: 1rem;
	}

	.user {
		margin-right: auto;
	}

	.big {
		width: 6rem;
		height: 6rem;
	}

	.header {
		margin: -2rem -2rem 2rem;
		padding: 2rem 2rem 1rem;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		background-color: #444;
	}

	.header .avatar {
		margin-top: -2.5rem;
	}

	.organizations {
		list-style: none;
	}

	.organizations li {
		margin-bottom: 0.5rem;
	}
</style>

<div class="container">
	<div class="avatar">
		<img width="64" height="64" src={profile.avatar} alt={profile.name} />
	</div>
	<div class="user">
		<span class="name">{profile.name}</span>
		{#if profile.email}<span class="email">{profile.email}</span>{/if}
	</div>
	{#if withSettings}
		<button on:click={() => (isSettingsDisplayed = !isSettingsDisplayed)} title="Configuration"><Icons.AccountSettings /></button>
	{/if}
	<button on:click={() => logout(profile.provider)} title="Déconnexion"><Icons.Delete /></button>
</div>
{#if isSettingsDisplayed}
	<Modale onClose={onModaleClose}>
		{#await Service.getOrganizations(profile.provider, { profile })}
			<p>Chargement...</p>
		{:then organizations}
			<div class="container header">
				<div class="avatar big">
					{#await Service.getAvatar(profile.provider, profile.descriptor, organizations[0].organizationName) then avatar}
						<img width="64" height="64" src={avatar} alt={profile.name} />
					{/await}
				</div>
				<div class="user">
					<span class="name">{profile.name}</span>
					<span class="email">{profile.email}</span>
				</div>
			</div>
			<AccountTitle>Organisations</AccountTitle>
			<ul class="organizations">
				{#each organizations as organization}
					<li>
						<input
							type="checkbox"
							id={organization.organizationName}
							checked={organization.checked}
							on:change={event => checkOrganization(event, organization)}
							disabled={$isFetchingData} />
						<label for={organization.organizationName}>
							{organization.organizationName}
						</label>
					</li>
				{/each}
			</ul>
		{/await}
	</Modale>
{/if}
