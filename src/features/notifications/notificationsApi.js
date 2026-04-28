import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export async function getNotifications({ pageNumber = 1, pageSize = 100 } = {}) {
  const response = await axiosClient.get(endPoints.NOTIFICATION_LIST, {
    params: {
      pageNumber,
      pageSize,
    },
  })

  return response.data
}

export async function getUnreadNotificationCount() {
  const response = await axiosClient.get(endPoints.NOTIFICATION_UNREAD_COUNT)
  return response.data
}

export async function markNotificationAsRead(notificationId) {
  const response = await axiosClient.put(`${endPoints.NOTIFICATION_MARK_AS_READ}/${notificationId}`)
  return response.data
}

export async function markAllNotificationsAsRead() {
  const response = await axiosClient.put(endPoints.NOTIFICATION_MARK_ALL_AS_READ)
  return response.data
}
