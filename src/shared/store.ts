import { writable, get, readable } from 'svelte/store';
import { removeValueFromKey, getItem, addItem, updateItem } from './storage';
const fs = require('fs');
const app = require('electron');
const { ipcRenderer, remote } = app;

const defaultState = {
	theme: 1,
	refresh: 5,
	startup: false,
};

/**
 * Comments
 */
export const mentionsHistory = writable([]);
export const responsesHistory = writable([]);

/**
 * Token
 */
export const clientToken = writable<any>(getItem('clientToken') || undefined);

/**
 * isOffline
 */
export const isOffline = writable<boolean>(false);

/**
 * Language
 */
const lang = languages => {
	let loadedLanguage;
	let lang = languages.find(x => x.code === 'EN');

	const language = getItem('language');

	if (language && languages.some(x => x.code === language)) {
		lang = languages.find(x => x.code === language);
	} else if (
		languages.some(x => x.code === remote.app.getLocale().toUpperCase())
	) {
		lang = languages.find(x => x.code === remote.app.getLocale().toUpperCase());
	}

	loadedLanguage = {
		...lang,
		words: JSON.parse(fs.readFileSync(`${__dirname}/${lang.words}`, 'utf8')),
	};

	addItem('language', loadedLanguage.code);
	const { subscribe, set, update } = writable(loadedLanguage);

	return {
		subscribe,
		set,
		update,
		setLanguage: lang => {
			lang = languages.find(x => x.code === lang.toUpperCase());

			set({
				...lang,
				words: JSON.parse(fs.readFileSync(`${__dirname}/${lang.words}`, 'utf8')),
			});
		},
		getWord: (word, ...format) => {
			let translation = loadedLanguage.words[word];

			if (translation === undefined) {
				translation = word;
			}

			if (translation && format) {
				for (let i = 0; i < format.length + 1; i++) {
					translation = translation.replace('$' + i, format[i]);
				}
			}

			return translation;
		},
		reset: () => set(loadedLanguage),
	};
};

export const languages = readable(
	JSON.parse(fs.readFileSync(`${__dirname}/assets/langs/langs.json`, 'utf8')),
	x => console.log(x),
);
export const language = lang(get(languages));

language.subscribe(params => {
	const storage = getItem('language');

	if (params.code !== storage) {
		ipcRenderer.send('update-language', params);
		ipcRenderer.on('update-language-res', (event, res) => {
			if (res) {
				addItem('language', params.code);
				language.setLanguage(params.code);
			} else {
				language.update(n => ({
					...n,
					code: storage,
				}));
			}
		});
	}
});

/**
 * Profile
 */
export const isFetchingProfile = writable<boolean>(false);
export const profile = writable<any>(undefined);
export const isSidebarHidden = writable<boolean>(false);
export const othersProfile = writable([]);

/**
 * List
 */
export const listIsFiltered = writable<boolean>(false);

/**
 * Organizations
 */
export const organizationsHasError = writable<any[]>([]);
export const organizations = writable<any[]>([]);
export const updateOrganization = (e: any, organization: any) => {
	organization.checked = e.target.checked;

	if (organization.checked) {
		updateItem('organizations', organization.accountId);
	} else {
		removeValueFromKey('organizations', organization.accountId);
	}
	organizations.update(organizationsList =>
		organizationsList.map(organizationItem => {
			let newOrganization = organizationItem;

			if (organizationItem.accountId === organization.accountId) {
				newOrganization = organization;
			}

			return newOrganization;
		}),
	);
};

/**
 * Repositories
 */
export const updateRepository = (e: any, repository: any) => {
	repository.checked = e.target.checked;

	if (repository.checked) {
		updateItem('repositories', repository.id);
	} else {
		removeValueFromKey('repositories', repository.id);
	}

	organizations.update(organizationsList =>
		organizationsList.map(organizationItem => ({
			...organizationItem,
			projects: organizationItem.projects.map((project: any) => ({
				...project,
				repositories: project.repositories.map((repositoryItem: any) => {
					let newRepository = repositoryItem;

					if (repositoryItem.id === repository.id) {
						newRepository = repository;
					}

					return newRepository;
				}),
			})),
		})),
	);
};

export const repositories = writable<any[]>([]);
export const isFetchingPullRequests = writable<boolean>(false);
export const pullRequestsFetchHasError = writable<boolean>(false);
export const pullRequests = writable<any[]>([]);

/**
 * Settings
 */

const derivedStore = <T>(
	key: string,
	defaultState: T,
	channel?: string,
	renderer?: (channel: string, args: T) => void,
) => {
	let value = <T>getItem(key);

	const { subscribe, set, update } = writable<T>(value || defaultState);

	const setValue = (value: T) => {
		addItem(key, value);
		if (channel && renderer) {
			renderer(channel, value);
		}
		set(value);
	};

	return {
		subscribe,
		update,
		set: setValue,
		reset: () => setValue(defaultState),
	};
};

export const refreshDelay = derivedStore<number>(
	'refreshDelay',
	defaultState.refresh,
);
export const startup = derivedStore<boolean>(
	'startup',
	defaultState.startup,
	'launch-startup',
	app.send,
);
export const theme = derivedStore<number>('theme', defaultState.theme);

export const cleanStore = () => {
	clientToken.set(undefined);
	isOffline.set(false);
	isFetchingProfile.set(false);
	profile.set(undefined);
	organizations.set([]);
	repositories.set([]);
	pullRequests.set([]);

	refreshDelay.reset();
	startup.reset();
	theme.reset();
};

export const event = writable({
	isHalloween: false,
});

(() => {
	const date = new Date(Date.now());

	let halloweenDateBegin = new Date(date.getFullYear(), 9, 31, 0, 0, 0);
	let halloweenDateEnd = new Date(date.getFullYear(), 9, 31, 0, 0, 0);

	const halloweenDateBeginTime = halloweenDateBegin.setDate(
		halloweenDateBegin.getDate() - 7,
	);
	const halloweenDateEndTime = halloweenDateEnd.setDate(
		halloweenDateEnd.getDate() + 7,
	);
	const dateNowTime = date.getTime();

	const isHalloween =
		dateNowTime >= halloweenDateBeginTime && dateNowTime <= halloweenDateEndTime;

	event.update(x => ({
		...x,
		isHalloween: isHalloween,
	}));
})();
