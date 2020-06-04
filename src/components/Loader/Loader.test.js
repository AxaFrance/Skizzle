import { render } from '@testing-library/svelte';
import Loader from './Loader.svelte';

describe('Loader Component', () => {
	it('should render', () => {
		const { container } = render(Loader);

		expect(container).toContainHTML('');
	});
});
