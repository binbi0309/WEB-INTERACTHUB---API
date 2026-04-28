import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPost,
  deletePost,
  followUser,
  reportPost,
  toggleLikePost,
  unfollowUser,
  updatePost,
} from '../homeApi'
import { HOME_QUERY_KEYS } from '../homeQueryKeys'

export function useCreatePostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.feed(pageNumber, pageSize),
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.myProfile,
      })
    },
  })
}

export function useToggleLikeMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()
  const feedKey = HOME_QUERY_KEYS.feed(pageNumber, pageSize)

  return useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKey })
      const previousFeed = queryClient.getQueryData(feedKey)

      queryClient.setQueryData(feedKey, (oldData) => {
        if (!oldData?.data) {
          return oldData
        }

        return {
          ...oldData,
          data: oldData.data.map((post) => {
            if (post.id !== postId) {
              return post
            }

            const nextLiked = !post.isLikedByCurrentUser
            const nextLikeCount = Math.max(
              0,
              Number(post.likeCount ?? 0) + (nextLiked ? 1 : -1),
            )

            return {
              ...post,
              isLikedByCurrentUser: nextLiked,
              likeCount: nextLikeCount,
            }
          }),
        }
      })

      return { previousFeed }
    },
    onError: (_error, _postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(feedKey, context.previousFeed)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: feedKey })
    },
  })
}

export function useFollowUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.following,
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.activeUsers,
      })
    },
  })
}

export function useUnfollowUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.following,
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.activeUsers,
      })
    },
  })
}

export function useUpdatePostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.feed(pageNumber, pageSize),
      })
    },
  })
}

export function useDeletePostMutation(pageNumber = 1, pageSize = 20) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.feed(pageNumber, pageSize),
      })
      await queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.myProfile,
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
        queryKey: HOME_QUERY_KEYS.feed(pageNumber, pageSize),
      })
    },
  })
}

