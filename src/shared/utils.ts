export const addItem = <T>(key: string, value: T): void =>
	localStorage.setItem(key, JSON.stringify(value));

export const removeItem = (key: string): void => localStorage.removeItem(key);

export const removeItems = (keys: string[]): void =>
	keys.forEach(key => removeItem(key));

export const getItem = <T>(key: string): T =>
	JSON.parse(localStorage.getItem(key)) as T;

export const existValue = <T>(items: T[], value: T) =>
	!!items && items.some(x => x === value);

export type Dictionary<T> = {
	[Key: string]: T;
};

export const getDateStr = (date: Date): string => {
	const today = new Date();
	const oneDay = 24 * 60 * 60 * 1000;
	const diffDays = Math.round(
		Math.abs((date.getTime() - today.getTime()) / oneDay),
	);

	switch (diffDays) {
		case 0:
			return "Aujourd'hui";
		case 1:
			return 'Hier';
		default:
			return `il y a ${diffDays} jours`;
	}
};

export function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16),
	);
}
