import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './ui/App'

const theme = createTheme()

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: (await import('./ui')).routes as any
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
) 