import type { CommentType } from './CommentType';
import type { CommonType } from './CommonType';
import type { ReviewType } from './ReviewType';

type UserType = {
	name: string;
	avatar?: string;
};

type LabelType = {
	name: string;
};

type PullRequestType = {
	title: string;
	description: string;
	date: string;
	dateStr: string;
	user: UserType;
	owner?: string;
	labels: LabelType[];
	url: string;
	comments: CommentType[];
	reviewers: ReviewType;
} & CommonType;

export type { UserType, LabelType, PullRequestType };
