import { render } from '@testing-library/svelte';
import Profile from './Profile.svelte';

describe('Profile Component', () => {
	it('should render', () => {
		const { container } = render(Profile);

		expect(container).toContainHTML('');
	});
});
