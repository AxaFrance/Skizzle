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
