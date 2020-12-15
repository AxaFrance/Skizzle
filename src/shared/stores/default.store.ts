import type { OrganizationType } from 'models/skizzle/OrganizationType';
import type { ProjectType } from 'models/skizzle/ProjectType';
import type { PullRequestType } from 'models/skizzle/PullRequestType';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import type { SettingsType } from 'models/skizzle/SettingsType';
import { Service } from 'services/Service';
import { get } from 'svelte/store';
import { createStore } from './store';
const app = require('electron').ipcRenderer;

export const isLoading = createStore<boolean>(false);
export const isFetchingData = createStore<boolean>(false);
export const organizations = createStore<OrganizationType[]>(
	[],
	'organizations',
);
export const projects = createStore<ProjectType[]>([], 'projects');
export const repositories = createStore<RepositoryType[]>([], 'repositories');
export const pullRequests = createStore<PullRequestType[]>([], 'pullRequests');
export const settings = createStore<SettingsType>(
	{
		refresh_delay: 1,
	},
	'settings',
);

let timer: NodeJS.Timeout;

export const refreshPullRequests = async () => {
	const values = get(repositories).filter(x => x.checked);

	if (values.length > 0) {
		let oldValues = get(pullRequests);

		let result: PullRequestType[] = [];

		try {
			for (const repository of values) {
				result = result.concat(
					await Service.getPullRequests(repository.provider, { repository }),
				);
			}
		} catch {
			return;
		}

		const newValues = result.filter(
			pullRequest => !oldValues.some(({ id }) => pullRequest.id === id),
		);

		if (newValues.length > 0) {
			let title =
				newValues.length > 1
					? 'De nouvelles pull requests sont disponibles'
					: 'Une nouvelle pull request est disponible';

			let body =
				newValues.length > 1
					? 'Plusieurs repositories ont étés mis à jour'
					: `Le repo ${newValues[0].repositoryName} a une nouvelle pull request`;

			app.send('notifier', {
				title,
				body,
			});
		}
		0;

		pullRequests.reset();
		pullRequests.set(result);
	}
};

settings.subscribe(settings => {
	if (settings.refresh_delay > 0) {
		timer = setInterval(refreshPullRequests, settings.refresh_delay * 60000);
	} else {
		clearInterval(timer);
	}
});

organizations.subscribe(async organizations => {
	for (const organization of organizations) {
		const values = get(projects);
		const exist = values.some(
			x => x.organizationName === organization.organizationName,
		);

		if (!exist) {
			const values = await Service.getProjects(organization.provider, {
				organization,
			});

			projects.update(x =>
				[...x, ...values].sort((a, b) => a.name.localeCompare(b.name)),
			);
		}
	}
});

projects.subscribe(async projects => {
	for (const project of projects) {
		if (project.checked) {
			const values = get(repositories);
			const exist = values.some(
				x =>
					x.organizationName === project.organizationName &&
					x.projectId === project.projectId,
			);

			if (!exist) {
				const values = await Service.getRepositories(project.provider, { project });

				repositories.update(x =>
					[...x, ...values].sort((a, b) => a.name.localeCompare(b.name)),
				);
			}
		}
	}
});
