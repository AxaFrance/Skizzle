import MainView from './MainView.svelte';
import { render } from '@testing-library/svelte';

describe('MainView Component', () => {
  it('should render', () => {
    const { container } = render(MainView);

    expect(container).toContainHTML('');
  });
});
