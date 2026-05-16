import api from "./axios"

export const getPosts = (params) => api.get("/posts/", { params })
export const getFeaturedPost = () => api.get("/posts/featured/")
export const getPost = (slug) => api.get(`/posts/${slug}/`)
export const getCategories = () => api.get("/categories/")
export const getTags = () => api.get("/tags/")
export const getComments = (slug) => api.get(`/posts/${slug}/comments/`)
export const postComment = (slug, data) => api.post(`/posts/${slug}/comments/`, data)
export const recordView = (slug) => api.post(`/posts/${slug}/view/`)
export const getStats = () => api.get("/stats/")
