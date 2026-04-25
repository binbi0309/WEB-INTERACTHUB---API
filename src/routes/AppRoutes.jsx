import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminModerationPage from '../pages/PC/AdminModeration'
import MainLayout from '../components/layout/MainLayout'
import AdminHomePage from '../pages/PC/AdminHome'
import { useAuthSession } from '../features/auth/hooks/useAuthSession'
import {
  ResponsiveFriends,
  ResponsiveHome,
  ResponsiveLogin,
  ResponsiveNotifications,
  ResponsiveNotFound,
  ResponsiveProfile,
  ResponsiveRegister,
} from './responsivePages'

function ProtectedRoute({ children }) {
  const { data: session, isLoading } = useAuthSession()

  if (isLoading) {
    return null
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

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
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ResponsiveHome />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <ResponsiveFriends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <ResponsiveNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ResponsiveProfile />
          </ProtectedRoute>
        }
      />
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
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
