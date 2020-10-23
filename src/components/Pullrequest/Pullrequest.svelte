<script>
	const { shell } = require('electron');
	import { getContext } from 'svelte';
	import { get } from 'svelte/store';
	import { getAvatar, fetchPullRequestComments } from '../../shared/requester';
	import { getDiffDays } from '../../shared/helpers';
	import {
		mentionsHistory,
		responsesHistory,
		profile,
		language,
	} from '../../shared/store';
	import Loader from '../Loader';
	import CommentsCounter from '../CommentsCounter';
	import Labels from '../Labels';
	import {
		manageNotification,
		getMentionedComments,
		getAuthorRespondedComments,
		showPullRequestModal,
	} from './Pullrequest.utils.js';
	import { PullRequestModal } from '../Modal';

	export let pullRequest;

	const { open } = getContext('modal');

	const profileId = get(profile).id.toUpperCase();

	let mentionsHistoryValue = [];
	let responsesHistoryValue = [];
	let mentioned = [];
	let authorResponses = [];
	let comments = [];

	mentionsHistory.subscribe(value => {
		mentionsHistoryValue = value;
	});

	responsesHistory.subscribe(value => {
		responsesHistoryValue = value;
	});

	const isMentioned = () => mentioned.length > 0;
	const hasResponse = () => authorResponses.length > 0;

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
			const commentsGroup = response.value.filter(
				({ identities, isDeleted, comments }) =>
					identities === null && !isDeleted && isNotSystemComments(comments),
			);

			if (commentsGroup.length > 0) {
				mentioned = getMentionedComments(commentsGroup, profileId);
				authorResponses = getAuthorRespondedComments(commentsGroup, profileId);
			}

			const data = {
				mentioned,
				mentionsHistoryValue,
				authorResponses,
				responsesHistoryValue,
				pullRequestTitle: pullRequest.title,
				comments: commentsGroup,
				organizationName: pullRequest.organizationName,
				PullRequestModal,
				open,
				pullRequestId: pullRequest.pullRequestId,
			};
			manageNotification(data);

			comments = commentsGroup;
			return commentsGroup;
		}
	};

	const makeUrl = ({ organizationName, repository, pullRequestId }) =>
		`https://dev.azure.com/${organizationName}/${repository.project.name}/_git/${repository.name}/pullrequest/${pullRequestId}`;

	const openModal = () =>
		showPullRequestModal(
			{ title: pullRequest.title, url: makeUrl(pullRequest) },
			comments,
			pullRequest.organizationName,
			PullRequestModal,
			open,
		);

	const openUrl = e => {
		if (!e.target.className.includes('skz-comments-counter')) {
			shell.openExternal(makeUrl(pullRequest));
		}
	};

	const getAvatarUrl = pr =>
		getAvatar(pr.createdBy.id, pr.organizationName, pr.createdBy.descriptor);

	const getTime = pullrequest => {
		const { creationDate } = pullrequest;
		const diffDays = getDiffDays(creationDate);

		switch (diffDays) {
			case 0:
				return language.getWord('Today');
			case 1:
				return language.getWord('Yesterday');
			default:
				return language.getWord('Time', diffDays);
		}
	};
</script>

<style src="./Pullrequest.scss">
</style>

<div class="skz-pullrequest" on:click={openUrl}>
	<div class="skz-pullrequest__avatar">
		{#await getAvatarUrl(pullRequest)}
			<img
				class="skz-pullrequest__thumbnail"
				alt={pullRequest.createdBy.displayName}
				src="./assets/user.svg" />
		{:then avatar}
			<img
				class="skz-pullrequest__thumbnail"
				alt={pullRequest.createdBy.displayName}
				src="data:image/jpeg;base64,{avatar.value}" />
		{:catch error}
			<img
				class="skz-pullrequest__thumbnail"
				alt={pullRequest.createdBy.displayName}
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
					{language.getWord('AutoComplete')}
				</span>
			{/if}
			{#if pullRequest.isDraft}
				<span class="skz-pullrequest__status skz-pullrequest__status--draft">
					{language.getWord('Draft')}
				</span>
			{/if}
			{#if pullRequest.mergeStatus && pullRequest.mergeStatus === 'conflicts'}
				<span class="skz-pullrequest__status skz-pullrequest__status--conflicts">
					{language.getWord('Conflicts')}
				</span>
			{/if}
			{pullRequest.title}
		</h3>
		<p class="skz-pullrequest__repo">{pullRequest.repository.name}</p>
		<div class="skz-pullrequest-infos">
			<div class="skz-pullrequest__counters">
				<span class="skz-pullrequest__counter skz-pullrequest__counter--approval">
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
			<Labels labels={pullRequest.labels} />
			{#await getComments(pullRequest)}
				<Loader mini={true} />
			{:then comments}
				{#if isMentioned()}
					<h1 class="skz-pullrequest__mention">@</h1>
				{/if}
				<div>
					<CommentsCounter
						action={openModal}
						{comments}
						hasResponse={hasResponse()} />
				</div>
			{/await}
		</div>
	</div>
</div>
