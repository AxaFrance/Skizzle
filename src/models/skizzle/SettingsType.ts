import type { ThemeEnum } from './ThemeEnum';

export type SettingsType = {
	refresh_delay: number;
	launch_at_startup: boolean;
	theme: ThemeEnum;
	language: string;
	compact: boolean;
	preRelease: boolean;
	updateAvailable: boolean;
};
