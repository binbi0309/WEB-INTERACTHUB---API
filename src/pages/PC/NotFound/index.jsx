import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        404
      </Typography>
      <Typography color="text.secondary">Không tìm thấy trang bạn yêu cầu.</Typography>
    </Stack>
  )
}

export default NotFoundPage
