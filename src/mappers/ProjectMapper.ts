import type {
	AzureDevOpsProjectApiType,
	GithubProjectApiType,
} from 'models/api/ProjectsApiType';
import type { ProjectType } from 'models/skizzle/ProjectType';
import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import { projects } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export class ProjectMapper {
	public to(
		o: AzureDevOpsProjectApiType[],
		organizationName: string,
		provider: ProviderEnum,
	): ProjectType[];
	public to(
		o: GithubProjectApiType[],
		organizationName: string,
		provider: ProviderEnum,
	): ProjectType[];
	public to(
		o: any[],
		organizationName: string,
		provider: ProviderEnum,
	): ProjectType[] {
		return o.map(value => {
			const store = get(projects);

			const data = {
				projectId: value.id,
				name: value.name,
				organizationName,
				provider,
			};

			return {
				...data,
				checked: store.some(x => x.projectId === data.projectId && x.checked),
			};
		});
	}
}
