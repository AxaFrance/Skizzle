import type {
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType,
} from 'models/api/RepositoriesApiType';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import { repositories } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export class RepositoryMapper {
	public to(o: AzureDevOpsRepositoryApiType[], params: any): RepositoryType[];
	public to(o: GithubRepositoryApiType[], params: any): RepositoryType[];
	public to(o: any[], params: any): RepositoryType[] {
		return o.map(value => {
			const store = get(repositories);

			const data = {
				repositoryId: value.id,
				name: value.name,
				fullName: value.full_name,
				owner: value.owner?.login,
				...params,
			};

			return {
				...data,
				checked: store.some(x => x.repositoryId === data.repositoryId && x.checked),
			};
		});
	}
}
