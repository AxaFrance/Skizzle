import type { ProviderEnum } from 'models/skizzle';
import type { OAuthConfigType } from 'providers';
import { client, clientHasProvider } from 'shared/stores/authentication.store';
import { isLoading, offline } from 'shared/stores/default.store';
import { authorize } from 'shared/token';
import { get } from 'svelte/store';
import ky from 'ky';
import type { Dictionary } from 'shared/utils';

export abstract class Requester<T extends OAuthConfigType> {
	private readonly provider: ProviderEnum;
	private caches: Dictionary<any> = {};

	constructor(provider: ProviderEnum) {
		this.provider = provider;
	}

	private clientHasProvider(config: T): boolean {
		return clientHasProvider(this.provider) && !!config?.access_token;
	}

	protected async fetch<S>(
		url: string,
		options?: { cache: boolean },
	): Promise<S> {
		const isOffline = get(offline);
		const isFetchingToken = get(isLoading);
		const config = get(client)[this.provider] as T;

		if (!isOffline && this.clientHasProvider(config) && !isFetchingToken) {
			const headers = this.getHeader(config);

			const result = ky.get(url, {
				retry: {
					methods: ['get'],
					limit: 3,
				},
				hooks: {
					afterResponse: [
						(input, options, response) => {
							if (response.status === 403 || response.status === 203) {
								client.update(n => ({
									...n,
									[this.provider]: {},
								}));

								authorize(
									this.provider,
									response.status === 403 || response.status === 203,
								);
							}
						},
					],
				},
				cache: 'force-cache',
				headers,
			});

			const data = await result.json<S>();

			this.caches[url] = data;

			return data;
		} else {
			return this.caches[url];
		}
	}

	protected abstract getHeader(config: T): HeadersInit;
}
