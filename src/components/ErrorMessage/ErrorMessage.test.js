import { render, fireEvent } from '@testing-library/svelte';
import ErrorMessage from './ErrorMessage.svelte';

describe('Testing Error Message Component', () => {
	it('should render with empty props', () => {
		const { container } = render(ErrorMessage, {
			label: '',
			retry: jest.fn(),
		});

		expect(container).toMatchSnapshot();
	});

	it('should render with label', () => {
		const { container } = render(ErrorMessage, {
			label: 'An error occurred!',
			retry: jest.fn(),
		});

		expect(container).toMatchSnapshot();
	});

	it('should render with button', async () => {
		const retry = jest.fn();
		const { getByText } = render(ErrorMessage, {
			label: '',
			retry,
		});

		const button = getByText('Retry');

		await fireEvent.click(button);

		expect(retry).toHaveBeenCalled();
	});
});
