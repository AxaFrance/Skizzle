class SkizzleCache {
	private readonly CACHING_DURATION = 7 * 24 * 3600;
	private readonly CACHE_NAME: string = 'cache-skizzle';

	public async get<T>(key: string): Promise<T | undefined> {
		const cachedData = await caches.open(this.CACHE_NAME);
		const response = await cachedData.match(key);

		if (!response || !response.ok) {
			return undefined;
		}

		const expirationDate = Date.parse(response.headers.get('x-cache-expires'));
		const now = new Date().getUTCMilliseconds();

		if (expirationDate < now) {
			return undefined;
		}

		return (await response.json()) as T;
	}

	public async add(key: string, response: Response): Promise<Response> {
		const cachedData = await caches.open(this.CACHE_NAME);

		const expires = new Date();
		expires.setSeconds(expires.getSeconds() + this.CACHING_DURATION);

		const cachedResponseFields = {
			status: response.status,
			statusText: response.statusText,
			headers: { 'x-cache-expires': expires.toUTCString() }
		};

		response.headers.forEach((v, k) => {
			cachedResponseFields.headers[k] = v;
		});

		const responseClone = response.clone();
		const result = await response.blob();

		await cachedData.put(key, new Response(result, cachedResponseFields));

		return responseClone;
	}

	public async check(): Promise<void> {
		const cachedData = await caches.open(this.CACHE_NAME);
		const keys = await cachedData.keys();

		keys.forEach(async key => {
			const response = await cachedData.match(key);
			const expirationDate = Date.parse(response.headers.get('x-cache-expires'));
			const now = new Date().getUTCMilliseconds();

			if (expirationDate < now) {
				cachedData.delete(key);
			}
		});
	}

	public async clear(): Promise<void> {
		const cachedData = await caches.open(this.CACHE_NAME);
		const keys = await cachedData.keys();

		keys.forEach(async key => {
			cachedData.delete(key);
		});
	}
}

export default new SkizzleCache();
