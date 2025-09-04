import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material'
import { Link, Outlet } from 'react-router-dom'
import { LoggerProvider } from '../logging/LoggerProvider'

export default function App() {
	return (
		<LoggerProvider>
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" sx={{ flexGrow: 1 }}>
							AffordMed URL Shortener
						</Typography>
						<Button color="inherit" component={Link} to="/">
							Shorten
						</Button>
						<Button color="inherit" component={Link} to="/stats">
							Statistics
						</Button>
					</Toolbar>
				</AppBar>
				<Container sx={{ py: 3, flexGrow: 1 }}>
					<Outlet />
				</Container>
			</Box>
		</LoggerProvider>
	)
} 