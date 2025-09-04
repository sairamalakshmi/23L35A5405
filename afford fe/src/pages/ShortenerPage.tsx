import { Add, Clear, ContentCopy } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	Snackbar,
	TextField,
	Tooltip,
	Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { codeSchema, minutesSchema, urlSchema } from '../utils/validation'
import { CreateShortenInput, ShortUrl } from '../types'
import { addMinutesIso } from '../utils/time'
import { findByCode, generateCode, listShortUrls, upsertShortUrl } from '../storage/urlRepo'
import { useLogger } from '../logging/LoggerProvider'

const MAX_ROWS = 5

export default function ShortenerPage() {
	const logger = useLogger()
	const [rows, setRows] = useState<Array<{ longUrl: string; minutes: string; code: string }>>([
		{ longUrl: '', minutes: '30', code: '' }
	])
	const [snack, setSnack] = useState<string | null>(null)

	const canAdd = rows.length < MAX_ROWS

	const handleAddRow = () => setRows(prev => [...prev, { longUrl: '', minutes: '30', code: '' }])
	const handleRemoveRow = (idx: number) => setRows(prev => prev.filter((_, i) => i !== idx))

	const errors = useMemo(() => {
		return rows.map(r => {
			const err: Partial<Record<'url' | 'minutes' | 'code', string>> = {}
			const urlRes = urlSchema.safeParse(r.longUrl)
			if (!urlRes.success) err.url = urlRes.error.issues[0]?.message || 'Invalid URL'
			const minRes = minutesSchema.safeParse(r.minutes)
			if (!minRes.success) err.minutes = minRes.error.issues[0]?.message || 'Invalid minutes'
			const codeRes = codeSchema.safeParse(r.code)
			if (!codeRes.success) err.code = codeRes.error.issues[0]?.message || 'Invalid code'
			if (codeRes.success && codeRes.data) {
				const existing = findByCode(codeRes.data)
				if (existing) err.code = 'Code already exists'
			}
			return err
		})
	}, [rows])

	const hasErrors = errors.some(e => Object.keys(e).length > 0)

	function createShortUrl(input: CreateShortenInput): ShortUrl {
		const now = new Date().toISOString()
		const code = input.preferredCode?.trim() || generateCode()
		const url: ShortUrl = {
			id: code,
			code,
			longUrl: input.longUrl,
			createdAt: now,
			expiresAt: addMinutesIso(now, input.validityMinutes ?? 30),
			custom: Boolean(input.preferredCode)
		}
		upsertShortUrl(url)
		return url
	}

	const handleCreate = () => {
		const created: ShortUrl[] = []
		rows.forEach(r => {
			const urlOk = urlSchema.safeParse(r.longUrl).success
			const minVal = minutesSchema.safeParse(r.minutes)
			const codeVal = codeSchema.safeParse(r.code)
			if (!urlOk || !minVal.success || !codeVal.success) return
			const preferred = codeVal.data
			const url = createShortUrl({ longUrl: r.longUrl, validityMinutes: minVal.data, preferredCode: preferred })
			created.push(url)
		})
		if (created.length) {
			logger.info('Created short URLs', { count: created.length })
			setSnack(`Created ${created.length} short URL(s).`)
			setRows([{ longUrl: '', minutes: '30', code: '' }])
		} else {
			setSnack('No valid rows to create.')
		}
	}

	const urls = listShortUrls()

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={7}>
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Shorten up to 5 URLs
						</Typography>
						{rows.map((row, idx) => (
							<Box key={idx} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
								<TextField
									label="Long URL"
									fullWidth
									value={row.longUrl}
									onChange={e => setRows(prev => prev.map((r, i) => (i === idx ? { ...r, longUrl: e.target.value } : r)))}
									error={Boolean(errors[idx]?.url)}
									helperText={errors[idx]?.url}
								/>
								<TextField
									label="Validity (minutes)"
									value={row.minutes}
									onChange={e => setRows(prev => prev.map((r, i) => (i === idx ? { ...r, minutes: e.target.value } : r)))}
									sx={{ width: 180 }}
									error={Boolean(errors[idx]?.minutes)}
									helperText={errors[idx]?.minutes}
								/>
								<TextField
									label="Preferred shortcode (optional)"
									value={row.code}
									onChange={e => setRows(prev => prev.map((r, i) => (i === idx ? { ...r, code: e.target.value } : r)))}
									InputProps={{ endAdornment: (
										<InputAdornment position="end">
											<Tooltip title="Clear">
												<IconButton size="small" onClick={() => setRows(prev => prev.map((r, i) => (i === idx ? { ...r, code: '' } : r)))}>
													<Clear fontSize="small" />
												</IconButton>
											</Tooltip>
										</InputAdornment>
									) }}
									sx={{ width: 280 }}
									error={Boolean(errors[idx]?.code)}
									helperText={errors[idx]?.code}
								/>
								{rows.length > 1 && (
									<Button color="warning" onClick={() => handleRemoveRow(idx)}>Remove</Button>
								)}
							</Box>
						))}
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Button startIcon={<Add />} onClick={handleAddRow} disabled={!canAdd}>
								Add Row
							</Button>
							<Button variant="contained" onClick={handleCreate} disabled={hasErrors}>
								Create Short Links
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} md={5}>
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Recently created
						</Typography>
						{urls.length === 0 && <FormHelperText>No URLs yet.</FormHelperText>}
						{urls.map(u => (
							<Box key={u.id} sx={{ mb: 1 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Box>
										<Typography variant="body2" sx={{ fontWeight: 600 }}>
											{location.origin}/r/{u.code}
										</Typography>
										<FormHelperText>expires {new Date(u.expiresAt).toLocaleString()}</FormHelperText>
									</Box>
									<Tooltip title="Copy">
										<IconButton
											onClick={() => {
												navigator.clipboard.writeText(`${location.origin}/r/${u.code}`)
												setSnack('Copied!')
											}}
										>
											<ContentCopy fontSize="small" />
										</IconButton>
									</Tooltip>
								</Box>
								<Divider sx={{ my: 1 }} />
							</Box>
						))}
					</CardContent>
				</Card>
			</Grid>
			<Snackbar
				open={Boolean(snack)}
				autoHideDuration={2500}
				onClose={() => setSnack(null)}
				message={snack || ''}
			/>
		</Grid>
	)
} 