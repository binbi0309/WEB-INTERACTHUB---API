export const FRIENDS_QUERY_KEYS = {
  all: ['friends'],
  myFriends: ['friends', 'my-friends'],
  pendingReceived: ['friends', 'pending-received'],
  pendingSent: ['friends', 'pending-sent'],
  activeUsers: ['friends', 'active-users'],
  myProfile: ['friends', 'my-profile'],
  profileByUser: (userId) => ['friends', 'profile-by-user', userId],
}

