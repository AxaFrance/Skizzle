import Labels from './Labels.svelte';
import { render } from '@testing-library/svelte';

describe('Labels Component', () => {
  it('should render', () => {
    const { getByText } = render(Labels, {
      labels: [
        {
          name: 'name',
        },
      ],
    });

    expect(getByText('name')).toBeInTheDocument();
  });
});
