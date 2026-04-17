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
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'

const profile = {
  name: 'Marcus Sterling',
  title: 'Kien truc su san pham so',
  location: 'NYC',
  bio:
    'Xay dung tuong lai cua nhung trai nghiem ket noi. Tap trung vao cac he thong thiet ke toi gian, kieu chu bien tap va su giao thoa giua tam ly hoc con nguoi voi giai dien ky thuat so.',
  coverImage:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  avatarImage:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
}

const stats = [
  { label: 'Bai viet', value: '1.2K' },
  { label: 'Ban be', value: '842' },
  { label: 'Du an', value: '15' },
]

const personalPosts = [
  {
    id: 1,
    title: 'Kham pha cac gioi han cua thiet ke don sac trong kien truc web hien dai',
    excerpt:
      'Bi quyet cua mot giao dien cao cap khong nam o so luong tinh nang, ma o chat luong cua cac khoang trang giua chung.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    time: '2 gio truoc',
    stats: { likes: 124, comments: 18 },
  },
  {
    id: 2,
    title: 'Su tien hoa cua cac framework React va su tro lai cua su don gian phia may chu',
    excerpt:
      'Chu ky phat trien front-end da thay doi trong 5 nam qua. Chung ta dan dich chuyen logic sang phia client, roi can bang tro lai.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    time: '1 ngay truoc',
    stats: { likes: 97, comments: 9 },
  },
]

function DashboardPage() {
  return (
    <Box sx={{ pb: 4 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <CardMedia component="img" image={profile.coverImage} alt="cover" sx={{ height: { xs: 180, md: 280 } }} />

        <Box sx={{ px: { xs: 2, md: 4 }, pb: 3 }}>
          <Box sx={{ mt: { xs: -6, md: -7 } }}>
            <Avatar
              src={profile.avatarImage}
              alt={profile.name}
              sx={{
                width: { xs: 96, md: 132 },
                height: { xs: 96, md: 132 },
                border: '4px solid #FFFFFF',
                boxShadow: 3,
              }}
            />
          </Box>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{ mt: 1.5 }}
          >
            <Box>
              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {profile.name}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ModeEditOutlineRoundedIcon />}
                  sx={{ borderRadius: 999, px: 1.5, minHeight: 32 }}
                >
                  Cap nhat ho so
                </Button>
              </Stack>
              <Typography color="text.secondary">
                {profile.title} - {profile.location}
              </Typography>
            </Box>
          </Stack>

          <Typography sx={{ mt: 2.5, maxWidth: 900, color: 'text.secondary', lineHeight: 1.7 }}>{profile.bio}</Typography>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '290px minmax(0, 1fr)' }, gap: 3 }}>
        <Card sx={{ height: 'fit-content', borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Stats
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
          {personalPosts.map((post) => (
            <Card key={post.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={profile.avatarImage} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{profile.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.time}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small">
                    <MoreHorizRoundedIcon />
                  </IconButton>
                </Stack>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {post.excerpt}
                </Typography>
              </CardContent>
              <CardMedia component="img" image={post.image} alt={post.title} sx={{ maxHeight: 380 }} />
              <CardContent sx={{ pt: 1.25 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<FavoriteBorderRoundedIcon />}>
                      {post.stats.likes}
                    </Button>
                    <Button size="small">{post.stats.comments} binh luan</Button>
                  </Stack>
                  <IconButton size="small">
                    <ShareRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mt: 3 }} />
    </Box>
  )
}

export default DashboardPage
