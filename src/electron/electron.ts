import {
	app,
	BrowserWindow,
	Menu,
	Notification,
	ipcMain,
	Tray,
	dialog,
	clipboard,
	nativeTheme
} from 'electron';
import OAuthWindow from './OAuthWindow';
import type { ProviderEnum } from '../models/skizzle/ProviderEnum';
import * as path from 'path';
import * as fs from 'fs';
import { autoUpdater } from 'electron-updater';
import type { CustomListType } from '../models/skizzle/CustomListType';
import { config } from '../config';

try {
	autoUpdater.logger = require('electron-log');
	require('electron-reloader')(module);
} catch (_) {}

const setAppUserModelId = () => {
	//@ts-ignore
	global.appUserModelId = 'com.axa.skizzle';
	app.setAppUserModelId('com.axa.skizzle');
};

setAppUserModelId();
autoUpdater.autoInstallOnAppQuit = true;

let window: BrowserWindow;
let children: Record<ProviderEnum, OAuthWindow> = undefined;
let tray: Tray;

const hangOrCrash = async (window: BrowserWindow) => {
	const options = {
		type: 'info',
		title: 'Renderer Process Hanging',
		message: 'This process is hanging.',
		buttons: ['Reload', 'Close']
	};

	const index = await dialog.showMessageBox(window, options);

	if (index.response === 0) {
		window.reload();
	} else {
		window.close();
	}
};

const createWindow = () => {
	const isMacOs = process.mas === true || process.platform === 'darwin';
	nativeTheme.themeSource = 'system';

	window = new BrowserWindow({
		title: 'Skizzle',
		center: true,
		width: 1024,
		minWidth: 250,
		minHeight: 500,
		height: 768,
		resizable: true,
		icon: path.join(__dirname, '../../', isMacOs ? 'assets/icon.icns' : 'assets/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, '../../preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			experimentalFeatures: true,
			webSecurity: false
		}
	});

	const url = app.isPackaged
		? `file://${path.join(__dirname, '../../index.html')}`
		: 'http://localhost:3000';

	window.loadURL(url);
	window.on('closed', () => {
		window = null;
	});

	if (!app.isPackaged) {
		window.webContents.openDevTools({ mode: 'detach' });
	}

	//@ts-ignore
	window.on('render-process-gone', () => hangOrCrash(window));
	window.on('unresponsive', () => hangOrCrash(window));

	window.on('maximize', () => {
		window.webContents.send('change-maximisze', true);
	});

	window.on('unmaximize', () => {
		window.webContents.send('change-maximisze', false);
	});

	window.once('focus', () => window.flashFrame(false));
	window.flashFrame(true);

	const iconName = isMacOs ? 'assets/icon-macos.png' : 'assets/icon.png';

	const iconPath = path.join(__dirname, '../../', iconName);

	window.setMenuBarVisibility(false);
	tray = new Tray(iconPath);
	tray.setToolTip('Skizzle application');

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'About Skizzle',
			role: 'about'
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo'
				},
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectAll'
				}
			]
		},
		{
			label: 'Quit',
			role: 'quit',
			click: () => app.quit(),
			accelerator: 'CommandOrControl+Q'
		}
	]);

	tray.setContextMenu(contextMenu);
	Menu.setApplicationMenu(contextMenu);

	tray.on('click', () => {
		if (window.isMinimized()) window.restore();
		if (!window.isVisible()) window.show();
		window.focus();
	});

	children = Object.fromEntries(
		Object.entries(config).reduce((acc, [key, value]) => {
			acc.push([
				key,
				new OAuthWindow(
					{
						parent: window,
						request: {
							url: value.oidc.authorize
						},
						params: {
							...value.oidc.params
						}
					},
					value.oidc.unAuthorizedFilter
				)
			]);

			return acc;
		}, [])
	) as Record<ProviderEnum, OAuthWindow>;
};

autoUpdater.on('update-downloaded', () =>
	window.webContents.send('check-for-update-response')
);

autoUpdater.on('download-progress', progress =>
	window.webContents.send('download-progress-response', progress)
);

ipcMain.handle(
	'check-for-update-request',
	async (event, _) => (await autoUpdater.checkForUpdates()).updateInfo.version
);

ipcMain.handle('get-version', (event, _) => app.getVersion());

ipcMain.on('check-for-update-restart', (event, _) =>
	autoUpdater.quitAndInstall(true, true)
);

ipcMain.handle('copy-to-clipboard', async (event, url: string) => {
	clipboard.writeText(url, 'clipboard');

	return true;
});

ipcMain.on('toggle-pre-release', (event, arg) => {
	autoUpdater.allowPrerelease = arg;
});

ipcMain.on('clear-applications-data', async (event, _) => {
	await window.webContents.session.clearStorageData();
	window.webContents.reload();
});

ipcMain.handle(
	'file-export',
	async (event: Electron.IpcMainEvent, currentTabData: CustomListType) => {
		try {
			const { filePath } = await dialog.showSaveDialog(window, {
				title: 'Export list as...',
				defaultPath: `${currentTabData.name}.json`,
				filters: [
					{
						name: 'Skizzle List',
						extensions: ['json']
					}
				]
			});

			fs.writeFileSync(filePath, JSON.stringify(currentTabData, undefined, 2));

			return true;
		} catch {
			return false;
		}
	}
);

ipcMain.handle('file-import', async (event: Electron.IpcMainEvent) => {
	try {
		const { filePaths } = await dialog.showOpenDialog(window, {
			properties: ['openFile'],
			title: 'Import list',
			filters: [{ name: 'Skizzle List', extensions: ['json'] }]
		});

		return fs.readFileSync(filePaths[0], 'utf8');
	} catch {
		return undefined;
	}
});

if (app.isPackaged) {
	const settings = app.getLoginItemSettings();

	app.setLoginItemSettings({
		openAtLogin: settings.openAtLogin
	});

	ipcMain.on('launch-startup', (event, arg) => {
		app.setLoginItemSettings({
			openAtLogin: arg
		});
	});
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if (window) {
			if (window.isMinimized()) window.restore();
			if (!window.isVisible()) window.show();
			window.focus();
		}
	});

	app.commandLine.appendSwitch('disable-site-isolation-trials');
	app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

	app.whenReady().then(() => {
		createWindow();

		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') app.quit();
			if (tray) tray.destroy();
		});
	});

	ipcMain.on('oauth', async (event, channel: string, key: ProviderEnum) => {
		children[key].startRequest(channel, event);
	});

	ipcMain.on('notifier', (event, arg) => {
		if (Notification.isSupported()) {
			const iconName =
				process.mas === true || process.platform === 'darwin'
					? 'assets/icon-macos.png'
					: 'assets/icon.png';

			const icon = path.join(__dirname, '../../', iconName);

			new Notification({ ...arg, icon }).show();
		}
	});
}
