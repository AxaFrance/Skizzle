<script>
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import { deleteRepository } from 'utils';
	import Icons from 'components/icons';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import type { ProfileType } from 'models/skizzle';
	const app = require('electron').ipcRenderer;

	export let profile: ProfileType;

	const copyToClipboard = async (url: string) => {
		const result: boolean = await app.invoke('copy-to-clipboard', url);

		if (result) {
			alert(`${url} copied to clipboard!`);
		}
	}

	$: followedRepositories = $repositories.filter(
		({ checked, provider }) => checked && provider === profile.provider,
	);
</script>

<style>
	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}

	b {
		color: var(--color);
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.project {
		margin-right: 0.5rem;
	}

	.project:after {
		content: '/';
		margin-left: 0.5rem;
		color: #ccc;
	}

	.repository {
		margin-right: auto;
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
</style>

<p class="intro">
	Vous suivez actuellement <b>{followedRepositories.length}</b> repositories sur {ProviderEnum[profile.provider]}.
</p>
<ul>
	{#each followedRepositories as repository}
		<li>
			{#if repository.projectName}
				<span class="project">{repository.projectName}</span>
			{/if}
			{#if repository.fullName}
				<span class="repository">{repository.fullName}</span>
			{:else}<span class="repository">{repository.name}</span>{/if}
			<button on:click={() => copyToClipboard(repository.gitUrl)} disabled={$isFetchingData} title="Copy .git to clipboard">
				Copy
			</button>
			<button
				on:click={() => deleteRepository(repository)}
				disabled={$isFetchingData}>
				<Icons.Delete />
			</button>
		</li>
	{/each}
</ul>
