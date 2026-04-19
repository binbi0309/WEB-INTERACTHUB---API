import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import { useLocation, useNavigate } from 'react-router-dom'

const trendingHashtags = [
  { id: 1, tag: '#AdaptiveAI', posts: '12K bài viết' },
  { id: 2, tag: '#MarketPivot', posts: '8.4K bài viết' },
  { id: 3, tag: '#SpatialComputing', posts: '5.6K bài viết' },
]

const suggestions = [
  { id: 1, name: 'Amara Kojo', role: 'Quản lý sản phẩm' },
  { id: 2, name: 'Soren West', role: 'Giám đốc sáng tạo' },
]

const posts = [
  {
    id: 1,
    author: 'Liam Vance',
    role: 'Kiến trúc sư',
    time: '2 giờ trước',
    content:
      'Định nghĩa lại sự giao thoa giữa hình thái hữu cơ và độ chính xác về cấu trúc. Dự án gian hàng mới này tập trung vào việc đón ánh sáng buổi sáng thông qua các lớp gỗ bền vững.',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    stats: { likes: '1.2k', comments: '84' },
  },
  {
    id: 2,
    author: 'Industrial Intelligence',
    role: 'Được tài trợ',
    time: '4 giờ trước',
    content:
      'Tương lai của logistics tự hành đang được đẩy nhanh bởi các hệ thống AI và chuỗi cung ứng kết nối theo thời gian thực.',
    image:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    stats: { likes: '430', comments: '26' },
  },
]

const desktopMenus = [
  { id: 'home', label: 'Trang chủ', icon: <HomeRoundedIcon fontSize="small" />, path: '/home' },
  { id: 'friends', label: 'Bạn bè', icon: <PeopleRoundedIcon fontSize="small" />, path: '/friends' },
  { id: 'notifications', label: 'Thông báo', icon: <NotificationsNoneRoundedIcon fontSize="small" />, path: '/notifications' },
]

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

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
          <IconButton size="small" aria-label="Hồ sơ" onClick={() => navigate('/profile')}>
            <Avatar sx={{ width: 34, height: 34 }}>T</Avatar>
          </IconButton>
        </Stack>
      </Box>

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
                  <Avatar sx={{ width: 42, height: 42 }}>T</Avatar>
                  <InputBase
                    placeholder="Bạn đang nghĩ gì?"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: '#F5F6F8',
                      width: '100%',
                    }}
                  />
                  <Button variant="contained" sx={{ borderRadius: 2, px: 2.5 }}>
                    Đăng
                  </Button>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={1.5}>
                  <Button startIcon={<InsertPhotoRoundedIcon />} size="small">
                    Ảnh/Video
                  </Button>
                  <Button startIcon={<VideocamRoundedIcon />} size="small">
                    Sự kiện
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {posts.map((post) => (
              <Card key={post.id} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar>{post.author[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={700}>{post.author}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.role} <CircleRoundedIcon sx={{ fontSize: 6, mx: 0.6 }} /> {post.time}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton size="small">
                      <MoreHorizRoundedIcon />
                    </IconButton>
                  </Stack>

                  <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>{post.content}</Typography>
                </CardContent>
                <CardMedia component="img" image={post.image} alt={post.author} sx={{ maxHeight: 430 }} />
                <CardContent sx={{ pt: 1.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2}>
                      <Button size="small" startIcon={<FavoriteBorderRoundedIcon />}>
                        {post.stats.likes}
                      </Button>
                      <Button size="small">{post.stats.comments} bình luận</Button>
                    </Stack>
                    <Stack direction="row">
                      <IconButton size="small">
                        <BookmarkBorderRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <SendRoundedIcon fontSize="small" />
                      </IconButton>
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
                  <TuneRoundedIcon color="action" fontSize="small" />
                </Stack>
                <Stack spacing={1.25}>
                  {trendingHashtags.map((item) => (
                    <Box key={item.id}>
                      <Typography fontWeight={600}>{item.tag}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.posts}
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
                  {suggestions.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 1, borderRadius: 2, backgroundColor: '#F7F8FA' }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar>{item.name[0]}</Avatar>
                        <Box>
                          <Typography fontWeight={600}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.role}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip label="Theo dõi" size="small" />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
