import type {
	OrganizationType,
	ProfileType,
	ProjectType,
	PullRequestType,
	RepositoryType,
} from 'models/skizzle';
import { ProviderEnum } from 'models/skizzle';
import { isFetchingData } from 'shared/stores/default.store';
import type { Dictionary } from 'shared/utils';
import { OAuthAzureDevOpsService } from './OAuthAzureDevOps.service';
import { OAuthGithubService } from './OAuthGithub.service';

export type ServiceParams = {
	query?: string;
	profile?: ProfileType;
	organization?: OrganizationType;
	project?: ProjectType;
	repository?: RepositoryType;
	pullRequest?: PullRequestType;
};

export interface IService {
	isLogged(): boolean;
	getProfile(userId?: string): Promise<ProfileType>;
	getAvatar(params: string, organizationName?: string): Promise<string>;
	getRepositories(params: ServiceParams): Promise<RepositoryType[]>;
	getPullRequests(params: ServiceParams): Promise<PullRequestType[]>;
}

export class Service {
	private static readonly INSTANCES: Dictionary<IService> = {
		[ProviderEnum.AzureDevOps]: OAuthAzureDevOpsService.getInstance(),
		[ProviderEnum.Github]: OAuthGithubService.getInstance(),
	};

	public static async getProfile(
		provider: ProviderEnum,
		userId?: string,
	): Promise<ProfileType> {
		isFetchingData.set(true);
		const result = await Service.INSTANCES[provider].getProfile(userId);
		isFetchingData.set(false);
		return result;
	}

	public static async getAvatar(
		provider: ProviderEnum,
		params: string,
		organizationName?: string,
	): Promise<string> {
		isFetchingData.set(true);
		const result = await Service.INSTANCES[provider].getAvatar(
			params,
			organizationName,
		);
		isFetchingData.set(false);
		return result;
	}

	public static async getRepositories(
		provider: ProviderEnum,
		params: ServiceParams,
	): Promise<RepositoryType[]> {
		isFetchingData.set(true);
		const result = await Service.INSTANCES[provider].getRepositories(params);
		isFetchingData.set(false);
		return result;
	}

	public static async getPullRequests(
		provider: ProviderEnum,
		params: ServiceParams,
	): Promise<PullRequestType[]> {
		isFetchingData.set(true);
		const result = await Service.INSTANCES[provider].getPullRequests(params);
		isFetchingData.set(false);
		return result;
	}
}
