export type CustomListType = {
	id: string;
	name: string;
	tags: string[];
	repositoriesId?: string[];
	provider?: string;
	hiddenPullRequestsIds?: string[];
	withoutOwnedByUserPR?: boolean;
	withoutOldPR?: boolean;
	withoutConflict?: boolean;
	withoutDraft?: boolean;
	withoutCheckedByOwner?: boolean;
};
