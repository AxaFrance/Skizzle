type ReviewsApiType = {};

enum AzureDevOpsVoteEnum {
	Approved = 10,
	ApproveWithSuggestions = 5,
	NoVote = 0,
	WaitingForAuthor = -5,
	Rejected = -10,
}

enum GithubVoteEnum {
	Approved = 'APPROVED',
	RequestChange = 'REQUEST_CHANGE',
	Pending = 'PENDING',
	Comment = 'COMMENT',
}

type AzureDevOpsReviewApiType = {
	vote: AzureDevOpsVoteEnum;
	id: string;
};

type GithubReviewApiType = {
	id: string;
	state: GithubVoteEnum;
};

type AzureDevOpsReviewsApiType = {
	count: number;
	value: Array<AzureDevOpsReviewApiType> & ReviewsApiType;
};

type GithubReviewsApiType = Array<GithubReviewApiType> & ReviewsApiType;

export type {
	AzureDevOpsReviewApiType,
	AzureDevOpsReviewsApiType,
	GithubReviewApiType,
	GithubReviewsApiType,
};
