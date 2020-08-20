import { render } from '@testing-library/svelte';
import ErrorMessage from './ErrorMessage.svelte';

describe('Testing Error Message Component', () => {
	it('should render', () => {
		const { getByText } = render(ErrorMessage, {
			label: '',
			retry: () => {},
		});

		expect(getByText('<p></p>')).toBeInTheDocument();
	});
});
