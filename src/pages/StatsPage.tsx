import {
	Box,
	Card,
	CardContent,
	Divider,
	FormHelperText,
	List,
	ListItem,
	ListItemText,
	Typography
} from '@mui/material'
import { listClicks, listShortUrls } from '../storage/urlRepo'

export default function StatsPage() {
	const urls = listShortUrls()
	const clicks = listClicks()
	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Short URLs
			</Typography>
			<Card sx={{ mb: 3 }}>
				<CardContent>
					{urls.length === 0 && <FormHelperText>No URLs created yet.</FormHelperText>}
					{urls.map(u => (
						<Box key={u.id} sx={{ mb: 2 }}>
							<Typography variant="subtitle2">{location.origin}/r/{u.code}</Typography>
							<FormHelperText>
								Created: {new Date(u.createdAt).toLocaleString()} | Expires: {new Date(u.expiresAt).toLocaleString()}
							</FormHelperText>
							<Divider sx={{ my: 1 }} />
						</Box>
					))}
				</CardContent>
			</Card>

			<Typography variant="h6" gutterBottom>
				Click events ({clicks.length})
			</Typography>
			<Card>
				<CardContent>
					{clicks.length === 0 && <FormHelperText>No clicks yet.</FormHelperText>}
					<List>
						{clicks.map(c => (
							<ListItem key={c.id} disableGutters>
								<ListItemText
									primary={`${new Date(c.timestamp).toLocaleString()} — /r/${c.code}`}
									secondary={`source: ${c.source}${c.geo ? `, geo: ${c.geo}` : ''}`}
								/>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Box>
	)
} 