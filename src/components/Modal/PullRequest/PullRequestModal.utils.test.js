import { getAvatarUrl, getFile, getTime } from './PullRequestModal.utils';

jest.mock('../../../shared/requester', () => {
	const originalModule = jest.requireActual('../../../shared/requester');

	return {
		...originalModule,
		getAvatar: () => Promise.resolve({ value: 'data' }),
	};
});

describe('PullRequestModal utils', () => {
	describe('getAvatarUrl', () => {
		it('return url', async () => {
			const author = { id: '123456', descriptor: 'descriptor?' };
			const organizationName = 'axa';

			const res = await getAvatarUrl(author, organizationName);
			expect(res.value).toEqual('data');
		});
	});

	describe('getFile', () => {
		it('return the corresponding file name', () => {
			const commentGroup = {
				threadContext: {
					filePath:
						'/Sources/client/game-clients/src/components/FormRachatPartiel/Besoin/CommentsModal.component.js',
				},
			};

			const res = getFile(commentGroup);
			expect(res).toEqual('CommentsModal.component.js');
		});

		it('return nothing if no threadContext', () => {
			const commentGroup = {};

			const res = getFile(commentGroup);
			expect(res).toEqual('');
		});
	});

	describe('getTime', () => {
		const substractDays = days => {
			const date = new Date();
			date.setDate(date.getDate() - days);
			return date;
		};

		it.each([
			[substractDays(0), "Aujourd'hui"],
			[substractDays(1), 'Hier'],
			[substractDays(2), 'il y a 2 jours'],
			[substractDays(5), 'il y a 5 jours'],
		])(' when time equals %s, should return %s', (time, expected) => {
			expect(getTime(time)).toBe(expected);
		});
	});
});
