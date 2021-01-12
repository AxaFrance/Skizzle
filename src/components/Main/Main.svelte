<script lang="ts">
	import type { CommentType } from 'models/skizzle/CommentType';
	import { pullRequests, customLists } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import Modale from 'components/Modale';
	import CustomListSettings from 'components/CustomListSettings';
	import { Service } from 'services/Service';

	let creatingList: boolean = false;
	let commentsModal: boolean = false;
	let modifyingListId: string = null;
	let currentTab: string = 'all';

	const closeModale = () => {
		creatingList = false;
		modifyingListId = null;
	};

	const deleteList = () => {
		customLists.update(list => list.filter(_list => _list.id !== currentTab));
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

	$: fetchedComments = Promise.resolve<CommentType[]>([]);
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
		</div>
	{/if}
	{#if displayedList.length}
		<ul class="list">
			{#each displayedList as pullRequest}
				<li>
					<PullRequest
						{pullRequest}
						on:comments={event => {
							fetchedComments = event.detail.fetchedComment;
							commentsModal = true;
						}} />
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
{#if commentsModal}
	<Modale
		onClose={() => {
			commentsModal = false;
		}}>
			{#await fetchedComments then comments}
				{#each comments as comment}
					{#await Service.getAvatar(comment.provider, comment.author.avatar, comment.organizationName) then avatar}
						<img width="64" height="64" src={avatar} alt={comment.author.displayName} />
					{/await}
					<p>Name: {comment.author.displayName}</p>
					<p>Date: {comment.date}</p>
					<p>Text: {comment.text}</p>
					<p>Provider: {comment.provider}</p>
				{:else}
					<p>Aucun commentaire</p>
				{/each}
			{/await}
	</Modale>
{/if}

