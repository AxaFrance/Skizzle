import Projects from './Projects.svelte';
import { render } from '@testing-library/svelte';

describe('Projects Component', () => {
	it('should render with no projects', () => {
		const { getByText } = render(Projects, {
			projects: [],
		});

		expect(getByText('NoProject')).toBeInTheDocument();
	});

	it('should render title with project', () => {
		const { getByText } = render(Projects, {
			projects: [{ id: '1', checked: true, name: 'name', repositories: [] }],
		});

		expect(getByText('OneProject')).toBeInTheDocument();
	});

	it('should render title with projects', () => {
		const { getByText } = render(Projects, {
			projects: [
				{ id: '1', checked: true, name: 'name', repositories: [] },
				{ id: '2', checked: false, name: 'name2', repositories: [] },
			],
		});

		expect(getByText('2 Projects')).toBeInTheDocument();
	});

	it('should render with projects', () => {
		const { getByText } = render(Projects, {
			projects: [
				{ id: '1', checked: true, name: 'name', repositories: [] },
				{ id: '2', checked: false, name: 'name2', repositories: [] },
			],
		});

		expect(getByText('name')).toBeInTheDocument();
		expect(getByText('name2')).toBeInTheDocument();
	});
});
