import { ProviderEnum, SettingsType, CustomListType } from 'models/skizzle';

export {};

declare global {
	interface Window {
		remote: {
			notification: (title: string, body: string) => void;
			authorize: (channel: string, provider: ProviderEnum) => void;
			setLaunchAtStartUp: (launchAtStartUp: boolean) => void;
			restartApp: () => void;
			fileImport: () => Promise<string>;
			fileExport: (data: CustomListType) => Promise<boolean>;
			copyToClipboard: (data: string) => Promise<boolean>;
			checkForUpdateRequest: () => Promise<string>;
			checkForUpdateRestart: () => void;
			openDefaultBrowser: (url: string) => void;
			receive: (channel: string, func: (...args: any) => void) => void;
			setPreRelease: (preRelease: boolean) => void;
			version: () => Promise<string>;
		};
	}
}
