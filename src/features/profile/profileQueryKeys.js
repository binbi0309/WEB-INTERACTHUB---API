export const PROFILE_QUERY_KEYS = {
  myProfile: ['profile', 'me'],
  myPosts: (pageNumber = 1, pageSize = 20) => ['profile', 'my-posts', pageNumber, pageSize],
}

