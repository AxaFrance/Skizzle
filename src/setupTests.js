jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
  remote: {
    app: {
      getVersion: () => '1.0.0',
    },
  },
}));
