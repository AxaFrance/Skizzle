import { render } from '@testing-library/svelte';
import Pullrequest from './Pullrequest.svelte';

describe('Pullrequest Component', () => {
	it('should render', () => {
		const { container, getByText } = render(Pullrequest, {
			pullRequest: {
				createdBy: {
					displayName: 'displayName',
				},
				repository: {
					project: {
						name: 'project',
					},
				},
				reviewers: [{ vote: 10 }],
			},
		});

		const displayName = container.getElementsByClassName(
			'skz-pullrequest__author',
		)[0].innerHTML;

		expect(displayName).toContain('displayName');
		expect(getByText('project')).toBeInTheDocument();
	});
});
