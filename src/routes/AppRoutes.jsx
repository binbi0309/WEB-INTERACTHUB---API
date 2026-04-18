import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminModerationPage from '../pages/PC/AdminModeration'
import MainLayout from '../components/layout/MainLayout'
import AdminHomePage from '../pages/PC/AdminHome'
import ProfilePage from '../pages/PC/Profile'
import FriendsPage from '../pages/PC/Friends'
import HomePage from '../pages/PC/Home'
import MobileFriendsPage from '../pages/Mobile/MobileFriends'
import MobileHomePage from '../pages/Mobile/MobileHome'
import MobileNotificationsPage from '../pages/Mobile/MobileNotifications'
import MobileProfilePage from '../pages/Mobile/MobileProfile'
import LoginPage from '../pages/PC/Login'
import MobileLoginPage from '../pages/Mobile/MobileLogin'
import MobileRegisterPage from '../pages/Mobile/MobileRegister'
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
      <Route path="/mobile/home" element={<MobileHomePage />} />
      <Route path="/mobile/friends" element={<MobileFriendsPage />} />
      <Route path="/mobile/notifications" element={<MobileNotificationsPage />} />
      <Route path="/mobile/profile" element={<MobileProfilePage />} />
      <Route path="/mobile/login" element={<MobileLoginPage />} />
      <Route path="/mobile/register" element={<MobileRegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
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
