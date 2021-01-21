import type { ProviderEnum } from 'models/skizzle';
import { addItem, getItem } from 'shared/utils';
import { get, writable } from 'svelte/store';

type StoreOptionsType<T> = {
	key?: string;
	predicate?: (value?: T, provider?: ProviderEnum) => T;
	subscriber?: (initialValue: T) => (value: T) => void;
};

export const createStore = <T>(
	initialValue: T,
	{ key, predicate, subscriber }: StoreOptionsType<T>,
) => {
	const storage = getItem<T>(key);

	const store = writable(storage ? storage : initialValue);
	const { subscribe, set, update } = store;

	if (subscriber) {
		subscribe(subscriber(initialValue));
	}

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
