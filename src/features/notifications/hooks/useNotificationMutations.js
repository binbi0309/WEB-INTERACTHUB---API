import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markAllNotificationsAsRead, markNotificationAsRead } from '../notificationsApi'
import { NOTIFICATION_QUERY_KEYS } from '../notificationsQueryKeys'

function markNotificationListsAsRead(queryClient, notificationId) {
  const listSnapshots = queryClient.getQueriesData({
    queryKey: NOTIFICATION_QUERY_KEYS.lists,
  })

  let changedUnreadCount = 0

  listSnapshots.forEach(([queryKey, data]) => {
    if (!data?.data) {
      return
    }

    let listChanged = false
    const nextItems = data.data.map((item) => {
      if (item.id !== notificationId || item.isRead) {
        return item
      }

      listChanged = true
      changedUnreadCount += 1

      return {
        ...item,
        isRead: true,
      }
    })

    if (listChanged) {
      queryClient.setQueryData(queryKey, {
        ...data,
        data: nextItems,
      })
    }
  })

  return {
    listSnapshots: listSnapshots.map(([queryKey, data]) => [queryKey, data]),
    changedUnreadCount,
  }
}

function markAllNotificationListsAsRead(queryClient) {
  const listSnapshots = queryClient.getQueriesData({
    queryKey: NOTIFICATION_QUERY_KEYS.lists,
  })

  listSnapshots.forEach(([queryKey, data]) => {
    if (!data?.data) {
      return
    }

    queryClient.setQueryData(queryKey, {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        isRead: true,
      })),
    })
  })

  return listSnapshots.map(([queryKey, data]) => [queryKey, data])
}

function restoreNotificationLists(queryClient, snapshots) {
  snapshots.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.lists })
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount })

      const { listSnapshots, changedUnreadCount } = markNotificationListsAsRead(queryClient, notificationId)
      const unreadCountSnapshot = queryClient.getQueryData(NOTIFICATION_QUERY_KEYS.unreadCount)

      if (unreadCountSnapshot?.count != null && changedUnreadCount > 0) {
        const currentCount = Number(unreadCountSnapshot.count) || 0
        const nextCount = Math.max(0, currentCount - changedUnreadCount)

        queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, {
          ...unreadCountSnapshot,
          count: nextCount,
        })
      }

      return {
        listSnapshots,
        unreadCountSnapshot,
      }
    },
    onError: (_error, _notificationId, context) => {
      if (context?.listSnapshots) {
        restoreNotificationLists(queryClient, context.listSnapshots)
      }

      if (context?.unreadCountSnapshot) {
        queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, context.unreadCountSnapshot)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.lists })
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount })
    },
  })
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.lists })
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount })

      const listSnapshots = markAllNotificationListsAsRead(queryClient)
      const unreadCountSnapshot = queryClient.getQueryData(NOTIFICATION_QUERY_KEYS.unreadCount)

      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, {
        ...(unreadCountSnapshot ?? {}),
        count: 0,
      })

      return {
        listSnapshots,
        unreadCountSnapshot,
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.listSnapshots) {
        restoreNotificationLists(queryClient, context.listSnapshots)
      }

      if (context?.unreadCountSnapshot) {
        queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, context.unreadCountSnapshot)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.lists })
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount })
    },
  })
}
