import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminModerationPage from '../pages/PC/AdminModeration'
import MainLayout from '../components/layout/MainLayout'
import AdminHomePage from '../pages/PC/AdminHome'
import {
  ResponsiveFriends,
  ResponsiveHome,
  ResponsiveLogin,
  ResponsiveNotifications,
  ResponsiveNotFound,
  ResponsiveProfile,
  ResponsiveRegister,
} from './responsivePages'

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
      <Route path="/home" element={<ResponsiveHome />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/friends" element={<ResponsiveFriends />} />
      <Route path="/notifications" element={<ResponsiveNotifications />} />
      <Route path="/profile" element={<ResponsiveProfile />} />
      <Route path="/login" element={<ResponsiveLogin />} />
      <Route path="/register" element={<ResponsiveRegister />} />
      <Route path="/404" element={<ResponsiveNotFound />} />

      <Route path="/mobile/home" element={<Navigate to="/home" replace />} />
      <Route path="/mobile/friends" element={<Navigate to="/friends" replace />} />
      <Route path="/mobile/notifications" element={<Navigate to="/notifications" replace />} />
      <Route path="/mobile/profile" element={<Navigate to="/profile" replace />} />
      <Route path="/mobile/login" element={<Navigate to="/login" replace />} />
      <Route path="/mobile/register" element={<Navigate to="/register" replace />} />

      {/* Chỉ admin: luôn MainLayout + giao diện PC (không tách mobile). */}
      <Route element={<AppLayout />}>
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
