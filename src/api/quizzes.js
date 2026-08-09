import api from "./axios"
import { guestHeaders } from "../utils/guest"

export const getQuizzes = () => api.get("/quizzes/")
export const getQuiz = (slug) => api.get(`/quizzes/${slug}/`)
export const startQuiz = (slug) => api.post(`/quizzes/${slug}/start/`, {}, { headers: guestHeaders() })
export const submitQuiz = (attemptId, answers) =>
  api.post(`/quizzes/attempts/${attemptId}/submit/`, { answers }, { headers: guestHeaders() })
export const getAttempt = (attemptId) =>
  api.get(`/quizzes/attempts/${attemptId}/`, { headers: guestHeaders() })
export const getMyAttempts = () => api.get("/quizzes/my-attempts/", { headers: guestHeaders() })
export const getArenaQuestions = (topics, count) => api.post("/quizzes/arena/questions/", { topics, count })
export const createArena = (topics, count) => api.post("/quizzes/arena/create/", { topics, count })
export const getArena = (code) => api.get(`/quizzes/arena/${code}/`)
export const joinArena = (code) => api.post(`/quizzes/arena/${code}/join/`)
export const startArena = (code) => api.post(`/quizzes/arena/${code}/start/`)
export const getArenaGame = (code) => api.get(`/quizzes/arena/${code}/play/`)
export const answerArena = (code, questionId, optionId) => api.post(`/quizzes/arena/${code}/play/`, { question_id: questionId, option_id: optionId })
