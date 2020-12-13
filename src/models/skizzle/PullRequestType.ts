import type { ProviderEnum } from './ProviderEnum';

type UserType = {
	name: string;
	avatar?: string;
};

type LabelType = {
	name: string;
};

type PullRequestType = {
	id: string;
	title: string;
	description: string;
	date: string;
	dateStr: string;
	user: UserType;
	repositoryId?: string;
	projectId?: string;
	organizationName?: string;
	repositoryName?: string;
	projectName?: string;
	labels: LabelType[];
	provider: ProviderEnum;
};

export type { UserType, LabelType, PullRequestType };
