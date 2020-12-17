import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import { addItem, getItem } from 'shared/utils';
import { get, writable } from 'svelte/store';

export const createStore = <T>(
	initialValue: T,
	{
		key,
		predicate,
	}: { key?: string; predicate?: (value?: T, provider?: ProviderEnum) => T },
) => {
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
		reset: (provider?: ProviderEnum) => {
			if (predicate) {
				set(predicate(get(store), provider));
			} else {
				set(initialValue);
			}
		},
		initialValue,
	};
};
