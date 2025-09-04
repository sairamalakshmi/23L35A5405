import { useEffect } from 'react'
import { useLogger } from './LoggerProvider'

export function useLoggingEffect(message: string, context?: Record<string, unknown>) {
	const logger = useLogger()
	useEffect(() => {
		logger.info(message, context)
		// no cleanup log by default
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
} 