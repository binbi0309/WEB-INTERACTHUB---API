import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
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

const EMPTY_LIST = []

function MobileHomePage() {
  const pageNumber = 1
  const pageSize = 20
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const logoutMutation = useLogoutMutation()
  const feedQuery = useFeedQuery({ pageNumber, pageSize })
  const myProfileQuery = useMyProfileQuery()
  const createPostMutation = useCreatePostMutation(pageNumber, pageSize)
  const toggleLikeMutation = useToggleLikeMutation(pageNumber, pageSize)
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
  const authorProfileQueries = useAuthorProfilesQuery(posts.map((post) => post.userId))
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
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return
    setNotification((prev) => ({ ...prev, open: false }))
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
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Đăng xuất thất bại. Vui lòng thử lại.'),
      })
    }
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

  const handleOpenEditDialog = () => {
    if (!selectedPost) return
    setEditForm({
      content: selectedPost.content ?? '',
      imageUrl: selectedPost.imageUrl ?? '',
    })
    setIsEditDialogOpen(true)
    handleClosePostMenu()
  }

  const handleSubmitEditPost = async () => {
    if (!selectedPost) return
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
    if (!selectedPost) return
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
    if (!selectedPost) return
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
        id="avatar-menu-mobile"
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

      <Menu
        id="post-menu-mobile"
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

      <Box sx={{ px: 2, py: 2 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar src={myProfile?.avatarUrl ?? ''}>{myProfile?.fullName?.[0] ?? myProfile?.firstName?.[0] ?? 'U'}</Avatar>
              <InputBase
                placeholder="Bạn đang nghĩ gì?"
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                sx={{
                  px: 1.75,
                  py: 0.75,
                  borderRadius: 999,
                  backgroundColor: '#F3F4F6',
                  width: '100%',
                  fontSize: 14,
                }}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-around" sx={{ mt: 1.5 }}>
              <Button size="small" startIcon={<InsertPhotoRoundedIcon sx={{ color: '#22C55E' }} />} color="inherit">
                Ảnh/Video
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {feedQuery.isLoading && <Alert severity="info" sx={{ mt: 2 }}>Đang tải bản tin...</Alert>}
        {feedQuery.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getApiErrorMessage(feedQuery.error, 'Không thể tải bản tin.')}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mt: 2 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ borderRadius: 3, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={(event) => handleOpenPostMenu(event, post)}
                sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
              >
                <MoreHorizRoundedIcon />
              </IconButton>
              <CardContent>
                <Stack direction="row" alignItems="center">
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ pr: 4 }}>
                    <Avatar src={avatarByUserId[post.userId] ?? ''}>{post.authorName?.[0] ?? 'U'}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{post.authorName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPostDate(post.createdOn)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Typography sx={{ mt: 1.25, color: 'text.secondary' }}>{post.content}</Typography>
              </CardContent>

              {post.imageUrl ? (
                <CardMedia component="img" image={post.imageUrl} alt={post.authorName} sx={{ maxHeight: 260 }} />
              ) : null}

              <CardContent sx={{ pt: 1.25 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Button
                    size="small"
                    startIcon={
                      <FavoriteBorderRoundedIcon color={post.isLikedByCurrentUser ? 'error' : 'inherit'} />
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
              </CardContent>
            </Card>
          ))}
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
          zIndex: 2000,
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

export default MobileHomePage
