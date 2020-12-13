import type { ProviderEnum } from './ProviderEnum';

export type ProjectType = {
	projectId: string;
	name: string;
	organizationName?: string;
	checked: boolean;
	provider: ProviderEnum;
};
