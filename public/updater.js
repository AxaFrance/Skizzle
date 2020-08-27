const { is } = require('electron-util');
const { autoUpdater } = require('electron-updater');
const { app } = require('electron');

let notifiedWindow;
let mainWindow;
let retry = 0;
autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
	if (!app.isPackaged) {
		notifiedWindow.webContents.send('message', {
			text: "Mode de développement, passage de l'étape de mise à jour",
		});

		setTimeout(() => {
			notifiedWindow.hide();
			mainWindow.show();
		}, 2000);
	} else {
		retry++;

		if (retry > 5) {
			notifiedWindow.webContents.send('message', {
				text: 'Une erreur est survenue lors de la mise à jour',
			});
		} else {
			timer(() => check(), retry > 1 ? 30 : 5);
		}
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

	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
	notifiedWindow.webContents.send('message', {
		text: 'Votre application est à jour',
	});

	setTimeout(() => {
		notifiedWindow.hide();
		mainWindow.show();
	}, 2000);
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

function checkForUpdates(secondWindow, primayWindow) {
	notifiedWindow = secondWindow;
	mainWindow = primayWindow;

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

	setInterval(() => {
		notifiedWindow.webContents.send('message', {
			text: `Nouvelle tentative dans ${value} seconde${value > 1 ? 's' : ''}`,
		});

		if (value > 0) {
			value--;
		}
	}, 1000);

	setTimeout(() => callback(), seconds * 1000);
}

module.exports.checkForUpdates = checkForUpdates;
