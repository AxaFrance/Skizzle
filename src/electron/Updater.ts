import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';

export class Updater {
	private splashscreen: BrowserWindow;
	private retry: number = 0;
	private interval: NodeJS.Timeout;
	private called: boolean = false;
	private createWindow: Function;

	constructor(createWindow: Function) {
		this.createWindow = createWindow;

		this.splashscreen = new BrowserWindow({
			autoHideMenuBar: true,
			frame: false,
			width: 525,
			height: 265,
			resizable: false,
			skipTaskbar: true,
			webPreferences: {
				nodeIntegration: true,
			},
		});

		const url = app.isPackaged
			? `file://${path.join(__dirname, '../../splashscreen.html')}`
			: 'http://localhost:3000/splashscreen.html';

		this.splashscreen.loadURL(url);

		this.splashscreen.on('closed', () => {
			this.splashscreen = null;
		});

		autoUpdater.autoDownload = false;

		autoUpdater.on('error', error => {
			if (!app.isPackaged) {
				this.splashscreen.webContents.send('message', {
					text: 'UpdateDevMode',
				});

				setTimeout(() => {
					createWindow();
					this.splashscreen.close();
				}, 2000);
			} else {
				this.splashscreen.webContents.send('message', {
					text: 'UpdateError',
				});

				this.retry++;
				this.clear();
				this.timer(this.retry > 1 ? 30 : 5);
			}
		});

		autoUpdater.on('checking-for-update', () => {
			this.splashscreen.webContents.send('message', {
				text: 'UpdateCheck',
			});
		});

		autoUpdater.on('update-available', () => {
			this.splashscreen.webContents.send('message', {
				text: 'UpdateAvailable',
			});

			this.clear();
			autoUpdater.downloadUpdate();
		});

		autoUpdater.on('update-not-available', () => {
			this.splashscreen.webContents.send('message', {
				text: 'UpdateNotAvailable',
			});

			setTimeout(() => {
				createWindow();
				this.splashscreen.close();
			}, 2000);

			this.clear();
		});

		autoUpdater.on('download-progress', progressObj => {
			this.splashscreen.webContents.send('message', {
				text: 'UpdateDownloading',
				data: { ...progressObj },
			});
		});

		autoUpdater.on('update-downloaded', () => {
			this.splashscreen.webContents.send('message', {
				text: 'UpdateDownloaded',
			});

			let seconds = 5;

			setInterval(() => {
				this.splashscreen.webContents.send('message', {
					text: 'UpdateNotified',
				});

				if (seconds > 0) {
					seconds = seconds - 1;
				}
			}, 1000);

			setTimeout(() => {
				autoUpdater.quitAndInstall(true, true);
			}, seconds * 1000);
		});
	}

	private timer(seconds: number) {
		let value = seconds;

		this.interval = setInterval(() => {
			this.splashscreen.webContents.send('message', {
				text: `Nouvelle tentative dans ${value} seconde${value > 1 ? 's' : ''}`,
			});

			if (value > 1) {
				value--;
			} else {
				if (!this.called) {
					this.check();

					this.called = true;
				}
			}
		}, 1000);
	}

	private clear() {
		clearInterval(this.interval);
		this.called = false;
	}

	private check() {
		setTimeout(() => {
			autoUpdater.checkForUpdates();
		}, 2000);
	}

	public checkForUpdates() {
		if (process.platform !== 'darwin' && process.mas !== false) {
			const log = require('electron-log');
			log.transports.file.level = 'debug';
			autoUpdater.logger = log;

			this.splashscreen.webContents.send('message', {
				text: 'Loading',
			});

			this.check();
		} else {
			this.createWindow();
		}
	}
}
