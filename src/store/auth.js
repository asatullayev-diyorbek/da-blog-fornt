import { create } from "zustand"

const ACCESS_KEY = "da_blog_access_token"
const REFRESH_KEY = "da_blog_refresh_token"

export const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem(ACCESS_KEY),
  refreshToken: localStorage.getItem(REFRESH_KEY),
  user: null,
  setTokens: (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
    set({ accessToken: access, refreshToken: refresh || localStorage.getItem(REFRESH_KEY) })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    set({ accessToken: null, refreshToken: null, user: null })
  },
}))

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY)
