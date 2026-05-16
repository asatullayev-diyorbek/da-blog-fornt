import { useEffect, useRef, useState } from "react"
import { BookOpen, PlayCircle, Eye, MessageCircle } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { useThemeStore } from "../store/theme"
import { getStats } from "../api/blog"

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K"
  return n.toString()
}

function AnimatedStat({ target, label, icon: Icon, dark }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (target === 0) return
    const duration = 1400
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(ease * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border text-center ${
      dark ? "bg-[#131929] border-white/10" : "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00E5FF]/10">
        <Icon size={18} className="text-[#00E5FF]" />
      </div>
      <div>
        <div className={`text-2xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>
          {formatNum(display)}+
        </div>
        <div className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-500"}`}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [stats, setStats] = useState({ posts: 0, courses: 0, views: 0, comments: 0 })

  useEffect(() => {
    getStats().then((r) => setStats(r.data)).catch(() => {})
  }, [])

  const statItems = [
    { key: "posts",    label: "Maqolalar",       icon: BookOpen      },
    { key: "courses",  label: "Kurslar",          icon: PlayCircle    },
    { key: "views",    label: "Ko'rishlar",        icon: Eye           },
    { key: "comments", label: "Izohlar",           icon: MessageCircle },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Helmet><title>Biz haqimizda — DA Blog</title></Helmet>

      {/* Hero */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
          dark ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" : "bg-[#00E5FF]/10 text-cyan-600 border border-cyan-200"
        }`}>
          Biz haqimizda
        </div>

        <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          <span className="text-[#FF3D57]">DA</span>
          <span>Blog</span>
        </h1>

        <p className={`text-lg leading-relaxed max-w-2xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
          DA Blog — bu dasturchilar uchun amaliy bilimlar platformasi. Django, React, DevOps va
          AI yo'nalishlarida bepul va sifatli kontent taqdim etamiz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {statItems.map(({ key, label, icon }) => (
          <AnimatedStat
            key={key}
            target={stats[key]}
            label={label}
            icon={icon}
            dark={dark}
          />
        ))}
      </div>

      {/* Mission */}
      <div className={`rounded-2xl border p-8 md:p-10 ${
        dark ? "bg-[#131929] border-white/10" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
          Maqsadimiz
        </h2>
        <p className={`leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
          O'zbekistonda dasturlash sohasini rivojlantirish va yosh dasturchilarni amaliy
          ko'nikmalar bilan qurollantirish. Har bir maqola va kurs real loyiha tajribasiga
          asoslanib tayyorlanadi — nazariya emas, amaliyot birinchi o'rinda.
        </p>
      </div>
    </div>
  )
}
