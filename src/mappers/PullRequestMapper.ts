import type {
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType,
} from 'models/api/PullRequestsApiType';
import type { PullRequestType } from 'models/skizzle/PullRequestType';
import { getDateStr } from 'shared/utils';

export class PullRequestMapper {
	public to(o: AzureDevOpsPullRequestApiType[], params: any): PullRequestType[];
	public to(o: GithubPullRequestApiType[], params: any): PullRequestType[];
	public to(o: any[], params: any): PullRequestType[] {
		return o.map(value => {
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

			return {
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
				...params,
			};
		});
	}
}
