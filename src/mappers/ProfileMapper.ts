import type {
	AzureDevOpsProfileApiType,
	GithubProfileApiType,
} from 'models/api/ProfileApiType';
import type { ProfileType } from 'models/skizzle/ProfileType';

export class ProfileMapper {
	public to(o: AzureDevOpsProfileApiType, params: any): ProfileType;
	public to(o: GithubProfileApiType, params: any): ProfileType;
	public to(o: any, params: any): ProfileType {
		let avatar = o.coreAttributes?.Avatar?.value?.value;

		if (avatar) {
			avatar = `data:image/png;base64,${avatar}`;
		} else {
			avatar = o.avatar_url;
		}

		return {
			email: o.email || o.emailAddress,
			id: o.id,
			name: o.name || o.displayName,
			avatar: avatar,
			...params,
		};
	}
}
