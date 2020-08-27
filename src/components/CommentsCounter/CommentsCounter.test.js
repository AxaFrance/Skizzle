import { render } from '@testing-library/svelte';
import CommentsCounter from './CommentsCounter.svelte';

describe('CommentsCounter Component', () => {
  it('should render', () => {
    const { getByText } = render(CommentsCounter, {
      hasResponse: false,
      comments: [
        {
          status: 'active',
          identities: null,
        },
      ],
    });

    expect(getByText('1')).toBeInTheDocument();
  });

  it('should render with responses', () => {
    const { getByText } = render(CommentsCounter, {
      hasResponse: true,
      comments: [
        {
          status: 'active',
          identities: null,
        },
      ],
    });

    expect(getByText('1')).toHaveClass('skz-comments-counter--responses');
  });
});
