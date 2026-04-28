import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthSession } from '../../auth/hooks/useAuthSession'
import { NOTIFICATION_QUERY_KEYS } from '../notificationsQueryKeys'
import { connectNotificationRealtime, disconnectNotificationRealtime } from '../notificationRealtime'

function prependNotificationToCachedLists(queryClient, incomingNotification) {
  const listSnapshots = queryClient.getQueriesData({
    queryKey: NOTIFICATION_QUERY_KEYS.lists,
  })

  listSnapshots.forEach(([queryKey, data]) => {
    if (!data?.data || !Array.isArray(data.data)) {
      return
    }

    const existed = data.data.some((item) => item.id === incomingNotification.id)
    if (existed) {
      return
    }

    const pageSize = Number(data.pageSize) > 0 ? Number(data.pageSize) : data.data.length + 1
    const nextItems = [incomingNotification, ...data.data].slice(0, pageSize)
    const currentTotalCount = Number(data.totalCount)
    const normalizedTotalCount = Number.isFinite(currentTotalCount) ? currentTotalCount : data.data.length

    queryClient.setQueryData(queryKey, {
      ...data,
      data: nextItems,
      totalCount: Math.max(nextItems.length, normalizedTotalCount + 1),
    })
  })
}

function increaseUnreadCountCache(queryClient) {
  const unreadCountSnapshot = queryClient.getQueryData(NOTIFICATION_QUERY_KEYS.unreadCount)
  if (!unreadCountSnapshot) {
    return
  }

  const currentCount = Number(unreadCountSnapshot.count) || 0
  queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, {
    ...unreadCountSnapshot,
    count: currentCount + 1,
  })
}

export function useNotificationRealtimeBridge() {
  const queryClient = useQueryClient()
  const { data: session } = useAuthSession()

  useEffect(() => {
    if (!session) {
      disconnectNotificationRealtime().catch(() => {})
      return undefined
    }

    let unsubscribe = null
    let cancelled = false

    const setupRealtime = async () => {
      try {
        const detachListener = await connectNotificationRealtime((incomingNotification) => {
          prependNotificationToCachedLists(queryClient, incomingNotification)
          if (!incomingNotification?.isRead) {
            increaseUnreadCountCache(queryClient)
          }
        })

        if (cancelled) {
          detachListener()
          return
        }

        unsubscribe = detachListener
      } catch (_error) {
        // Ignore connection bootstrap errors. Existing REST queries continue to work.
      }
    }

    setupRealtime()

    return () => {
      cancelled = true
      if (unsubscribe) {
        unsubscribe()
      }
      disconnectNotificationRealtime().catch(() => {})
    }
  }, [queryClient, session])
}
