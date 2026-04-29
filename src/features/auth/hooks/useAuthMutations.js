import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, register } from '../authApi'
import { AUTH_QUERY_KEY } from '../authQueryKeys'
import { PROFILE_QUERY_KEYS } from '../../profile/profileQueryKeys'
import { HOME_QUERY_KEYS } from '../../home/homeQueryKeys'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
      // Khi đổi tài khoản, các query profile/home có thể còn "fresh" do staleTime,
      // nên cần invalidate để UI hiển thị đúng user mới ngay lập tức.
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.myProfile })
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.myPosts(1, 20) })
      await queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.myProfile })
      await queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.feed(1, 20) })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.myProfile })
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.myPosts(1, 20) })
      await queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.myProfile })
      await queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.feed(1, 20) })
    },
  })
}

