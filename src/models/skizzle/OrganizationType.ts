import type { ProviderEnum } from './ProviderEnum';

export type OrganizationType = {
	organizationName?: string;
	checked?: boolean;
	provider?: ProviderEnum;
};
