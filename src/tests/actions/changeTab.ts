import { act, fireEvent, screen } from '@testing-library/svelte';

export const changeTabAsync = async (tab: string | RegExp): Promise<void> => {
  await act(async () => {
    fireEvent.mouseDown(await screen.findByRole('tab', { name: tab }));
    fireEvent.mouseUp(await screen.findByRole('tab', { name: tab }));
  });
};

export const changeTab = (tab: string | RegExp): void => {
  act(() => {
    fireEvent.mouseDown(screen.getByRole('tab', { name: tab }));
    fireEvent.mouseUp(screen.getByRole('tab', { name: tab }));
  });
};
