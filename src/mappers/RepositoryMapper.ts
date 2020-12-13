import type {
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType,
} from 'models/api/RepositoriesApiType';
import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import { repositories } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export class RepositoryMapper {
	public to(
		o: AzureDevOpsRepositoryApiType[],
		organizationName: string,
		projectId: string,
		projectName: string,
		provider: ProviderEnum,
	): RepositoryType[];
	public to(
		o: GithubRepositoryApiType[],
		organizationName: string,
		projectId: string,
		projectName: string,
		provider: ProviderEnum,
	): RepositoryType[];
	public to(
		o: any[],
		organizationName: string,
		projectId: string,
		projectName: string,
		provider: ProviderEnum,
	): RepositoryType[] {
		return o.map(value => {
			const store = get(repositories);

			const data = {
				repositoryId: value.id,
				name: value.name,
				organizationName,
				projectId,
				projectName,
				fullName: value.full_name,
				owner: value.owner?.login,
				provider,
			};

			return {
				...data,
				checked: store.some(x => x.repositoryId === data.repositoryId && x.checked),
			};
		});
	}
}
