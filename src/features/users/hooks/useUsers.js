import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../userApi'

export const USERS_QUERY_KEY = ['users']

export const useUsers = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  })
