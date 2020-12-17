type ProfileApiType = {};

type AzureDevOpsProfileApiType = {
	displayName: string;
	emailAddress: string;
	id: string;
} & ProfileApiType;

type GithubProfileApiType = {
	name: string;
	email: string;
	id: number;
	avatar_url: string;
} & ProfileApiType;

export type { ProfileApiType, AzureDevOpsProfileApiType, GithubProfileApiType };
