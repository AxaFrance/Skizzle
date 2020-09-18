const { is } = require('electron-util');
const { autoUpdater } = require('electron-updater');
const { app } = require('electron');

let notifiedWindow;
let createWindow;
let retry = 0;
let interval;
let called = false;
let translate;

autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
	if (!app.isPackaged) {
		notifiedWindow.webContents.send('message', {
			text: translate('UpdateDevMode'),
		});

		setTimeout(() => {
			createWindow();
			notifiedWindow.close();
		}, 2000);
	} else {
		notifiedWindow.webContents.send('message', {
			text: translate('UpdateError'),
		});

		retry++;
		clear();
		timer(check, retry > 1 ? 30 : 5);
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

	clear();
	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
	notifiedWindow.webContents.send('message', {
		text: translate('UpdateNotAvailable'),
	});

	setTimeout(() => {
		createWindow();
		notifiedWindow.close();
	}, 2000);

	clear();
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
		autoUpdater.quitAndInstall(true, true);
	}, seconds * 1000);
});

function checkForUpdates(secondWindow, window, getWord) {
	notifiedWindow = secondWindow;
	createWindow = window;
	translate = getWord;

	if (!is.macAppStore) {
		const log = require('electron-log');
		log.transports.file.level = 'debug';
		autoUpdater.logger = log;

		notifiedWindow.webContents.send('message', {
			text: translate('Loading'),
		});

		check();
	}
}

function check() {
	setTimeout(() => {
		autoUpdater.checkForUpdates();
	}, 2000);
}

function timer(callback, seconds) {
	let value = seconds;

	interval = setInterval(() => {
		notifiedWindow.webContents.send('message', {
			text: `Nouvelle tentative dans ${value} seconde${value > 1 ? 's' : ''}`,
		});

		if (value > 1) {
			value--;
		} else {
			if (!called) {
				callback();

				called = true;
			}
		}
	}, 1000);
}

function clear() {
	clearInterval(interval);
	called = false;
}

module.exports.checkForUpdates = checkForUpdates;
