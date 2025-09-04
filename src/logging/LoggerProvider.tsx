import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AppLog, AppLogLevel } from '../types'
import { getKeys, readJson, writeJson } from '../storage/localStore'
import { nanoid } from 'nanoid'

export type Logger = {
	log: (level: AppLogLevel, message: string, context?: Record<string, unknown>) => void
	debug: (message: string, context?: Record<string, unknown>) => void
	info: (message: string, context?: Record<string, unknown>) => void
	warn: (message: string, context?: Record<string, unknown>) => void
	error: (message: string, context?: Record<string, unknown>) => void
	useMiddleware: (fn: (log: AppLog) => AppLog | void) => void
	entries: AppLog[]
	clear: () => void
}

const LoggerContext = createContext<Logger | null>(null)

const KEYS = getKeys()

export function LoggerProvider({ children }: { children: React.ReactNode }) {
	const [entries, setEntries] = useState<AppLog[]>(() => readJson<AppLog[]>(KEYS.logs, []))
	const middlewares = useRef<Array<(l: AppLog) => AppLog | void>>([])

	const emit = useCallback((level: AppLogLevel, message: string, context?: Record<string, unknown>) => {
		let log: AppLog = {
			id: nanoid(),
			timestamp: new Date().toISOString(),
			level,
			message,
			context
		}
		for (const mw of middlewares.current) {
			const result = mw(log)
			if (result) log = result
		}
		setEntries(prev => {
			const next = [log, ...prev]
			writeJson(KEYS.logs, next)
			return next
		})
	}, [])

	const api = useMemo<Logger>(() => ({
		log: emit,
		debug: (m, c) => emit('debug', m, c),
		info: (m, c) => emit('info', m, c),
		warn: (m, c) => emit('warn', m, c),
		error: (m, c) => emit('error', m, c),
		useMiddleware: fn => middlewares.current.push(fn),
		entries,
		clear: () => {
			writeJson(KEYS.logs, [])
			setEntries([])
		}
	}), [emit, entries])

	return <LoggerContext.Provider value={api}>{children}</LoggerContext.Provider>
}

export function useLogger(): Logger {
	const ctx = useContext(LoggerContext)
	if (!ctx) throw new Error('useLogger must be used within LoggerProvider')
	return ctx
} 