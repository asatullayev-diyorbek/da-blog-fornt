import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, ExternalLink, LoaderCircle, Send, XCircle } from "lucide-react"
import { claimGuestAttempts, getTelegramAuthStatus, startTelegramAuth } from "../api/auth"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dark = useThemeStore((state) => state.theme) === "dark"
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")
  const tokenRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => () => clearInterval(intervalRef.current), [])

  async function handleTelegramLogin() {
    // Telegram popup oyna emas, brauzerda yonma-yon yangi tab sifatida ochiladi.
    const popup = window.open("about:blank", "_blank")
    setStatus("starting")
    setError("")
    try {
      const response = await startTelegramAuth()
      const { token, deep_link: deepLink } = response.data
      tokenRef.current = token
      if (popup) popup.location.href = deepLink
      else window.open(deepLink, "_blank")
      setStatus("waiting")
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => pollStatus(token), 1500)
    } catch (requestError) {
      popup?.close()
      setStatus("idle")
      setError(requestError.response?.data?.detail || "Telegram loginni boshlashda xatolik yuz berdi.")
    }
  }

  async function pollStatus(token) {
    try {
      const response = await getTelegramAuthStatus(token)
      if (response.data.status === "confirmed") {
        clearInterval(intervalRef.current)
        setTokens(response.data.access, response.data.refresh)
        setUser(response.data.user)
        setStatus("success")
        await claimGuestAttempts().catch(() => {})
        navigate(location.state?.from || "/profile")
      } else if (response.data.status === "rejected" || response.data.status === "expired") {
        clearInterval(intervalRef.current)
        setStatus(response.data.status)
      }
    } catch {
      // Temporary network errors should not cancel the login polling.
    }
  }

  const statusText = {
    starting: "Login link tayyorlanmoqda...",
    waiting: "Telegram botdagi tasdiqni kutyapmiz...",
    success: "Tasdiqlandi, kirilmoqda...",
    rejected: "Login bekor qilindi.",
    expired: "Login link muddati tugadi. Qaytadan urinib ko‘ring.",
  }[status]

  return <div className="max-w-md mx-auto px-4 py-14"><div className={`rounded-2xl border p-6 sm:p-8 ${dark ? "bg-[#0e1726] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}><div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-5"><Send size={22} /></div><h1 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>Telegram orqali kirish</h1><p className={`text-sm mt-2 mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>Telegram botda kirishni tasdiqlang — saytga avtomatik kirasiz.</p><button onClick={handleTelegramLogin} disabled={status === "starting" || status === "waiting"} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:opacity-50">{status === "starting" || status === "waiting" ? <LoaderCircle size={17} className="animate-spin" /> : <ExternalLink size={17} />} {status === "waiting" ? "Telegram tasdig‘i kutilmoqda..." : "Telegram orqali kirish"}</button>{statusText && <div className={`mt-5 flex items-center justify-center gap-2 text-sm ${status === "success" ? "text-emerald-500" : status === "rejected" || status === "expired" ? "text-rose-500" : dark ? "text-slate-300" : "text-slate-600"}`}>{status === "success" ? <CheckCircle2 size={16} /> : status === "rejected" || status === "expired" ? <XCircle size={16} /> : <LoaderCircle size={16} className="animate-spin" />} {statusText}</div>}{error && <p className="text-sm text-rose-500 text-center mt-4">{error}</p>}<p className={`text-xs text-center mt-6 ${dark ? "text-slate-500" : "text-slate-400"}`}>Tugmani bosgach, Telegram’da “Ha, kirish” tugmasini bosing.</p></div></div>
}
