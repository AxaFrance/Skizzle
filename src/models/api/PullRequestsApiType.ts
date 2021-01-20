import type {
	AzureDevOpsCommentApiType,
	GithubCommentApiType,
} from './CommentsApiType';
import type { AzureDevOpsRepositoryApiType } from './RepositoriesApiType';
import type {
	AzureDevOpsReviewApiType,
	GithubReviewApiType,
} from './ReviewsApiType';

type PullRequestsApiType = {};

type CreatedByApiType = {
	displayName?: string;
	descriptor?: string;
};

type AzureDevOpsLabelsApiType = {
	name?: string;
	active?: boolean;
};

type AzureDevOpsPullRequestApiType = {
	pullRequestId?: string;
	title?: string;
	description?: string;
	creationDate?: string;
	reviewers?: AzureDevOpsReviewApiType[];
	createdBy?: CreatedByApiType;
	repository?: AzureDevOpsRepositoryApiType;
	labels?: AzureDevOpsLabelsApiType[];
	comments?: AzureDevOpsCommentApiType[];
};

type UserApiType = {
	login?: string;
	avatar_url?: string;
};

type GithubLabelsApiType = {
	name?: string;
};

type GithubOwnerBaseApiType = {
	login?: string;
	type?: string;
};

type GithubRepoBaseApiType = {
	owner?: GithubOwnerBaseApiType;
};

type GithubBaseApiType = {
	repo?: GithubRepoBaseApiType;
};

type GithubPullRequestApiType = {
	title?: string;
	body?: string;
	user?: UserApiType;
	updated_at?: string;
	number?: number;
	labels?: GithubLabelsApiType[];
	base?: GithubBaseApiType;
	html_url?: string;
	reviewers?: GithubReviewApiType[];
	comments?: GithubCommentApiType[];
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
