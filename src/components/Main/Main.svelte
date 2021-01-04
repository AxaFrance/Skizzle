<script lang="ts">
	import type { CommentType } from 'models/skizzle/CommentType';
	import type { CustomListType } from 'models/skizzle/CustomListType';
	import { pullRequests } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import Modale from 'components/Modale';
	import CustomListSettings from 'components/CustomListSettings';

	// let creatingList: boolean = false;
	let creatingList: boolean = true;

	const customLists: CustomListType[] = [
		{
			name: 'Agenda partagé',
			projectsIds: ['51f756a1-4881-4ff4-ad15-91f43256bb86'],
			withoutOwnedByUserPR: true,
		},
		{
			name: 'Skizzle',
			repositoriesIds: [218745280],
		},
	];

	$: fetchedComments = Promise.resolve<CommentType[]>([]);
	const tabs = {
		all: 'Toutes',
	};

	customLists.forEach(({ name }, index) => {
		tabs[index] = name;
	});
	let currentTab: string = 'all';
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
	{#if currentTab === 'all'}
		<ul class="list">
			{#each $pullRequests.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as pullRequest}
				<li>
					<PullRequest
						{pullRequest}
						on:comments={event => (fetchedComments = event.detail.fetchedComment)} />
				</li>
			{/each}
		</ul>
	{:else}
		<ul class="list">
			{#each $pullRequests
				.filter(pullRequest => {
					return customLists[currentTab].projectsIds ? customLists[currentTab].projectsIds.includes(pullRequest.projectId) : true;
				})
				.filter(pullRequest => {
					return customLists[currentTab].repositoriesIds ? customLists[currentTab].repositoriesIds.includes(pullRequest.repositoryId) : true;
				})
				.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as pullRequest}
				<li>
					<PullRequest
						{pullRequest}
						on:comments={event => (fetchedComments = event.detail.fetchedComment)} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
{#if creatingList}
	<Modale
		onClose={() => {
			creatingList = false;
		}}>
		<CustomListSettings />
	</Modale>
{/if}
