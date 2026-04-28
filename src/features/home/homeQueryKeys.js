export const HOME_QUERY_KEYS = {
  feed: (pageNumber = 1, pageSize = 20) => ['home', 'feed', pageNumber, pageSize],
  myProfile: ['home', 'my-profile'],
  activeUsers: ['home', 'active-users'],
  following: ['home', 'following'],
  authorProfile: (userId) => ['home', 'author-profile', userId],
}

