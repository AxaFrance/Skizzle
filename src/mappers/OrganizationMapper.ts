import type {
	AzureDevOpsOrganizationApiType,
	GithubOrganizationApiType,
} from 'models/api/OrganizationsApiType';
import type { OrganizationType } from 'models/skizzle/OrganizationType';
import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import { organizations } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export class OrganizationMapper {
	public to(
		o: AzureDevOpsOrganizationApiType[],
		provider: ProviderEnum,
	): OrganizationType[];
	public to(
		o: GithubOrganizationApiType[],
		provider: ProviderEnum,
	): OrganizationType[];
	public to(o: any[], provider: ProviderEnum): OrganizationType[] {
		return o.map(value => {
			const store = get(organizations);

			const data = {
				organizationName: value.accountName || value.login,
				provider,
			};

			return {
				...data,
				checked: store.some(
					x => x.organizationName === data.organizationName && x.checked,
				),
			};
		});
	}
}
