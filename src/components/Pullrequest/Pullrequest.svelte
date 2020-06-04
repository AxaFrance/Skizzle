<style src="./Pullrequest.scss">

</style>

<script>
	const { shell } = require('electron');
	import Loader from '../Loader';
	import CommentsCounter from '../CommentsCounter';
	import Labels from '../Labels';
	import { getAvatar, fetchPullRequestComments } from '../../shared/requester';
	import getDiffDays from '../../shared/helpers';
	export let pullRequest;

	const isNotSystemComments = comments =>
		comments.every(({ commentType }) => commentType !== 'system');

	const getComments = async pullRequest => {
		const response = await fetchPullRequestComments({
			pullRequestId: pullRequest.pullRequestId,
			repositoryId: pullRequest.repository.id,
			projectId: pullRequest.repository.project.id,
			organizationName: pullRequest.organizationName,
		});

		if (response.value && response.value.length > 0) {
			return response.value.filter(
				({ identities, isDeleted, comments }) =>
					identities === null && !isDeleted && isNotSystemComments(comments),
			);
		}
	};

	const makeUrl = ({ organizationName, repository, pullRequestId }) =>
		`https://dev.azure.com/${organizationName}/${repository.project.name}/_git/${repository.name}/pullrequest/${pullRequestId}`;

	const openUrl = () => shell.openExternal(makeUrl(pullRequest));

	const getAvatarUrl = pr =>
		getAvatar(pr.createdBy.id, pr.organizationName, pr.createdBy.descriptor);

	const getTime = pullrequest => {
		const { creationDate } = pullrequest;
		const diffDays = getDiffDays(creationDate);

		switch (diffDays) {
			case 0:
				return "Aujourd'hui";
			case 1:
				return 'Hier';
			default:
				return `il y a ${diffDays} jours`;
		}
	};
</script>

<div class="skz-pullrequest" on:click="{openUrl}">
	<div class="skz-pullrequest__avatar">
		{#await getAvatarUrl(pullRequest)}
			<img
				class="skz-pullrequest__thumbnail"
				alt="{pullRequest.createdBy.displayName}"
				src="./assets/user.svg" />
		{:then avatar}
			<img
				class="skz-pullrequest__thumbnail"
				alt="{pullRequest.createdBy.displayName}"
				src="data:image/jpeg;base64,{avatar.value}" />
		{:catch error}
			<img
				class="skz-pullrequest__thumbnail"
				alt="{pullRequest.createdBy.displayName}"
				src="./assets/user.svg" />
		{/await}
	</div>
	<div class="skz-pullrequest__details">
		<h2 class="skz-pullrequest__author">
			{pullRequest.createdBy.displayName} - {getTime(pullRequest)}
			<span>{pullRequest.repository.project.name}</span>
		</h2>
		<h3 class="skz-pullrequest__title">
			{#if pullRequest.autoCompleteSetBy}
				<span
					class="skz-pullrequest__status skz-pullrequest__status--auto-complete">
					Auto complete
				</span>
			{/if}
			{#if pullRequest.isDraft}
				<span class="skz-pullrequest__status skz-pullrequest__status--draft">
					Draft
				</span>
			{/if}
			{#if pullRequest.mergeStatus && pullRequest.mergeStatus === 'conflicts'}
				<span
					class="skz-pullrequest__status skz-pullrequest__status--conflicts">
					Conflicts
				</span>
			{/if}
			{pullRequest.title}
		</h3>
		<p class="skz-pullrequest__repo">{pullRequest.repository.name}</p>
		<div class="skz-pullrequest-infos">
			<div class="skz-pullrequest__counters">
				<span
					class="skz-pullrequest__counter skz-pullrequest__counter--approval">
					{pullRequest.reviewers.filter(({ vote }) => vote === 10).length}
				</span>
				<span class="skz-pullrequest__counter skz-pullrequest__counter--valid">
					{pullRequest.reviewers.filter(({ vote }) => vote === 5).length}
				</span>
				<span class="skz-pullrequest__counter skz-pullrequest__counter--wait">
					{pullRequest.reviewers.filter(({ vote }) => vote === -5).length}
				</span>
				<span class="skz-pullrequest__counter skz-pullrequest__counter--reject">
					{pullRequest.reviewers.filter(({ vote }) => vote === -10).length}
				</span>
			</div>
			<Labels labels="{pullRequest.labels}" />
			{#await getComments(pullRequest)}
				<Loader mini="{true}" />
			{:then comments}
				<CommentsCounter comments="{comments}" />
			{/await}
		</div>
	</div>
</div>
