import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import DashboardPage from '../pages/Dashboard'
import HomePage from '../pages/Home'
import LoginPage from '../pages/Login'
import NotFoundPage from '../pages/NotFound'
import RegisterPage from '../pages/Register'

function AppLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
