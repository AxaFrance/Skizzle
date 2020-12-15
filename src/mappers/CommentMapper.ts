import type {
	AzureDevOpsCommentType,
	GithubCommentApiType,
} from 'models/api/CommentsApiType';
import type { CommentType } from 'models/skizzle/CommentType';
import { getDateStr } from 'shared/utils';

export class CommentMapper {
	public to(o: AzureDevOpsCommentType[], params: any): CommentType[];
	public to(o: GithubCommentApiType[], params: any): CommentType[];
	public to(o: any[], params: any): CommentType[] {
		return o.map(value => {
			const date = new Date(value.updated_at || value.lastUpdatedDate);

			return {
				text: value.body || value.content,
				date: getDateStr(date),
				author: {
					avatar: value.user?.avatar_url || value.author?.descriptor,
					displayName: value.user?.login || value.author?.displayName,
				},
				...params,
			};
		});
	}
}
