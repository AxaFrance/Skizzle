import type {
	AzureDevOpsProjectApiType,
	GithubProjectApiType,
} from 'models/api/ProjectsApiType';
import type { ProjectType } from 'models/skizzle/ProjectType';
import { projects } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export class ProjectMapper {
	public to(o: AzureDevOpsProjectApiType[], params: any): ProjectType[];
	public to(o: GithubProjectApiType[], params: any): ProjectType[];
	public to(o: any[], params: any): ProjectType[] {
		return o.map(value => {
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
