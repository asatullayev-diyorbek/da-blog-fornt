const BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"

export function mediaUrl(path) {
  if (!path) return null
  if (path.startsWith("http")) return path
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`
}

export function authorName(author) {
  if (!author) return ""
  const full = [author.first_name, author.last_name].filter(Boolean).join(" ")
  return full || author.username || ""
}
