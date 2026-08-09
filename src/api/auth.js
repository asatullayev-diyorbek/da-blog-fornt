import api from "./axios"
import { guestHeaders } from "../utils/guest"

export const telegramLogin = (code) => api.post("/auth/telegram/login/", { code })
export const startTelegramAuth = () => api.post("/auth/telegram/auth/start/")
export const getTelegramAuthStatus = (token) => api.get(`/auth/telegram/auth/status/${token}/`)
export const getMe = () => api.get("/auth/me/")
export const claimGuestAttempts = () => api.post("/quizzes/attempts/claim/", {}, { headers: guestHeaders() })
export const getGamification = () => api.get("/quizzes/gamification/me/")
export const getLeaderboard = (period = "all") => api.get("/quizzes/leaderboard/", { params: { period } })
