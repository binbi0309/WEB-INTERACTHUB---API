import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        404
      </Typography>
      <Typography color="text.secondary">Khong tim thay trang ban yeu cau.</Typography>
    </Stack>
  )
}

export default NotFoundPage
