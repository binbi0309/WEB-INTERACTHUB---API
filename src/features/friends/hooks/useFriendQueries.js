import { useQueries, useQuery } from '@tanstack/react-query'
import {
  getAllActiveUsers,
  getMyFriends,
  getMyProfile,
  getProfileByUserId,
  getPendingReceivedRequests,
  getPendingSentRequests,
} from '../friendsApi'
import { FRIENDS_QUERY_KEYS } from '../friendsQueryKeys'

export function useMyFriendsQuery() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.myFriends,
    queryFn: getMyFriends,
    staleTime: 30 * 1000,
  })
}

export function usePendingReceivedRequestsQuery() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.pendingReceived,
    queryFn: getPendingReceivedRequests,
    staleTime: 15 * 1000,
  })
}

export function usePendingSentRequestsQuery() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.pendingSent,
    queryFn: getPendingSentRequests,
    staleTime: 15 * 1000,
  })
}

export function useFriendsActiveUsersQuery() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.activeUsers,
    queryFn: getAllActiveUsers,
    staleTime: 60 * 1000,
  })
}

export function useFriendsMyProfileQuery() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.myProfile,
    queryFn: getMyProfile,
    staleTime: 60 * 1000,
  })
}

export function useFriendProfilesQuery(userIds = []) {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)))

  return useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: FRIENDS_QUERY_KEYS.profileByUser(userId),
      queryFn: () => getProfileByUserId(userId),
      staleTime: 5 * 60 * 1000,
    })),
  })
}

