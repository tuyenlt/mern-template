import { Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/auth-layout/AuthLayout'
import { authRoutes } from './routes/authRoutes'
import RootLayout from './layouts/root-layout/RootLayout'
import { publicRoutes } from './routes/publicRoute'
import AuthProvider from './providers/authProvider'

function App() {
	return (
		// <BrowserRouter>
		<AuthProvider>
			<Routes>
				<Route element={<AuthLayout />}>
					{authRoutes.map(route => (
						<Route path={route.path} element={route.element} />
					))}
				</Route>
				<Route element={<RootLayout />}>
					{publicRoutes.map(route => (
						<Route path={route.path} element={route.element} />
					))}
				</Route>
			</Routes>
		</AuthProvider>
		// </BrowserRouter>
	)
}

export default App
