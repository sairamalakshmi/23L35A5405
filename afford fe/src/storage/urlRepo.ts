import { nanoid } from 'nanoid'
import { ClickEvent, ShortUrl } from '../types'
import { getKeys, readJson, writeJson } from './localStore'

const KEYS = getKeys()

export function listShortUrls(): ShortUrl[] {
	return readJson<ShortUrl[]>(KEYS.urls, [])
}

export function saveShortUrls(urls: ShortUrl[]): void {
	writeJson(KEYS.urls, urls)
}

export function upsertShortUrl(url: ShortUrl): void {
	const urls = listShortUrls()
	const idx = urls.findIndex(u => u.code === url.code)
	if (idx >= 0) urls[idx] = url
	else urls.unshift(url)
	saveShortUrls(urls)
}

export function findByCode(code: string): ShortUrl | undefined {
	return listShortUrls().find(u => u.code === code)
}

export function generateCode(): string {
	return nanoid(6)
}

// Clicks
export function listClicks(): ClickEvent[] {
	return readJson<ClickEvent[]>(KEYS.clicks, [])
}

export function addClick(evt: Omit<ClickEvent, 'id' | 'timestamp'> & Partial<Pick<ClickEvent, 'timestamp'>>): ClickEvent {
	const event: ClickEvent = {
		id: nanoid(),
		timestamp: evt.timestamp ?? new Date().toISOString(),
		geo: evt.geo,
		source: evt.source,
		code: evt.code
	}
	const clicks = listClicks()
	clicks.unshift(event)
	writeJson(KEYS.clicks, clicks)
	return event
} 