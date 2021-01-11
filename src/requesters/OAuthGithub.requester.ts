import type {
	GithubCommentApiType,
	GithubCommentsApiType,
} from 'models/api/CommentsApiType';
import type { GithubOrganizationsApiType } from 'models/api/OrganizationsApiType';
import type { GithubProfileApiType } from 'models/api/ProfileApiType';
import type { GithubProjectsApiType } from 'models/api/ProjectsApiType';
import type {
	GithubPullRequestApiType,
	GithubPullRequestsApiType,
} from 'models/api/PullRequestsApiType';
import type {
	GithubRepositoriesApiType,
	GithubRepositoryApiType,
	GithubSeachRepositoriesApiType,
} from 'models/api/RepositoriesApiType';
import type {
	GithubReviewApiType,
	GithubReviewsApiType,
} from 'models/api/ReviewsApiType';
import type { OAuthGithubConfigType } from 'providers/OAuthGithubConfig.provider';
import { Requester } from './Requester';

export class OAuthGithubRequester extends Requester<OAuthGithubConfigType> {
	protected getHeader(config: OAuthGithubConfigType): RequestInit {
		const headers = new window.Headers();

		headers.append('Accept', 'application/vnd.github.v3+json');
		headers.append('Authorization', `bearer ${config.access_token}`);

		const params: RequestInit = {
			method: 'GET',
			headers,
		};

		return params;
	}

	public async getProfile(): Promise<GithubProfileApiType> {
		return super.fetch('https://api.github.com/user');
	}

	public getOrganizations(): Promise<GithubOrganizationsApiType> {
		return Promise.resolve([]);
	}

	public getProjects(): Promise<GithubProjectsApiType[]> {
		return Promise.resolve([]);
	}

	public async getRepositories(
		query?: string,
		searchPrivateRepositories?: boolean,
	): Promise<GithubRepositoryApiType[]> {
		let repos: GithubRepositoryApiType[] = [];

		if (searchPrivateRepositories) {
			repos.push(
				...((
					await super.fetch<GithubRepositoriesApiType>(
						'https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&visibility=private',
					)
				).filter(({ name, full_name }) => {
					return (
						name.toLowerCase().includes(query.toLowerCase()) ||
						full_name.toLowerCase().includes(query.toLowerCase())
					);
				}) || []),
			);
		}

		repos.push(
			...(
				await super.fetch<GithubSeachRepositoriesApiType>(
					`https://api.github.com/search/repositories?q=${query}&sort=updated`,
				)
			).items,
		);

		return repos;
	}

	public async getPullRequests(
		owner?: string,
		repository?: string,
	): Promise<GithubPullRequestApiType[]> {
		return await super.fetch<GithubPullRequestsApiType>(
			`https://api.github.com/repos/${owner}/${repository}/pulls?state=open&sort=updated&direction=desc&per_page=20`,
		);
	}

	public async getComments(
		owner?: string,
		repository?: string,
		pullRequest?: string,
	): Promise<GithubCommentApiType[]> {
		return super.fetch<GithubCommentsApiType>(
			`https://api.github.com/repos/${owner}/${repository}/issues/${pullRequest}/comments?sort=updated`,
		);
	}

	public async getReviews(
		owner?: string,
		repository?: string,
		pullRequest?: string,
	): Promise<GithubReviewApiType[]> {
		return super.fetch<GithubReviewsApiType>(
			`https://api.github.com/repos/${owner}/${repository}/pulls/${pullRequest}/reviews`,
		);
	}
}
