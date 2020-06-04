import { render } from '@testing-library/svelte';
import MainView from './MainView.svelte';

describe('MainView Component', () => {
	it('should render', () => {
		const { container } = render(MainView);

		expect(container).toContainHTML('');
	});
});
