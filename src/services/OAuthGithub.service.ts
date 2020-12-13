import { ProfileMapper } from 'mappers/ProfileMapper';
import { PullRequestMapper } from 'mappers/PullRequestMapper';
import { RepositoryMapper } from 'mappers/RepositoryMapper';
import type { ProfileType } from 'models/skizzle/ProfileType';
import { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { PullRequestType } from 'models/skizzle/PullRequestType';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import { OAuthGithubRequester } from 'requesters/OAuthGithub.requester';
import type { IService, ServiceParams } from './Service';

export class OAuthGithubService implements IService {
	private requester: OAuthGithubRequester;
	private readonly provider = ProviderEnum.Github;
	private static instance: OAuthGithubService;

	private constructor() {
		this.requester = new OAuthGithubRequester(this.provider);
	}

	public static getInstance(): OAuthGithubService {
		if (!OAuthGithubService.instance) {
			OAuthGithubService.instance = new OAuthGithubService();
		}

		return OAuthGithubService.instance;
	}

	public async getProfile(): Promise<ProfileType> {
		const result = await this.requester.getProfile();

		const mapper = new ProfileMapper();

		return mapper.to(result);
	}

	public async getAvatar(avatar: string): Promise<string> {
		return avatar;
	}

	public async getRepositories(
		params: ServiceParams,
	): Promise<RepositoryType[]> {
		const { query } = params;

		if (!query) {
			return [];
		}

		const result = await this.requester.getRepositories(query, true);

		const mapper = new RepositoryMapper();

		return mapper.to(result, undefined, undefined, undefined, this.provider);
	}

	public async getPullRequests({
		repository,
	}: ServiceParams): Promise<PullRequestType[]> {
		const { name, repositoryId, owner } = repository;

		const result = await this.requester.getPullRequests(owner, name);

		const mapper = new PullRequestMapper();

		return mapper.to(
			result,
			undefined,
			undefined,
			repositoryId,
			name,
			undefined,
			this.provider,
		);
	}
}
