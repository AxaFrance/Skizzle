import { render } from '@testing-library/svelte';
import Home from './Home.svelte';

describe('Home Component', () => {
	it('should render', () => {
		const { container } = render(Home);

		expect(container).toContainHTML('');
	});
});
