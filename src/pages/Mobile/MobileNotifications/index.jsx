import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLogoutMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '../../../features/notifications/hooks/useNotificationMutations'
import {
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from '../../../features/notifications/hooks/useNotificationQueries'
import { useMyProfileQuery } from '../../../features/home/hooks/useHomeQueries'

const EMPTY_LIST = []
const NOTIFICATION_QUERY_PARAMS = { pageNumber: 1, pageSize: 100 }

const notificationTypes = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
]

function getRelativeTimeLabel(value) {
  if (!value) return 'Vừa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Vừa cập nhật'
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Vừa xong'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

function normalizeNotificationType(typeText) {
  switch (String(typeText || '').toLowerCase()) {
    case 'friendrequest':
    case 'acceptfriend':
      return 'request'
    case 'follow':
      return 'follow'
    case 'like':
      return 'like'
    case 'comment':
      return 'comment'
    default:
      return 'system'
  }
}

function getTypeConfig(typeText) {
  switch (String(typeText || '').toLowerCase()) {
    case 'friendrequest':
      return { color: '#0A8F5A', label: 'Lời mời kết bạn' }
    case 'acceptfriend':
      return { color: '#1E88E5', label: 'Đã chấp nhận kết bạn' }
    case 'follow':
      return { color: '#00897B', label: 'Theo dõi' }
    case 'comment':
      return { color: '#5750E3', label: 'Bình luận' }
    case 'like':
      return { color: '#D64184', label: 'Lượt thích' }
    default:
      return { color: '#5F6D7E', label: 'Hệ thống' }
  }
}

function MobileNotificationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const [activeType, setActiveType] = useState('all')
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null)
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  })
  const isAvatarMenuOpen = Boolean(avatarMenuAnchor)

  const logoutMutation = useLogoutMutation()
  const myProfileQuery = useMyProfileQuery()
  const notificationsQuery = useNotificationsQuery(NOTIFICATION_QUERY_PARAMS)
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const markAsReadMutation = useMarkNotificationAsReadMutation()
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation()

  const myProfile = myProfileQuery.data?.data
  const notifications = notificationsQuery.data?.data ?? EMPTY_LIST
  const unreadCount = unreadCountQuery.data?.count ?? 0
  const totalCount = notificationsQuery.data?.totalCount ?? notifications.length

  const isLoading = notificationsQuery.isLoading || unreadCountQuery.isLoading
  const hasLoadError = notificationsQuery.isError || unreadCountQuery.isError
  const loadError = notificationsQuery.error || unreadCountQuery.error
  const isMutating =
    markAsReadMutation.isPending || markAllAsReadMutation.isPending || logoutMutation.isPending

  const overview = useMemo(() => {
    const likes = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'like').length
    const comments = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'comment').length
    const requests = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'request').length
    const follows = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'follow').length
    return { likes, comments, requests, follows, unread: unreadCount }
  }, [notifications, unreadCount])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeType === 'unread') return !item.isRead
      return true
    })
  }, [activeType, notifications])

  const showNotification = (severity, message) => {
    setNotification({ open: true, severity, message })
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId)
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể đánh dấu đã đọc thông báo.'))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      showNotification('success', 'Đã đánh dấu tất cả thông báo là đã đọc.')
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể đánh dấu tất cả thông báo là đã đọc.'))
    }
  }

  const handleNavigateToNotification = async (item) => {
    if (!item.url) return
    if (!item.isRead) {
      try {
        await markAsReadMutation.mutateAsync(item.id)
      } catch (error) {
        showNotification('error', getApiErrorMessage(error, 'Không thể cập nhật trạng thái thông báo.'))
        return
      }
    }
    if (item.url.startsWith('/')) {
      navigate(item.url)
      return
    }
    window.location.assign(item.url)
  }

  const handleOpenAvatarMenu = (event) => {
    setAvatarMenuAnchor(event.currentTarget)
  }

  const handleCloseAvatarMenu = () => {
    setAvatarMenuAnchor(null)
  }

  const handleLogout = async () => {
    setAvatarMenuAnchor(null)
    try {
      await logoutMutation.mutateAsync()
      navigate('/login', { replace: true })
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Đăng xuất thất bại. Vui lòng thử lại.'))
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F4F6', pb: 10 }}>
      <Box
        sx={{
          pl: 2,
          pr: 0.75,
          py: 1.2,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.25} alignItems="center">
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>InteractHub</Typography>
            <IconButton size="small" aria-label="Tìm kiếm">
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Avatar
            sx={{ width: 28, height: 28, cursor: 'pointer', ml: 'auto' }}
            src={myProfile?.avatarUrl ?? ''}
            onClick={handleOpenAvatarMenu}
          >
            {myProfile?.fullName?.[0] ?? myProfile?.firstName?.[0] ?? 'U'}
          </Avatar>
        </Stack>
      </Box>

      <Menu
        id="avatar-menu-mobile-notifications"
        anchorEl={avatarMenuAnchor}
        open={isAvatarMenuOpen}
        onClose={handleCloseAvatarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleCloseAvatarMenu()
            navigate('/profile')
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Xem hồ sơ
        </MenuItem>
        <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </MenuItem>
      </Menu>

      <Box sx={{ px: 2, py: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>Thông báo</Typography>
          </Stack>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <CampaignRoundedIcon color="primary" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tổng quan hôm nay
                </Typography>
              </Stack>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Lượt thích mới</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.likes}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Bình luận</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.comments}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Yêu cầu</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.requests}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Lượt theo dõi</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.follows}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Chưa đọc</Typography>
                  <Chip label={overview.unread} color="primary" size="small" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Typography color="text.secondary">
            Hiển thị {filteredNotifications.length} / {totalCount} thông báo gần nhất.
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {notificationTypes.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  clickable
                  color={activeType === item.id ? 'primary' : 'default'}
                  variant={activeType === item.id ? 'filled' : 'outlined'}
                  onClick={() => setActiveType(item.id)}
                />
              ))}
            </Stack>
            <Chip
              label="Đánh dấu tất cả"
              clickable
              variant="outlined"
              disabled={isMutating || unreadCount === 0 || notifications.length === 0}
              onClick={handleMarkAllAsRead}
              sx={{ ml: 'auto' }}
            />
          </Stack>

          {isLoading ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Đang tải thông báo...</Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : hasLoadError ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Alert severity="error">{getApiErrorMessage(loadError, 'Không tải được danh sách thông báo.')}</Alert>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={1.25}>
              {filteredNotifications.map((item) => {
                const typeConfig = getTypeConfig(item.typeText)
                const actorName = item.senderName?.trim()
                const canOpenDetail = Boolean(item.url)

                return (
                  <Card
                    key={item.id}
                    onClick={canOpenDetail ? () => handleNavigateToNotification(item) : undefined}
                    sx={{
                      borderRadius: 3,
                      borderLeft: '4px solid',
                      borderLeftColor: item.isRead ? 'transparent' : 'primary.main',
                      opacity: item.isRead ? 0.88 : 1,
                      cursor: canOpenDetail ? 'pointer' : 'default',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Badge
                          color="primary"
                          variant="dot"
                          overlap="circular"
                          invisible={item.isRead}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <Avatar>{actorName?.[0] ?? 'H'}</Avatar>
                        </Badge>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ textAlign: 'left' }}>
                            {actorName ? (
                              <>
                                <Box component="span" sx={{ fontWeight: 700 }}>
                                  {actorName}
                                </Box>{' '}
                                {item.message}
                              </>
                            ) : (
                              item.message
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.75, textAlign: 'left' }}
                          >
                            {getRelativeTimeLabel(item.createdOn)}
                          </Typography>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                            <Chip
                              label={typeConfig.label}
                              size="small"
                              sx={{ backgroundColor: `${typeConfig.color}1A`, color: typeConfig.color }}
                            />
                            <Chip
                              label={item.isRead ? 'Đã đọc' : 'Chưa đọc'}
                              size="small"
                              color={item.isRead ? 'default' : 'primary'}
                              variant={item.isRead ? 'outlined' : 'filled'}
                            />
                          </Stack>
                          {!item.isRead ? (
                            <Button
                              size="small"
                              variant="contained"
                              disabled={isMutating}
                              onClick={(event) => {
                                event.stopPropagation()
                                handleMarkAsRead(item.id)
                              }}
                              sx={{ mt: 1.25 }}
                            >
                              Đánh dấu tất cả đã đọc
                            </Button>
                          ) : null}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          )}

          {!isLoading && !hasLoadError && filteredNotifications.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Không có thông báo phù hợp với bộ lọc hiện tại.</Typography>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Box>

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 5,
          px: 1,
          py: 0.8,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/home')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <HomeRoundedIcon fontSize="small" color={active === '/home' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/home' ? 'primary' : 'text.secondary'}>
            Trang chủ
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/friends')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <PeopleRoundedIcon fontSize="small" color={active === '/friends' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/friends' ? 'primary' : 'text.secondary'}>
            Bạn bè
          </Typography>
        </Stack>
        <IconButton
          sx={{
            width: 44,
            height: 44,
            backgroundColor: 'primary.main',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
          aria-label="Tạo mới"
        >
          <AddRoundedIcon />
        </IconButton>
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/notifications')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Badge color="primary" variant={unreadCount > 0 ? 'dot' : 'standard'} overlap="circular">
            <NotificationsNoneRoundedIcon fontSize="small" color={active === '/notifications' ? 'primary' : 'disabled'} />
          </Badge>
          <Typography variant="caption" color={active === '/notifications' ? 'primary' : 'text.secondary'}>
            Thông báo
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/profile')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <PersonRoundedIcon fontSize="small" color={active === '/profile' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/profile' ? 'primary' : 'text.secondary'}>
            Hồ sơ
          </Typography>
        </Stack>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MobileNotificationsPage
