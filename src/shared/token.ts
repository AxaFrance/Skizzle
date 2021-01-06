import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import { get } from 'svelte/store';
import type {
	OAuthConfig,
	OAuthConfigType,
} from '../providers/OAuthConfig.provider';
import { client } from './stores/authentication.store';
import { isLoading, settings } from './stores/default.store';
const app = require('electron').ipcRenderer;

export const getToken = async <T extends OAuthConfigType>(
	config: OAuthConfig<T>,
) => {
	const provider = config.getProvider();

	try {
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
					},
				}));
			}
		}
		isLoading.set(false);
	} catch (err) {
		console.log(err);
		isLoading.set(false);
		return;
	}
};

export const authorize = (provider: ProviderEnum) => {
	isLoading.set(true);
	app.send('oauth', provider);
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
