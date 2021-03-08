export type CustomListType = {
	id: string;
	name: string;
	tags: string[];
	projectsIds?: string[];
	repositoriesIds?: string[];
	hiddenPullRequestsIds?: string[];
	withoutOwnedByUserPR?: boolean;
	withoutOldPR?: boolean;
	withoutConflict?: boolean;
	withoutDraft?: boolean;
	withoutCheckedByOwner?: boolean;
};
