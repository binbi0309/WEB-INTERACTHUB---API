import axiosClient from '../../api/axiosClient'
import endPoints from '../../api/endPoints'

export const getUsers = async () => {
  const response = await axiosClient.get(endPoints.USERS)
  return response.data
}
