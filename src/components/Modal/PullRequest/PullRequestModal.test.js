import { render } from '@testing-library/svelte';
import PullRequestModal from './PullRequestModal.svelte';

describe('PullRequestModal Component', () => {
	it('should render', () => {
		const { container } = render(PullRequestModal, {
			pullRequest: {
				title: 'PR',
			},
			commentsGroup: [
				{
					threadContext: {
						filePath: 'Modal.svelte',
					},
					comments: [
						{
							lastUpdatedDate: new Date(),
							author: {
								displayName: 'Moignont Christophe',
							},
							content: 'En attente de Pair test...',
						},
					],
				},
			],
		});

		expect(container).toMatchSnapshot();
	});
});
