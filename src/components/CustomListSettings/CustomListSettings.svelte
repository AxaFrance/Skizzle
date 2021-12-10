<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import Radio from 'components/Radio';
	import Switch from 'components/Switch';
	import TagInput from 'components/TagInput';
	import type { CustomListType, PullRequestType } from 'models/skizzle';
	import { remote } from 'shared/remote';
	import { client } from 'shared/stores/authentication.store';
	import {
		customLists,
		notifications,
		pullRequests,
		repositories,
		isElectron
	} from 'shared/stores/default.store';
	import { getLabelsFrom, getPullRequestsFromCustomSettings } from 'shared/utils';
	import { v4 as uuidv4 } from 'uuid';

	export let onDone: () => void;
	export let isInCreationMode: boolean = false;
	export let customList: CustomListType = {
		id: uuidv4(),
		name: '',
		tags: []
	} as CustomListType;

	let isListDisplayed = false;

	const onImport = async () => {
		const result: any = await remote.fileImport();

		readFile(result);
	};

	const onChangeFile = (event: Event) => {
		const { files } = event.target as HTMLInputElement;

		const reader = new FileReader();
		reader.onloadend = () => {
			const content = reader.result as string;
			readFile(content);
		};
		reader.readAsDataURL(files[0]);
	};

	const readFile = (result: any) => {
		if (result) {
			customList = { ...JSON.parse(result), id: uuidv4() } as CustomListType;

			notifications.update(notifications => [
				...notifications,
				{
					text: 'Liste importée.',
					id: uuidv4()
				}
			]);
		}
	};

	const saveSettings = () => {
		updateSettings({
			...customList,
			hiddenPullRequestsIds: pullRequestsList.reduce((acc, curr) => {
				if (!curr.show) {
					acc.push(curr.pullRequest.pullRequestId);
				}

				return acc;
			}, [] as string[])
		});

		notifications.update(notifications => [
			...notifications,
			{
				text: `Liste ${isInCreationMode ? 'créée' : 'modifiée'}`,
				id: uuidv4()
			}
		]);

		onDone();
	};

	const updateSettings = (list: CustomListType) => {
		customLists.update(x => {
			const exist = ({ id }: CustomListType) => list.id === id;

			if (!x.some(exist)) {
				x = [...x, list];
			} else {
				x[x.indexOf(x.find(exist))] = list;
			}

			return x;
		});
	};

	const getTags = (event: CustomEvent<{ tags: string[] }>) => {
		customList.tags = event.detail.tags;
	};

	$: pullRequestsList = getPullRequestsFromCustomSettings($pullRequests, customList)
		.filter(pr => !!pr)
		.map(x => ({
			pullRequest: x,
			show:
				!customList.hiddenPullRequestsIds ||
				!customList.hiddenPullRequestsIds.some(y => y === x.pullRequestId)
		})) as { pullRequest: PullRequestType; show: boolean }[];
</script>

<div>
	<AccountTitle>
		{$customLists.some(x => x.id === customList.id) ? 'List modification' : 'New list'}
		{#if $isElectron}
			<button class="import" on:click={onImport}>Import</button>
		{:else}
			<input
				class="import"
				type="file"
				accept=".json"
				on:change={event => onChangeFile(event)}
			/>
		{/if}
	</AccountTitle>
	<div class="fields">
		<div class="field">
			<label for="list-name">List name :</label>
			<input id="list-name" type="text" bind:value={customList.name} />
		</div>
		<div class="field">
			<TagInput
				id="tags"
				label="View pull requests including tags :"
				suggestions={getLabelsFrom($pullRequests)}
				tags={customList.tags}
				on:tags={event => getTags(event)}
			/>
		</div>
		<div class="field">
			<label for="list-provider">View pull requests from provider :</label>
			<select id="list-provider" bind:value={customList.provider}>
				<option value="">-- Select a provider --</option>
				{#each Object.keys($client) as key}
					<option value={key}>
						{key}
					</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<label for="repo">View pull requests from repository :</label>
			<select
				id="repo"
				bind:value={customList.repositoryId}
				disabled={$repositories.length === 0}
			>
				<option value="">-- Select a repository --</option>
				{#each $repositories.filter(x => !customList.provider || x.provider === customList.provider) as repository}
					<option value={repository.repositoryId}>
						{repository.name}
					</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<p>Hide pull requests</p>
			<ul>
				<li>
					<Radio bind:checked={customList.withoutOwnedByUserPR} label="I created" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutOldPR} label="Older than 30 days" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutConflict} label="In conflicts" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutDraft} label="Draft" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutCheckedByOwner} label="I already approved" />
				</li>
			</ul>
		</div>
		{#if pullRequestsList.length > 0}
			<div class="field">
				<Switch
					vspace={1}
					bind:active={isListDisplayed}
					label="Hide specific pull requests"
				/>
				{#if isListDisplayed}
					<ul>
						{#each pullRequestsList.filter(pr => pr != null) as { pullRequest, show } (pullRequest.pullRequestId)}
							<li>
								<Radio
									on:change={() => (show = !show)}
									checked={!show}
									label={pullRequest.title}
								/>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</div>
<div class="action">
	<button class="cancel" on:click={() => onDone()}>Cancel</button>
	<button class="cta" on:click={() => saveSettings()} disabled={!customList.name}
		>Save</button
	>
</div>

<style>
	.import {
		padding: 0.5rem;
		color: var(--color);
		font-size: 1rem;
		border: none;
		background-color: transparent;
	}

	.field {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.2rem;
	}

	[type='text'] {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	ul {
		list-style: none;
		border-radius: 4px;
		background-color: #555;
	}

	li {
		padding: 0.5rem;
	}

	li:not(:last-child) {
		border-bottom: 1px solid #666;
	}

	.action {
		display: flex;
		justify-content: flex-end;
	}

	.cta {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	.cancel {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	:global(.isListDisplayed) {
		margin-bottom: 0.2rem;
	}
</style>
