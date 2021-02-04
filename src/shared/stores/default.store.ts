import type {
	CommonType,
	CustomListType,
	OrganizationType,
	ProjectType,
	PullRequestType,
	RepositoryType,
	SettingsType,
	ProviderEnum,
	NotificationType,
} from 'models/skizzle';
import { ThemeEnum } from 'models/skizzle';
import { Service } from 'services/Service';
import { get } from 'svelte/store';
import { createStore } from './store';
const app = require('electron').ipcRenderer;

const predicate = <T extends CommonType>(
	value: T[],
	provider: ProviderEnum,
): T[] => {
	return value.filter(x => x.provider !== provider);
};

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
			pullRequest =>
				!oldValues.some(
					({ pullRequestId }) => pullRequest.pullRequestId === pullRequestId,
				),
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
		pullRequests.set(
			result.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
		);
	}
};

export const pullRequests = createStore<PullRequestType[]>([], {
	key: 'pullRequests',
	predicate,
});
export const repositories = createStore<RepositoryType[]>([], {
	key: 'repositories',
	predicate,
});
export const projects = createStore<ProjectType[]>([], {
	key: 'projects',
	predicate,
	subscriber: () => async projects => {
		for (const project of projects) {
			if (project.checked) {
				const values = get(repositories);
				const exist = values.some(
					x =>
						x.organizationName === project.organizationName &&
						x.projectId === project.projectId,
				);

				if (!exist) {
					const values = await Service.getRepositories(project.provider, {
						project,
					});

					repositories.update(x =>
						[...x, ...values].sort((a, b) => a.name.localeCompare(b.name)),
					);
				}
			}
		}
	},
});
export const organizations = createStore<OrganizationType[]>([], {
	key: 'organizations',
	predicate,
	subscriber: () => async organizations => {
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
	},
});
export const isLoading = createStore<boolean>(false, {});
export const isFetchingData = createStore<boolean>(false, {});
export const notifications = createStore<NotificationType[]>([], {});
export const offline = createStore<boolean>(false, {});
export const settings = createStore<SettingsType>(
	{
		refresh_delay: 5,
		launch_at_startup: false,
		proxy: '',
		theme: ThemeEnum.Orange,
		language: 'en',
	},
	{
		key: 'settings',
		subscriber: initialValue => settings => {
			if (settings.refresh_delay > 0) {
				timer = setInterval(refreshPullRequests, settings.refresh_delay * 60000);
			}

			Object.keys(initialValue).forEach(element => {
				let property = settings[element];

				if (!property) {
					settings[element] = initialValue[element];
				}
			});

			app.send('launch-startup', settings.launch_at_startup);
		},
	},
);
export const customLists = createStore<CustomListType[]>([], {
	key: 'customLists',
});
