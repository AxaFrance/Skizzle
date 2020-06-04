import { render } from '@testing-library/svelte';
import Login from './Login.svelte';

describe('Login Component', () => {
	it('should render', () => {
		const { container } = render(Login);

		expect(container).toContainHTML('');
	});
});
