<script lang="ts">
	import type { PullRequestType } from 'models/skizzle/PullRequestType';
	import Icons from 'components/icons';
	import { ProviderEnum } from '../../models/skizzle/ProviderEnum';
	import { Service } from 'services/Service';
	export let pullRequest: PullRequestType;
	export let className: string;

	const images = {
		[ProviderEnum.Github]: Icons.Github,
		[ProviderEnum.AzureDevOps]: Icons.AzureDevOps,
	};
</script>

<style>
	.container {
		position: relative;
		width: 4rem;
		height: 4rem;
	}

	.avatar {
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	.badge {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 2px solid #fff;
		background-color: #333;
	}

	.badge :global(svg) {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60%;
		height: auto;
		transform: translateY(-50%) translateX(-50%);
	}
</style>

<div class={`container ${className || ''}`}>
	{#await Service.getAvatar(pullRequest.provider, pullRequest.user.avatar, pullRequest.organizationName)}
		<p>Chargement...</p>
	{:then avatar}
		<div class="avatar"><img src={avatar} alt={pullRequest.user.name} /></div>
		{#if pullRequest.provider}
			<div class="badge">
				<svelte:component this={Icons[pullRequest.provider]} />
			</div>
		{/if}
	{:catch}
		<p>Erreur</p>
	{/await}
</div>
