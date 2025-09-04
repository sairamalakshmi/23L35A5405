const STORAGE_KEYS = {
	urls: 'am_urls',
	clicks: 'am_clicks',
	logs: 'am_logs'
} as const

export function readJson<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key)
		return raw ? (JSON.parse(raw) as T) : fallback
	} catch {
		return fallback
	}
}

export function writeJson<T>(key: string, value: T): void {
	localStorage.setItem(key, JSON.stringify(value))
}

export function getKeys() {
	return STORAGE_KEYS
} 