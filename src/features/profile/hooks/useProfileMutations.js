import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  deletePost,
  reportPost,
  toggleLikePost,
  updateMyProfile,
  updatePost,
} from '../profileApi'
import { PROFILE_QUERY_KEYS } from '../profileQueryKeys'
import { HOME_QUERY_KEYS } from '../../home/homeQueryKeys'

export function useUpdateMyProfileMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.myProfile })
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myPosts(pageNumber, pageSize),
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.myProfile,
      })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
  })
}

export function useToggleMyPostLikeMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()
  const postsKey = PROFILE_QUERY_KEYS.myPosts(pageNumber, pageSize)

  return useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postsKey })
      const previousPosts = queryClient.getQueryData(postsKey)

      queryClient.setQueryData(postsKey, (oldData) => {
        if (!oldData?.data) {
          return oldData
        }

        return {
          ...oldData,
          data: oldData.data.map((post) => {
            if (post.id !== postId) {
              return post
            }

            const isLikedByCurrentUser = !post.isLikedByCurrentUser
            return {
              ...post,
              isLikedByCurrentUser,
              likeCount: Math.max(
                0,
                Number(post.likeCount ?? 0) + (isLikedByCurrentUser ? 1 : -1),
              ),
            }
          }),
        }
      })

      return { previousPosts }
    },
    onError: (_error, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postsKey, context.previousPosts)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: postsKey })
    },
  })
}

export function useUpdateMyPostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myPosts(pageNumber, pageSize),
      })
    },
  })
}

export function useDeleteMyPostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myPosts(pageNumber, pageSize),
      })
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myProfile,
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.feed(1, 20),
      })
    },
  })
}

export function useReportPostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reportPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myPosts(pageNumber, pageSize),
      })
    },
  })
}

