jest.mock('electron', () => ({
	ipcRenderer: {
		send: jest.fn(),
		on: jest.fn(),
	},
	remote: {
		app: {
			getVersion: () => '1.0.3',
			on: jest.fn(),
			getLocale: () => 'en',
		},
		getCurrentWindow: () => ({
			isMaximized: jest.fn(),
			on: jest.fn(),
		}),
	},
}));

jest.mock('fs', () => ({
	existsSync: () => false,
	readFileSync: () =>
		JSON.stringify([
			{
				code: 'EN',
				label: 'English',
				words: 'assets/langs/en.json',
			},
		]),
}));
