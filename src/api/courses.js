import api from "./axios"

export const getCourses = (params) => api.get("/courses/", { params })
export const getCourse = (slug) => api.get(`/courses/${slug}/`)
export const getLesson = (courseSlug, lessonSlug) =>
  api.get(`/courses/${courseSlug}/lessons/${lessonSlug}/`)
