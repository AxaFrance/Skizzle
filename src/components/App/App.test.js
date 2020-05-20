import App from './App.svelte';
import { render } from '@testing-library/svelte';

describe('App Component', () => {
  it('should render', () => {
    const { container } = render(App);

    expect(container).toContainHTML('');
  });
});
