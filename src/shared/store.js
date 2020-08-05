import { writable, get } from 'svelte/store';
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
const lang = () => {
	const directory = '/assets/langs/';

	let loadedLanguage;
	const language = getItem('language');

	if (language && language.lang) {
		loadedLanguage = {
			lang: language.lang,
			...JSON.parse(
				fs.readFileSync(`${__dirname}${directory}${language.lang}.json`, 'utf8'),
			),
		};
	} else if (fs.existsSync(`${directory}${remote.app.getLocale()}.json`)) {
		loadedLanguage = {
			lang: remote.app.getLocale(),
			...JSON.parse(
				fs.readFileSync(
					`${__dirname}${directory}${remote.app.getLocale()}.json`,
					'utf8',
				),
			),
		};
	} else {
		loadedLanguage = {
			lang: 'en',
			...JSON.parse(fs.readFileSync(`${__dirname}${directory}en.json`, 'utf8')),
		};
	}

	addItem('language', loadedLanguage);
	const { subscribe, set } = writable(loadedLanguage);

	return {
		subscribe,
		set,
		setLanguage: lang =>
			set({
				lang,
				...JSON.parse(
					fs.readFileSync(`${__dirname}${directory}${lang}.json`, 'utf8'),
				),
			}),
		getWord: (word, ...format) => {
			let translation = loadedLanguage[word];

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

export const language = lang();

language.subscribe(params => {
	const storage = getItem('language');

	if (params.lang !== storage.lang) {
		ipcRenderer.send('update-language', params);
		ipcRenderer.on('update-language-res', (event, res) => {
			if (!res) {
				language.set({ ...storage, lang: storage.lang });
			} else {
				addItem('language', params);
				language.setLanguage(params.lang);
			}
			console.log({ params, language: get(language), storage });
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
