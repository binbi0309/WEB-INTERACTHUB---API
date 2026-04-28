import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from '../friendsApi'
import { FRIENDS_QUERY_KEYS } from '../friendsQueryKeys'

async function invalidateFriendQueries(queryClient) {
  await queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.myFriends })
  await queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.pendingReceived })
  await queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.pendingSent })
  await queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.activeUsers })
}

export function useSendFriendRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: async () => {
      await invalidateFriendQueries(queryClient)
    },
  })
}

export function useAcceptFriendRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await invalidateFriendQueries(queryClient)
    },
  })
}

export function useRejectFriendRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await invalidateFriendQueries(queryClient)
    },
  })
}

