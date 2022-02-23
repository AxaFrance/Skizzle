import type { CustomListType, ProviderEnum } from 'models/skizzle';
import { addItem, getItem } from 'shared/utils';
import { get, writable } from 'svelte/store';

type StoreOptionsType<T> = {
	key?: string;
	predicate?: (value?: T, provider?: ProviderEnum) => T;
	subscriber?: (initialValue: T) => (value: T) => void;
};

const getStoreValue = <T>(storage: T, initialValue: T) => {
	if (typeof storage === 'boolean') {
		return storage;
	}

	return storage ? storage : initialValue;
};

const initStorage = () => {
	let customLists: CustomListType[] = getItem('customLists');

	if (customLists) {
		customLists = customLists.map(list => {
			const cleanList = { ...list };

			if (cleanList.repositoryId) {
				cleanList.repositoriesId = [cleanList.repositoryId];
				delete cleanList.repositoryId;
			}

			return cleanList;
		});

		addItem('customLists', customLists);
	}
};

export const createStore = <T>(
	initialValue: T,
	{ key, predicate, subscriber }: StoreOptionsType<T>
) => {
	initStorage();
	const storage = getItem<T>(key);
	const store = writable(getStoreValue(storage, initialValue));
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
		initialValue
	};
};
