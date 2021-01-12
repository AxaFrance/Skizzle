import type {
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType,
} from 'models/api';
import type { RepositoryType } from 'models/skizzle';
import { repositories } from 'shared/stores/default.store';
import { get } from 'svelte/store';
import { From, Mapper } from './Mapper';

export type RepositoryMapperType = From<
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType
>;

export class RepositoryMapper extends Mapper<
	RepositoryMapperType,
	RepositoryType
> {
	public to(data: RepositoryMapperType[], params: any): RepositoryType[] {
		return data.map(value => {
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
