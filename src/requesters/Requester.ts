import type { HeaderType, ProviderEnum } from 'models/skizzle';
import type { OAuthConfigType } from 'providers';
import { client, clientHasProvider } from 'shared/stores/authentication.store';
import { isLoading, offline, settings } from 'shared/stores/default.store';
import { get } from 'svelte/store';

export abstract class Requester<T extends OAuthConfigType> {
	private readonly provider: ProviderEnum;
	constructor(provider: ProviderEnum) {
		this.provider = provider;
	}

	private clientHasProvider(config: T): boolean {
		return clientHasProvider(this.provider) && !!config?.access_token;
	}

	protected async fetch<S>(url: string): Promise<S> {
		const isOffline = get(offline);
		const isFetchingToken = get(isLoading);
		const config = get(client)[this.provider] as T;

		if (!isOffline && this.clientHasProvider(config) && !isFetchingToken) {
			const headers = this.getHeader(config);

			const data = (await window.remote.invoke(
				'request',
				JSON.stringify({
					url,
					options: headers,
					settings: get(settings),
				}),
			)) as S;

			return data;
		}
	}

	protected abstract getHeader(config: T): HeaderType;
}
