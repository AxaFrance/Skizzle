import type { ProviderEnum } from 'models/skizzle';
import { get } from 'svelte/store';
import type { OAuthConfig, OAuthConfigType } from '../providers';
import { client } from './stores/authentication.store';
import { isLoading, settings } from './stores/default.store';

export const getToken = async <T extends OAuthConfigType>(
	config: OAuthConfig<T>,
) => {
	const provider = config.getProvider();

	const body = config.getBody();

	const result = await window.remote.invoke('token', {
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
	window.remote.send('oauth', provider, isSilent);
	window.remote.receive('getToken', args =>
		client.update(n => ({
			...n,
			[provider]: {
				...n[provider],
				...args,
			},
		})),
	);
};
