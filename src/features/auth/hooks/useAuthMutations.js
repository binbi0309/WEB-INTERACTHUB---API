import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, register } from '../authApi'
import { AUTH_QUERY_KEY } from '../authQueryKeys'

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
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
    },
  })
}

