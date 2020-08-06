import { writable, get, readable } from 'svelte/store';
import { removeValueFromKey, getItem, addItem, updateItem } from './storage';
const fs = require('fs');
const { ipcRenderer, remote } = require('electron');

/**
 * Token
 */
export const clientToken = writable(getItem('clientToken') || undefined);

/**
 * isOffline
 */
export const isOffline = writable(false);

/**
 * Language
 */
const lang = languages => {
	const directory = '/assets/langs/';

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
export const isFetchingProfile = writable(false);
export const profile = writable(undefined);
export const isSidebarHidden = writable(false);
export const theme = writable(getItem('theme') || 1);

/**
 * List
 */
export const listIsFiltered = writable(false);

/**
 * Organizations
 */
export const organizationsHasError = writable([]);
export const organizations = writable([]);
export const updateOrganization = (e, organization) => {
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
export const updateRepository = (e, repository) => {
	repository.checked = e.target.checked;

	if (repository.checked) {
		updateItem('repositories', repository.id);
	} else {
		removeValueFromKey('repositories', repository.id);
	}

	organizations.update(organizationsList =>
		organizationsList.map(organizationItem => ({
			...organizationItem,
			projects: organizationItem.projects.map(project => ({
				...project,
				repositories: project.repositories.map(repositoryItem => {
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

export const repositories = writable([]);
export const isFetchingPullRequests = writable(false);
export const pullRequestsFetchHasError = writable(false);
export const pullRequests = writable([]);

/**
 * Settings
 */

const getSettingsByKey = (key, initial, type = undefined) => {
	let value = getItem(key);

	if (typeof value !== 'boolean' && !value && value !== 0) {
		value = initial;
		addItem(key, value);

		if (key === 'startup') {
			ipcRenderer.send('launch-startup', value);
		}
	}

	return type ? type(value) : value;
};

export const refreshDelay = writable(
	getSettingsByKey('refreshDelay', 5, Number),
);

export const startup = writable(getSettingsByKey('startup', true));

export const cleanStore = () => {
	clientToken.set(undefined);
	isOffline.set(false);
	isFetchingProfile.set(false);
	profile.set(undefined);
	organizations.set([]);
	repositories.set([]);
	pullRequests.set([]);
};
