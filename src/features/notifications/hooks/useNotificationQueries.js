import { useQuery } from '@tanstack/react-query'
import { getNotifications, getUnreadNotificationCount } from '../notificationsApi'
import { NOTIFICATION_QUERY_KEYS } from '../notificationsQueryKeys'

export function useNotificationsQuery(params = {}) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 15 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

export function useUnreadNotificationCountQuery(options = {}) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 10 * 1000,
    ...options,
  })
}
