import { render } from '@testing-library/svelte';
import App from './App.svelte';

describe('App Component', () => {
	it('should render', () => {
		const { container } = render(App);

		expect(container).toContainHTML('');
	});
});
