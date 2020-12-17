import type { ProviderEnum } from './ProviderEnum';

export type ProfileType = {
	name: string;
	email?: string;
	id: string;
	avatar?: string;
	provider?: ProviderEnum;
};
