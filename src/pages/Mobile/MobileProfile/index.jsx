import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
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
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'
import {
  useChangePasswordMutation,
  useDeleteMyPostMutation,
  useReportPostMutation,
  useToggleMyPostLikeMutation,
  useUpdateMyPostMutation,
  useUpdateMyProfileMutation,
} from '../../../features/profile/hooks/useProfileMutations'
import { useMyPostsQuery, useMyProfileQuery } from '../../../features/profile/hooks/useProfileQueries'

const EMPTY_LIST = []
const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'

function MobileProfilePage() {
  const pageNumber = 1
  const pageSize = 20
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname
  const profileQuery = useMyProfileQuery()
  const myPostsQuery = useMyPostsQuery({ pageNumber, pageSize })
  const updateProfileMutation = useUpdateMyProfileMutation(pageNumber, pageSize)
  const changePasswordMutation = useChangePasswordMutation()
  const likeMutation = useToggleMyPostLikeMutation(pageNumber, pageSize)
  const updatePostMutation = useUpdateMyPostMutation(pageNumber, pageSize)
  const deletePostMutation = useDeleteMyPostMutation(pageNumber, pageSize)
  const reportPostMutation = useReportPostMutation(pageNumber, pageSize)
  const logoutMutation = useLogoutMutation()
  const profile = profileQuery.data?.data
  const posts = myPostsQuery.data?.data ?? EMPTY_LIST
  const stats = [
    { label: 'Bài viết', value: profile?.stats?.postCount ?? 0 },
    { label: 'Bạn bè', value: profile?.stats?.friendCount ?? 0 },
    { label: 'Người theo dõi', value: profile?.stats?.followerCount ?? 0 },
  ]

  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  })
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState(DEFAULT_COVER_IMAGE)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatarUrl: '',
    coverImageUrl: '',
    bio: '',
    gender: '',
    address: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  })
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

  const showError = (error, fallback) => {
    setNotification({
      open: true,
      severity: 'error',
      message: getApiErrorMessage(error, fallback),
    })
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
      showError(error, 'Đăng xuất thất bại. Vui lòng thử lại.')
    }
  }

  const handleSubmitProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim() || null,
        avatarUrl: profileForm.avatarUrl.trim() || null,
        coverImageUrl: profileForm.coverImageUrl.trim() || null,
        bio: profileForm.bio.trim() || null,
        gender: profileForm.gender.trim() || null,
        address: profileForm.address.trim() || null,
      })
      setCoverImageUrl(profileForm.coverImageUrl.trim() || DEFAULT_COVER_IMAGE)
      setNotification({
        open: true,
        severity: 'success',
        message: 'Cập nhật hồ sơ thành công.',
      })
      setIsEditingProfile(false)
      setIsChangingPassword(false)
    } catch (error) {
      showError(error, 'Không thể cập nhật hồ sơ lúc này.')
    }
  }

  const handleSubmitChangePassword = async () => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '' })
      setIsChangingPassword(false)
      setNotification({
        open: true,
        severity: 'success',
        message: 'Đổi mật khẩu thành công.',
      })
    } catch (error) {
      showError(error, 'Không thể đổi mật khẩu lúc này.')
    }
  }

  const handleToggleLike = async (postId) => {
    try {
      await likeMutation.mutateAsync(postId)
    } catch (error) {
      showError(error, 'Không thể thích bài viết này.')
    }
  }

  const handleToggleEditProfile = () => {
    if (!isEditingProfile) {
      setProfileForm({
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
        phoneNumber: profile?.phoneNumber ?? '',
        avatarUrl: profile?.avatarUrl ?? '',
        coverImageUrl: profile?.coverImageUrl ?? (coverImageUrl === DEFAULT_COVER_IMAGE ? '' : coverImageUrl),
        bio: profile?.bio ?? '',
        gender: profile?.gender ?? '',
        address: profile?.address ?? '',
      })
    }
    setIsEditingProfile((prev) => !prev)
    if (isEditingProfile) setIsChangingPassword(false)
  }

  const handleOpenPostMenu = (event, post) => {
    setPostMenuAnchor(event.currentTarget)
    setSelectedPost(post)
  }

  const handleClosePostMenu = () => {
    setPostMenuAnchor(null)
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
      showError(error, 'Không thể cập nhật bài viết.')
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
      showError(error, 'Không thể xóa bài viết.')
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
      showError(error, 'Không thể báo cáo bài viết lúc này.')
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
            src={profile?.avatarUrl ?? ''}
            onClick={handleOpenAvatarMenu}
          >
            {profile?.fullName?.[0] ?? profile?.firstName?.[0] ?? 'U'}
          </Avatar>
        </Stack>
      </Box>

      <Menu
        id="avatar-menu-mobile-profile"
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

      <Box sx={{ backgroundColor: '#FFFFFF' }}>
        <CardMedia
          component="img"
          image={profile?.coverImageUrl ?? coverImageUrl}
          alt="cover"
          sx={{ height: 200 }}
        />
        <Box sx={{ px: 2, pt: 2, pb: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              src={profile?.avatarUrl ?? ''}
              alt={profile?.fullName ?? 'Người dùng'}
              sx={{ width: 82, height: 82, border: '3px solid #FFFFFF', boxShadow: 2, mt: -6 }}
            >
              {profile?.fullName?.[0] ?? 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1, pt: 0.5, textAlign: 'left' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 22, lineHeight: 1.1, textAlign: 'left' }}>
                {profile?.fullName ?? '...'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                {[profile?.email, profile?.address].filter(Boolean).join(' • ')}
              </Typography>

              <Typography sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.6, textAlign: 'left' }}>
                {profile?.bio || 'Bạn chưa cập nhật giới thiệu.'}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -7, mb: 7 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<ModeEditOutlineRoundedIcon />}
              sx={{ borderRadius: 999, fontWeight: 700 }}
              onClick={handleToggleEditProfile}
            >
              {isEditingProfile ? 'Đóng cập nhật' : 'Cập nhật hồ sơ'}
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            {stats.map((item) => (
              <Box
                key={item.label}
                sx={{ flex: 1, p: 1.2, borderRadius: 2, backgroundColor: '#F5F7FA', textAlign: 'center' }}
              >
                <Typography sx={{ fontWeight: 700 }}>{item.value}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Collapse in={isEditingProfile}>
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography fontWeight={700}>Chỉnh sửa hồ sơ</Typography>
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    size="small"
                    label="Tên"
                    fullWidth
                    value={profileForm.firstName}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))}
                  />
                  <TextField
                    size="small"
                    label="Họ"
                    fullWidth
                    value={profileForm.lastName}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))}
                  />
                </Stack>
                <TextField
                  size="small"
                  label="Số điện thoại"
                  fullWidth
                  value={profileForm.phoneNumber}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                />
                <TextField
                  size="small"
                  label="Avatar URL"
                  fullWidth
                  value={profileForm.avatarUrl}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
                />
                <TextField
                  size="small"
                  label="Ảnh bìa URL"
                  fullWidth
                  value={profileForm.coverImageUrl}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                />
                <TextField
                  size="small"
                  label="Giới tính"
                  fullWidth
                  value={profileForm.gender}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, gender: event.target.value }))}
                />
                <TextField
                  size="small"
                  label="Địa chỉ"
                  fullWidth
                  value={profileForm.address}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, address: event.target.value }))}
                />
                <TextField
                  size="small"
                  label="Giới thiệu"
                  fullWidth
                  multiline
                  minRows={3}
                  value={profileForm.bio}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
                />
                <Divider />
                <Collapse in={isChangingPassword}>
                  <Stack spacing={1.5}>
                    <TextField
                      type="password"
                      size="small"
                      label="Mật khẩu hiện tại"
                      fullWidth
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                      }
                    />
                    <TextField
                      type="password"
                      size="small"
                      label="Mật khẩu mới"
                      fullWidth
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                    />
                  </Stack>
                </Collapse>
                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="outlined" sx={{ mr: 1 }} onClick={() => setIsChangingPassword((prev) => !prev)}>
                    {isChangingPassword ? 'Hủy' : 'Đổi mật khẩu'}
                  </Button>
                  {isChangingPassword && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={handleSubmitChangePassword}
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSubmitProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Collapse>

        {profileQuery.isLoading && <Alert severity="info">Đang tải thông tin cá nhân...</Alert>}
        {profileQuery.isError && (
          <Alert severity="error">{getApiErrorMessage(profileQuery.error, 'Không thể tải thông tin hồ sơ.')}</Alert>
        )}
        {myPostsQuery.isLoading && <Alert severity="info" sx={{ mt: 1.5 }}>Đang tải bài viết của bạn...</Alert>}
        {myPostsQuery.isError && (
          <Alert severity="error" sx={{ mt: 1.5 }}>
            {getApiErrorMessage(myPostsQuery.error, 'Không thể tải bài viết của bạn.')}
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
                    <Avatar src={profile?.avatarUrl ?? ''} sx={{ width: 36, height: 36 }}>
                      {profile?.fullName?.[0] ?? 'U'}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{post.authorName ?? profile?.fullName ?? 'Người dùng'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPostDate(post.createdOn)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Typography sx={{ mt: 1.25, color: 'text.secondary' }}>{post.content}</Typography>
              </CardContent>

              {post.imageUrl ? <CardMedia component="img" image={post.imageUrl} alt={post.authorName} sx={{ maxHeight: 260 }} /> : null}

              <CardContent sx={{ pt: 1.25 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2}>
                    <Button
                      size="small"
                      startIcon={
                        <FavoriteBorderRoundedIcon color={post.isLikedByCurrentUser ? 'error' : 'inherit'} />
                      }
                      onClick={() => handleToggleLike(post.id)}
                      disabled={likeMutation.isPending}
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
      </Box>

      <Menu
        id="profile-post-menu-mobile"
        anchorEl={postMenuAnchor}
        open={isPostMenuOpen}
        onClose={handleClosePostMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Chỉnh sửa bài viết
        </MenuItem>
        <MenuItem onClick={handleDeletePost} disabled={deletePostMutation.isPending}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Xóa bài viết
        </MenuItem>
        <MenuItem onClick={handleOpenReportDialog}>
          <ListItemIcon>
            <ReportGmailerrorredRoundedIcon fontSize="small" />
          </ListItemIcon>
          Báo cáo bài viết
        </MenuItem>
      </Menu>

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
        <Stack alignItems="center" spacing={0.4} onClick={() => navigate('/home')} sx={{ cursor: 'pointer', userSelect: 'none' }}>
          <HomeRoundedIcon fontSize="small" color={active === '/home' ? 'primary' : 'disabled'} />
          <Typography variant="caption" color={active === '/home' ? 'primary' : 'text.secondary'}>
            Trang chủ
          </Typography>
        </Stack>
        <Stack alignItems="center" spacing={0.4} onClick={() => navigate('/friends')} sx={{ cursor: 'pointer', userSelect: 'none' }}>
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
        <Stack alignItems="center" spacing={0.4} onClick={() => navigate('/notifications')} sx={{ cursor: 'pointer', userSelect: 'none' }}>
          <Badge color="primary" variant="dot">
            <NotificationsNoneRoundedIcon fontSize="small" color={active === '/notifications' ? 'primary' : 'disabled'} />
          </Badge>
          <Typography variant="caption" color={active === '/notifications' ? 'primary' : 'text.secondary'}>
            Thông báo
          </Typography>
        </Stack>
        <Stack alignItems="center" spacing={0.4} onClick={() => navigate('/profile')} sx={{ cursor: 'pointer', userSelect: 'none' }}>
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

export default MobileProfilePage
