<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import Button from 'components/Button';
	import Icons from 'components/icons';
	import Tabs from 'components/Tabs';
	import type { RepositoryType } from 'models/skizzle';
	import { Service } from 'services';
	import { notifications, pullRequests, repositories } from 'shared/stores/default.store';
	import { copyToClipboard, isJson } from 'shared/utils';
	import { HighlightAuto } from 'svelte-highlight';
	import 'svelte-highlight/src/styles/dark.css';
	import { v4 as uuidv4 } from 'uuid';

	export let followedRepositories: RepositoryType[];
	export let shareDisplayed: boolean;

	let currentTab: string = 'import';
	let code: string = '';

	const changeTab = ({ detail: { tab } }) => (currentTab = tab);

	const importCode = async () => {
		let repositoriesImported = JSON.parse(code) as RepositoryType[];
		repositoriesImported = repositoriesImported
			.filter(repository => {
				return (
					(repository.repositoryId &&
						repository.gitUrl &&
						repository.name &&
						repository.provider &&
						repository.organizationName &&
						repository.projectId &&
						repository.projectName) ||
					(repository.fullName && repository.owner)
				);
			})
			.filter(y => !$repositories.some(z => z.repositoryId === y.repositoryId));

		repositories.update(x => [...x, ...repositoriesImported]);

		const values = (
			await Promise.all(
				repositoriesImported.map(repository => {
					return Service.getPullRequests(repository.provider, {
						repository
					});
				})
			)
		).reduce((prev, curr) => prev.concat(curr), []);

		pullRequests.update(x =>
			[...x, ...values].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
		);

		notifications.update(notifications => [
			...notifications,
			{
				text: 'Repositories importés',
				id: uuidv4()
			}
		]);

		shareDisplayed = false;
	};

	const getExportCode = (): RepositoryType[] => {
		return followedRepositories.map(repository => ({
			...repository
		}));
	};
</script>

<AccountTitle>Import / Export repositories list.</AccountTitle>
<p class="intro">
	Skizzle can import and export lists of followed repositories, so you can share it with
	your team.
</p>
<Tabs
	on:change={changeTab}
	current={currentTab}
	data={{
		import: { order: 0, label: 'Import' },
		export: { order: 1, label: 'Export' }
	}}
/>
<div class="container">
	{#if currentTab === 'export'}
		<p class="intro">Copy JSON code et import it in another Skizzle instance.</p>
		<div class="code">
			<HighlightAuto code={JSON.stringify(getExportCode(), undefined, 2)} />
			<button
				class="copy"
				on:click={() =>
					copyToClipboard(
						JSON.stringify(getExportCode(), undefined, 2),
						'Copied in clipboard.'
					)}
				title="Copy repository url"
			>
				<Icons.Copy />
			</button>
		</div>
	{:else}
		<form on:submit|preventDefault={importCode}>
			<p class="intro">
				Paste the JSON code from another Skizzle instance. <b>Warning</b> Skizzle will delete all
				current followed repositories.
			</p>
			<textarea bind:value={code} placeholder="Paste here your JSON code" />
			<div class="bar">
				<Button disabled={!isJson(code)} type="submit">Import repositories</Button>
			</div>
		</form>
	{/if}
</div>

<style>
	textarea {
		margin-bottom: 0.5rem;
		color: #fff;
		width: 100%;
		height: 10rem;
		resize: vertical;
		padding: 1rem;
		border: none;
		border-radius: 4px;
		background-color: #2b2b2b;
	}

	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}

	b {
		color: var(--color);
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

	button:last-child {
		margin-left: 1rem;
	}

	textarea {
		flex-grow: 1;
	}

	.container {
		flex-grow: 1;
		margin-left: -2rem;
		margin-right: -2rem;
		margin-bottom: -2rem;
		padding: 1rem;
		border-radius: 0 0 8px 8px;
		background-color: #4e4e4e;
	}

	form,
	.container {
		display: flex;
		flex-direction: column;
	}

	form {
		height: 100%;
	}

	.code {
		position: relative;
		border-radius: 4px;
		overflow: hidden;
		flex-grow: 1;
	}

	.code :global(pre),
	.code :global(code) {
		height: 100%;
	}

	.copy {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	:global(.modale) :global(h1) {
		margin-bottom: 1rem;
	}

	:global(.modale) :global(.content) {
		display: flex;
		flex-direction: column;
	}

	.bar {
		display: flex;
		justify-content: flex-end;
	}
</style>
