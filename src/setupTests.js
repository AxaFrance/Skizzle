jest.mock('electron', () => ({
	ipcRenderer: {
		send: jest.fn(),
		on: jest.fn(),
	},
	remote: {
		app: {
			getVersion: () => '1.0.1',
		},
		getCurrentWindow: () => ({
			isMaximized: jest.fn(),
			on: jest.fn(),
		}),
	},
}));
