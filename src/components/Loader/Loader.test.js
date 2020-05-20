import Loader from './Loader.svelte';
import { render } from '@testing-library/svelte';

describe('Loader Component', () => {
  it('should render', () => {
    const { container } = render(Loader);

    expect(container).toContainHTML('');
  });
});
