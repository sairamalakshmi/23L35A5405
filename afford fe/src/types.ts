export type ShortUrl = {
	id: string
	code: string
	longUrl: string
	createdAt: string
	expiresAt: string
	custom?: boolean
}

export type ClickEvent = {
	id: string
	code: string
	timestamp: string
	source: 'redirect' | 'stats' | 'copy' | 'manual'
	geo?: string
}

export type AppLogLevel = 'debug' | 'info' | 'warn' | 'error'

export type AppLog = {
	id: string
	timestamp: string
	level: AppLogLevel
	message: string
	context?: Record<string, unknown>
}

export type CreateShortenInput = {
	longUrl: string
	validityMinutes?: number
	preferredCode?: string
} 