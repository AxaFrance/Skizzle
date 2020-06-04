import { render } from '@testing-library/svelte';
import Repositories from './Repositories.svelte';

describe('Repositories Component', () => {
	it('should render with no repositories', () => {
		const { getByText } = render(Repositories, {
			repositories: [],
		});

		expect(getByText('Aucun repository pour ce projet.')).toBeInTheDocument();
	});

	it('should render with repositories', () => {
		const { getByText } = render(Repositories, {
			repositories: [
				{ id: '1', checked: true, name: 'name' },
				{ id: '2', checked: false, name: 'name2' },
			],
		});

		expect(getByText('name')).toBeInTheDocument();
		expect(getByText('name2')).toBeInTheDocument();
	});
});
