<script lang="ts">
	const {remote} = require('electron');
	const fs = require('fs')

	import { v4 as uuidv4 } from 'uuid';
	import { pullRequests, customLists, notifications } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import Modale from 'components/Modale';
	import CustomListSettings from 'components/CustomListSettings';

	let creatingList: boolean = false;
	let modifyingListId: string = null;
	let currentTab: string = 'all';
	const dialog = remote.dialog;
	let customListsData;

	const closeModale = () => {
		creatingList = false;
		modifyingListId = null;
	};

	customLists.subscribe(value => {
		customListsData = value;
	});

const exportList = () => {
	const currentTabData = customListsData.filter(customList => customList.id == currentTab)[0]

	const options = {
    title: "Exporter la liste sous...",
    defaultPath : `${currentTabData.name}.json`,
    filters: [
        {name: 'Skizzle List', extensions: ['json']}
    ]
}
	const saveDialog = dialog.showSaveDialog(remote.getCurrentWindow(), options);

	saveDialog.then(function(saveTo) {
		fs.writeFileSync(saveTo.filePath, JSON.stringify(
			{
				name: currentTabData.name,
				repositoriesIds: currentTabData.repositoriesIds
			})
		)

		notifications.update(notifications => [
				...notifications,
				{
					text: "Liste exportée.",
					id: uuidv4(),
				},
			]);
	})

}

	const deleteList = () => {
		customLists.update(list => list.filter(_list => _list.id !== currentTab));
		notifications.update(notifications => [
				...notifications,
				{
					text: "Liste supprimée.",
					id: uuidv4(),
				},
			]);
		currentTab = 'all';
	};

	const filterList = list =>
		$pullRequests.filter(pullRequest =>
			list.repositoriesIds
				? list.repositoriesIds.includes(String(pullRequest.repositoryId))
				: true,
		);

	const getTabs = lists => {
		const tabs = {
			all: {
				label: 'Toutes',
				order: 0,
			},
		};

		lists.forEach((list, index) => {
			tabs[list.id] = {
				label: list.name,
				order: index + 1,
				counter: filterList(list).length,
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
	}

	.bar button {
		margin-left: 0.5rem;
		padding: 0.5rem;
		color: var(--color);
		border: none;
		background-color: transparent;
	}

	.no-pr {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
</style>

<Tabs
	current={currentTab}
	onChange={tab => (currentTab = tab)}
	data={tabs}
	onCreation={() => {
		creatingList = true;
	}} />

<div class="content">
	{#if currentTab !== 'all'}
		<div class="bar">
			<button
				on:click={() => {
					modifyingListId = currentTab;
				}}>Modifier</button>
			<button on:click={deleteList}>Supprimer</button>
			<button on:click={exportList}>Exporter</button>
		</div>
	{/if}
	{#if displayedList.length}
		<ul class="list">
			{#each displayedList as pullRequest}
				<li>
					<PullRequest {pullRequest} />
				</li>
			{/each}
		</ul>
	{:else}
		<p class="no-pr">Il n'y a aucune pull request à afficher dans cette liste.</p>
	{/if}
</div>
{#if creatingList || modifyingListId}
	<Modale onClose={closeModale}>
		<CustomListSettings id={modifyingListId} onDone={closeModale} />
	</Modale>
{/if}
