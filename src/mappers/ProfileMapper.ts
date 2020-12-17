import type {
	AzureDevOpsProfileApiType,
	GithubProfileApiType,
} from 'models/api/ProfileApiType';
import type { ProfileType } from 'models/skizzle/ProfileType';

export class ProfileMapper {
	public to(o: AzureDevOpsProfileApiType, params: any): ProfileType;
	public to(o: GithubProfileApiType, params: any): ProfileType;
	public to(o: any, params: any): ProfileType {
		return {
			email: o.email || o.emailAddress,
			id: o.id,
			name: o.name || o.displayName,
			avatar: o.avatar_url,
			...params,
		};
	}
}
