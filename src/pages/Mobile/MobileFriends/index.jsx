import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
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
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from '../../../features/friends/hooks/useFriendMutations'
import {
  useFriendsActiveUsersQuery,
  useFriendsMyProfileQuery,
  useFriendProfilesQuery,
  useMyFriendsQuery,
  usePendingReceivedRequestsQuery,
  usePendingSentRequestsQuery,
} from '../../../features/friends/hooks/useFriendQueries'

const EMPTY_LIST = []

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

function FriendRequestCard({ request, onAccept, onReject, disabled }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={request.avatarUrl || undefined}>{request.name?.[0] ?? '?'}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>{request.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {request.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.time}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="contained" fullWidth disabled={disabled} onClick={() => onAccept(request.id)}>
              Chấp nhận
            </Button>
            <Button size="small" variant="outlined" color="inherit" fullWidth disabled={disabled} onClick={() => onReject(request.id)}>
              Từ chối
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MobileFriendsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const [activeTab, setActiveTab] = useState('friends')
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null)
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  })
  const isAvatarMenuOpen = Boolean(avatarMenuAnchor)

  const logoutMutation = useLogoutMutation()
  const friendsQuery = useMyFriendsQuery()
  const pendingReceivedQuery = usePendingReceivedRequestsQuery()
  const pendingSentQuery = usePendingSentRequestsQuery()
  const activeUsersQuery = useFriendsActiveUsersQuery()
  const myProfileQuery = useFriendsMyProfileQuery()

  const sendRequestMutation = useSendFriendRequestMutation()
  const acceptRequestMutation = useAcceptFriendRequestMutation()
  const rejectRequestMutation = useRejectFriendRequestMutation()
  const removeFriendMutation = useRemoveFriendMutation()

  const myProfile = myProfileQuery.data?.data
  const friends = friendsQuery.data?.data ?? EMPTY_LIST
  const pendingReceived = pendingReceivedQuery.data?.data ?? EMPTY_LIST
  const pendingSent = pendingSentQuery.data?.data ?? EMPTY_LIST
  const activeUsers = activeUsersQuery.data?.data ?? EMPTY_LIST

  const pendingSentUserIdSet = useMemo(
    () => new Set(pendingSent.map((request) => request.addresseeId)),
    [pendingSent],
  )
  const pendingReceivedUserIdSet = useMemo(
    () => new Set(pendingReceived.map((request) => request.requesterId)),
    [pendingReceived],
  )
  const friendUserIdSet = useMemo(() => new Set(friends.map((friend) => friend.userId)), [friends])

  const suggestions = useMemo(
    () =>
      activeUsers
        .filter((user) => user.id !== myProfile?.userId)
        .filter((user) => !friendUserIdSet.has(user.id))
        .filter((user) => !pendingReceivedUserIdSet.has(user.id))
        .map((user) => ({
          id: user.id,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.emailId,
          email: user.emailId,
          requested: pendingSentUserIdSet.has(user.id),
        })),
    [activeUsers, friendUserIdSet, myProfile?.userId, pendingReceivedUserIdSet, pendingSentUserIdSet],
  )

  const profileUserIds = useMemo(
    () => [
      ...friends.map((friend) => friend.userId),
      ...pendingReceived.map((request) => request.requesterId),
      ...suggestions.map((user) => user.id),
    ],
    [friends, pendingReceived, suggestions],
  )
  const profileQueries = useFriendProfilesQuery(profileUserIds)
  const profileMap = useMemo(() => {
    return profileQueries.reduce((acc, query) => {
      const userId = query.data?.data?.userId
      if (userId) {
        acc.set(userId, query.data?.data)
      }
      return acc
    }, new Map())
  }, [profileQueries])

  const isLoading =
    friendsQuery.isLoading ||
    pendingReceivedQuery.isLoading ||
    pendingSentQuery.isLoading ||
    activeUsersQuery.isLoading ||
    myProfileQuery.isLoading
  const isMutating =
    sendRequestMutation.isPending ||
    acceptRequestMutation.isPending ||
    rejectRequestMutation.isPending ||
    removeFriendMutation.isPending
  const hasLoadError =
    friendsQuery.isError ||
    pendingReceivedQuery.isError ||
    pendingSentQuery.isError ||
    activeUsersQuery.isError ||
    myProfileQuery.isError
  const loadError =
    friendsQuery.error ||
    pendingReceivedQuery.error ||
    pendingSentQuery.error ||
    activeUsersQuery.error ||
    myProfileQuery.error

  const showNotification = (severity, message) => {
    setNotification({
      open: true,
      severity,
      message,
    })
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequestMutation.mutateAsync(requestId)
      setActiveTab('friends')
      showNotification('success', 'Chấp nhận lời mời kết bạn thành công.')
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể chấp nhận lời mời kết bạn.'))
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectRequestMutation.mutateAsync(requestId)
      showNotification('success', 'Đã từ chối lời mời kết bạn.')
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể từ chối lời mời kết bạn.'))
    }
  }

  const handleSendFriendRequest = async (targetUserId) => {
    try {
      await sendRequestMutation.mutateAsync(targetUserId)
      showNotification('success', 'Gửi lời mời kết bạn thành công.')
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể gửi lời mời kết bạn.'))
    }
  }

  const handleRemoveFriend = async (targetUserId) => {
    try {
      await removeFriendMutation.mutateAsync(targetUserId)
      showNotification('success', 'Hủy kết bạn thành công.')
    } catch (error) {
      showNotification('error', getApiErrorMessage(error, 'Không thể hủy kết bạn.'))
    }
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
        id="avatar-menu-mobile-friends"
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

      <Box
        sx={{
          px: 2,
          py: 0.5,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Chip
            label={`Bạn bè (${friends.length})`}
            clickable
            color={activeTab === 'friends' ? 'primary' : 'default'}
            variant={activeTab === 'friends' ? 'filled' : 'outlined'}
            onClick={() => setActiveTab('friends')}
          />
          <Chip
            label={`Lời mời (${pendingReceived.length})`}
            clickable
            color={activeTab === 'requests' ? 'primary' : 'default'}
            variant={activeTab === 'requests' ? 'filled' : 'outlined'}
            onClick={() => setActiveTab('requests')}
          />
          <Chip
            label={`Gợi ý (${suggestions.filter((item) => !item.requested).length})`}
            clickable
            color={activeTab === 'suggestions' ? 'primary' : 'default'}
            variant={activeTab === 'suggestions' ? 'filled' : 'outlined'}
            onClick={() => setActiveTab('suggestions')}
          />
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tổng quan kết nối
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Tổng số bạn bè</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{friends.length}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography color="text.secondary">Lời mời kết bạn</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{pendingReceived.length}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Đang tải dữ liệu bạn bè...</Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : hasLoadError ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Alert severity="error">{getApiErrorMessage(loadError, 'Không tải được dữ liệu bạn bè.')}</Alert>
              </CardContent>
            </Card>
          ) : activeTab === 'requests' ? (
            pendingReceived.length > 0 ? (
              pendingReceived.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={{
                    id: request.id,
                    name: request.requesterName,
                    email: request.requesterEmail,
                    time: getRelativeTimeLabel(request.createdOn),
                    avatarUrl: profileMap.get(request.requesterId)?.avatarUrl,
                  }}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  disabled={isMutating}
                />
              ))
            ) : (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography color="text.secondary">Hiện chưa có lời mời kết bạn.</Typography>
                </CardContent>
              </Card>
            )
          ) : activeTab === 'suggestions' ? (
            suggestions.length > 0 ? (
              suggestions.map((person) => (
                <Card key={person.id} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar src={profileMap.get(person.id)?.avatarUrl || undefined}>
                          {person.name?.[0] ?? '?'}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>{person.name}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {person.email}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        size="small"
                        variant={person.requested ? 'outlined' : 'contained'}
                        color={person.requested ? 'inherit' : 'primary'}
                        disabled={person.requested || isMutating}
                        onClick={() => handleSendFriendRequest(person.id)}
                      >
                        {person.requested ? 'Đã gửi' : 'Thêm bạn'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography color="text.secondary">Hiện chưa có gợi ý kết bạn nào.</Typography>
                </CardContent>
              </Card>
            )
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <Card key={friend.userId} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Avatar src={profileMap.get(friend.userId)?.avatarUrl || undefined}>
                        {friend.fullName?.[0] ?? '?'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }}>{friend.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {friend.email}
                        </Typography>
                        <Chip
                          label={`Kết nối ${getRelativeTimeLabel(friend.since)}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 0.75 }}
                        />
                      </Box>
                    </Stack>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={isMutating}
                      onClick={() => handleRemoveFriend(friend.userId)}
                    >
                      Hủy kết bạn
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Bạn chưa có bạn bè.</Typography>
              </CardContent>
            </Card>
          )}
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
          <NotificationsNoneRoundedIcon fontSize="small" color={active === '/notifications' ? 'primary' : 'disabled'} />
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
    </Box>
  )
}

export default MobileFriendsPage
