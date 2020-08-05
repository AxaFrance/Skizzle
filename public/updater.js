const { is } = require('electron-util');
const { autoUpdater } = require('electron-updater');
const { app } = require('electron');

let notifiedWindow;
let mainWindow;
let translate;
autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
	notifiedWindow.webContents.send('message', {
		text: !app.isPackaged ? translate('UpdateDevMode') : translate('UpdateError'),
	});

	if (!app.isPackaged) {
		setTimeout(() => {
			notifiedWindow.hide();
			mainWindow.show();
		}, 2000);
	}
});

autoUpdater.on('checking-for-update', () => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateCheck'),
	});
});

autoUpdater.on('update-available', () => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateAvailable'),
	});

	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateNotAvailable'),
	});

	setTimeout(() => {
		notifiedWindow.hide();
		mainWindow.show();
	}, 2000);
});

autoUpdater.on('download-progress', progressObj => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateDownloading'),
		data: { ...progressObj },
	});
});

autoUpdater.on('update-downloaded', () => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateDownloaded'),
	});

	let seconds = 5;

	setInterval(() => {
		notifiedWindow.webContents.send('message', {
			text: translate('UpdateNotified', seconds, seconds > 1 ? 's' : ''),
		});

		if (seconds > 0) {
			seconds = seconds - 1;
		}
	}, 1000);

	setTimeout(() => {
		setImmediate(() => autoUpdater.quitAndInstall(true, true));
	}, 5000);
});

function checkForUpdates(secondWindow, primayWindow, getWord) {
	notifiedWindow = secondWindow;
	mainWindow = primayWindow;
	translate = getWord;

	if (!is.macAppStore) {
		const log = require('electron-log');
		log.transports.file.level = 'debug';
		autoUpdater.logger = log;

		notifiedWindow.webContents.send('message', {
			text: translate('Loading'),
		});

		setTimeout(() => {
			autoUpdater.checkForUpdates();
		}, 2000);
	}
}

module.exports.checkForUpdates = checkForUpdates;
