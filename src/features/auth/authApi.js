import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export async function register(payload) {
  const response = await axiosClient.post(endPoints.AUTH_REGISTER, payload)
  return response.data
}

export async function login(payload) {
  const response = await axiosClient.post(endPoints.AUTH_LOGIN, payload, {
    params: {
      useCookies: true,
      useSessionCookies: false,
    },
    headers: {
      Accept: 'application/json',
    },
  })
  return response.data
}

export async function logout() {
  const response = await axiosClient.post(endPoints.AUTH_LOGOUT, null, {
    headers: {
      Accept: '*/*',
    },
  })
  return response.data
}

export async function getSession() {
  const response = await axiosClient.get(endPoints.AUTH_ME)
  return response.data
}

