import { getMemberName } from '../../shared/requester';
import { mentionsHistory, responsesHistory } from '../../shared/store';

const { ipcRenderer } = require('electron');

export const showPullRequestModal = (
	pullRequest,
	comments,
	organizationName,
	PullRequestModal,
	open,
) => {
	open(PullRequestModal, {
		commentsGroup: comments,
		organizationName,
		pullRequest,
	});
};

export const getNotification = (isMention, isSolo, member, pullRequestTitle) =>
	isMention
		? isSolo
			? {
					title: `${pullRequestTitle}`,
					body: `${member} vous a mentionné`,
			  }
			: {
					title: `${pullRequestTitle}`,
					body: 'Vous avez de nouvelles mentions',
			  }
		: isSolo
		? {
				title: `${pullRequestTitle}`,
				body: `${member} vous a répondu`,
		  }
		: {
				title: `${pullRequestTitle}`,
				body: 'Vous avez de nouvelles réponses',
		  };

export const sendNotification = async ({
	threads,
	isMention,
	pullRequestTitle,
	comments,
	organizationName,
	PullRequestModal,
	open,
	pullRequestId,
}) => {
	if (threads.length === 1) {
		const member = await getMemberName(threads[0].comments[0].author.id);

		const { title, body } = getNotification(
			isMention,
			true,
			member,
			pullRequestTitle,
		);

		ipcRenderer.send('mentioned', {
			title,
			body,
			pullRequestId,
		});

		ipcRenderer.once(`mentioned-${pullRequestId}:clicked`, (event, args) => {
			showPullRequestModal(comments, organizationName, PullRequestModal, open);
		});
	} else {
		const member = await getMemberName(threads[0].comments[0].author.id);

		const { title, body } = getNotification(
			isMention,
			false,
			member,
			pullRequestTitle,
		);

		ipcRenderer.send('notifier', {
			title,
			body,
		});
	}
};

export const manageNotification = ({
	mentioned,
	mentionsHistoryValue,
	authorResponses,
	responsesHistoryValue,
	pullRequestTitle,
	comments,
	organizationName,
	PullRequestModal,
	open,
	pullRequestId,
}) => {
	if (mentioned.length > 0 && authorResponses.length > 0) {
		const title = `${pullRequestTitle}`;
		const body = 'Vous avez de nouvelles mentions/réponses';

		ipcRenderer.send('notifier', {
			title,
			body,
		});
	} else if (mentioned.length > 0) {
		if (mentionsHistoryValue.length === 0) {
			sendNotification({
				threads: mentioned,
				isMention: true,
				pullRequestTitle,
				comments,
				organizationName,
				PullRequestModal,
				open,
				pullRequestId,
			});
		} else {
			const fusedId = mentionsHistoryValue.reduce(
				(acc, curr) => `${curr.id},${acc}`,
				'',
			);

			const newMentions = mentioned.filter(thread => !fusedId.includes(thread.id));

			if (newMentions.length > 0) {
				sendNotification({
					threads: newMentions,
					isMention: true,
					pullRequestTitle,
					comments,
					organizationName,
					PullRequestModal,
					open,
					pullRequestId,
				});
			}
		}
		mentionsHistory.set(mentioned);
	} else if (authorResponses.length > 0) {
		if (responsesHistoryValue.length === 0) {
			sendNotification({
				threads: authorResponses,
				isMention: false,
				pullRequestTitle,
				comments,
				organizationName,
				PullRequestModal,
				open,
				pullRequestId,
			});
		} else {
			const fusedId = responsesHistoryValue.reduce(
				(acc, curr) => `${curr.id},${acc}`,
				'',
			);

			const newResponses = authorResponses.filter(
				thread => !fusedId.includes(thread.id),
			);

			if (newResponses.length > 0) {
				sendNotification({
					threads: newResponses,
					isMention: false,
					pullRequestTitle,
					comments,
					organizationName,
					PullRequestModal,
					open,
					pullRequestId,
				});
			}
		}
		responsesHistory.set(authorResponses);
	}
};

export const getMentionedComments = (commentsGroup, profileId) =>
	commentsGroup.filter(
		thread =>
			thread &&
			thread.comments.filter(
				comment => comment && comment.content.includes(profileId),
			).length > 0,
	);

export const getAuthorRespondedComments = (commentsGroup, profileId) =>
	commentsGroup.filter(
		thread =>
			thread &&
			thread.comments.filter(
				comment => comment && comment.author.id.toUpperCase() === profileId,
			).length > 1,
	);
