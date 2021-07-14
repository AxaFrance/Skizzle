<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import {
		pullRequests,
		customLists,
		notifications,
	} from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import ListTest from 'components/ListTest';
	import Modale from 'components/Modale';
	import type { CustomListType, ExportType } from 'models/skizzle';

	let creatingList: boolean = false;
	let modifyingListId: string = null;
	let currentTab: string = 'all';

	const closeModale = () => {
		creatingList = false;
		modifyingListId = null;
	};

	const exportList = async () => {
		const currentTabData = $customLists.find(
			customList => customList.id == currentTab,
		);

		if (currentTabData) {
			const result: boolean = await window.remote.invoke('file-export', {
				name: currentTabData.name,
				repositoriesIds: currentTabData.repositoriesIds,
			} as ExportType);

			if (result) {
				notifications.update(notifications => [
					...notifications,
					{
						text: 'Liste exportée.',
						id: uuidv4(),
					},
				]);
			}
		}
	};

	const deleteList = () => {
		customLists.update(list => list.filter(_list => _list.id !== currentTab));
		notifications.update(notifications => [
			...notifications,
			{
				text: 'Liste supprimée.',
				id: uuidv4(),
			},
		]);
		currentTab = 'all';
	};

	const filterList = (customList: CustomListType) => {
		let filteredPullRequests = $pullRequests;

		if (customList.repositoriesIds.length) {
			filteredPullRequests = filteredPullRequests
				.filter(pullRequest => !!pullRequest)
				.filter(pullRequest =>
					customList.repositoriesIds
						.map(String)
						.includes(String(pullRequest.repositoryId)),
				);
		}

		if (customList.tags) {
			// filteredPullRequests = filteredPullRequests.filter(pullRequest =>
			// 	pullRequest.labels
			// 		?.map(label => label.name.toLocaleLowerCase())
			// 		.includes(customList.tags.map(tag => tag.toLocaleLowerCase())),
			// );
		}

		return filteredPullRequests;
	};

	const getTabs = (lists: CustomListType[]) => {
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

	$: tabs = getTabs($customLists.filter(x => !x.onDraft));

	$: displayedList =
		currentTab === 'all'
			? $pullRequests
			: filterList($customLists.find(({ id }) => id === currentTab));
</script>

<Tabs
	current={currentTab}
	onChange={tab => (currentTab = tab)}
	data={tabs}
	onCreation={() => {
		creatingList = true;
	}}
/>

{#if creatingList || modifyingListId}
	<Modale onClose={closeModale}>
		<!--<CustomListSettings id={modifyingListId} onDone={closeModale} />-->
		<ListTest customList={$customLists.find(({ id }) => id === modifyingListId)} onDone={closeModale} />
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
				Modifier
			</button>
			<button on:click={deleteList}>Supprimer</button>
			<button on:click={exportList}>Exporter</button>
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
		<p class="no-pr">Il n'y a aucune pull request à afficher dans cette liste.</p>
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
