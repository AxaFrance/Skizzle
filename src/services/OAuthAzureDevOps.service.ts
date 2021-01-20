import {
	CommentMapper,
	OrganizationMapper,
	ProfileMapper,
	ProjectMapper,
	PullRequestMapper,
	RepositoryMapper,
	ReviewMapper,
} from 'mappers';
import {
	AzureDevOpsCommentApiEnum,
	AzureDevOpsCommentStatusApiEnum,
	AzureDevOpsCommentType,
} from 'models/api';
import type {
	CommentType,
	OrganizationType,
	ProfileType,
	ProjectType,
	PullRequestType,
	RepositoryType,
	ReviewType,
} from 'models/skizzle';
import { ProviderEnum } from 'models/skizzle';
import { OAuthAzureDevOpsRequester } from 'requesters/OAuthAzureDevOps.requester';
import { clientAuthenticated } from 'shared/stores/authentication.store';
import { get } from 'svelte/store';
import type { IService, ServiceParams } from './Service';

export class OAuthAzureDevOpsService implements IService {
	private requester: OAuthAzureDevOpsRequester;
	private readonly provider = ProviderEnum.AzureDevOps;
	private static instance: OAuthAzureDevOpsService;

	private constructor() {
		this.requester = new OAuthAzureDevOpsRequester(this.provider);
	}

	public static getInstance(): OAuthAzureDevOpsService {
		if (!OAuthAzureDevOpsService.instance) {
			OAuthAzureDevOpsService.instance = new OAuthAzureDevOpsService();
		}

		return OAuthAzureDevOpsService.instance;
	}

	public isLogged(): boolean {
		return get(clientAuthenticated).isAzureDevOpsAuthenticated;
	}

	public async getProfile(userId?: string): Promise<ProfileType> {
		const profile = await this.requester.getProfile(userId ?? 'me');
		const descriptor = await this.requester.getDescriptor(profile.id);

		const profileMapper = new ProfileMapper();

		const profileMapped = profileMapper.to(profile, {
			provider: this.provider,
			descriptor,
		});

		return profileMapped;
	}

	public async getOrganizations({
		profile,
	}: ServiceParams): Promise<OrganizationType[]> {
		const { id } = profile;

		const result = await this.requester.getOrganizations(id);

		const mapper = new OrganizationMapper();

		return mapper.to(result, { provider: this.provider });
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

		return mapper.to(result, { organizationName, provider: this.provider });
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

		return mapper.to(result, {
			organizationName,
			projectId,
			projectName: name,
			provider: this.provider,
		});
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

		let result = await this.requester.getPullRequests(
			organizationName,
			projectId,
			repositoryId,
		);

		result = await Promise.all(
			result.map(async pullRequest => {
				let comments = await this.requester.getComments(
					organizationName,
					projectId,
					repositoryId,
					pullRequest.pullRequestId,
				);

				comments = comments.sort(
					(a, b) => Date.parse(b.lastUpdatedDate) - Date.parse(a.lastUpdatedDate),
				);
				pullRequest.creationDate = comments[0].lastUpdatedDate;

				comments.forEach(
					comment =>
						(comment.comments = comment.comments.filter(
							x => x.commentType === AzureDevOpsCommentApiEnum.Text,
						)),
				);

				comments = comments
					.filter(
						comment =>
							comment.comments.length > 0 &&
							!comment.isDeleted &&
							comment.status === AzureDevOpsCommentStatusApiEnum.Active,
					)
					.reduce((acc, curr) => {
						acc.push(...curr.comments);

						return acc;
					}, []);

				pullRequest.comments = comments;

				return pullRequest;
			}),
		);

		return new PullRequestMapper().to(result, {
			organizationName,
			projectId,
			projectName,
			repositoryId,
			repositoryName: name,
			provider: this.provider,
		});
	}
}
