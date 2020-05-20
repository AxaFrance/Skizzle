import Profile from './Profile.svelte';
import { render } from '@testing-library/svelte';

describe('Profile Component', () => {
  it('should render', () => {
    const { container } = render(Profile);

    expect(container).toContainHTML('');
  });
});
