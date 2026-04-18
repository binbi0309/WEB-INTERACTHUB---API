import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import { useLocation, useNavigate } from 'react-router-dom'

const profile = {
  name: 'Hoàng Nam',
  handle: '@nam_digital_curator',
  title: 'Nhà thiết kế sản phẩm',
  location: 'Hà Nội',
  bio:
    'Nguồn kể chuyện qua hình ảnh & Nhà thiết kế sản phẩm. Đam mê kết nối con người thông qua công nghệ bền vững.',
  coverImage:
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80',
  avatarImage:
    'https://images.unsplash.com/photo-1520975958225-15d3b0b6ef3d?auto=format&fit=crop&w=500&q=80',
}

const stats = [
  { label: 'Bài viết', value: '128' },
  { label: 'Bạn bè', value: '4.2K' },
  { label: 'Đang theo dõi', value: '85' },
]

const personalPosts = [
  {
    id: 1,
    time: '2 giờ trước',
    content:
      'Vừa hoàn thành dự án thiết kế giao diện cho một startup mới. Cảm giác thật tuyệt khi thấy ý tưởng dần trở thành hiện thực! #UIUX #DesignThinking',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    stats: { likes: '245', comments: '18' },
  },
  {
    id: 2,
    time: '1 ngày trước',
    content: '“Sự tối giản không phải là thiếu đi cái gì, mà là có đủ những gì cần thiết.”',
    stats: { likes: '1.2K', comments: '56' },
  },
  {
    id: 3,
    time: '3 ngày trước',
    content: 'Khoảnh khắc hoàng hôn tuyệt đẹp từ bàn làm việc chiều nay. Bình yên là đây.',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=80',
    ],
    stats: { likes: '980', comments: '41' },
  },
]

function TopTab({ active, children, onClick }) {
  return (
    <Button
      onClick={onClick}
      color="inherit"
      sx={{
        px: 0,
        borderRadius: 0,
        fontWeight: 900,
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

function StatsCard() {
  return (
    <Paper elevation={0} sx={{ borderRadius: 4, p: 1.5, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1}>
        {stats.map((item) => (
          <Box
            key={item.label}
            sx={{
              flex: 1,
              py: 1.2,
              borderRadius: 3,
              backgroundColor: '#F7F8FA',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{item.value}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  )
}

function PostCard({ post }) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ pb: 1.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.1} alignItems="center">
            <Avatar src={profile.avatarImage} alt={profile.name} sx={{ width: 36, height: 36 }} />
            <Box>
              <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>{profile.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {post.time}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" aria-label="Tìm kiếm">
            <SearchRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Typography sx={{ mt: 1.1, color: 'text.secondary' }}>{post.content}</Typography>
      </CardContent>

      {post.image ? <CardMedia component="img" image={post.image} alt="post" sx={{ maxHeight: 280 }} /> : null}

      {post.gallery ? (
        <Box sx={{ px: 1.5, pb: 1.25, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <CardMedia component="img" image={post.gallery[0]} alt="gallery-1" sx={{ borderRadius: 2, height: 160 }} />
          <Box sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 1 }}>
            <CardMedia component="img" image={post.gallery[1]} alt="gallery-2" sx={{ borderRadius: 2, height: 76 }} />
            <Box sx={{ position: 'relative' }}>
              <CardMedia component="img" image={post.gallery[2]} alt="gallery-3" sx={{ borderRadius: 2, height: 76 }} />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                }}
              >
                +5
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}

      <CardContent sx={{ pt: 1.25 }}>
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" startIcon={<FavoriteBorderRoundedIcon />}>
            {post.stats.likes}
          </Button>
          <Button size="small" startIcon={<ChatBubbleOutlineRoundedIcon />}>
            {post.stats.comments}
          </Button>
          <IconButton size="small" aria-label="Chia sẻ">
            <ShareRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MobileProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

  const [activeTab, setActiveTab] = useState('posts')

  const visiblePosts = useMemo(() => {
    if (activeTab !== 'posts') return []
    return personalPosts
  }, [activeTab])

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
      </Box>

      <Box sx={{ backgroundColor: '#FFFFFF' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia component="img" image={profile.coverImage} alt="cover" sx={{ height: 210 }} />
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              bottom: -38,
              width: 92,
              height: 92,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 3,
            }}
          >
            <Avatar
              src={profile.avatarImage}
              alt={profile.name}
              sx={{
                width: 84,
                height: 84,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ px: 2, pt: 5.5, pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1.1 }}>{profile.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5 }}>
                {profile.handle}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<ModeEditOutlineRoundedIcon />}
              sx={{ borderRadius: 999, fontWeight: 900, px: 1.5, minHeight: 34 }}
            >
              Cập nhật hồ sơ
            </Button>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {profile.title} • {profile.location}
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>{profile.bio}</Typography>

          <Box sx={{ mt: 2 }}>
            <StatsCard />
          </Box>
        </Box>

        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={3}>
            <TopTab active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
              Bài viết
            </TopTab>
            <TopTab active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
              Ảnh & Video
            </TopTab>
            <TopTab active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
              Đã lưu
            </TopTab>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        {activeTab === 'posts' ? (
          <Stack spacing={2}>
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography color="text.secondary">
              {activeTab === 'media' ? 'Chưa có ảnh hoặc video nào.' : 'Chưa có mục đã lưu nào.'}
            </Typography>
          </Paper>
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

export default MobileProfilePage
