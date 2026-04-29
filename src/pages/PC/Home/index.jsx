import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
  useActiveUsersQuery,
  useAuthorProfilesQuery,
  useFeedQuery,
  useMyProfileQuery,
} from '../../../features/home/hooks/useHomeQueries'
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useReportPostMutation,
  useToggleLikeMutation,
  useUpdatePostMutation,
} from '../../../features/home/hooks/useHomeMutations'
import { useSendFriendRequestMutation } from '../../../features/friends/hooks/useFriendMutations'
import {
  useMyFriendsQuery,
  usePendingReceivedRequestsQuery,
  usePendingSentRequestsQuery,
} from '../../../features/friends/hooks/useFriendQueries'

const EMPTY_LIST = []

const desktopMenus = [
  { id: 'home', label: 'Trang chủ', icon: <HomeRoundedIcon fontSize="small" />, path: '/home' },
  { id: 'friends', label: 'Bạn bè', icon: <PeopleRoundedIcon fontSize="small" />, path: '/friends' },
  { id: 'notifications', label: 'Thông báo', icon: <NotificationsNoneRoundedIcon fontSize="small" />, path: '/notifications' },
]

function HomePage() {
  const pageNumber = 1
  const pageSize = 20
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const logoutMutation = useLogoutMutation()
  const feedQuery = useFeedQuery({ pageNumber, pageSize })
  const myProfileQuery = useMyProfileQuery()
  const activeUsersQuery = useActiveUsersQuery()
  const myFriendsQuery = useMyFriendsQuery()
  const pendingReceivedQuery = usePendingReceivedRequestsQuery()
  const pendingSentQuery = usePendingSentRequestsQuery()
  const createPostMutation = useCreatePostMutation(pageNumber, pageSize)
  const toggleLikeMutation = useToggleLikeMutation(pageNumber, pageSize)
  const sendFriendRequestMutation = useSendFriendRequestMutation()
  const updatePostMutation = useUpdatePostMutation(pageNumber, pageSize)
  const deletePostMutation = useDeletePostMutation(pageNumber, pageSize)
  const reportPostMutation = useReportPostMutation(pageNumber, pageSize)
  const [notification, setNotification] = useState({
    open: false,
    severity: 'error',
    message: '',
  })
  const [postContent, setPostContent] = useState('')
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null)
  const [postMenuAnchor, setPostMenuAnchor] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    content: '',
    imageUrl: '',
  })
  const [reportForm, setReportForm] = useState({
    reason: '',
    description: '',
  })
  const isAvatarMenuOpen = Boolean(avatarMenuAnchor)
  const isPostMenuOpen = Boolean(postMenuAnchor)
  const posts = feedQuery.data?.data ?? EMPTY_LIST
  const myProfile = myProfileQuery.data?.data
  const activeUsers = activeUsersQuery.data?.data ?? EMPTY_LIST
  const myFriends = myFriendsQuery.data?.data ?? EMPTY_LIST
  const pendingReceivedRequests = pendingReceivedQuery.data?.data ?? EMPTY_LIST
  const pendingSentRequests = pendingSentQuery.data?.data ?? EMPTY_LIST
  const friendUserIdSet = useMemo(() => new Set(myFriends.map((friend) => friend.userId)), [myFriends])
  const pendingReceivedUserIdSet = useMemo(
    () => new Set(pendingReceivedRequests.map((request) => request.requesterId)),
    [pendingReceivedRequests],
  )
  const pendingSentUserIdSet = useMemo(
    () => new Set(pendingSentRequests.map((request) => request.addresseeId)),
    [pendingSentRequests],
  )
  const suggestions = useMemo(() => {
    return activeUsers
      .filter((user) => user.id !== myProfile?.userId)
      .filter((user) => !friendUserIdSet.has(user.id))
      .filter((user) => !pendingReceivedUserIdSet.has(user.id))
      .slice(0, 8)
      .map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.emailId,
        requested: pendingSentUserIdSet.has(user.id),
      }))
  }, [activeUsers, friendUserIdSet, myProfile?.userId, pendingReceivedUserIdSet, pendingSentUserIdSet])
  const authorProfileQueries = useAuthorProfilesQuery([
    ...posts.map((post) => post.userId),
    ...suggestions.map((item) => item.id),
  ])
  const trendingHashtags = useMemo(() => {
    const hashtagCounter = new Map()

    posts.forEach((post) => {
      const tags = post.content?.match(/#[\p{L}\p{N}_]+/gu) ?? []
      tags.forEach((tag) => {
        hashtagCounter.set(tag, (hashtagCounter.get(tag) ?? 0) + 1)
      })
    })

    return Array.from(hashtagCounter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))
  }, [posts])
  const avatarByUserId = useMemo(() => {
    return authorProfileQueries.reduce((accumulator, queryResult) => {
      const userId = queryResult.data?.data?.userId
      const avatarUrl = queryResult.data?.data?.avatarUrl

      if (userId && avatarUrl) {
        accumulator[userId] = avatarUrl
      }

      return accumulator
    }, {})
  }, [authorProfileQueries])

  const formatPostDate = (value) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
    setAvatarMenuAnchor(null)

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

  const handleOpenAvatarMenu = (event) => {
    setAvatarMenuAnchor(event.currentTarget)
  }

  const handleCloseAvatarMenu = () => {
    setAvatarMenuAnchor(null)
  }

  const handleGoToProfile = () => {
    setAvatarMenuAnchor(null)
    navigate('/profile')
  }

  const handleOpenPostMenu = (event, post) => {
    setPostMenuAnchor(event.currentTarget)
    setSelectedPost(post)
  }

  const handleClosePostMenu = () => {
    setPostMenuAnchor(null)
  }

  const handleCreatePost = async () => {
    const content = postContent.trim()
    if (!content) {
      setNotification({
        open: true,
        severity: 'warning',
        message: 'Nội dung bài viết không được để trống.',
      })
      return
    }

    try {
      await createPostMutation.mutateAsync({ content, imageUrl: null })
      setPostContent('')
      setNotification({
        open: true,
        severity: 'success',
        message: 'Đăng bài thành công.',
      })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Đăng bài thất bại. Vui lòng thử lại.'),
      })
    }
  }

  const handleToggleLike = async (postId) => {
    try {
      await toggleLikeMutation.mutateAsync(postId)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Khong the thich bai viet nay.'),
      })
    }
  }

  const handleSendFriendRequest = async (targetUserId) => {
    try {
      await sendFriendRequestMutation.mutateAsync(targetUserId)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Khong the gui loi moi ket ban luc nay.'),
      })
    }
  }

  const handleOpenEditDialog = () => {
    if (!selectedPost) {
      return
    }

    setEditForm({
      content: selectedPost.content ?? '',
      imageUrl: selectedPost.imageUrl ?? '',
    })
    setIsEditDialogOpen(true)
    handleClosePostMenu()
  }

  const handleSubmitEditPost = async () => {
    if (!selectedPost) {
      return
    }

    try {
      await updatePostMutation.mutateAsync({
        postId: selectedPost.id,
        payload: {
          content: editForm.content.trim(),
          imageUrl: editForm.imageUrl.trim() || null,
        },
      })
      setIsEditDialogOpen(false)
      setNotification({
        open: true,
        severity: 'success',
        message: 'Cập nhật bài viết thành công.',
      })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Không thể cập nhật bài viết.'),
      })
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost) {
      return
    }

    try {
      await deletePostMutation.mutateAsync(selectedPost.id)
      setNotification({
        open: true,
        severity: 'success',
        message: 'Xóa bài viết thành công.',
      })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Không thể xóa bài viết.'),
      })
    } finally {
      handleClosePostMenu()
    }
  }

  const handleOpenReportDialog = () => {
    setReportForm({ reason: '', description: '' })
    setIsReportDialogOpen(true)
    handleClosePostMenu()
  }

  const handleSubmitReportPost = async () => {
    if (!selectedPost) {
      return
    }

    try {
      await reportPostMutation.mutateAsync({
        postId: selectedPost.id,
        reason: reportForm.reason.trim(),
        description: reportForm.description.trim() || null,
      })
      setIsReportDialogOpen(false)
      setNotification({
        open: true,
        severity: 'success',
        message: 'Đã gửi báo cáo bài viết.',
      })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Không thể báo cáo bài viết lúc này.'),
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F4F6F8' }}>
      <Box
        sx={{
          height: 72,
          px: { xs: 2, md: 4 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography
          variant="h6"
          component="button"
          onClick={() => navigate('/home')}
          sx={{
            fontWeight: 700,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          InteractHub
        </Typography>

        <Paper
          elevation={0}
          sx={{
            width: { xs: '52%', sm: 360, md: 420 },
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SearchRoundedIcon color="action" fontSize="small" />
          <InputBase placeholder="Tìm kiếm..." sx={{ width: '100%' }} />
        </Paper>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" aria-label="Thông báo" onClick={() => navigate('/notifications')}>
            <Badge color="primary" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="small"
            aria-label="Mở menu tài khoản"
            onClick={handleOpenAvatarMenu}
            aria-controls={isAvatarMenuOpen ? 'avatar-menu' : undefined}
            aria-haspopup="menu"
            aria-expanded={isAvatarMenuOpen ? 'true' : undefined}
          >
            <Avatar sx={{ width: 34, height: 34 }} src={myProfile?.avatarUrl ?? ''}>
              {myProfile?.fullName?.[0] ?? myProfile?.firstName?.[0] ?? 'U'}
            </Avatar>
          </IconButton>
        </Stack>
      </Box>

      <Menu
        id="avatar-menu"
        anchorEl={avatarMenuAnchor}
        open={isAvatarMenuOpen}
        onClose={handleCloseAvatarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem onClick={handleGoToProfile}>
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

      <Menu
        id="post-menu"
        anchorEl={postMenuAnchor}
        open={isPostMenuOpen}
        onClose={handleClosePostMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {selectedPost?.userId === myProfile?.userId && (
          <MenuItem onClick={handleOpenEditDialog}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Chỉnh sửa bài viết
          </MenuItem>
        )}
        {selectedPost?.userId === myProfile?.userId && (
          <MenuItem onClick={handleDeletePost} disabled={deletePostMutation.isPending}>
            <ListItemIcon>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            Xóa bài viết
          </MenuItem>
        )}
        <MenuItem onClick={handleOpenReportDialog}>
          <ListItemIcon>
            <ReportGmailerrorredRoundedIcon fontSize="small" />
          </ListItemIcon>
          Báo cáo bài viết
        </MenuItem>
      </Menu>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr) 300px' }, gap: 3 }}>
          <Card sx={{ display: { xs: 'none', md: 'block' }, height: 'fit-content', borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={0.5}>
                {desktopMenus.map((item) => (
                  <Button
                    key={item.id}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      color: active === item.path ? 'primary.main' : 'text.secondary',
                      fontWeight: active === item.path ? 700 : 500,
                      borderRadius: 2,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={2.5}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5}>
                  <Avatar sx={{ width: 42, height: 42 }} src={myProfile?.avatarUrl ?? ''}>
                    {myProfile?.fullName?.[0] ?? myProfile?.firstName?.[0] ?? 'U'}
                  </Avatar>
                  <InputBase
                    placeholder="Bạn đang nghĩ gì?"
                    value={postContent}
                    onChange={(event) => setPostContent(event.target.value)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: '#F5F6F8',
                      width: '100%',
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2, px: 2.5 }}
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                  >
                    {createPostMutation.isPending ? 'Đang đăng...' : 'Đăng'}
                  </Button>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={1.5}>
                  <Button startIcon={<InsertPhotoRoundedIcon />} size="small">
                    Ảnh/Video
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {feedQuery.isLoading && <Alert severity="info">Đang tải bản tin...</Alert>}
            {feedQuery.isError && (
              <Alert severity="error">
                {getApiErrorMessage(feedQuery.error, 'Không thể tải bản tin.')}
              </Alert>
            )}

            {posts.map((post) => (
              <Card key={post.id} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={avatarByUserId[post.userId] ?? ''}>
                        {post.authorName?.[0] ?? 'U'}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{post.authorName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPostDate(post.createdOn)}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={(event) => handleOpenPostMenu(event, post)}
                      sx={{ ml: 'auto', alignSelf: 'flex-start' }}
                    >
                      <MoreHorizRoundedIcon />
                    </IconButton>
                  </Stack>

                  <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>{post.content}</Typography>
                </CardContent>
                {post.imageUrl && (
                  <CardMedia component="img" image={post.imageUrl} alt={post.authorName} sx={{ maxHeight: 430 }} />
                )}
                <CardContent sx={{ pt: 1.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2}>
                      <Button
                        size="small"
                        startIcon={
                          <FavoriteBorderRoundedIcon
                            color={post.isLikedByCurrentUser ? 'error' : 'inherit'}
                          />
                        }
                        onClick={() => handleToggleLike(post.id)}
                        disabled={toggleLikeMutation.isPending}
                      >
                        {post.likeCount ?? 0}
                      </Button>
                      <Button size="small" startIcon={<ChatBubbleOutlineRoundedIcon />}>
                        {post.commentCount ?? 0}
                      </Button>
                      <Button size="small" startIcon={<ShareRoundedIcon />}>
                        {post.shareCount ?? 0}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Stack spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography fontWeight={700}>Xu hướng hiện nay</Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {trendingHashtags.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có hastag trong bảng tin.
                    </Typography>
                  )}
                  {trendingHashtags.map((item) => (
                    <Box key={item.tag}>
                      <Typography fontWeight={600}>{item.tag}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} bài viết
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  Gợi ý kết bạn
                </Typography>
                <Stack spacing={1.25}>
                  {activeUsersQuery.isLoading && (
                    <Typography variant="body2" color="text.secondary">
                      Đang tải gợi ý...
                    </Typography>
                  )}
                  {suggestions.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    sx={{ p: 1, borderRadius: 2, backgroundColor: '#F7F8FA', minHeight: 48 }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar src={avatarByUserId[item.id] ?? ''}>{item.name[0]}</Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography fontWeight={600} noWrap>
                            {item.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 'auto', flexShrink: 0 }}>
                        <Button
                          size="small"
                          variant={item.requested ? 'outlined' : 'contained'}
                          color={item.requested ? 'inherit' : 'primary'}
                          disabled={item.requested || sendFriendRequestMutation.isPending}
                          onClick={() => handleSendFriendRequest(item.id)}
                          sx={{
                            borderRadius: 2,
                            px: 1.5,
                            minWidth: 120,
                            width: 120,
                            justifyContent: 'center',
                          }}
                        >
                          {item.requested ? 'Đã gửi' : 'Thêm bạn'}
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>

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

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ mt: 0.5 }}>
            <TextField
              label="Nội dung"
              multiline
              minRows={3}
              value={editForm.content}
              onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
            />
            <TextField
              label="Ảnh URL (không bắt buộc)"
              value={editForm.imageUrl}
              onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmitEditPost} disabled={updatePostMutation.isPending}>
            {updatePostMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isReportDialogOpen} onClose={() => setIsReportDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Báo cáo bài viết</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ mt: 0.5 }}>
            <TextField
              label="Lý do"
              value={reportForm.reason}
              onChange={(event) => setReportForm((prev) => ({ ...prev, reason: event.target.value }))}
            />
            <TextField
              label="Mô tả thêm (không bắt buộc)"
              multiline
              minRows={3}
              value={reportForm.description}
              onChange={(event) => setReportForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReportDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmitReportPost} disabled={reportPostMutation.isPending}>
            {reportPostMutation.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HomePage
