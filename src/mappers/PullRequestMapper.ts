import type {
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType,
} from 'models/api/PullRequestsApiType';
import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type {
	LabelType,
	PullRequestType,
} from 'models/skizzle/PullRequestType';

export class PullRequestMapper {
	public to(
		o: AzureDevOpsPullRequestApiType[],
		organizationName: string,
		projectId: string,
		repositoryId: string,
		repositoryName: string,
		projectName: string,
		provider: ProviderEnum,
	): PullRequestType[];
	public to(
		o: GithubPullRequestApiType[],
		organizationName: string,
		projectId: string,
		repositoryId: string,
		repositoryName: string,
		projectName: string,
		provider: ProviderEnum,
	): PullRequestType[];
	public to(
		o: any[],
		organizationName: string,
		projectId: string,
		repositoryId: string,
		repositoryName: string,
		projectName: string,
		provider: ProviderEnum,
	): PullRequestType[] {
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
				organizationName,
				projectId,
				repositoryId,
				repositoryName,
				projectName,
				id: value.pullRequestId || value.id,
				title: value.title,
				description: value.description || value.body,
				date: value.creationDate || value.updated_at,
				dateStr: this.getDateStr(date),
				labels,
				user: {
					name: value.createdBy?.displayName || value.user?.login,
					avatar: value.createdBy?.descriptor || value.user?.avatar_url,
				},
				provider,
			};
		});
	}

	private getDateStr(date: Date): string {
		const today = new Date();
		const oneDay = 24 * 60 * 60 * 1000;
		const diffDays = Math.round(
			Math.abs((date.getTime() - today.getTime()) / oneDay),
		);

		switch (diffDays) {
			case 0:
				return "Aujourd'hui";
			case 1:
				return 'Hier';
			default:
				return `il y a ${diffDays} jours`;
		}
	}
}
