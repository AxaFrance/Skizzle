import Home from './Home.svelte';
import { render } from '@testing-library/svelte';

describe('Home Component', () => {
  it('should render', () => {
    const { container } = render(Home);

    expect(container).toContainHTML('');
  });
});
