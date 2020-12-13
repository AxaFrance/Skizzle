type ProjectsApiType = {};

type AzureDevOpsProjectApiType = {
	id: string;
	name: string;
};

type GithubProjectApiType = {
	name: string;
	id: number;
};

type AzureDevOpsProjectsApiType = {
	count: number;
	value: Array<AzureDevOpsProjectApiType> & ProjectsApiType;
};

type GithubProjectsApiType = Array<GithubProjectApiType> & ProjectsApiType;

export type {
	ProjectsApiType,
	AzureDevOpsProjectApiType,
	GithubProjectApiType,
	AzureDevOpsProjectsApiType,
	GithubProjectsApiType,
};
