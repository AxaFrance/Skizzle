import type { ProviderEnum } from './ProviderEnum';

export type RepositoryType = {
	repositoryId: string;
	name: string;
	fullName?: string;
	projectId?: string;
	projectName?: string;
	organizationName?: string;
	owner?: string;
	checked: boolean;
	provider: ProviderEnum;
};
