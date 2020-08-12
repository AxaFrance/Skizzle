import { writable } from 'svelte/store';
import { removeValueFromKey, getItem, addItem, updateItem } from './storage';
const { ipcRenderer } = require('electron');

/**
 * Token
 */
export const clientToken = writable<any>(getItem('clientToken') || undefined);

/**
 * isOffline
 */
export const isOffline = writable<boolean>(false);

/**
 * Profile
 */
export const isFetchingProfile = writable<boolean>(false);
export const profile = writable<any>(undefined);
export const isSidebarHidden = writable<boolean>(false);
export const theme = writable<number>(getItem('theme') || 1);

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

const getSettingsByKey = (key: string, initial: any, type: any) => {
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
	getSettingsByKey('refreshDelay', 5, Number.parseInt),
);

export const startup = writable(getSettingsByKey('startup', true, undefined));

export const cleanStore = () => {
	clientToken.set(undefined);
	isOffline.set(false);
	isFetchingProfile.set(false);
	profile.set(undefined);
	organizations.set([]);
	repositories.set([]);
	pullRequests.set([]);
};
