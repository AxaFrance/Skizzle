import { BrowserWindow } from 'electron';

export default class OAuthWindow {
	private params: any;
	private request: any;
	private authorizeFilter: string[];
	private window: BrowserWindow;

	constructor({ parent, request, params }, authorizeFilter: string[] = []) {
		this.request = request;
		this.params = params;
		this.window = null;
		this.authorizeFilter = authorizeFilter;

		this.window = new BrowserWindow({
			autoHideMenuBar: true,
			parent,
			show: false,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true
			}
		});
	}

	public startRequest(channel: string, event: Electron.IpcMainEvent): void {
		const values = Object.entries(this.params)
			.filter(([key, _]) => !this.authorizeFilter.some(x => x === key))
			.map(([key, value]) => `${key}=${value}`)
			.join('&');
		const authURL = `${this.request.url}?${values}`;

		this.window.loadURL(authURL);

		this.window.show();

		this.window.on('close', event => {
			event.preventDefault();

			this.window.hide();
		});

		this.window.webContents.on('will-navigate', (e, url) =>
			this.login(channel, event, url)
		);
		this.window.webContents.on('will-redirect', (e, url) =>
			this.login(channel, event, url)
		);
	}

	private login(channel: string, event: Electron.IpcMainEvent, url: string): void {
		const _url = url.split('?')[1];
		const _params = new URLSearchParams(_url);
		const _accessCode = _params.get('code');

		if (_accessCode) {
			event.sender.send(channel, {
				code: _accessCode,
				...this.params
			});

			if (this.window) {
				this.window.hide();
			}
		}
	}
}
