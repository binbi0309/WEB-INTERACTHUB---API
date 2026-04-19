import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded'
import { useLocation, useNavigate } from 'react-router-dom'

const posts = [
  {
    id: 1,
    author: 'Minh Anh',
    time: '2 giờ trước',
    content:
      'Vừa hoàn thành dự án thiết kế nội thất cho văn phòng mới. Sự kết hợp giữa tối giản và thiên nhiên luôn mang lại cảm giác dễ chịu nhất.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    likes: '128 lượt thích',
    comments: '24 bình luận',
    shares: '5 chia sẻ',
  },
  {
    id: 2,
    author: 'Hoàng Nam',
    time: '5 giờ trước',
    content:
      'Chuyến đi Đà Lạt cuối tuần vừa rồi thực sự làm mình được nạp lại năng lượng. Không khí se lạnh và tách cà phê nóng là combo hoàn hảo.',
    gallery: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=600&q=80',
    ],
    likes: '96 lượt thích',
    comments: '17 bình luận',
    shares: '2 chia sẻ',
  },
  {
    id: 3,
    author: 'Lê Quang',
    time: '10 giờ trước',
    content:
      '“Kỷ luật là cầu nối giữa mục tiêu và thành tựu.” Gần đây mình đang thử dậy sớm lúc 5 giờ sáng để đọc sách và thiền.',
    tags: ['#Productivity', '#Growth'],
  },
]

const trendingTags = ['#ThiếtKế', '#CôngNghệ', '#KhởiNghiệp']

function MobileHomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname

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
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small">
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <Badge color="primary" variant="dot">
                <NotificationsNoneRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" />
              <InputBase
                placeholder="Bạn đang nghĩ gì?"
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
              <Button size="small" startIcon={<VideocamRoundedIcon sx={{ color: '#EF4444' }} />} color="inherit">
                Trực tiếp
              </Button>
              <Button size="small" startIcon={<EmojiEmotionsRoundedIcon sx={{ color: '#EAB308' }} />} color="inherit">
                Cảm xúc
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar>{post.author[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{post.author}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.time}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small">
                    <MoreHorizRoundedIcon />
                  </IconButton>
                </Stack>
                <Typography sx={{ mt: 1.25, color: 'text.secondary' }}>{post.content}</Typography>
              </CardContent>

              {post.image ? <CardMedia component="img" image={post.image} alt={post.author} sx={{ maxHeight: 260 }} /> : null}

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
                          fontWeight: 700,
                        }}
                      >
                        +12
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : null}

              <CardContent sx={{ pt: 1.25 }}>
                {post.likes ? (
                  <Typography variant="caption" color="text.secondary">
                    {post.likes} • {post.comments} • {post.shares}
                  </Typography>
                ) : null}

                {post.tags ? (
                  <Stack direction="row" spacing={1} sx={{ mb: 1.25 }} useFlexGap flexWrap="wrap">
                    {post.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                ) : null}

                <Stack direction="row" justifyContent="space-between">
                  <Button size="small" startIcon={<FavoriteRoundedIcon />}>
                    Thích
                  </Button>
                  <Button size="small" startIcon={<ChatBubbleOutlineRoundedIcon />}>
                    Bình luận
                  </Button>
                  <Button size="small" startIcon={<ShareRoundedIcon />}>
                    Chia sẻ
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Paper elevation={0} sx={{ mt: 2, p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography fontWeight={700}>Xu hướng cho bạn</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
            {trendingTags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </Paper>
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
    </Box>
  )
}

export default MobileHomePage
