<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import Button from 'components/Button';
	import MultiSelector from 'components/MultiSelector';
	import Checkbox from 'components/Checkbox';
	import Switch from 'components/Switch';
	import type { CustomListType,PullRequestType } from 'models/skizzle';
	import { remote } from 'shared/remote';
	import {
	customLists,isElectron,notifications,
	pullRequests,
	repositories
	} from 'shared/stores/default.store';
	import { getLabelsFrom,getPullRequestsFromCustomSettings } from 'shared/utils';
	import { v4 as uuidv4 } from 'uuid';

	export let onDone: () => void;
	export let isInCreationMode: boolean = false;
	export let customList: CustomListType = {
		id: uuidv4(),
		name: '',
		tags: [],
		repositoriesId: []
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

	const onTagsChange = (event: CustomEvent<{ value: string[] }>) => {
		customList.tags = event.detail.value;
	};

	const onRepositoriesChange = (event: CustomEvent<{ value: string[] }>) => {
		customList.repositoriesId = event.detail.value;
	};


	$: pullRequestsList = getPullRequestsFromCustomSettings($pullRequests, customList)
		.filter(pr => !!pr)
		.map(x => ({
			pullRequest: x,
			show:
				!customList.hiddenPullRequestsIds ||
				!customList.hiddenPullRequestsIds.some(y => y === x.pullRequestId)
		})) as { pullRequest: PullRequestType; show: boolean }[];

		const repositoriesSelectorList = $repositories.reduce((acc, curr )=> {
			acc[curr.repositoryId] = curr.fullName ? curr.fullName : `${curr.projectName}/${curr.name}`
			return acc;
		}, {})
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
			<label for="list-name">List name</label>
			<input placeholder="Give your list a name" id="list-name" type="text" bind:value={customList.name} />
		</div>

		<div class="field">
			<MultiSelector
				value={customList.repositoriesId}
				on:change={onRepositoriesChange}
				list={repositoriesSelectorList}
				placeholder="Start typing a repository name..."
				label="View pull requests only from these repositories"
				noMatchError="Doesn't match any of your repositories."
				alreadySelectedError="This repository is already selected."
			/>
		</div>

		<div class="field">
			<MultiSelector
				value={customList.tags}
				on:change={onTagsChange}
				list={getLabelsFrom($pullRequests).sort().reduce((acc,curr) => {
					acc[curr] = curr;
					return acc;
				}, {})}
				placeholder="Start typing a tag name..."
				label="Filter pull requests by tags"
				alreadySelectedError="This tag is already selected."
				allowFreeInput
			/>
		</div>

		<div class="field">
			<p class="label">Hide pull requests</p>
			<ul>
				<li>
					<Checkbox bind:checked={customList.withoutOwnedByUserPR} label="I created" />
				</li>
				<li>
					<Checkbox bind:checked={customList.withoutOldPR} label="Older than 30 days" />
				</li>
				<li>
					<Checkbox bind:checked={customList.withoutConflict} label="In conflicts" />
				</li>
				<li>
					<Checkbox bind:checked={customList.withoutDraft} label="Draft" />
				</li>
				<li>
					<Checkbox bind:checked={customList.withoutCheckedByOwner} label="I already approved" />
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
								<Checkbox
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
	<Button light on:click={() => onDone()}>Cancel</Button>
	<Button on:click={() => saveSettings()} disabled={!customList.name}
		>Save</Button
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
		margin-bottom: 2rem;
	}

	label, .label {
		display: inline-block;
		margin-bottom: 0.5rem;
	}

	[type='text'] {
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

	ul li:not(:last-child) {
		border-bottom: 1px solid #666;
	}

	.action {
		display: flex;
		justify-content: flex-end;
	}

	:global(.isListDisplayed) {
		margin-bottom: 0.2rem;
	}

	.marker {
		position: relative;
		padding: 0 0.5rem;
		border-radius: 4px;
		background-color: #555;
	}

	.repositories {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}
</style>
