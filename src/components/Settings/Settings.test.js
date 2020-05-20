import Settings from './Settings.svelte';
import { render } from '@testing-library/svelte';

describe('Settings Component', () => {
  it('should render', () => {
    const { container } = render(Settings);

    expect(container).toContainHTML('');
  });
});
