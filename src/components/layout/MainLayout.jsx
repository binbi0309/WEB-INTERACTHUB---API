import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { useLocation, useNavigate } from 'react-router-dom'

function MainLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            component="button"
            onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
              color={active === '/' ? 'inherit' : 'default'}
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
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  )
}

export default MainLayout
