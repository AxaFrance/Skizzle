import type { CommonType } from './CommonType';

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
} & CommonType;

export type { UserType, LabelType, PullRequestType };
