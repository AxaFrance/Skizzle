import type {
	AzureDevOpsOrganizationApiType,
	GithubOrganizationApiType,
} from 'models/api';
import type { OrganizationType } from 'models/skizzle';
import { organizations } from 'shared/stores/default.store';
import { get } from 'svelte/store';
import { From, Mapper } from './Mapper';

export type OrganizationMapperType = From<
	AzureDevOpsOrganizationApiType,
	GithubOrganizationApiType
>;

export class OrganizationMapper extends Mapper<
	OrganizationMapperType,
	OrganizationType
> {
	public to(data: OrganizationMapperType[], params: any): OrganizationType[] {
		return data.map(value => {
			const store = get(organizations);

			const data = {
				organizationName: value.accountName || value.login,
				...params,
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
