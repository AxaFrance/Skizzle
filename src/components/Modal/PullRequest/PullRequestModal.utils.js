import { getDiffDays } from '../../../shared/helpers';
import { getAvatar, getMemberName } from '../../../shared/requester';

export const getProfileIdInComment = commentsGroup => {
	let commentGroupWithId = [];
	const res = new Set();

	commentGroupWithId = commentsGroup.filter(commentGroup =>
		commentGroup.comments.filter(comment => comment.content.includes('@<')),
	);

	commentGroupWithId.map(commentGroup =>
		commentGroup.comments.map(comment => {
			const splitIdStarter = comment.content.split('@<');

			if (splitIdStarter.length > 1) {
				splitIdStarter.map(splitId => {
					const splitIdFull = splitId.split('>');
					if (splitIdFull.length > 1) {
						res.add(splitIdFull[0]);
					}
				});
			}
		}),
	);

	return res;
};

export const updateProfilStore = async (idSet, othersProfile) => {
	let othersProfileValue;

	othersProfile.subscribe(value => {
		othersProfileValue = value;
	});

	for (const id of idSet) {
		if (othersProfileValue.filter(value => value.id !== id).length === 0) {
			const profile = await getMemberName(id);

			othersProfile.update(current => [...current, { id, name: profile }]);
		}
	}
};

export const replaceIdWithUsername = (commentsGroup, othersProfileValue) => {
	let commentGroupWithId = [];

	commentGroupWithId = commentsGroup.filter(commentGroup =>
		commentGroup.comments.filter(comment => comment.content.includes('@<')),
	);

	commentGroupWithId.forEach(commentGroup => {
		commentGroup.comments.forEach(comment => {
			othersProfileValue.forEach(profile => {
				comment.content = comment.content.replace(
					new RegExp(`@<${profile.id}>`, 'g'),
					`@${profile.name}`,
				);
			});
		});
	});
};

export const updateCommentsWithUsername = async (
	commentsGroup,
	othersProfile,
) => {
	let othersProfileValue;

	othersProfile.subscribe(value => {
		othersProfileValue = value;
	});

	await updateProfilStore(getProfileIdInComment(commentsGroup), othersProfile);

	replaceIdWithUsername(commentsGroup, othersProfileValue);
};

export const getAvatarUrl = (author, organizationName) =>
	getAvatar(author.id, organizationName, author.descriptor);

export const getFile = commentGroup => {
	if (commentGroup.threadContext) {
		const splittedFilePath = commentGroup.threadContext.filePath.split('/');
		return splittedFilePath[splittedFilePath.length - 1];
	}
	return '';
};

export const getTime = lastUpdatedDate => {
	const diffDays = getDiffDays(lastUpdatedDate);

	switch (diffDays) {
		case 0:
			return "Aujourd'hui";
		case 1:
			return 'Hier';
		default:
			return `il y a ${diffDays} jours`;
	}
};
