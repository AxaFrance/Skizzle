import { addItem, getItem } from 'shared/utils';
import { writable } from 'svelte/store';

export const createStore = <T>(initialValue: T, key?: string) => {
	const storage = getItem<T>(key);

	const store = writable(storage ? storage : initialValue);
	const { subscribe, set, update } = store;

	if (key) {
		subscribe((value: T) => addItem<T>(key, value));
	}

	return {
		set,
		subscribe,
		update,
		reset: () => set(initialValue),
		initialValue,
	};
};
