import axios from 'axios'

const axiosClient = axios.create({
  // In development, use Vite proxy (/_api) to avoid CORS issues with cookie-based auth.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/_api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosClient
