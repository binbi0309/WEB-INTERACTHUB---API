import { useQuery } from '@tanstack/react-query'
import { getMyPosts, getMyProfile } from '../profileApi'
import { PROFILE_QUERY_KEYS } from '../profileQueryKeys'

export function useMyProfileQuery(options = {}) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.myProfile,
    queryFn: getMyProfile,
    staleTime: 60 * 1000,
    ...options,
  })
}

export function useMyPostsQuery(params = { pageNumber: 1, pageSize: 20 }) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.myPosts(params.pageNumber, params.pageSize),
    queryFn: () => getMyPosts(params),
    staleTime: 30 * 1000,
  })
}

