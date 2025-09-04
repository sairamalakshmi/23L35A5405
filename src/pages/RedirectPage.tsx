import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addClick, findByCode } from '../storage/urlRepo'
import { isExpired } from '../utils/time'
import { useLogger } from '../logging/LoggerProvider'

export default function RedirectPage() {
	const { code } = useParams()
	const logger = useLogger()
	const [status, setStatus] = useState<'loading' | 'notfound' | 'expired' | 'redirected'>('loading')
	const [target, setTarget] = useState<string>('')

	useEffect(() => {
		if (!code) return
		const url = findByCode(code)
		if (!url) {
			setStatus('notfound')
			logger.warn('Redirect: code not found', { code })
			return
		}
		if (isExpired(url.expiresAt)) {
			setStatus('expired')
			logger.info('Redirect: code expired', { code })
			return
		}
		addClick({ code, source: 'redirect' })
		setTarget(url.longUrl)
		setStatus('redirected')
		location.replace(url.longUrl)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code])

	if (status === 'loading') {
		return (
			<Box sx={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
				<CircularProgress />
				<Typography sx={{ mt: 2 }}>Redirecting…</Typography>
			</Box>
		)
	}

	if (status === 'notfound') {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity="error" sx={{ mb: 2 }}>
					Short link not found.
				</Alert>
				<Button href="/">Go to home</Button>
			</Box>
		)
	}

	if (status === 'expired') {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity="warning" sx={{ mb: 2 }}>
					This short link has expired.
				</Alert>
				<Button href="/">Create a new one</Button>
			</Box>
		)
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography>Redirecting to {target}…</Typography>
		</Box>
	)
} 