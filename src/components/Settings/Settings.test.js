import { render } from '@testing-library/svelte';
import Settings from './Settings.svelte';

describe('Settings Component', () => {
	it('should render', () => {
		const { container } = render(Settings);

		expect(container).toContainHTML('');
	});
});
