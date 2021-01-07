<script lang="ts">
	import type { CommentType } from 'models/skizzle/CommentType';
	import { pullRequests, customLists } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import Modale from 'components/Modale';
	import CustomListSettings from 'components/CustomListSettings';

	let creatingList: boolean = false;

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

	let currentTab: string = 'all';

	$: displayedList =
		currentTab === 'all'
			? $pullRequests
			: filterList($customLists.find(({ id }) => id === currentTab));
</script>

<style>
	.content {
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
</style>

<Tabs
	current={currentTab}
	onChange={tab => (currentTab = tab)}
	data={tabs}
	onCreation={() => {
		creatingList = true;
	}} />

<div class="content">
	<ul class="list">
		{#each displayedList as pullRequest}
			<li>
				<PullRequest
					{pullRequest}
					on:comments={event => (fetchedComments = event.detail.fetchedComment)} />
			</li>
		{/each}
	</ul>
</div>
{#if creatingList}
	<Modale
		onClose={() => {
			creatingList = false;
		}}>
		<CustomListSettings />
	</Modale>
{/if}
