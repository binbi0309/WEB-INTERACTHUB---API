import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const friendRequestsSeed = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    role: 'Nhà thiết kế sản phẩm',
    mutualFriends: 18,
    time: '2 giờ trước',
  },
  {
    id: 2,
    name: 'Julian Chen',
    role: 'Kỹ sư Front-end',
    mutualFriends: 9,
    time: '1 ngày trước',
  },
  {
    id: 3,
    name: 'Sarah King',
    role: 'Quản lý vận hành',
    mutualFriends: 6,
    time: '3 ngày trước',
  },
]

const recentFriendsSeed = [
  { id: 1, name: 'Marcus Sterling', role: 'Kiến trúc sư sản phẩm số', connectedAt: 'Vừa kết bạn' },
  { id: 2, name: 'Amara Kojo', role: 'Quản lý sản phẩm', connectedAt: '2 ngày trước' },
  { id: 3, name: 'Soren West', role: 'Giám đốc sáng tạo', connectedAt: '4 ngày trước' },
  { id: 4, name: 'Liam Vance', role: 'Kiến trúc sư', connectedAt: '1 tuần trước' },
]

function FriendRequestCard({ request, onAccept, onReject }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar>{request.name[0]}</Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{request.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {request.role}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.mutualFriends} bạn chung • {request.time}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="contained" onClick={() => onAccept(request.id)}>
              Chấp nhận
            </Button>
            <Button size="small" variant="outlined" color="inherit" onClick={() => onReject(request.id)}>
              Từ chối
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends')
  const [friendRequests, setFriendRequests] = useState(friendRequestsSeed)
  const [recentFriends, setRecentFriends] = useState(recentFriendsSeed)

  const acceptedRequestsCount = useMemo(() => {
    return recentFriends.length - recentFriendsSeed.length + (friendRequestsSeed.length - friendRequests.length)
  }, [friendRequests.length, recentFriends.length])

  const handleAcceptRequest = (requestId) => {
    const accepted = friendRequests.find((item) => item.id === requestId)
    if (!accepted) return

    setRecentFriends((prev) => [{ id: Date.now(), name: accepted.name, role: accepted.role, connectedAt: 'Vừa kết bạn' }, ...prev])
    setFriendRequests((prev) => prev.filter((item) => item.id !== requestId))
    setActiveTab('friends')
  }

  const handleRejectRequest = (requestId) => {
    setFriendRequests((prev) => prev.filter((item) => item.id !== requestId))
  }

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Bạn bè
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        Quản lý lời mời và theo dõi danh sách bạn bè gần đây để không bỏ lỡ kết nối mới.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
        <Chip
          label={`Bạn bè (${recentFriends.length})`}
          clickable
          color={activeTab === 'friends' ? 'primary' : 'default'}
          variant={activeTab === 'friends' ? 'filled' : 'outlined'}
          onClick={() => setActiveTab('friends')}
        />
        <Chip
          label={`Lời mời (${friendRequests.length})`}
          clickable
          color={activeTab === 'requests' ? 'primary' : 'default'}
          variant={activeTab === 'requests' ? 'filled' : 'outlined'}
          onClick={() => setActiveTab('requests')}
        />
      </Stack>

      <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)' }, gap: 2.5 }}>
        <Card sx={{ borderRadius: 3, height: 'fit-content' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tổng quan kết nối
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Tổng số bạn bè</Typography>
                <Typography sx={{ fontWeight: 700 }}>{recentFriends.length}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Lời mời chờ duyệt</Typography>
                <Typography sx={{ fontWeight: 700 }}>{friendRequests.length}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Kết nối mới hôm nay</Typography>
                <Typography sx={{ fontWeight: 700 }}>{acceptedRequestsCount}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {activeTab === 'requests' ? (
            friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))
            ) : (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography color="text.secondary">Hiện không còn lời mời kết bạn nào.</Typography>
                </CardContent>
              </Card>
            )
          ) : (
            recentFriends.map((friend) => (
              <Card key={friend.id} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar>{friend.name[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{friend.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {friend.role}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip label={friend.connectedAt} size="small" color="primary" variant="outlined" />
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default FriendsPage
