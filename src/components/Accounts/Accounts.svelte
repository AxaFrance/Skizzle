<script lang="ts">
	import { ProviderEnum } from '../../models/skizzle/ProviderEnum';
	import Tabs from '../Tabs';
	import AzureDevOps from '../AzureDevOps';
	import Github from '../Github';
	import Icons from '../icons';

	let currentProvider = ProviderEnum.AzureDevOps;

	const views = {
		[ProviderEnum.AzureDevOps]: AzureDevOps,
		[ProviderEnum.Github]: Github,
	};

	const tabs = {
		[ProviderEnum.AzureDevOps]: {
			label: 'Azure DevOps',
			icon: Icons.AzureDevOps,
			order: 0,
		},
		[ProviderEnum.Github]: {
			label: 'Github',
			icon: Icons.Github,
			order: 1,
		},
	};
</script>

<Tabs
	current={currentProvider}
	onChange={provider => (currentProvider = provider)}
	data={tabs}
/>
<div class="content">
	<svelte:component this={views[currentProvider]} />
</div>

<style>
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 6rem);
		flex: 1 0 auto;
		padding: 1rem;
		overflow: auto;
		background-color: #4e4e4e;
	}

	.content :global(.loader), .content :global(.error) {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
</style>
