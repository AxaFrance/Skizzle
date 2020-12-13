import type { OrganizationType } from 'models/skizzle/OrganizationType';

type OrganizationsApiType = {};

type AzureDevOpsOrganizationApiType = {
	accountId: string;
	accountName: string;
};

type GithubOrganizationApiType = {
	login: string;
	id: number;
};

type AzureDevOpsOrganizationsApiType = {
	count: number;
	value: Array<AzureDevOpsOrganizationApiType> & OrganizationsApiType;
};

type GithubOrganizationsApiType = Array<GithubOrganizationApiType> &
	OrganizationsApiType;

export type {
	OrganizationsApiType,
	AzureDevOpsOrganizationApiType,
	GithubOrganizationApiType,
	AzureDevOpsOrganizationsApiType,
	GithubOrganizationsApiType,
};
