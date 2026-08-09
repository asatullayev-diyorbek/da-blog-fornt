import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("da_blog_access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem("da_blog_refresh_token")
    if (error.response?.status === 401 && refresh && !original?._retry) {
      original._retry = true
      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, { refresh })
        localStorage.setItem("da_blog_access_token", response.data.access)
        original.headers.Authorization = `Bearer ${response.data.access}`
        return api(original)
      } catch {
        localStorage.removeItem("da_blog_access_token")
        localStorage.removeItem("da_blog_refresh_token")
      }
    }
    return Promise.reject(error)
  },
)

export default api
