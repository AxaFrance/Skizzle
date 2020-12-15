import { BrowserWindow } from 'electron';
var request = require('superagent');
require('superagent-proxy')(request);

export default class OAuthWindow {
	private params: any;
	private authorizeFilter: string[];
	private window: BrowserWindow;

	constructor({ parent, params }, authorizeFilter: string[] = []) {
		this.params = params;
		this.window = null;
		this.authorizeFilter = authorizeFilter;

		this.window = new BrowserWindow({
			autoHideMenuBar: true,
			parent,
			show: false,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
			},
		});
	}

	public startRequest(
		authorizationUrl: string,
		event: Electron.IpcMainEvent,
	): void {
		const values = Object.entries(this.params)
			.filter(([key, _]) => !this.authorizeFilter.some(x => x === key))
			.map(([key, value]) => `${key}=${value}`)
			.join('&');
		const authURL = `${authorizationUrl}?${values}`;

		this.window.loadURL(authURL);
		this.window.show();
		this.window.webContents.on('will-navigate', (e, url) =>
			this.login(event, url),
		);
		this.window.webContents.on('will-redirect', (e, url) =>
			this.login(event, url),
		);
	}

	private login(event: Electron.IpcMainEvent, url: string): void {
		const _url = url.split('?')[1];
		const _params = new URLSearchParams(_url);
		const _accessCode = _params.get('code');

		if (_accessCode) {
			event.sender.send('getToken', {
				code: _accessCode,
				...this.params,
			});

			if (this.window) {
				this.window.hide();
			}
		}
	}

	public async requestToken(url: string, body: string | object) {
		try {
			const result = await request
				.post(url)
				.proxy(process.env.http_proxy || '')
				.send(body);

			return result.body;
		} catch (error) {
			if (this.window) {
				this.window.hide();
			}

			throw new Error(error);
		}
	}
}
