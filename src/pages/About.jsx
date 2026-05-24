import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import {
  BookOpen, PlayCircle, Eye, MessageCircle,
  Target, Lightbulb, Users, Zap, Heart, ShieldCheck, ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useThemeStore } from "../store/theme"
import { getStats } from "../api/blog"

// ── helpers ───────────────────────────────────────────────────────────────────
function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K"
  return n.toString()
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedStat({ target, label, icon: Icon, dark }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!target) return
    const duration = 1600
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
    <motion.div
      variants={fadeUp}
      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border text-center ${
        dark ? "bg-white/3 border-white/8" : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
        dark ? "bg-blue-600/15" : "bg-blue-50"
      }`}>
        <Icon size={20} className="text-blue-600" />
      </div>
      <div>
        <div className={`text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {formatNum(display)}+
        </div>
        <div className={`text-xs mt-1 font-medium ${dark ? "text-slate-500" : "text-slate-500"}`}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Target,
    title: "Amaliyot birinchi",
    desc: "Har bir dars real loyihalarga asoslanadi. Nazariya emas — ishlaydigan kod yozishni o'rganasiz.",
    color: "text-blue-600", bg: "bg-blue-50", bgDark: "bg-blue-600/12",
  },
  {
    icon: Lightbulb,
    title: "Sodda tushuntirish",
    desc: "Murakkab mavzularni ham eng oddiy tilda tushuntiramiz. Har kim tushuna oladigan daraja.",
    color: "text-amber-500", bg: "bg-amber-50", bgDark: "bg-amber-500/12",
  },
  {
    icon: Zap,
    title: "AI yordami",
    desc: "Har doim AI assistant yordamida savollarga tez va aniq javob olishingiz mumkin.",
    color: "text-violet-600", bg: "bg-violet-50", bgDark: "bg-violet-600/12",
  },
  {
    icon: Users,
    title: "Jamoa",
    desc: "O'z-o'zidan o'rganmaysiz — tajribali mentorlar va hamfikr talabalar jamoasi bilan birga.",
    color: "text-emerald-600", bg: "bg-emerald-50", bgDark: "bg-emerald-600/12",
  },
  {
    icon: Heart,
    title: "Bepul kontent",
    desc: "Ko'plab kurs va maqolalar bepul. Bilim hamma uchun ochiq bo'lishi kerak.",
    color: "text-rose-500", bg: "bg-rose-50", bgDark: "bg-rose-500/12",
  },
  {
    icon: ShieldCheck,
    title: "Sifat kafolati",
    desc: "Har bir kurs va maqola tajribali mutaxassislar tomonidan tekshirilgan.",
    color: "text-teal-600", bg: "bg-teal-50", bgDark: "bg-teal-600/12",
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function About() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [stats, setStats] = useState({ posts: 0, courses: 0, views: 0, comments: 0 })

  useEffect(() => {
    getStats().then((r) => setStats(r.data)).catch(() => {})
  }, [])

  const statItems = [
    { key: "courses",  label: "Kurslar",      icon: PlayCircle    },
    { key: "posts",    label: "Maqolalar",     icon: BookOpen      },
    { key: "views",    label: "Ko'rishlar",    icon: Eye           },
    { key: "comments", label: "Izohlar",       icon: MessageCircle },
  ]

  return (
    <>
      <Helmet><title>Biz haqimizda — ChaqimchiAI Academy</title></Helmet>

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden border-b ${
        dark ? "bg-[#080d16] border-white/[0.07]" : "bg-white border-slate-200"
      }`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={dark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.25)"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center"
        >
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 ${
            dark ? "bg-blue-600/10 border-blue-500/25 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Biz haqimizda
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 ${
            dark ? "text-white" : "text-slate-900"
          }`}>
            O'zbekistonda eng yaxshi<br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              AI ta'lim platformasi
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}>
            ChaqimchiAI Academy — bu dasturlash, sun'iy intellekt va zamonaviy texnologiyalarni
            O'zbek tilida amaliy va sifatli tarzda o'rgatuvchi platforma.
          </p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className={`py-16 ${dark ? "bg-[#0B0F19]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {statItems.map(({ key, label, icon }) => (
              <AnimatedStat key={key} target={stats[key]} label={label} icon={icon} dark={dark} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Mission + Vision ── */}
      <section className={`py-16 ${dark ? "bg-[#080d16]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                icon: Target,
                title: "Maqsadimiz",
                text: "O'zbekistonda dasturlash va AI sohasini rivojlantirish, yosh avlodga amaliy ko'nikmalar berish. Har bir dars real loyiha tajribasiga asoslanadi — nazariya emas, amaliyot birinchi o'rinda.",
                color: "text-blue-600", bg: dark ? "bg-blue-600/12 border-blue-500/20" : "bg-blue-50 border-blue-100",
              },
              {
                icon: Lightbulb,
                title: "Vazifamiz",
                text: "Sifatli ta'limni hammaga ochiq qilish. Murakkab texnologiyalarni sodda tilda tushuntirish, AI yordamida har bir talabaga shaxsiy o'quv yo'li yaratish.",
                color: "text-indigo-600", bg: dark ? "bg-indigo-600/12 border-indigo-500/20" : "bg-indigo-50 border-indigo-100",
              },
            ].map(({ icon: Icon, title, text, color, bg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`p-8 rounded-2xl border ${bg}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  dark ? "bg-white/8" : "bg-white shadow-sm"
                }`}>
                  <Icon size={22} className={color} />
                </div>
                <h2 className={`text-xl font-bold mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
                  {title}
                </h2>
                <p className={`leading-relaxed text-sm sm:text-base ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  {text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={`py-16 ${dark ? "bg-[#0B0F19]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
              Qadriyatlarimiz
            </h2>
            <p className={`text-sm sm:text-base max-w-lg mx-auto ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Biz ushbu tamoyillar asosida ishlaymiz va har bir qaror shu asosda qabul qilinadi
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {VALUES.map(({ icon: Icon, title, desc, color, bg, bgDark }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`p-6 rounded-2xl border transition-colors ${
                  dark
                    ? "bg-white/3 border-white/8 hover:bg-white/5"
                    : "bg-white border-slate-200 hover:border-blue-200 shadow-sm"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${dark ? bgDark : bg}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className={`font-bold text-[15px] mb-2 ${dark ? "text-slate-100" : "text-slate-800"}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed ${dark ? "text-slate-500" : "text-slate-500"}`}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-16 ${dark ? "bg-[#080d16]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-3xl p-10 md:p-14 text-center border ${
              dark ? "border-blue-500/20 bg-blue-600/8" : "border-blue-100 bg-blue-50"
            }`}
          >
            {/* background glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: dark
                ? "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
            }} />

            <div className="relative">
              <h2 className={`text-2xl sm:text-3xl font-extrabold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
                O'rganishni bugun boshlang
              </h2>
              <p className={`text-sm sm:text-base mb-8 max-w-lg mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Minglab talabalar allaqachon ChaqimchiAI Academy bilan o'rganmoqda. Siz ham qo'shiling!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 active:scale-95 transition-all"
                  style={{ boxShadow: "0 8px 28px rgba(37,99,235,0.35)" }}
                >
                  Kurslarni ko'rish <ArrowRight size={16} />
                </Link>
                <Link
                  to="/blog"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border font-bold text-[15px] transition-all hover:-translate-y-0.5 ${
                    dark
                      ? "border-white/15 text-slate-300 hover:border-blue-500/50 hover:text-white"
                      : "border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  Blogni o'qish
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
