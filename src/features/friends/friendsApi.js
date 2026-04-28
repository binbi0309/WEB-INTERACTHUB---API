import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export async function getMyFriends() {
  const response = await axiosClient.get(endPoints.FRIEND_GET_FRIENDS)
  return response.data
}

export async function getPendingReceivedRequests() {
  const response = await axiosClient.get(endPoints.FRIEND_GET_PENDING_RECEIVED)
  return response.data
}

export async function getPendingSentRequests() {
  const response = await axiosClient.get(endPoints.FRIEND_GET_PENDING_SENT)
  return response.data
}

export async function getAllActiveUsers() {
  const response = await axiosClient.get(endPoints.USER_ACTIVE)
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

export async function sendFriendRequest(targetUserId) {
  const response = await axiosClient.post(endPoints.FRIEND_SEND_REQUEST, { targetUserId })
  return response.data
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosClient.post(`${endPoints.FRIEND_ACCEPT_REQUEST}/${requestId}`)
  return response.data
}

export async function rejectFriendRequest(requestId) {
  const response = await axiosClient.post(`${endPoints.FRIEND_REJECT_REQUEST}/${requestId}`)
  return response.data
}

