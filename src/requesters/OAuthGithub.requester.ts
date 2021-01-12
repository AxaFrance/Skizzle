import type {
	GithubCommentApiType,
	GithubCommentsApiType,
	GithubProfileApiType,
	GithubPullRequestApiType,
	GithubPullRequestsApiType,
	GithubRepositoriesApiType,
	GithubRepositoryApiType,
	GithubSeachRepositoriesApiType,
	GithubReviewApiType,
	GithubReviewsApiType,
} from 'models/api';
import type { OAuthGithubConfigType } from 'providers/OAuthGithubConfig.provider';
import { Requester } from './Requester';

export class OAuthGithubRequester extends Requester<OAuthGithubConfigType> {
	protected getHeader(config: OAuthGithubConfigType): HeadersInit {
		const headers = new window.Headers();

		headers.append('Accept', 'application/vnd.github.v3+json');
		headers.append('Authorization', `bearer ${config.access_token}`);

		return headers;
	}

	public async getProfile(): Promise<GithubProfileApiType> {
		return super.fetch('https://api.github.com/user');
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
