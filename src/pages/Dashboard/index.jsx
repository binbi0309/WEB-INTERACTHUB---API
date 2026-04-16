import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import UserList from '../../features/users/components/UserList'

function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      <UserList />
    </Stack>
  )
}

export default DashboardPage
