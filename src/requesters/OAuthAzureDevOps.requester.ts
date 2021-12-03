import { config } from 'config';
import type {
	AzureDevOpsAvatarApiType,
	AzureDevOpsDescriptorApiType,
	AzureDevOpsCommentApiType,
	AzureDevOpsCommentsApiType,
	AzureDevOpsProfileApiType,
	AzureDevOpsOrganizationApiType,
	AzureDevOpsOrganizationsApiType,
	AzureDevOpsPullRequestApiType,
	AzureDevOpsPullRequestsApiType,
	AzureDevOpsRepositoriesApiType,
	AzureDevOpsRepositoryApiType,
	IdentityType
} from 'models/api';
import type { HeaderType } from 'models/skizzle';
import type { OAuthAzureDevOpsConfigType } from 'providers/OAuthAzureDevOpsConfig.provider';
import { Requester } from './Requester';

export class OAuthAzureDevOpsRequester extends Requester<OAuthAzureDevOpsConfigType> {
	public getHeader(config: OAuthAzureDevOpsConfigType, headers?: HeaderType): HeaderType {
		return {
			'content-type': 'application/json',
			authorization: `bearer ${config.access_token}`,
			...headers
		};
	}

	public async getProfile(userId: string): Promise<AzureDevOpsProfileApiType> {
		return super.fetch(config.AzureDevOps.get.profile(userId), true);
	}

	public async getDescriptor(userId: IdentityType): Promise<string> {
		return (
			await super.fetch<AzureDevOpsDescriptorApiType>(
				config.AzureDevOps.get.descriptor(userId),
				true
			)
		).value;
	}

	public async getAvatar(descriptor: string, organizationName: string): Promise<string> {
		return (
			await super.fetch<AzureDevOpsAvatarApiType>(
				config.AzureDevOps.get.avatar(organizationName, descriptor),
				true
			)
		).value;
	}

	public async getOrganizations(
		userId?: string
	): Promise<AzureDevOpsOrganizationApiType[]> {
		return (
			await super.fetch<AzureDevOpsOrganizationsApiType>(
				config.AzureDevOps.get.organizations(userId),
				true
			)
		).value;
	}

	public async getRepositories(
		organization?: string
	): Promise<AzureDevOpsRepositoryApiType[]> {
		try {
			const repositories = (
				await super.fetch<AzureDevOpsRepositoriesApiType>(
					config.AzureDevOps.get.repositories(organization),
					true
				)
			).value;

			return repositories;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	public async getPullRequests(
		organization?: string,
		repository?: string
	): Promise<AzureDevOpsPullRequestApiType[]> {
		const pullRequests = (
			await super.fetch<AzureDevOpsPullRequestsApiType>(
				config.AzureDevOps.get.pullRequests(organization, repository)
			)
		).value;

		return pullRequests
			.sort((a, b) => Date.parse(a.creationDate) - Date.parse(b.creationDate))
			.slice(0, 20);
	}

	public async getComments(
		organization?: string,
		repository?: string,
		pullRequest?: string
	): Promise<AzureDevOpsCommentApiType[]> {
		return (
			await super.fetch<AzureDevOpsCommentsApiType>(
				config.AzureDevOps.get.comments(organization, repository, pullRequest)
			)
		).value;
	}
}
