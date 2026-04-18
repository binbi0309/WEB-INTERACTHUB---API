import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation, useNavigate } from 'react-router-dom'

const friendRequestsSeed = [
  {
    id: 1,
    name: 'Lê Minh Anh',
    role: 'Nhà thiết kế sản phẩm',
    mutualFriends: 3,
    time: '2 giờ trước',
    cover: 'https://images.unsplash.com/photo-1520975958225-15d3b0b6ef3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Nguyễn Hoàng Nam',
    role: 'Kỹ sư Front-end',
    mutualFriends: 12,
    time: '1 ngày trước',
    cover: 'https://images.unsplash.com/photo-1520975958225-15d3b0b6ef3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Trần Thu Hà',
    role: 'Quản lý vận hành',
    mutualFriends: 8,
    time: '3 ngày trước',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
]

const friendsSeed = [
  {
    id: 1,
    name: 'Trần Thu Hà',
    status: 'Hoạt động 5 phút trước',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Phạm Gia Bảo',
    status: 'Đang trực tuyến',
    online: true,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Vũ Hoàng Yến',
    status: 'Hoạt động 2 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 4,
    name: 'Đặng Minh Tuấn',
    status: 'Đang trực tuyến',
    online: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
]

const suggestionsSeed = [
  { id: 11, name: 'Elena Rodriguez', role: 'Nhà thiết kế sản phẩm', mutualFriends: 18 },
  { id: 12, name: 'Julian Chen', role: 'Kỹ sư Front-end', mutualFriends: 9 },
  { id: 13, name: 'Sarah King', role: 'Quản lý vận hành', mutualFriends: 6 },
]

function TabButton({ active, children, onClick }) {
  return (
    <Button
      onClick={onClick}
      color="inherit"
      sx={{
        px: 0,
        borderRadius: 0,
        fontWeight: 800,
        color: active ? 'text.primary' : 'text.secondary',
        position: 'relative',
        '&::after': active
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -10,
              height: 3,
              borderRadius: 999,
              backgroundColor: 'primary.main',
            }
          : {},
      }}
    >
      {children}
    </Button>
  )
}

function FriendRequestCard({ request, onAccept, onReject }) {
  return (
    <Card sx={{ borderRadius: 4, minWidth: 240, maxWidth: 240, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" image={request.cover} alt={request.name} sx={{ height: 130 }} />
        <Chip
          label={`${request.mutualFriends} bạn chung`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.55)',
            fontWeight: 800,
          }}
        />
      </Box>
      <CardContent sx={{ pt: 1.5 }}>
        <Typography sx={{ fontWeight: 900 }}>{request.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {request.role}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {request.time}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button size="small" fullWidth variant="contained" onClick={() => onAccept(request.id)} sx={{ borderRadius: 3 }}>
            Chấp nhận
          </Button>
          <Button
            size="small"
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => onReject(request.id)}
            sx={{ borderRadius: 3 }}
          >
            Từ chối
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

function FriendRow({ friend }) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar src={friend.avatar} alt={friend.name} sx={{ width: 44, height: 44 }}>
                {friend.name?.[0]}
              </Avatar>
              {friend.online ? (
                <Box
                  sx={{
                    position: 'absolute',
                    right: -1,
                    bottom: -1,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    border: '2px solid #FFFFFF',
                  }}
                />
              ) : null}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900 }}>{friend.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {friend.status}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" aria-label="Nhắn tin">
            <ChatBubbleOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MobileFriendsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

  const [activeTopTab, setActiveTopTab] = useState('friends')
  const [friendRequests, setFriendRequests] = useState(friendRequestsSeed)
  const [friends, setFriends] = useState(friendsSeed)
  const [suggestions, setSuggestions] = useState(suggestionsSeed)

  const acceptedRequestsCount = useMemo(() => {
    return friends.length - friendsSeed.length + (friendRequestsSeed.length - friendRequests.length)
  }, [friendRequests.length, friends.length])

  const handleAcceptRequest = (requestId) => {
    const accepted = friendRequests.find((item) => item.id === requestId)
    if (!accepted) return

    setFriends((prev) => [
      {
        id: Date.now(),
        name: accepted.name,
        status: 'Vừa kết bạn',
        online: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      },
      ...prev,
    ])
    setFriendRequests((prev) => prev.filter((item) => item.id !== requestId))
    setActiveTopTab('friends')
  }

  const handleRejectRequest = (requestId) => {
    setFriendRequests((prev) => prev.filter((item) => item.id !== requestId))
  }

  const handleAddSuggestion = (suggestionId) => {
    setSuggestions((prev) => prev.filter((item) => item.id !== suggestionId))
  }

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
          <IconButton size="small" aria-label="Tìm kiếm">
            <SearchRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mt: 1.2 }}>
          <TabButton active={activeTopTab === 'friends'} onClick={() => setActiveTopTab('friends')}>
            Bạn bè
          </TabButton>
          <TabButton active={activeTopTab === 'suggestions'} onClick={() => setActiveTopTab('suggestions')}>
            Gợi ý
          </TabButton>
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        {activeTopTab === 'friends' ? (
          <Stack spacing={2}>
            <Paper elevation={0} sx={{ borderRadius: 4, p: 1.75, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1}>
                <Typography fontWeight={900}>Tổng quan</Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Tổng số bạn bè</Typography>
                  <Typography fontWeight={900}>{friends.length}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Lời mời chờ duyệt</Typography>
                  <Typography fontWeight={900}>{friendRequests.length}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Kết nối mới hôm nay</Typography>
                  <Typography fontWeight={900}>{acceptedRequestsCount}</Typography>
                </Stack>
              </Stack>
            </Paper>

            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Lời mời kết bạn
              </Typography>
              <Button size="small" color="primary" sx={{ fontWeight: 900 }}>
                Xem tất cả
              </Button>
            </Stack>

            {friendRequests.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 0.5 }}>
                {friendRequests.map((request) => (
                  <FriendRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </Box>
            ) : (
              <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography color="text.secondary">Hiện không còn lời mời kết bạn nào.</Typography>
              </Paper>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Danh sách bạn bè
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                  Lọc
                </Typography>
                <IconButton size="small" aria-label="Lọc">
                  <FilterListRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Stack spacing={1.25}>
              {friends.map((friend) => (
                <FriendRow key={friend.id} friend={friend} />
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.25}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Gợi ý kết bạn
            </Typography>
            <Typography color="text.secondary">
              Những người bạn có thể quen biết dựa trên bạn chung và hoạt động gần đây.
            </Typography>
            <Divider sx={{ my: 1 }} />

            {suggestions.length > 0 ? (
              suggestions.map((person) => (
                <Card key={person.id} sx={{ borderRadius: 4 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar>{person.name[0]}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 900 }}>{person.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {person.role}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {person.mutualFriends} bạn chung
                          </Typography>
                        </Box>
                      </Stack>
                      <Button variant="contained" size="small" onClick={() => handleAddSuggestion(person.id)} sx={{ borderRadius: 3 }}>
                        Thêm bạn
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography color="text.secondary">Hiện chưa có gợi ý phù hợp.</Typography>
              </Paper>
            )}
          </Stack>
        )}
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
          <NotificationsNoneRoundedIcon fontSize="small" color={active === '/mobile/notifications' ? 'primary' : 'disabled'} />
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

export default MobileFriendsPage
