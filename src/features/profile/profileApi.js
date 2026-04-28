import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export async function getMyProfile() {
  const response = await axiosClient.get(endPoints.PROFILE_ME)
  return response.data
}

export async function updateMyProfile(payload) {
  const response = await axiosClient.put(endPoints.PROFILE_UPDATE_ME, payload)
  return response.data
}

export async function changePassword(payload) {
  const response = await axiosClient.post(endPoints.PROFILE_CHANGE_PASSWORD, payload)
  return response.data
}

export async function getMyPosts({ pageNumber = 1, pageSize = 20 } = {}) {
  const response = await axiosClient.get(endPoints.POST_MY_POSTS, {
    params: { pageNumber, pageSize },
  })
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

