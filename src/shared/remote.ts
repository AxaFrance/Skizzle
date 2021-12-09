import ky from 'ky';
import type { CustomListType } from 'models/skizzle';
import { ProviderEnum } from 'models/skizzle';
import SkizzleCache from './cache';

const isElectronRenderer = () => {
	// Renderer process
	if (
		typeof window !== 'undefined' &&
		typeof window.process === 'object' &&
		window.process.type === 'renderer'
	) {
		return true;
	}

	// Main process
	if (
		typeof process !== 'undefined' &&
		typeof process.versions === 'object' &&
		!!process.versions.electron
	) {
		return true;
	}

	// Detect the user agent when the `nodeIntegration` option is set to false
	if (
		typeof navigator === 'object' &&
		typeof navigator.userAgent === 'string' &&
		navigator.userAgent.indexOf('Electron') >= 0
	) {
		return true;
	}

	return false;
};

const checkNotificationPromise = () => {
	try {
		Notification.requestPermission().then();
	} catch (e) {
		return false;
	}

	return true;
};

const data = {
	notification: (title: string, body: string) => {
		if (isElectronRenderer()) {
			window.remote.notification(title, body);
		} else {
			if (!('Notification' in window)) {
				console.log('This browser does not support notifications.');
			} else {
				if (checkNotificationPromise()) {
					Notification.requestPermission().then(permission => {
						new Notification(title, { body, icon: '../assets/icon.png' });
					});
				}
			}
		}
	},
	getToken: async <T>(provider: ProviderEnum, body: string | T) => {
		switch (provider) {
			case ProviderEnum.AzureDevOps: {
				const data = await ky('https://app.vssps.visualstudio.com/oauth2/token', {
					method: 'post',
					timeout: 60000,
					body: body as string,
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				}).json<any>();

				return data;
			}
			case ProviderEnum.Github: {
				const data = await ky('https://github.com/login/oauth/access_token', {
					method: 'post',
					timeout: 60000,
					json: body,
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Connection: 'keep-alive'
					},
					redirect: 'follow'
				}).json<any>();

				return data;
			}
		}
	},
	authorize: (channel: string, provider: ProviderEnum) => {
		if (isElectronRenderer()) {
			window.remote.authorize(channel, provider);
		} else {
			console.log('Work in progress');
		}
	},
	setLaunchAtStartUp: (launchAtStartUp: boolean) => {
		if (isElectronRenderer()) {
			window.remote.setLaunchAtStartUp(launchAtStartUp);
		}
	},
	restartApp: () => {
		if (isElectronRenderer()) {
			window.remote.restartApp();
		}
	},
	fileImport: () => {
		if (isElectronRenderer()) {
			return window.remote.fileImport();
		}
	},
	fileExport: (data: CustomListType) => {
		if (isElectronRenderer()) {
			return window.remote.fileExport(data);
		} else {
			var a = document.createElement('a');
			var file = new Blob([JSON.stringify(data, undefined, 2)], {
				type: 'application/json'
			});
			a.href = URL.createObjectURL(file);
			a.download = 'Skizzle List';
			a.remove();
			return Promise.resolve(true);
		}
	},
	copyToClipboard: (data: string) => {
		if (isElectronRenderer()) {
			return window.remote.copyToClipboard(data);
		} else {
			navigator.clipboard.writeText(data);

			return Promise.resolve(true);
		}
	},
	checkForUpdateRequest: () => {
		if (isElectronRenderer()) {
			return window.remote.checkForUpdateRequest();
		}
	},
	checkForUpdateRestart: () => {
		if (isElectronRenderer()) {
			window.remote.checkForUpdateRestart();
		}
	},
	openDefaultBrowser: (url: string) => {
		if (isElectronRenderer()) {
			window.remote.openDefaultBrowser(url);
		} else {
			window.open(url, '_blank').focus();
		}
	},
	receive: (channel: string, func: (...args: any) => void) => {
		if (isElectronRenderer()) {
			window.remote.receive(channel, func);
		}
	},
	setPreRelease: (preRelease: boolean) => {
		if (isElectronRenderer()) {
			window.remote.setPreRelease(preRelease);
		}
	},
	getVersion: () => {
		if (isElectronRenderer()) {
			return window.remote.version();
		}
	},
	clearApplicationsData: () => {
		if (isElectronRenderer()) {
			return window.remote.clearApplicationsData();
		} else {
			localStorage.clear();
			SkizzleCache.clear();
		}
	}
};

export { data as remote, isElectronRenderer };
