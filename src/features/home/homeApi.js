import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export async function getFeed({ pageNumber = 1, pageSize = 20 } = {}) {
  const response = await axiosClient.get(endPoints.POST_FEED, {
    params: { pageNumber, pageSize },
  })
  return response.data
}

export async function createPost(payload) {
  const response = await axiosClient.post(endPoints.POST_CREATE, payload)
  return response.data
}

export async function toggleLikePost(postId) {
  const response = await axiosClient.post(`${endPoints.POST_TOGGLE_LIKE}/${postId}`)
  return response.data
}

export async function updatePost({ postId, payload }) {
  const response = await axiosClient.put(`${endPoints.POST_UPDATE}/${postId}`, payload)
  return response.data
}

export async function deletePost(postId) {
  const response = await axiosClient.delete(`${endPoints.POST_DELETE}/${postId}`)
  return response.data
}

export async function reportPost(payload) {
  const response = await axiosClient.post(endPoints.REPORT_CREATE_POST, payload)
  return response.data
}

export async function getMyProfile() {
  const response = await axiosClient.get(endPoints.PROFILE_ME)
  return response.data
}

export async function getProfileByUserId(userId) {
  const response = await axiosClient.get(`/api/Profile/GetByUserId/${userId}`)
  return response.data
}

export async function getAllActiveUsers() {
  const response = await axiosClient.get(endPoints.USER_ACTIVE)
  return response.data
}

export async function getFollowingUsers() {
  const response = await axiosClient.get(endPoints.FRIEND_GET_FOLLOWING)
  return response.data
}

export async function followUser(targetUserId) {
  const response = await axiosClient.post(endPoints.FRIEND_FOLLOW, { targetUserId })
  return response.data
}

export async function unfollowUser(targetUserId) {
  const response = await axiosClient.post(endPoints.FRIEND_UNFOLLOW, { targetUserId })
  return response.data
}

