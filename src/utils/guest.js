const GUEST_KEY = "da_blog_guest_id"

export function getGuestId() {
  let id = localStorage.getItem(GUEST_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(GUEST_KEY, id)
  }
  return id
}

export function guestHeaders() {
  return { "X-Guest-ID": getGuestId() }
}
