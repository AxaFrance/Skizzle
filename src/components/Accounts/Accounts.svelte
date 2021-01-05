<script lang="ts">
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import Tabs from 'components/Tabs';
	import AzureDevOps from 'components/AzureDevOps';
	import Github from 'components/Github';
	import Icons from 'components/icons';

	let currentProvider = ProviderEnum.Github;

	const views = {
		[ProviderEnum.AzureDevOps]: AzureDevOps,
		[ProviderEnum.Github]: Github,
	};
</script>

<style>
	.content {
		height: calc(100vh - 6rem);
		flex: 1 0 auto;
		padding: 1rem;
		overflow: auto;
		background-color: #4e4e4e;
	}
</style>

<Tabs
	current={currentProvider}
	onChange={provider => (currentProvider = provider)}
	data={{ [ProviderEnum.AzureDevOps]: 'Azure DevOps', [ProviderEnum.Github]: 'Github' }}
	icons={{ [ProviderEnum.AzureDevOps]: Icons.AzureDevOps, [ProviderEnum.Github]: Icons.Github }} />
<div class="content">
	<svelte:component this={views[currentProvider]} />
</div>
