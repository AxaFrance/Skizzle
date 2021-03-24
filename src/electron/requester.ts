import type { SettingsType } from '../models/skizzle/SettingsType';
import type { HeaderType } from '../models/skizzle/HeaderType';

var superagent = require('superagent');
require('superagent-proxy')(superagent);

export const requester = async (
	url: string,
	headers?: HeaderType,
	settings?: SettingsType,
) => {
	try {
		const result = await superagent
			.get(url)
			.proxy(settings.proxy)
			.set('User-Agent', headers['user-agent'])
			.auth(headers?.authorization, { type: 'bearer' });

		return result.body;
	} catch (error) {
		throw new Error(error);
	}
};
