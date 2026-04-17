import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminModerationPage from '../pages/PC/AdminModeration'
import MainLayout from '../components/layout/MainLayout'
import DashboardPage from '../pages/PC/Dashboard'
import FriendsPage from '../pages/PC/Friends'
import HomePage from '../pages/PC/Home'
import LoginPage from '../pages/PC/Login'
import MobileLoginPage from '../pages/Mobile/MobileLogin'
import NotFoundPage from '../pages/PC/NotFound'
import NotificationsPage from '../pages/PC/Notifications'
import RegisterPage from '../pages/PC/Register'

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
      <Route path="/mobile/login" element={<MobileLoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
