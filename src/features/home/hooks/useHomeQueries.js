import { useQueries, useQuery } from '@tanstack/react-query'
import { getAllActiveUsers, getFeed, getFollowingUsers, getMyProfile, getProfileByUserId } from '../homeApi'
import { HOME_QUERY_KEYS } from '../homeQueryKeys'

export function useFeedQuery(params = { pageNumber: 1, pageSize: 20 }) {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.feed(params.pageNumber, params.pageSize),
    queryFn: () => getFeed(params),
    staleTime: 30 * 1000,
  })
}

export function useMyProfileQuery() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.myProfile,
    queryFn: getMyProfile,
    staleTime: 60 * 1000,
  })
}

export function useActiveUsersQuery() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.activeUsers,
    queryFn: getAllActiveUsers,
    staleTime: 60 * 1000,
  })
}

export function useFollowingUsersQuery() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.following,
    queryFn: getFollowingUsers,
    staleTime: 60 * 1000,
  })
}

export function useAuthorProfilesQuery(userIds = []) {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)))

  return useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: HOME_QUERY_KEYS.authorProfile(userId),
      queryFn: () => getProfileByUserId(userId),
      staleTime: 5 * 60 * 1000,
    })),
  })
}

