import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useUsers } from '../hooks/useUsers'

function UserList() {
  const { data, isLoading, isError, error } = useUsers()

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    )
  }

  if (isError) {
    return <Alert severity="error">Khong the tai users: {error.message}</Alert>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Danh sach users</Typography>
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        {data?.slice(0, 8).map((user) => (
          <ListItem key={user.id} divider>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

export default UserList
