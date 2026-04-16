import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PrimaryButton from '../../components/common/PrimaryButton'

function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Chao mung den voi InteractHub
      </Typography>
      <Typography color="text.secondary">
        Day la trang Home duoc to chuc theo kien truc feature-based.
      </Typography>
      <PrimaryButton>Tiep tuc</PrimaryButton>
    </Stack>
  )
}

export default HomePage
