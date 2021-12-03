export const electron = {
	remote: {
		send: jest.fn(),
		receive: jest.fn(),
		invoke: jest.fn(),
		openDefaultBrowser: jest.fn()
	}
};
