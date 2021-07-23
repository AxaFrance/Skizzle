import type { ProviderEnum } from "../../../models/skizzle/ProviderEnum";
import type { OAuthConfigType } from "../../../providers/OAuthConfig.provider";
import { client } from "../../../shared/stores/authentication.store";

export class OAuthConfigBuilder {
  private config = {} as OAuthConfigType;

  withToken(token?: string): OAuthConfigBuilder {
    this.config = ({
      access_token: token ?? 'token'
    });

    return this;
  }

  build(provider: ProviderEnum): OAuthConfigType {
    client.update(n => ({
			...n,
			[provider]: {
				...n[provider],
				...this.config,
			},
		}))
    return this.config;
  }
}