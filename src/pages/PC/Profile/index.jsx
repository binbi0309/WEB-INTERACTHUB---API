import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
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
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
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

function ProfilePage() {
  const pageNumber = 1
  const pageSize = 20
  const profileQuery = useMyProfileQuery()
  const myPostsQuery = useMyPostsQuery({ pageNumber, pageSize })
  const updateProfileMutation = useUpdateMyProfileMutation(pageNumber, pageSize)
  const changePasswordMutation = useChangePasswordMutation()
  const likeMutation = useToggleMyPostLikeMutation(pageNumber, pageSize)
  const updatePostMutation = useUpdateMyPostMutation(pageNumber, pageSize)
  const deletePostMutation = useDeleteMyPostMutation(pageNumber, pageSize)
  const reportPostMutation = useReportPostMutation(pageNumber, pageSize)
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
  const isPostMenuOpen = Boolean(postMenuAnchor)

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

  const showError = (error, fallback) => {
    setNotification({
      open: true,
      severity: 'error',
      message: getApiErrorMessage(error, fallback),
    })
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
    if (isEditingProfile) {
      setIsChangingPassword(false)
    }
  }

  const handleOpenPostMenu = (event, post) => {
    setPostMenuAnchor(event.currentTarget)
    setSelectedPost(post)
  }

  const handleClosePostMenu = () => {
    setPostMenuAnchor(null)
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
      showError(error, 'Không thể cập nhật bài viết.')
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
      showError(error, 'Không thể báo cáo bài viết lúc này.')
    }
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={profile?.coverImageUrl ?? coverImageUrl}
          alt="cover"
          sx={{ height: { xs: 180, md: 280 } }}
        />

        <Box sx={{ px: { xs: 2, md: 4 }, pb: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
              <Avatar
                src={profile?.avatarUrl ?? ''}
                alt={profile?.fullName ?? 'Người dùng'}
                sx={{
                  width: { xs: 96, md: 132 },
                  height: { xs: 96, md: 132 },
                  border: '4px solid #FFFFFF',
                  boxShadow: 3,
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {profile?.fullName ?? '...'}
                </Typography>
                <Typography color="text.secondary">
                  {[profile?.email, profile?.address].filter(Boolean).join(' • ')}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.7 }}>
                  {profile?.bio || 'Bạn chưa cập nhật giới thiệu.'}
                </Typography>
              </Box>
              <Box sx={{ ml: { md: 'auto' }, alignSelf: { xs: 'flex-start', md: 'center' } }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ModeEditOutlineRoundedIcon />}
                  sx={{ borderRadius: 2, px: 1.75, minHeight: 36, whiteSpace: 'nowrap' }}
                  onClick={handleToggleEditProfile}
                >
                  {isEditingProfile ? 'Đóng cập nhật' : 'Cập nhật hồ sơ'}
                </Button>
              </Box>
            </Stack>
          </Stack>

          <Collapse in={isEditingProfile}>
            <Stack spacing={1.5} sx={{ mt: 2.5, p: 2, borderRadius: 2, backgroundColor: '#F8FAFC' }}>
              <Typography variant="h6" fontWeight={700}>
                Chỉnh sửa hồ sơ
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
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
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                  <Typography fontWeight={600} sx={{ minWidth: { md: 160 } }}>
                    Đổi mật khẩu
                  </Typography>
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
                  {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '290px minmax(0, 1fr)' }, gap: 3 }}>
        <Card sx={{ height: 'fit-content', borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Thống kê
            </Typography>
            <Stack direction="row" spacing={1}>
              {stats.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#F5F7FA',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2.5}>
          {profileQuery.isLoading && <Alert severity="info">Đang tải thông tin cá nhân...</Alert>}
          {profileQuery.isError && (
            <Alert severity="error">
              {getApiErrorMessage(profileQuery.error, 'Không thể tải thông tin hồ sơ.')}
            </Alert>
          )}
          {myPostsQuery.isLoading && <Alert severity="info">Đang tải bài viết của bạn...</Alert>}
          {myPostsQuery.isError && (
            <Alert severity="error">
              {getApiErrorMessage(myPostsQuery.error, 'Không thể tải bài viết của bạn.')}
            </Alert>
          )}

          {posts.map((post) => (
            <Card key={post.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={profile?.avatarUrl ?? ''} sx={{ width: 40, height: 40 }}>
                      {profile?.fullName?.[0] ?? 'U'}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{profile?.fullName ?? 'Người dùng'}</Typography>
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

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>
              </CardContent>
              {post.imageUrl && (
                <CardMedia component="img" image={post.imageUrl} alt={post.content} sx={{ maxHeight: 380 }} />
              )}
              <CardContent sx={{ pt: 1.25 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={
                        <FavoriteBorderRoundedIcon
                          color={post.isLikedByCurrentUser ? 'error' : 'inherit'}
                        />
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
        id="profile-post-menu"
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

      <Divider sx={{ mt: 3 }} />
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

export default ProfilePage
