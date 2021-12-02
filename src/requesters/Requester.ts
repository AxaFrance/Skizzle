import { client, clientHasProvider } from 'shared/stores/authentication.store';
import type { OAuthConfigType } from 'providers';
import type { HeaderType, ProviderEnum } from 'models/skizzle';
import { FetchMethodEnum } from 'models/skizzle';
import { isLoading, offline } from 'shared/stores/default.store';
import { get } from 'svelte/store';
import ky from 'ky';

export abstract class Requester<T extends OAuthConfigType> {
	public readonly provider: ProviderEnum;

	constructor(provider: ProviderEnum) {
		this.provider = provider;
	}

	public clientHasProvider(config: T): boolean {
		return clientHasProvider(this.provider) && !!config?.access_token;
	}

	public async fetch<S>(
		url: string,
		method: FetchMethodEnum = FetchMethodEnum.Get,
		body?: unknown
	): Promise<S> {
		const isOffline = get(offline);
		const isFetchingToken = get(isLoading);
		const config = get(client)[this.provider] as T;

		console.log({ config });

		if (!isOffline && this.clientHasProvider(config) && !isFetchingToken) {
			const headers = this.getHeader(config);

			const data = await ky(url, {
				method,
				timeout: 60000,
				retry: {
					methods: ['get'],
					limit: 3
				},
				json: body,
				headers
			}).json<S>();

			return data;
		}
	}

	public abstract getHeader(config: T): HeaderType;
}
