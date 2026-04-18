import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation, useNavigate } from 'react-router-dom'

const notificationTypes = [
  { id: 'all', label: 'Tất cả' },
  { id: 'like', label: 'Lượt thích', icon: <FavoriteRoundedIcon fontSize="small" /> },
  { id: 'comment', label: 'Bình luận', icon: <CommentRoundedIcon fontSize="small" /> },
  { id: 'request', label: 'Yêu cầu', icon: <PersonAddRoundedIcon fontSize="small" /> },
]

const notificationSeed = [
  {
    id: 1,
    actor: 'Jenny Song',
    message: 'đã thích bài viết của bạn.',
    detail: '"Hành trình khám phá UI/UX chuyên nghiệp."',
    type: 'like',
    read: false,
    time: '2 phút trước',
  },
  {
    id: 2,
    actor: 'Minh Tú',
    message: 'đã bình luận:',
    detail: '"Thiết kế này thực sự tối giản và sang trọng!"',
    type: 'comment',
    read: false,
    time: '15 phút trước',
  },
  {
    id: 3,
    actor: 'Cộng đồng Design VN',
    message: 'mời bạn tham gia nhóm "UI/UX Editorial".',
    type: 'request',
    action: { primary: 'Chấp nhận', secondary: 'Từ chối' },
    read: true,
    time: '1 giờ trước',
  },
  {
    id: 4,
    actor: 'Le Anh',
    message: 'đã nhắc đến bạn trong một bình luận:',
    detail: '"@nguoidung hãy xem thử tài liệu này nhé."',
    type: 'comment',
    read: true,
    time: '3 giờ trước',
  },
  {
    id: 5,
    actor: 'Khánh Hoàng',
    message: 'muốn kết nối với bạn trên InteractHub.',
    type: 'request',
    read: true,
    time: '5 giờ trước',
  },
]

function getTypeConfig(type) {
  switch (type) {
    case 'request':
      return { color: '#0A8F5A', label: 'Yêu cầu' }
    case 'comment':
      return { color: '#5750E3', label: 'Bình luận' }
    case 'like':
      return { color: '#D64184', label: 'Lượt thích' }
    default:
      return { color: '#5F6D7E', label: 'Chung' }
  }
}

function MobileNotificationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

  const [activeType, setActiveType] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [notifications, setNotifications] = useState(notificationSeed)

  const overview = useMemo(() => {
    const likes = notifications.filter((item) => item.type === 'like').length
    const comments = notifications.filter((item) => item.type === 'comment').length
    const requests = notifications.filter((item) => item.type === 'request').length
    const unread = notifications.filter((item) => !item.read).length
    return { likes, comments, requests, unread }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const typeMatched = activeType === 'all' || item.type === activeType
      const readMatched =
        readFilter === 'all' || (readFilter === 'unread' && !item.read) || (readFilter === 'read' && item.read)

      return typeMatched && readMatched
    })
  }, [activeType, notifications, readFilter])

  const toggleReadStatus = (notificationId) => {
    setNotifications((prev) => prev.map((item) => (item.id === notificationId ? { ...item, read: !item.read } : item)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const hasUnread = overview.unread > 0

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F4F6', pb: 10 }}>
      <Box
        sx={{
          px: 2,
          py: 1.2,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>I</Avatar>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>InteractHub</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" aria-label="Tìm kiếm">
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Tuỳ chọn">
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>
            Thông báo
          </Typography>
          <Button
            size="small"
            color="primary"
            disabled={!hasUnread}
            onClick={markAllAsRead}
            sx={{ fontWeight: 900, borderRadius: 999 }}
          >
            Đánh dấu đã đọc
          </Button>
        </Stack>

        <Paper elevation={0} sx={{ mt: 1.5, borderRadius: 4, p: 1.75, border: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <NotificationsRoundedIcon fontSize="small" color="primary" />
              <Typography sx={{ fontWeight: 900 }}>Tổng quan hoạt động hôm nay</Typography>
              {hasUnread ? <Chip label={`${overview.unread} chưa đọc`} size="small" color="primary" /> : null}
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Lượt thích</Typography>
              <Typography fontWeight={900}>{overview.likes}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Bình luận</Typography>
              <Typography fontWeight={900}>{overview.comments}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Yêu cầu</Typography>
              <Typography fontWeight={900}>{overview.requests}</Typography>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
          {notificationTypes.map((item) => (
            <Chip
              key={item.id}
              icon={item.icon}
              label={item.label}
              clickable
              color={activeType === item.id ? 'primary' : 'default'}
              variant={activeType === item.id ? 'filled' : 'outlined'}
              onClick={() => setActiveType(item.id)}
              sx={{ fontWeight: 800 }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
          <Chip
            label="Tất cả"
            clickable
            color={readFilter === 'all' ? 'primary' : 'default'}
            variant={readFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setReadFilter('all')}
            sx={{ fontWeight: 800 }}
          />
          <Chip
            label="Chưa đọc"
            clickable
            color={readFilter === 'unread' ? 'primary' : 'default'}
            variant={readFilter === 'unread' ? 'filled' : 'outlined'}
            onClick={() => setReadFilter('unread')}
            sx={{ fontWeight: 800 }}
          />
          <Chip
            label="Đã đọc"
            clickable
            color={readFilter === 'read' ? 'primary' : 'default'}
            variant={readFilter === 'read' ? 'filled' : 'outlined'}
            onClick={() => setReadFilter('read')}
            sx={{ fontWeight: 800 }}
          />
        </Stack>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {filteredNotifications.map((item) => {
            const typeConfig = getTypeConfig(item.type)
            const isUnread = !item.read

            return (
              <Card
                key={item.id}
                sx={{
                  borderRadius: 4,
                  borderLeft: '4px solid',
                  borderLeftColor: isUnread ? 'primary.main' : 'transparent',
                  opacity: item.read ? 0.9 : 1,
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Badge
                      color="primary"
                      variant="dot"
                      overlap="circular"
                      invisible={!isUnread}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <Avatar sx={{ width: 44, height: 44 }}>{item.actor?.[0]}</Avatar>
                    </Badge>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Typography sx={{ pr: 1 }}>
                          <Box component="span" sx={{ fontWeight: 900 }}>
                            {item.actor}
                          </Box>{' '}
                          {item.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {item.time}
                        </Typography>
                      </Stack>

                      {item.detail ? (
                        <Typography color="text.secondary" sx={{ mt: 0.75, fontStyle: 'italic' }}>
                          {item.detail}
                        </Typography>
                      ) : null}

                      <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
                        <Chip
                          label={typeConfig.label}
                          size="small"
                          sx={{ backgroundColor: `${typeConfig.color}1A`, color: typeConfig.color, fontWeight: 800 }}
                        />
                        <Chip
                          label={item.read ? 'Đã đọc' : 'Chưa đọc'}
                          size="small"
                          color={item.read ? 'default' : 'primary'}
                          variant={item.read ? 'outlined' : 'filled'}
                          sx={{ fontWeight: 800 }}
                        />
                      </Stack>

                      {item.action ? (
                        <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                          <Button size="small" variant="contained" sx={{ borderRadius: 3, fontWeight: 900 }}>
                            {item.action.primary}
                          </Button>
                          <Button size="small" variant="outlined" color="inherit" sx={{ borderRadius: 3, fontWeight: 900 }}>
                            {item.action.secondary}
                          </Button>
                        </Stack>
                      ) : (
                        <Button
                          size="small"
                          variant={item.read ? 'outlined' : 'contained'}
                          onClick={() => toggleReadStatus(item.id)}
                          sx={{ mt: 1.25, borderRadius: 3, fontWeight: 900 }}
                        >
                          {item.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )
          })}

          {filteredNotifications.length === 0 ? (
            <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography color="text.secondary">Không có thông báo phù hợp với bộ lọc hiện tại.</Typography>
            </Paper>
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
          onClick={() => navigate('/mobile/home')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <HomeRoundedIcon fontSize="small" color={active === '/mobile/home' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/mobile/home' ? 'primary' : 'text.secondary'}>
            Trang chủ
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/mobile/friends')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <PeopleRoundedIcon fontSize="small" color={active === '/mobile/friends' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/mobile/friends' ? 'primary' : 'text.secondary'}>
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
          onClick={() => navigate('/mobile/notifications')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Badge color="primary" variant={hasUnread ? 'dot' : 'standard'} overlap="circular">
            <NotificationsNoneRoundedIcon fontSize="small" color={active === '/mobile/notifications' ? 'primary' : 'disabled'} />
          </Badge>
          <Typography variant="caption" color={active === '/mobile/notifications' ? 'primary' : 'text.secondary'}>
            Thông báo
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          spacing={0.4}
          onClick={() => navigate('/mobile/profile')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <PersonRoundedIcon fontSize="small" color={active === '/mobile/profile' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/mobile/profile' ? 'primary' : 'text.secondary'}>
            Hồ sơ
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

export default MobileNotificationsPage
