import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '../../../features/notifications/hooks/useNotificationMutations'
import {
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from '../../../features/notifications/hooks/useNotificationQueries'

const EMPTY_LIST = []
const NOTIFICATION_QUERY_PARAMS = {
  pageNumber: 1,
  pageSize: 100,
}

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

function NotificationsPage() {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState('all')
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  const notificationsQuery = useNotificationsQuery(NOTIFICATION_QUERY_PARAMS)
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const markAsReadMutation = useMarkNotificationAsReadMutation()
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation()

  const notifications = notificationsQuery.data?.data ?? EMPTY_LIST
  const unreadCount = unreadCountQuery.data?.count ?? 0
  const totalCount = notificationsQuery.data?.totalCount ?? notifications.length

  const isLoading = notificationsQuery.isLoading || unreadCountQuery.isLoading
  const hasLoadError = notificationsQuery.isError || unreadCountQuery.isError
  const loadError = notificationsQuery.error || unreadCountQuery.error
  const isMutating = markAsReadMutation.isPending || markAllAsReadMutation.isPending

  const overview = useMemo(() => {
    const likes = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'like').length
    const comments = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'comment').length
    const requests = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'request').length
    const follows = notifications.filter((item) => normalizeNotificationType(item.typeText) === 'follow').length

    return { likes, comments, requests, follows, unread: unreadCount }
  }, [notifications, unreadCount])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeType === 'unread') {
        return !item.isRead
      }

      return true
    })
  }, [activeType, notifications])

  const showNotification = (severity, message) => {
    setNotification({
      open: true,
      severity,
      message,
    })
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
    if (!item.url) {
      return
    }

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

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Thông báo
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        Nhận tương tác mới, theo dõi trạng thái và phản hồi nhanh trên mạng lưới của bạn.
      </Typography>

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' }, gap: 2.5 }}>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <CampaignRoundedIcon color="primary" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tổng quan hôm nay
                </Typography>
              </Stack>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
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
                <Divider />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Chưa đọc</Typography>
                  <Chip label={overview.unread} color="primary" size="small" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, backgroundColor: '#1F2937', color: '#FFFFFF' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Theo dõi tương tác mới
              </Typography>
              <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.78)' }}>
                Bạn có {overview.unread} thông báo chưa đọc. Ưu tiên xử lý lời mời kết nối và các tương tác mới để không bỏ lỡ cập nhật quan trọng.
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Typography color="text.secondary">
              Hiển thị {filteredNotifications.length} / {totalCount} thông báo gần nhất.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleMarkAllAsRead}
              disabled={isMutating || unreadCount === 0 || notifications.length === 0}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          </Stack>

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
                <Typography color="error.main">
                  {getApiErrorMessage(loadError, 'Không tải được danh sách thông báo.')}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((item) => {
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
                  <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
                      <Avatar>{actorName?.[0] ?? 'H'}</Avatar>
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
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75, textAlign: 'left' }}>
                          {getRelativeTimeLabel(item.createdOn)}
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
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
                      </Box>
                    </Stack>

                    <Box sx={{ width: 172, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                      {!item.isRead ? (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={isMutating}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleMarkAsRead(item.id)
                          }}
                          sx={{ width: '100%', minHeight: 40 }}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      ) : (
                        <Box sx={{ width: '100%', minHeight: 40 }} />
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )
          })
          )}

          {!isLoading && !hasLoadError && filteredNotifications.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  Không có thông báo phù hợp với bộ lọc hiện tại.
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Box>

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

export default NotificationsPage
