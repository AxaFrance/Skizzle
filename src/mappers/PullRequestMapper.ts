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

			return {
				id: value.pullRequestId || value.number,
				title: value.title,
				description: value.description || value.body,
				date: value.creationDate || value.updated_at,
				dateStr: getDateStr(date),
				labels,
				user: {
					name: value.createdBy?.displayName || value.user?.login,
					avatar: value.createdBy?.descriptor || value.user?.avatar_url,
				},
				...params,
			};
		});
	}
}
