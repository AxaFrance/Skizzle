import type {
	IdentityType,
	AzureDevOpsAvatarApiType,
	AzureDevOpsDescriptorApiType,
	AzureDevOpsCommentApiType,
	AzureDevOpsCommentsApiType,
	AzureDevOpsProfileApiType,
	AzureDevOpsOrganizationApiType,
	AzureDevOpsOrganizationsApiType,
	AzureDevOpsProjectApiType,
	AzureDevOpsProjectsApiType,
	AzureDevOpsPullRequestApiType,
	AzureDevOpsPullRequestsApiType,
	AzureDevOpsRepositoriesApiType,
	AzureDevOpsRepositoryApiType,
	AzureDevOpsReviewApiType,
	AzureDevOpsReviewsApiType,
} from 'models/api';
import type { OAuthAzureDevOpsConfigType } from 'providers/OAuthAzureDevOpsConfig.provider';
import { Requester } from './Requester';

export class OAuthAzureDevOpsRequester extends Requester<OAuthAzureDevOpsConfigType> {
	private readonly API_VERSION = '6.1-preview';

	protected getHeader(config: OAuthAzureDevOpsConfigType): HeadersInit {
		const headers = new window.Headers();

		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', `bearer ${config.access_token}`);

		return headers;
	}

	public async getProfile(userId: string): Promise<AzureDevOpsProfileApiType> {
		return super.fetch(
			`https://app.vssps.visualstudio.com/_apis/profile/profiles/${userId}?details=true&api-version=${this.API_VERSION}`,
		);
	}

	public async getDescriptor(userId: IdentityType): Promise<string> {
		return (
			await super.fetch<AzureDevOpsDescriptorApiType>(
				`https://vssps.dev.azure.com/_apis/graph/descriptors/${userId}?api-version=${this.API_VERSION}`,
				{
					cache: true,
				},
			)
		).value;
	}

	public async getAvatar(
		descriptor: string,
		organizationName: string,
	): Promise<string> {
		return (
			await super.fetch<AzureDevOpsAvatarApiType>(
				`https://vssps.dev.azure.com/${organizationName}/_apis/graph/Subjects/${descriptor}/avatars?size=large&api-version=${this.API_VERSION}`,
				{
					cache: true,
				},
			)
		).value;
	}

	public async getOrganizations(
		userId?: string,
	): Promise<AzureDevOpsOrganizationApiType[]> {
		return (
			await super.fetch<AzureDevOpsOrganizationsApiType>(
				`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${userId}&api-version=${this.API_VERSION}`,
			)
		).value;
	}

	public async getProjects(
		organization?: string,
	): Promise<AzureDevOpsProjectApiType[]> {
		return (
			await super.fetch<AzureDevOpsProjectsApiType>(
				`https://dev.azure.com/${organization}/_apis/projects?$top=1000&api-version=${this.API_VERSION}`,
			)
		).value;
	}

	public async getRepositories(
		organization?: string,
		project?: string,
	): Promise<AzureDevOpsRepositoryApiType[]> {
		return (
			await super.fetch<AzureDevOpsRepositoriesApiType>(
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories?includeLinks=true&api-version=${this.API_VERSION}`,
			)
		).value;
	}

	public async getPullRequests(
		organization?: string,
		project?: string,
		repository?: string,
	): Promise<AzureDevOpsPullRequestApiType[]> {
		const pullRequests = (
			await super.fetch<AzureDevOpsPullRequestsApiType>(
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests?searchCriteria.status=active&includeLinks=true&api-version=${this.API_VERSION}`,
			)
		).value;

		return pullRequests
			.sort((a, b) => Date.parse(a.creationDate) - Date.parse(b.creationDate))
			.slice(0, 20);
	}

	public async getComments(
		organization?: string,
		project?: string,
		repository?: string,
		pullRequest?: string,
	): Promise<AzureDevOpsCommentApiType[]> {
		return (
			await super.fetch<AzureDevOpsCommentsApiType>(
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/threads?api-version=${this.API_VERSION}`,
			)
		).value;
	}

	public async getReviews(
		organization?: string,
		project?: string,
		repository?: string,
		pullRequest?: string,
	): Promise<AzureDevOpsReviewApiType[]> {
		return (
			await super.fetch<AzureDevOpsReviewsApiType>(
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/reviewers?api-version=${this.API_VERSION}`,
			)
		).value;
	}
}
