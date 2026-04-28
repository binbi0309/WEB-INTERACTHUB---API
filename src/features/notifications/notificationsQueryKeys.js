export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'],
  lists: ['notifications', 'list'],
  list: (params) => ['notifications', 'list', params],
  unreadCount: ['notifications', 'unread-count'],
}
