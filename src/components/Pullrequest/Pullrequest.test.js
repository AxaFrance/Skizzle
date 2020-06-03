import { render } from '@testing-library/svelte';
import { profile } from '../../shared/store';
import Pullrequest from './Pullrequest.svelte';

jest.mock('svelte', () => {
  const originalModule = jest.requireActual('svelte');

  return {
    ...originalModule,
    getContext: jest.fn(a => jest.fn()),
  };
});

describe('Pullrequest Component', () => {
  it('should render', () => {
    profile.set({ id: '1234567' });

    const { container, getByText } = render(Pullrequest, {
      pullRequest: {
        createdBy: {
          displayName: 'displayName',
        },
        repository: {
          project: {
            name: 'project',
          },
        },
        reviewers: [{ vote: 10 }],
      },
    });

    const displayName = container.getElementsByClassName(
      'skz-pullrequest__author',
    )[0].innerHTML;

    expect(displayName).toContain('displayName');
    expect(getByText('project')).toBeInTheDocument();
  });
});
