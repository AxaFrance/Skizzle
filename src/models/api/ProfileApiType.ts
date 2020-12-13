type ProfileApiType = {};

type ValueType = {
	value: string;
};

type AvatarType = {
	value: ValueType;
};

type CoreAttributesType = {
	Avatar: AvatarType;
};

type AzureDevOpsProfileApiType = {
	displayName: string;
	emailAddress: string;
	id: string;
	coreAttributes: CoreAttributesType;
} & ProfileApiType;

type GithubProfileApiType = {
	name: string;
	email: string;
	id: number;
	avatar_url: string;
} & ProfileApiType;

export type { ProfileApiType, AzureDevOpsProfileApiType, GithubProfileApiType };
