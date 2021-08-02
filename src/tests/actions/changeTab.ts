import { act, fireEvent, screen } from '@testing-library/svelte';

export const changeTabAsync = async (tab: string): Promise<void> => {
  await act(async () => {
    fireEvent.click(await screen.findByRole('tab', { name: tab }));
  });
};

export const changeTab = (tab: string): void => {
  act(() => {
    fireEvent.click(screen.getByRole('tab', { name: tab }));
  });
};
