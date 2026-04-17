import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded'

const notificationTypes = [
  { id: 'all', label: 'Tất cả' },
  { id: 'like', label: 'Lượt thích', icon: <FavoriteRoundedIcon fontSize="small" /> },
  { id: 'comment', label: 'Bình luận', icon: <CommentRoundedIcon fontSize="small" /> },
  { id: 'request', label: 'Yêu cầu', icon: <PersonAddRoundedIcon fontSize="small" /> },
  { id: 'mention', label: 'Nhắc đến', icon: <AlternateEmailRoundedIcon fontSize="small" /> },
]

const notificationSeed = [
  {
    id: 1,
    actor: 'Elena Rodriguez',
    message: 'đã nhắc đến bạn trong một bài viết.',
    detail: '"Absolutely agree with @interact_user. The focus on white space is essential."',
    type: 'mention',
    read: false,
    time: 'vừa xong',
  },
  {
    id: 2,
    actor: 'Marcus Sterling',
    message: 'đã gửi cho bạn một yêu cầu kết nối.',
    type: 'request',
    read: false,
    time: '15 phút trước',
  },
  {
    id: 3,
    actor: 'Julian Chen',
    message: 'đã bình luận về ảnh của bạn.',
    detail: '"Màu sắc và bố cục rất chặt. Bạn có sử dụng bộ lọc nào không?"',
    type: 'comment',
    read: true,
    time: '2 giờ trước',
  },
  {
    id: 4,
    actor: 'Sarah King',
    message: 'và 13 người khác đã thích cập nhật của bạn.',
    type: 'like',
    read: true,
    time: '5 giờ trước',
  },
]

function getTypeConfig(type) {
  switch (type) {
    case 'mention':
      return { color: '#0D63CE', label: 'Nhắc đến' }
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

function NotificationsPage() {
  const [activeType, setActiveType] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [notifications, setNotifications] = useState(notificationSeed)

  const overview = useMemo(() => {
    const likes = notifications.filter((item) => item.type === 'like').length
    const comments = notifications.filter((item) => item.type === 'comment').length
    const requests = notifications.filter((item) => item.type === 'request').length
    const mentions = notifications.filter((item) => item.type === 'mention').length
    const unread = notifications.filter((item) => !item.read).length

    return { likes, comments, requests, mentions, unread }
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
    setNotifications((prev) =>
      prev.map((item) => (item.id === notificationId ? { ...item, read: !item.read } : item)),
    )
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
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Lượt thích mới</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.likes}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Bình luận</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.comments}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Yêu cầu</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.requests}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Nhắc đến</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{overview.mentions}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
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
                Bạn có {overview.unread} thông báo chưa đọc. Ưu tiên xử lý mục nhắc đến và yêu cầu để tăng tương tác.
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {notificationTypes.map((item) => (
              <Chip
                key={item.id}
                icon={item.icon}
                label={item.label}
                clickable
                color={activeType === item.id ? 'primary' : 'default'}
                variant={activeType === item.id ? 'filled' : 'outlined'}
                onClick={() => setActiveType(item.id)}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip
              label="Tất cả trạng thái"
              clickable
              color={readFilter === 'all' ? 'primary' : 'default'}
              variant={readFilter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setReadFilter('all')}
            />
            <Chip
              label="Chưa đọc"
              clickable
              color={readFilter === 'unread' ? 'primary' : 'default'}
              variant={readFilter === 'unread' ? 'filled' : 'outlined'}
              onClick={() => setReadFilter('unread')}
            />
            <Chip
              label="Đã đọc"
              clickable
              color={readFilter === 'read' ? 'primary' : 'default'}
              variant={readFilter === 'read' ? 'filled' : 'outlined'}
              onClick={() => setReadFilter('read')}
            />
          </Stack>

          {filteredNotifications.map((item) => {
            const typeConfig = getTypeConfig(item.type)

            return (
              <Card
                key={item.id}
                sx={{
                  borderRadius: 3,
                  borderLeft: '4px solid',
                  borderLeftColor: item.read ? 'transparent' : 'primary.main',
                  opacity: item.read ? 0.88 : 1,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Avatar>{item.actor[0]}</Avatar>
                      <Box>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {item.actor}
                          </Box>{' '}
                          {item.message}
                        </Typography>
                        {item.detail ? (
                          <Typography color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {item.detail}
                          </Typography>
                        ) : null}
                        <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                          <Chip
                            label={typeConfig.label}
                            size="small"
                            sx={{ backgroundColor: `${typeConfig.color}1A`, color: typeConfig.color }}
                          />
                          <Chip
                            label={item.read ? 'Đã đọc' : 'Chưa đọc'}
                            size="small"
                            color={item.read ? 'default' : 'primary'}
                            variant={item.read ? 'outlined' : 'filled'}
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack alignItems="flex-end" spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        {item.time}
                      </Typography>
                      <Button size="small" variant={item.read ? 'outlined' : 'contained'} onClick={() => toggleReadStatus(item.id)}>
                        {item.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )
          })}

          {filteredNotifications.length === 0 ? (
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
    </Box>
  )
}

export default NotificationsPage
