import AppBar from '@mui/material/AppBar'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../features/auth/authErrors'

function MainLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const logoutMutation = useLogoutMutation()
  const [notification, setNotification] = useState({
    open: false,
    severity: 'error',
    message: '',
  })

  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setNotification((prev) => ({
      ...prev,
      open: false,
    }))
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate('/login', { replace: true })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Đăng xuất thất bại. Vui lòng thử lại.'),
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            component="button"
            onClick={() => navigate('/home')}
            sx={{
              flexGrow: 1,
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 700,
              textAlign: 'left',
              p: 0,
            }}
          >
            InteractHub
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              size="small"
              aria-label="Trang chủ"
              onClick={() => navigate('/home')}
              color={active === '/home' ? 'inherit' : 'default'}
            >
              <HomeRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Bạn bè"
              onClick={() => navigate('/friends')}
              color={active === '/friends' ? 'inherit' : 'default'}
            >
              <PeopleRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Thông báo"
              onClick={() => navigate('/notifications')}
              color={active === '/notifications' ? 'inherit' : 'default'}
            >
              <Badge color="primary" variant="dot">
                <NotificationsNoneRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>
            <IconButton size="small" aria-label="Hồ sơ" onClick={() => navigate('/profile')}>
              <Avatar sx={{ width: 30, height: 30 }}>T</Avatar>
            </IconButton>
            <IconButton
              size="small"
              aria-label="Đăng xuất"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>{children}</Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MainLayout
