import type {
	AzureDevOpsProjectApiType,
	GithubProjectApiType,
} from 'models/api';
import type { ProjectType } from 'models/skizzle';
import { projects } from 'shared/stores/default.store';
import { get } from 'svelte/store';
import { From, Mapper } from './Mapper';

export type ProjectMapperType = From<
	AzureDevOpsProjectApiType,
	GithubProjectApiType
>;

export class ProjectMapper extends Mapper<ProjectMapperType, ProjectType> {
	public to(data: ProjectMapperType[], params: any): ProjectType[] {
		return data.map(value => {
			const store = get(projects);

			const data = {
				projectId: value.id,
				name: value.name,
				...params,
			};

			return {
				...data,
				checked: store.some(x => x.projectId === data.projectId && x.checked),
			};
		});
	}
}
