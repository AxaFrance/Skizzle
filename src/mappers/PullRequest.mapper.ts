import { CommentMapper } from './Comment.mapper';
import { ReviewMapper } from './Review.mapper';
import type {
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType,
} from 'models/api';
import type { PullRequestType } from 'models/skizzle';
import { getDateStr } from 'shared/utils';
import { From, Mapper } from './Mapper';

export type PullRequestMapperType = From<
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType
>;

export class PullRequestMapper extends Mapper<
	PullRequestMapperType,
	PullRequestType
> {
	public to(data: PullRequestMapperType[], params: any): PullRequestType[] {
		return data.map(value => {
			const date = new Date(value.creationDate || value.updated_at);

			const labels =
				value.labels &&
				value.labels.map((x: any) => {
					if (x.hasOwnProperty('active') && x.active === false) {
						return;
					}

					return {
						name: x.name,
					};
				});

			if (
				value.base?.repo?.owner?.type === 'Organization' &&
				value.base?.repo?.owner?.login
			) {
				params.projectName = value.base?.repo?.owner?.login;
			}

			const result: PullRequestType = {
				pullRequestId: value.pullRequestId || value.number,
				title: value.title,
				description: value.description || value.body,
				date: value.creationDate || value.updated_at,
				dateStr: getDateStr(date),
				labels,
				user: {
					name: value.createdBy?.displayName || value.user?.login,
					avatar: value.createdBy?.descriptor || value.user?.avatar_url,
				},
				url:
					value.html_url ||
					`https://dev.azure.com/${params.organizationName}/${params.projectName}/_git/${params.repositoryName}/pullrequest/${value.pullRequestId}`,
				isDraft: value.isDraft || value.draft,
				isConflict: value.mergeStatus && value.mergeStatus === 'conflicts',
				isAutoComplete: !!value.autoCompleteSetBy,
				...params,
			};

			if (value.comments) {
				result.comments = new CommentMapper().to(value.comments, params);
			}

			if (value.reviewers) {
				result.reviewers = new ReviewMapper().to(value.reviewers);
			}

			return result;
		});
	}
}
