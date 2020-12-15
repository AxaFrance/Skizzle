import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { OAuthConfigType } from 'providers/OAuthConfig.provider';
import { client, clientHasProvider } from 'shared/stores/authentication.store';
import { authorize } from 'shared/token';
import { get } from 'svelte/store';

export abstract class Requester<T extends OAuthConfigType> {
	private readonly provider: ProviderEnum;

	constructor(provider: ProviderEnum) {
		this.provider = provider;
	}

	private clientHasProvider(config: T): boolean {
		return clientHasProvider(this.provider) && !!config?.access_token;
	}

	protected async fetch<S>(url: string, retry: number = 3): Promise<S> {
		const config = get(client)[this.provider] as T;

		if (this.clientHasProvider(config)) {
			const params = this.getHeader(config);

			const result = await fetch(url, params);

			if (params.method === 'GET' && !result.ok && result.status !== 401) {
				if (retry === 0) {
					throw new Error('Fetching error');
				}

				this.fetch(url, retry - 1);
			}

			if (
				result.status === 203 ||
				result.status === 401 ||
				result.status === 302
			) {
				client.update(n => ({
					...n,
					[this.provider]: {},
				}));
				authorize(this.provider);
			}

			return (await result.json()) as S;
		}
	}

	protected abstract getHeader(config: T): RequestInit;
}
