import type { ProviderEnum } from 'models/skizzle';
import { get } from 'svelte/store';
import type { OAuthConfig, OAuthConfigType } from '../providers';
import { client } from './stores/authentication.store';
import { isLoading, settings } from './stores/default.store';
const app = require('electron').ipcRenderer;

export const getToken = async <T extends OAuthConfigType>(
	config: OAuthConfig<T>,
) => {
	const provider = config.getProvider();

	const body = config.getBody();

	const result = await app.invoke('token', {
		key: provider,
		body,
		settings: get(settings),
	});

	if (result.message) {
		console.error({ message: result.message });

		client.update(n => ({
			...n,
			[provider]: {},
		}));
	} else {
		if (result.access_token) {
			client.update(n => ({
				...n,
				[provider]: {
					...n[provider],
					...result,
					current_date: new Date(),
				},
			}));
		}
	}
	isLoading.set(false);
};

export const authorize = (provider: ProviderEnum, isSilent = false) => {
	app.send('oauth', provider, isSilent);
	app.once('getToken', (_, args) =>
		client.update(n => ({
			...n,
			[provider]: {
				...n[provider],
				...args,
			},
		})),
	);
};
