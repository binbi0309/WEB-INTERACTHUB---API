import { useQuery } from '@tanstack/react-query'
import { AUTH_QUERY_KEY } from '../authQueryKeys'
import { getSession } from '../authApi'

export function useAuthSession() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getSession,
    retry: false,
    staleTime: 60 * 1000,
  })
}

