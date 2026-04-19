import Box from '@mui/material/Box'
import MainLayout from '../components/layout/MainLayout'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import ProfilePage from '../pages/PC/Profile'
import FriendsPage from '../pages/PC/Friends'
import HomePage from '../pages/PC/Home'
import NotFoundPage from '../pages/PC/NotFound'
import MobileFriendsPage from '../pages/Mobile/MobileFriends'
import MobileHomePage from '../pages/Mobile/MobileHome'
import MobileNotificationsPage from '../pages/Mobile/MobileNotifications'
import MobileProfilePage from '../pages/Mobile/MobileProfile'
import LoginPage from '../pages/PC/Login'
import MobileLoginPage from '../pages/Mobile/MobileLogin'
import MobileRegisterPage from '../pages/Mobile/MobileRegister'
import NotificationsPage from '../pages/PC/Notifications'
import RegisterPage from '../pages/PC/Register'

export function ResponsiveHome() {
  const isMobile = useIsMobileLayout()
  return isMobile ? <MobileHomePage /> : <HomePage />
}

export function ResponsiveFriends() {
  const isMobile = useIsMobileLayout()
  if (isMobile) return <MobileFriendsPage />
  return (
    <MainLayout>
      <FriendsPage />
    </MainLayout>
  )
}

export function ResponsiveNotifications() {
  const isMobile = useIsMobileLayout()
  if (isMobile) return <MobileNotificationsPage />
  return (
    <MainLayout>
      <NotificationsPage />
    </MainLayout>
  )
}

export function ResponsiveProfile() {
  const isMobile = useIsMobileLayout()
  if (isMobile) return <MobileProfilePage />
  return (
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  )
}

export function ResponsiveLogin() {
  const isMobile = useIsMobileLayout()
  if (isMobile) return <MobileLoginPage />
  return (
    <MainLayout>
      <LoginPage />
    </MainLayout>
  )
}

export function ResponsiveRegister() {
  const isMobile = useIsMobileLayout()
  if (isMobile) return <MobileRegisterPage />
  return (
    <MainLayout>
      <RegisterPage />
    </MainLayout>
  )
}

/** Trang lỗi 404: mobile không dùng thanh điều hướng desktop (MainLayout). */
export function ResponsiveNotFound() {
  const isMobile = useIsMobileLayout()
  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', px: 2, py: 3, bgcolor: 'background.default' }}>
        <NotFoundPage />
      </Box>
    )
  }
  return (
    <MainLayout>
      <NotFoundPage />
    </MainLayout>
  )
}
