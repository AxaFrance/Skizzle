import type {
	CommonType,
	CustomListType,
	NotificationType,
	ProfileType,
	PullRequestType,
	RepositoryType,
	SettingsType
} from 'models/skizzle';
import { ProviderEnum, ThemeEnum } from 'models/skizzle';
import { Service } from 'services/Service';
import { isElectronRenderer, remote } from 'shared/remote';
import { displayLocalNotification } from 'shared/utils';
import { get } from 'svelte/store';
import { createStore } from './store';

const predicate = <T extends CommonType>(value: T[], provider: ProviderEnum): T[] => {
	return value.filter(x => x.provider !== provider);
};

export const refreshPullRequests = async () => {
	const isOffline = get(offline);

	if (!isOffline) {
		const values = get(repositories);

		if (values.length > 0) {
			let oldValues = get(pullRequests);

			let result: PullRequestType[] = [];

			try {
				for (const repository of values) {
					result = result.concat(
						await Service.getPullRequests(repository.provider, { repository })
					);
				}
			} catch {
				return;
			}

			const newValues = result.filter(
				pullRequest =>
					!oldValues.some(({ pullRequestId }) => pullRequest.pullRequestId === pullRequestId)
			);

			if (newValues.length > 0) {
				let title =
					newValues.length > 1
						? 'New pull requests are available'
						: 'New pull request is available';

				let body =
					newValues.length > 1
						? 'Pull requests have been published on repositories you follow.'
						: `The repository ${newValues[0].repositoryName} has a new pull request.`;

				remote.notification(title, body);
			}

			pullRequests.reset();
			pullRequests.set(result.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
		}
	}
};

export const profiles = createStore<ProfileType[]>([], { key: 'profiles' });
export const pullRequests = createStore<PullRequestType[]>([], {
	key: 'pullRequests',
	predicate
});
export const repositories = createStore<RepositoryType[]>([], {
	key: 'repositories',
	predicate
});
export const isLoading = createStore<boolean>(false, {});
export const isFetchingData = createStore<boolean>(false, {});
export const notifications = createStore<NotificationType[]>([], {});
export const offline = createStore<boolean>(false, {
	key: 'offline',
	subscriber: () => (offline: boolean) => {
		if (offline) {
			displayLocalNotification('You are offline.');
		}
	}
});
export const settings = createStore<SettingsType>(
	{
		refresh_delay: 5,
		launch_at_startup: false,
		theme: ThemeEnum.Orange,
		language: 'en',
		compact: false,
		preRelease: false,
		updateAvailable: false
	},
	{
		key: 'settings',
		subscriber: initialValue => settings => {
			if (settings.refresh_delay > 0) {
				setInterval(refreshPullRequests, settings.refresh_delay * 60000);
			}

			Object.keys(initialValue).forEach(element => {
				let property = settings[element];

				if (!property) {
					settings[element] = initialValue[element];
				}
			});

			if (isElectronRenderer()) {
				remote.setLaunchAtStartUp(settings.launch_at_startup);
			}

			remote.setPreRelease(settings.preRelease);
		}
	}
);
export const customLists = createStore<CustomListType[]>([], {
	key: 'customLists'
});
export const needIntro = createStore<boolean>(true, { key: 'needIntro' });
export const isElectron = createStore<boolean>(isElectronRenderer(), {});
