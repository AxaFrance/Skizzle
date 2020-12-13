import { OrganizationMapper } from 'mappers/OrganizationMapper';
import { ProfileMapper } from 'mappers/ProfileMapper';
import { ProjectMapper } from 'mappers/ProjectMapper';
import { PullRequestMapper } from 'mappers/PullRequestMapper';
import { RepositoryMapper } from 'mappers/RepositoryMapper';
import type { OrganizationType } from 'models/skizzle/OrganizationType';
import type { ProfileType } from 'models/skizzle/ProfileType';
import type { ProjectType } from 'models/skizzle/ProjectType';
import { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { PullRequestType } from 'models/skizzle/PullRequestType';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import { OAuthAzureDevOpsRequester } from 'requesters/OAuthAzureDevOps.requester';
import type { IService, ServiceParams } from './Service';

export class OAuthAzureDevOpsService implements IService {
	private requester: OAuthAzureDevOpsRequester;
	private readonly PROVIDER = ProviderEnum.AzureDevOps;
	private static instance: OAuthAzureDevOpsService;

	private constructor() {
		this.requester = new OAuthAzureDevOpsRequester(this.PROVIDER);
	}

	public static getInstance(): OAuthAzureDevOpsService {
		if (!OAuthAzureDevOpsService.instance) {
			OAuthAzureDevOpsService.instance = new OAuthAzureDevOpsService();
		}

		return OAuthAzureDevOpsService.instance;
	}

	public async getProfile(): Promise<ProfileType> {
		const profile = await this.requester.getProfile();

		const profileMapper = new ProfileMapper();

		const profileMapped = profileMapper.to(profile);

		return profileMapped;
	}

	public async getOrganizations({
		profile,
	}: ServiceParams): Promise<OrganizationType[]> {
		const { id } = profile;

		const result = await this.requester.getOrganizations(id);

		const mapper = new OrganizationMapper();

		return mapper.to(result, this.PROVIDER);
	}

	public async getAvatar(
		descriptor: string,
		organizationName?: string,
	): Promise<string> {
		const avatar = await this.requester.getAvatar(descriptor, organizationName);

		return `data:image/png;base64,${avatar}`;
	}

	public async getProjects({
		organization,
	}: ServiceParams): Promise<ProjectType[]> {
		const { organizationName } = organization;

		const result = await this.requester.getProjects(organizationName);

		const mapper = new ProjectMapper();

		return mapper.to(result, organizationName, this.PROVIDER);
	}

	public async getRepositories({
		project,
	}: ServiceParams): Promise<RepositoryType[]> {
		const { organizationName, projectId, name } = project;

		const result = await this.requester.getRepositories(
			organizationName,
			projectId,
		);

		const mapper = new RepositoryMapper();

		return mapper.to(result, organizationName, projectId, name, this.PROVIDER);
	}

	public async getPullRequests({
		repository,
	}: ServiceParams): Promise<PullRequestType[]> {
		const {
			organizationName,
			projectId,
			projectName,
			repositoryId,
			name,
		} = repository;

		const result = await this.requester.getPullRequests(
			organizationName,
			projectId,
			repositoryId,
		);

		const mapper = new PullRequestMapper();

		return mapper.to(
			result,
			organizationName,
			projectId,
			repositoryId,
			name,
			projectName,
			this.PROVIDER,
		);
	}
}
