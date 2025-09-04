import { RouteObject } from 'react-router-dom'
import ShortenerPage from '../pages/ShortenerPage'
import StatsPage from '../pages/StatsPage'
import RedirectPage from '../pages/RedirectPage'

export const routes: RouteObject[] = [
	{ index: true, element: <ShortenerPage /> },
	{ path: 'stats', element: <StatsPage /> },
	{ path: 'r/:code', element: <RedirectPage /> }
] 