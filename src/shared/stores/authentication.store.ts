import { get } from 'svelte/store';
import type { OAuthConfigType } from '../../providers';
import { ProviderEnum } from '../../models/skizzle';
import {
	OAuthAzureDevOpsConfig,
	OAuthAzureDevOpsConfigType,
} from '../../providers/OAuthAzureDevOpsConfig.provider';
import { getToken } from '../token';
import type { Dictionary } from '../utils';
import {
	OAuthGithubConfig,
	OAuthGithubConfigType,
} from '../../providers/OAuthGithubConfig.provider';
import { createStore } from './store';

/**
 * Authentication
 */
export const client = createStore<Dictionary<OAuthConfigType>>(
	{},
	{ key: 'clientToken' },
);
export const clientHasProvider = (provider: ProviderEnum): boolean => {
	const value = get(client) as Dictionary<OAuthConfigType>;

	return value && value.hasOwnProperty(provider);
};

export const clientAuthenticated = createStore(
	{
		isGithubAuthenticated: false,
		isAzureDevOpsAuthenticated: false,
	},
	{},
);

const timer: Dictionary<NodeJS.Timeout> = {};

const createIntervalRefresh = (key: string, element: OAuthConfigType) => {
	let interval = setInterval(async () => {
		const diffSecondes = Math.abs(
			(new Date(element.current_date).getTime() - new Date().getTime()) / 1000,
		);

		const expires_in = parseInt(element.expires_in);

		if (diffSecondes > expires_in) {
			switch (key) {
				case ProviderEnum.AzureDevOps:
					await getToken<OAuthAzureDevOpsConfigType>(new OAuthAzureDevOpsConfig());
					break;
				case ProviderEnum.Github:
					await getToken<OAuthGithubConfigType>(new OAuthGithubConfig());
					break;
			}
		}
	}, 10000);

	timer[key] = interval;
};

const authentication = async (client: Dictionary<OAuthConfigType>) => {
	Object.entries(client).forEach(([key, value]) => {
		switch (key) {
			case ProviderEnum.Github:
				clientAuthenticated.update(x => ({
					...x,
					isGithubAuthenticated: value && !!value.access_token,
				}));
				break;
			case ProviderEnum.AzureDevOps:
				clientAuthenticated.update(x => ({
					...x,
					isAzureDevOpsAuthenticated: value && !!value.access_token,
				}));
				break;
		}
	});

	for (const key in client) {
		if (Object.prototype.hasOwnProperty.call(client, key)) {
			const element = client[key];

			const interval = timer[key];

			if (element && element.current_date && !interval) {
				createIntervalRefresh(key, element);
			}

			if (element && !element.access_token) {
				switch (key) {
					case ProviderEnum.AzureDevOps:
						await getToken<OAuthAzureDevOpsConfigType>(new OAuthAzureDevOpsConfig());
						break;
					case ProviderEnum.Github:
						await getToken<OAuthGithubConfigType>(new OAuthGithubConfig());
						break;
				}
			}
		}
	}
};

client.subscribe(authentication);
