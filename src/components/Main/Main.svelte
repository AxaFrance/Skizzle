<script lang="ts">
	import type { CommentType } from 'models/skizzle/CommentType';
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import { pullRequests } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import Modale from 'components/Modale';
	import CustomListSettings from 'components/CustomListSettings';

	let creatingList: boolean = false;

	const filterList = list =>
		$pullRequests
			.filter(pullRequest => {
				return list.projectsIds
					? list.projectsIds.includes(pullRequest.projectId)
					: true;
			})
			.filter(pullRequest => {
				return list.repositoriesIds
					? list.repositoriesIds.includes(pullRequest.repositoryId)
					: true;
			});

	const customLists: CustomListType[] = [
		{
			id: '123',
			order: 0,
			name: 'Agenda partagé',
			projectsIds: ['51f756a1-4881-4ff4-ad15-91f43256bb86'],
			withoutOwnedByUserPR: true,
		},
		{
			id: '456',
			order: 1,
			name: 'Skizzle',
			repositoriesIds: [218745280],
		},
	];

	$: fetchedComments = Promise.resolve<CommentType[]>([]);

	const tabs = {
		all: {
			label: 'Toutes',
			order: 0,
		},
	};

	customLists.forEach(list => {
		tabs[list.id] = {
			label: list.name,
			order: list.order + 1,
			counter: filterList(list).length,
		};
	});

	let currentTab: string = 'all';

	$: console.log(currentTab);

	$: displayedList =
		currentTab === 'all'
			? $pullRequests
			: filterList(customLists.find(({ id }) => id === currentTab));
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
