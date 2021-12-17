<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { pullRequests, customLists, notifications } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import CustomListSettings from 'components/CustomListSettings';
	import Modale from 'components/Modale';
	import type { CustomListType } from 'models/skizzle';
	import { getPullRequestsFromCustomSettings } from 'shared/utils';
	import { remote } from 'shared/remote';
	import AccountTitle from 'components/AccountTitle';
	import Button from 'components/Button';
	import Icons from 'components/icons';

	let creatingList: boolean = false;
	let modifyingListId: string = null;
	let currentTab: string = 'all';
	let isConfirmToDeleteDisplayed:boolean = false;

	const closeModale = () => {
		creatingList = false;
		modifyingListId = null;
		isConfirmToDeleteDisplayed = false;
	};

	const exportList = async () => {
		const currentTabData = $customLists.find(customList => customList.id == currentTab);

		if (currentTabData) {
			const result: boolean = await remote.fileExport(currentTabData);

			if (result) {
				notifications.update(notifications => [
					...notifications,
					{
						text: 'List exported.',
						id: uuidv4()
					}
				]);
			}
		}
	};

	const confirmToDelete = () => {
		isConfirmToDeleteDisplayed = true;
	}

	const deleteList = () => {
		customLists.update(list => list.filter(_list => _list.id !== currentTab));
		notifications.update(notifications => [
			...notifications,
			{
				text: 'List deleted.',
				id: uuidv4()
			}
		]);
		currentTab = 'all';
		isConfirmToDeleteDisplayed = false;
	};

	const filterList = (customList: CustomListType) => getPullRequestsFromCustomSettings($pullRequests, customList).filter(
		x => !customList.hiddenPullRequestsIds?.some(y => x.pullRequestId === y)
	);

	const getTabs = (lists: CustomListType[]) => {
		const tabs = {
			all: {
				label: 'All',
				order: 0
			}
		};

		lists.forEach((list, index) => {
			tabs[list.id] = {
				label: list.name,
				order: index + 1,
				counter: filterList(list).length
			};
		});

		return tabs;
	};

	$: tabs = getTabs($customLists);
	$: displayedList =
		currentTab === 'all'
			? $pullRequests
			: filterList($customLists.find(({ id }) => id === currentTab));
</script>

<Tabs
	current={currentTab}
	onChange={tab => {
		currentTab = tab
		}}
	data={tabs}
	onCreation={() => {
		creatingList = true;
	}}
/>

{#if creatingList || modifyingListId}
	<Modale onClose={closeModale}>
		<CustomListSettings
			customList={$customLists.find(({ id }) => id === modifyingListId)}
			isInCreationMode={creatingList}
			onDone={closeModale}
		/>
	</Modale>
{/if}

{#if isConfirmToDeleteDisplayed}
	<Modale onClose={closeModale} fullHeight={false}>
		<AccountTitle>Do you confirm to delete this list ?</AccountTitle>
				<p class="modale-content">
					If you confirm, your list <b>{tabs[currentTab].label}</b> will be destroyed.
				</p>
				<div class="modale-bar">
					<Button
						danger
						class="button"
						on:click={deleteList}
						><Icons.Trash color="#fff" /> Yes, delete list.</Button
					>
					<Button
						clear
						class="button"
						on:click={() => {
							isConfirmToDeleteDisplayed = false;
						}}>Cancel</Button
					>
				</div>
	</Modale>
{/if}

<div class="content">
	{#if currentTab !== 'all'}
		<div class="bar">
			<button
				on:click={() => {
					modifyingListId = currentTab;
				}}
			>
				Modify
			</button>
			<button on:click={confirmToDelete}>Delete</button>
			<button on:click={exportList}>Export</button>
		</div>
	{/if}
	{#if displayedList.length}
		<ul class="list">
			{#each displayedList as pullRequest}
				{#if pullRequest}
					<li>
						<PullRequest {pullRequest} />
					</li>
				{/if}
			{/each}
		</ul>
	{:else}
		<p class="no-pr">No pull request in this list.</p>
	{/if}
</div>

<style>
	.content {
		position: relative;
		height: calc(100vh - 6rem);
		flex: 1 0 auto;
		padding: 1rem;
		overflow: auto;
		background-color: #4e4e4e;
	}

	.list {
		list-style: none;
	}

	.list li:not(:last-child) {
		margin-bottom: 1rem;
	}

	.bar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
    padding: 0.5rem 1rem;
		border-radius: 8px;
		background-color: #555;
	}

	.bar button {
		padding: 0.5rem;
		color: var(--color);
		border: none;
		background-color: transparent;
	}

	.bar button:not(:first-child) {
		margin-left: 0.5rem;
	}

	.no-pr {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
	
	.modale-bar {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 1rem;
	}

	.modale-bar :global(.button) {
		margin: 0 0.5rem;
	}

	.modale-content b {
		color: var(--color);
	}
	@media only screen and (max-width: 300px) {
		.content {
			padding: 0.2rem;
		}

		.bar {
			margin-bottom: 0;
			justify-content: center;
		}

		.list li:not(:last-child) {
			margin-bottom: 0.2rem;
			/* border-bottom: 1px solid #eee; */
		}
	}
</style>
