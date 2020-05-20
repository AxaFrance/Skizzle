import Login from './Login.svelte';
import { render } from '@testing-library/svelte';

describe('Login Component', () => {
  it('should render', () => {
    const { container } = render(Login);

    expect(container).toContainHTML('');
  });
});
