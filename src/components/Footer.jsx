import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowRight } from "lucide-react"
import { useThemeStore } from "../store/theme"

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.67l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.889z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const SOCIALS = [
  { href: "#", label: "Telegram",  Icon: TelegramIcon,  hoverLight: "hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200",   hoverDark: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30" },
  { href: "#", label: "YouTube",   Icon: YouTubeIcon,   hoverLight: "hover:bg-red-50 hover:text-red-600 hover:border-red-200",       hoverDark: "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30" },
  { href: "#", label: "Instagram", Icon: InstagramIcon, hoverLight: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200",    hoverDark: "hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30" },
  { href: "#", label: "LinkedIn",  Icon: LinkedInIcon,  hoverLight: "hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200",       hoverDark: "hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30" },
]

export default function Footer() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail("")
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <footer className={`relative border-t ${
      dark ? "border-white/[0.07] bg-[#060a12]" : "border-slate-200 bg-slate-50"
    }`}>

      {dark && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-20">

          {/* Left — Brand + social */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <img src="/logo-small.png" alt="ChaqimchiAI" className="h-11 w-auto object-contain" />
              <div className="flex flex-col leading-none gap-[3px]">
                <span className={`font-extrabold text-[17px] tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                  Chaqimchi<span className="text-blue-500">AI</span>
                </span>
                <span className="text-[13px] font-bold text-white bg-blue-600 rounded-md px-1.5 py-[2px] text-center tracking-wide">
                  academy
                </span>
              </div>
            </Link>

            <p className={`text-sm leading-relaxed mb-7 max-w-[340px] ${dark ? "text-slate-500" : "text-slate-500"}`}>
              O'zbek tilida AI, dasturlash va zamonaviy texnologiyalarni o'rgatuvchi platforma. Kelajakni bugun quring.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon, hoverLight, hoverDark }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                    dark
                      ? `border-white/10 bg-white/4 text-slate-500 ${hoverDark}`
                      : `border-slate-200 bg-white text-slate-400 ${hoverLight}`
                  }`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Newsletter */}
          <div className={`rounded-2xl p-6 border ${
            dark ? "border-white/8 bg-white/3" : "border-slate-200 bg-white"
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              dark ? "bg-blue-600/15" : "bg-blue-50"
            }`}>
              <Mail size={18} className="text-blue-600" />
            </div>

            <h4 className={`font-bold text-[16px] mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
              Yangiliklar bilan doim xabardor bo'ling
            </h4>
            <p className={`text-sm leading-relaxed mb-5 ${dark ? "text-slate-500" : "text-slate-500"}`}>
              Yangi kurslar, maqolalar va AI yangiliklari to'g'ridan-to'g'ri email manzilingizga.
            </p>

            {sent ? (
              <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
                dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Muvaffaqiyatli yuborildi! Rahmat.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@manzil.com"
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    dark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400"
                  }`}
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shrink-0"
                >
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          dark ? "border-white/[0.06]" : "border-slate-200"
        }`}>
          <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
            © {new Date().getFullYear()} ChaqimchiAI Academy. Barcha huquqlar himoyalangan.
          </span>
          <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
            O'zbekistonda yaratilgan 🇺🇿
          </span>
        </div>
      </div>
    </footer>
  )
}
