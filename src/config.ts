import type { IdentityType } from './models/api/IdentityType';
import { ProviderEnum } from './models/skizzle';

const AZURE_DEV_OPS_API_VERSION = '6.1-preview';

type OidcType = {
	authorize: string;
	unAuthorizedFilter?: string[];
	params: Record<string, string>;
};

type ConfigType = {
	get?: Record<string, (...args: IdentityType[]) => string>;
	post?: Record<string, (...args: IdentityType[]) => string>;
	put?: Record<string, (...args: IdentityType[]) => string>;
	delete?: Record<string, (...args: IdentityType[]) => string>;
	oidc: OidcType;
};

export const config: Record<ProviderEnum, ConfigType> = {
	[ProviderEnum.AzureDevOps]: {
		get: {
			profile: (userId: string) =>
				`https://app.vssps.visualstudio.com/_apis/profile/profiles/${userId}?details=true&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			descriptor: (userId: IdentityType) =>
				`https://vssps.dev.azure.com/_apis/graph/descriptors/${userId}?api-version=${AZURE_DEV_OPS_API_VERSION}`,
			avatar: (organization: string, descriptor: string) =>
				`https://vssps.dev.azure.com/${organization}/_apis/graph/Subjects/${descriptor}/avatars?size=large&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			organizations: (userId: IdentityType) =>
				`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${userId}&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			projects: (organization: string) =>
				`https://dev.azure.com/${organization}/_apis/projects?$top=1000&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			repositories: (organization: string, project: IdentityType) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories?includeLinks=true&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			pullRequests: (
				organization: string,
				project: IdentityType,
				repository: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests?searchCriteria.status=active&includeLinks=true&api-version=${AZURE_DEV_OPS_API_VERSION}`,
			comments: (
				organization: string,
				project: IdentityType,
				repository: IdentityType,
				pullRequest: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/threads?api-version=${AZURE_DEV_OPS_API_VERSION}`,
			reviews: (
				organization: string,
				project: IdentityType,
				repository: IdentityType,
				pullRequest: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/reviewers?api-version=${AZURE_DEV_OPS_API_VERSION}`
		},
		oidc: {
			authorize: 'https://app.vssps.visualstudio.com/oauth2/authorize',
			unAuthorizedFilter: ['client_assertion'],
			params: {
				client_id: '26940866-2575-4627-B2A4-DFF5972172B3',
				client_secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs',
				response_type: 'code',
				redirect_uri: 'https://localhost:3000/',
				post_logout_redirect_uri: 'https://localhost:3000/',
				response_mode: 'query',
				scope:
					'vso.analytics vso.build vso.code vso.connected_server vso.dashboards vso.entitlements vso.extension vso.extension.data vso.graph vso.identity vso.loadtest vso.machinegroup_manage vso.memberentitlementmanagement vso.notification vso.packaging vso.project vso.release vso.securefiles_read vso.serviceendpoint vso.symbols vso.taskgroups_read vso.test vso.variablegroups_read vso.wiki vso.work',
				client_assertion:
					'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiIyNjk0MDg2Ni0yNTc1LTQ2MjctYjJhNC1kZmY1OTcyMTcyYjMiLCJjc2kiOiJlMmMyNmQyOC00MDljLTQ2OTAtYWM4Mi1mZDc5Y2U3NDk0NjgiLCJuYW1laWQiOiI2ZTBkMzcwYi01ZDA1LTY3ODgtYjk0ZC1lY2E2ODU5ZTRhZTEiLCJpc3MiOiJhcHAudnN0b2tlbi52aXN1YWxzdHVkaW8uY29tIiwiYXVkIjoiYXBwLnZzdG9rZW4udmlzdWFsc3R1ZGlvLmNvbSIsIm5iZiI6MTU3OTg4MjU4OSwiZXhwIjoxNzM3NzM1Mzg5fQ.JZ3XeXL22-nw-9BHi3sigm_Wruj1uPKBO-bA_um3tFaauex2eTvsEPPJZ3C5GYOdldroMRE_UGZUvBNctL2Ya6JjjESWEwwhTb2kkHs9r466ewnU7l-UfjdWV-cPJoKWlfEhU7IfH1PD1eSPJijXeB6zQYpPkM-TNAyVZl3PwOoOFdqkQrV1_eufxfiYeO9aBaxCCtzo_b3PsgvSVuZxGVWVdS0svX8bB_RKiwcWCcR089-5OnhK38OZVfx-RVP2HF2Eb-xmqTsQjcvWMdBam_sND3HKeo02GnxrByBizvTLyb6cE1yJJ-K1YY9vIGuWMaYjBLXFWEykYD60tr_bog'
			}
		}
	},
	[ProviderEnum.Github]: {
		get: {
			profile: () => `https://api.github.com/user`,
			privateRepositories: () =>
				`https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&visibility=private`,
			repositories: (query: string) =>
				`https://api.github.com/search/repositories?q=${query}&sort=updated`,
			pullRequests: (owner: string, repository: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls?state=open&sort=updated&direction=desc&per_page=20`,
			comments: (owner: string, repository: string, pullRequest: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls/${pullRequest}/comments?sort=updated`,
			reviews: (owner: string, repository: string, pullRequest: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls/${pullRequest}/reviews`
		},
		oidc: {
			authorize: 'https://github.com/login/oauth/authorize',
			unAuthorizedFilter: ['client_secret'],
			params: {
				client_id: '90831528b6fd1b9f98d7',
				scope: 'repo user read:org',
				client_secret: 'dd17cefb74536fa55088ae713f220bf736e5b310'
			}
		}
	}
};
