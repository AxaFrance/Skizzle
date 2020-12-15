import type { AzureDevOpsRepositoryApiType } from './RepositoriesApiType';

type PullRequestsApiType = {};

type CreatedByApiType = {
	displayName: string;
	descriptor: string;
};

type ReviewerApiType = {
	vote: number;
};

type AzureDevOpsLabelsApiType = {
	name: string;
	active: boolean;
};

type AzureDevOpsPullRequestApiType = {
	pullRequestId: string;
	title: string;
	description: string;
	creationDate: string;
	reviewers: Array<ReviewerApiType>;
	createdBy: CreatedByApiType;
	repository: AzureDevOpsRepositoryApiType;
	labels: AzureDevOpsLabelsApiType[];
};

type UserApiType = {
	login: string;
	avatar_url: string;
};

type GithubLabelsApiType = {
	name: string;
};

type GithubPullRequestApiType = {
	title: string;
	body: string;
	user: UserApiType;
	updated_at: string;
	number: number;
	labels: GithubLabelsApiType[];
};

type AzureDevOpsPullRequestsApiType = {
	count: number;
	value: Array<AzureDevOpsPullRequestApiType> & PullRequestsApiType;
};

type GithubPullRequestsApiType = Array<GithubPullRequestApiType> &
	PullRequestsApiType;

export type {
	PullRequestsApiType,
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType,
	AzureDevOpsPullRequestsApiType,
	GithubPullRequestsApiType,
};
