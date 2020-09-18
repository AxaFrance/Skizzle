const { is } = require('electron-util');
const { autoUpdater } = require('electron-updater');
const { app } = require('electron');

let notifiedWindow;
let createWindow;
let retry = 0;
let interval;
let called = false;
autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
	if (!app.isPackaged) {
		notifiedWindow.webContents.send('message', {
			text: "Mode de développement, passage de l'étape de mise à jour",
		});

		setTimeout(() => {
			createWindow();
			notifiedWindow.close();
		}, 2000);
	} else {
		notifiedWindow.webContents.send('message', {
			text: 'Une erreur est survenue !',
		});

		retry++;
		clear();
		timer(check, retry > 1 ? 30 : 5);
	}
});

autoUpdater.on('checking-for-update', () => {
	notifiedWindow.webContents.send('message', {
		text: 'Recherche de mise à jour...',
	});
});

autoUpdater.on('update-available', () => {
	notifiedWindow.webContents.send('message', {
		text: 'Une mise à jour est disponible',
	});

	clear();
	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
	notifiedWindow.webContents.send('message', {
		text: 'Votre application est à jour',
	});

	setTimeout(() => {
		createWindow();
		notifiedWindow.close();
	}, 2000);

	clear();
});

autoUpdater.on('download-progress', progressObj => {
	notifiedWindow.webContents.send('message', {
		text: 'Téléchargement en cours...',
		data: { ...progressObj },
	});
});

autoUpdater.on('update-downloaded', () => {
	notifiedWindow.webContents.send('message', {
		text: 'Installation de la mise à jour',
	});

	setTimeout(() => {
		autoUpdater.quitAndInstall(true, true);
	}, 2000);
});

function checkForUpdates(secondWindow, window) {
	notifiedWindow = secondWindow;
	createWindow = window;

	if (!is.macAppStore) {
		const log = require('electron-log');
		log.transports.file.level = 'debug';
		autoUpdater.logger = log;

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
