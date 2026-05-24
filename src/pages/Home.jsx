import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Code2, Globe, Smartphone, BrainCircuit, Database, Shield,
  BookOpen, Layers, RefreshCw, Award, FlaskConical,
  ArrowRight, ChevronRight, Play, FileText, Cpu,
} from "lucide-react"
import { useThemeStore } from "../store/theme"
import { getCourses } from "../api/courses"
import { getPosts } from "../api/blog"
import { mediaUrl } from "../utils/media"
import PostCard from "../components/PostCard"
import CourseCard from "../components/CourseCard"
import Loader from "../components/Loader"

// ── Laptop + floating elements illustration ───────────────────────────────────
function LaptopIllustration({ dark }) {
  const files = ["main.py", "models.py", "views.py", "utils.py", "README.md"]

  return (
    <div className="relative w-full max-w-[580px] select-none">

      {/* Background glow blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "540px", height: "540px",
          background: dark ? "rgba(37,99,235,0.22)" : "rgba(59,130,246,0.14)",
          filter: "blur(100px)",
        }}
      />

      {/* SVG glowing rings */}
      <svg
        className="absolute -bottom-2 left-0 right-0 w-full pointer-events-none"
        height="90"
        viewBox="0 0 580 90"
      >
        <defs>
          <filter id="rg">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse cx="290" cy="72" rx="272" ry="40" fill="none" stroke="#3B82F6" strokeWidth="1.8" opacity="0.65" filter="url(#rg)" />
        <ellipse cx="290" cy="72" rx="214" ry="30" fill="none" stroke="#60A5FA" strokeWidth="1.4" opacity="0.45" filter="url(#rg)" />
        <ellipse cx="290" cy="72" rx="152" ry="22" fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Floating </> badge */}
      <div className="absolute -top-4 right-8 z-20">
        <div className="px-3.5 py-2 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/40">
          <span className="text-white font-extrabold font-mono text-base">{"</>"}</span>
        </div>
      </div>

      {/* Floating { } left */}
      <div className="absolute top-[28%] -left-3 z-20">
        <div className={`px-3 py-2 rounded-2xl font-mono font-bold text-base shadow-lg border ${
          dark
            ? "bg-[#0d1a2e] text-blue-400 border-slate-700"
            : "bg-white text-blue-600 border-slate-200"
        }`}>
          {"{  }"}
        </div>
      </div>

      {/* Floating <> right-bottom */}
      <div className="absolute bottom-[22%] -right-1 z-20">
        <div className={`px-2.5 py-1.5 rounded-xl font-mono font-bold text-sm shadow border ${
          dark
            ? "bg-[#0d1a2e] text-blue-300 border-slate-700"
            : "bg-white text-blue-500 border-slate-200"
        }`}>
          {"<>"}
        </div>
      </div>

      {/* Laptop */}
      <div className="relative z-10">
        {/* Screen */}
        <div
          className={`mx-auto rounded-t-2xl overflow-hidden shadow-2xl border-t border-x ${
            dark ? "border-slate-600" : "border-slate-400"
          }`}
          style={{ width: "94%" }}
        >
          {/* Titlebar */}
          <div className="h-8 flex items-center gap-2 px-3 bg-slate-800">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="mx-auto text-[11px] text-slate-400">main.py</span>
          </div>

          {/* Editor body */}
          <div className="flex" style={{ height: "215px", background: "#0f172a" }}>
            {/* File tree */}
            <div
              className="shrink-0 p-2 border-r border-slate-800"
              style={{ width: "112px", background: "#1e293b" }}
            >
              <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">
                Explorer
              </p>
              {files.map((f, i) => (
                <div
                  key={f}
                  className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded mb-0.5 text-[11px] ${
                    i === 0
                      ? "bg-blue-600/20 text-blue-300"
                      : "text-slate-500"
                  }`}
                >
                  <span className="text-[9px]">{i === 4 ? "📝" : "🐍"}</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Code content */}
            <div className="flex-1 p-4 overflow-hidden font-mono text-xs leading-6">
              <div className="text-slate-300">
                <div>
                  <span className="text-purple-400">def</span>{" "}
                  <span className="text-yellow-300">greet</span>
                  <span className="text-white">():</span>
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">message</span>
                  <span className="text-white"> = </span>
                  <span className="text-green-400">"Kod yozing,"</span>
                </div>
                <div className="pl-4">
                  <span className="text-green-400 pl-10">"AI bilan rivojlaning."</span>
                </div>
                <div className="pl-4">
                  <span className="text-yellow-300">print</span>
                  <span className="text-white">(message)</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">return</span>
                  <span className="text-orange-400"> True</span>
                </div>
                <div className="mt-1 text-slate-600">{"# ─────────────────────"}</div>
                <div>
                  <span className="text-purple-400">if</span>
                  <span className="text-white"> __name__ == </span>
                  <span className="text-green-400">"__main__"</span>
                  <span className="text-white">:</span>
                </div>
                <div className="pl-4">
                  <span className="text-yellow-300">greet</span>
                  <span className="text-white">()</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard base */}
        <div
          className={`mx-auto rounded-b-2xl border-x border-b ${
            dark ? "bg-slate-600 border-slate-600" : "bg-slate-400 border-slate-400"
          }`}
          style={{ width: "94%", height: "18px" }}
        />
        {/* Trackpad strip */}
        <div
          className="mx-auto mt-0.5"
          style={{
            width: "52%", height: "4px", borderRadius: "99px",
            background: dark ? "#475569" : "#9ca3af",
          }}
        />
      </div>

      {/* AI Assistant bubble */}
      <div className="absolute right-0 z-20" style={{ bottom: "56px" }}>
        <div className={`w-44 rounded-2xl p-3.5 shadow-2xl border ${
          dark
            ? "bg-[#111c35] border-slate-700"
            : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-[8px] font-extrabold">AI</span>
            </div>
            <span className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
              AI Assistant
            </span>
            <span className="ml-auto text-[10px] text-blue-400">✦✦</span>
          </div>
          <p className={`text-[11px] leading-snug mb-2.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Yordam kerakmi?
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Data constants ─────────────────────────────────────────────────────────────
const HERO_FEATURES = [
  { icon: FileText, label: "Amaliyotga yo'naltirilgan konspektlar" },
  { icon: Cpu,      label: "AI yordamida o'rganish" },
  { icon: Layers,   label: "Zamonaviy texnologiyalar" },
  { icon: Play,     label: "Sifatli va tushunarli darslar" },
]

const YO_NALISHLAR = [
  { icon: Code2,       label: "Dasturlash",           color: "text-blue-600",   bg: "bg-blue-50",   bgDark: "bg-blue-600/10",   route: "/yo-nalishlar" },
  { icon: Globe,       label: "Web Development",      color: "text-cyan-600",   bg: "bg-cyan-50",   bgDark: "bg-cyan-600/10",   route: "/yo-nalishlar" },
  { icon: Smartphone,  label: "Mobil Development",    color: "text-violet-600", bg: "bg-violet-50", bgDark: "bg-violet-600/10", route: "/yo-nalishlar" },
  { icon: BrainCircuit,label: "AI & Machine Learning",color: "text-emerald-600",bg: "bg-emerald-50",bgDark: "bg-emerald-600/10",route: "/yo-nalishlar" },
  { icon: Database,    label: "Ma'lumotlar Bazasi",   color: "text-orange-600", bg: "bg-orange-50", bgDark: "bg-orange-600/10", route: "/yo-nalishlar" },
  { icon: Shield,      label: "Cyber Security",       color: "text-red-600",    bg: "bg-red-50",    bgDark: "bg-red-600/10",    route: "/yo-nalishlar" },
]

const STATIC_COURSES = [
  { id: "s1", title: "Python Dasturlash",      level: "Boshlang'ich → Ilg'or", icon: Code2,        color: "text-yellow-500", bg: "bg-yellow-50", bgDark: "bg-yellow-500/10", slug: "python" },
  { id: "s2", title: "Frontend Development",   level: "Boshlang'ich → Ilg'or", icon: Layers,       color: "text-blue-500",   bg: "bg-blue-50",   bgDark: "bg-blue-500/10",   slug: "frontend" },
  { id: "s3", title: "Artificial Intelligence",level: "Boshlang'ich → Ilg'or", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50", bgDark: "bg-purple-500/10", slug: "ai" },
  { id: "s4", title: "Backend Development",    level: "Boshlang'ich → Ilg'or", icon: Database,     color: "text-green-500",  bg: "bg-green-50",  bgDark: "bg-green-500/10",  slug: "backend" },
]

const NIMA_UCHUN = [
  { icon: BookOpen,   label: "Sifatli kontent",      desc: "Tajribali mentorlar tomonidan yaratilgan darslar",     color: "text-blue-600",   bg: "bg-blue-50",   bgDark: "bg-blue-600/12" },
  { icon: FlaskConical,label:"Amaliyot ustuvor",     desc: "Ko'proq amaliyot, kamroq nazariya",                    color: "text-emerald-600",bg: "bg-emerald-50",bgDark: "bg-emerald-600/12" },
  { icon: Cpu,        label: "AI yordam 24/7",        desc: "Savollarga AI doim javob beradi",                      color: "text-violet-600", bg: "bg-violet-50", bgDark: "bg-violet-600/12" },
  { icon: RefreshCw,  label: "Doimiy yangillanish",  desc: "Eng so'ngi texnologiyalar",                            color: "text-orange-600", bg: "bg-orange-50", bgDark: "bg-orange-600/12" },
  { icon: Award,      label: "Sertifikat va natija",  desc: "Amaliy loyihalar va sertifikatlar",                    color: "text-pink-600",   bg: "bg-pink-50",   bgDark: "bg-pink-600/12" },
]

// ── Animation variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle, dark, center = true }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={`mb-10 ${center ? "text-center" : ""}`}
    >
      <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm sm:text-base ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
      )}
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [courses, setCourses] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  useEffect(() => {
    Promise.all([
      getCourses({ page_size: 4 }),
      getPosts({ page: 1 }),
    ]).then(([cRes, pRes]) => {
      setCourses(cRes.data.results ?? cRes.data)
      const all = pRes.data.results ?? pRes.data
      setPosts(all)
      setHasNext(!!pRes.data.next)
    }).finally(() => setLoading(false))
  }, [])

  const loadMore = () => {
    const next = page + 1
    setLoadingMore(true)
    getPosts({ page: next })
      .then((res) => {
        setPosts((p) => [...p, ...(res.data.results ?? res.data)])
        setHasNext(!!res.data.next)
        setPage(next)
      })
      .finally(() => setLoadingMore(false))
  }

  if (loading) return <Loader />

  const displayCourses = courses.slice(0, 4)

  return (
    <>
      <Helmet><title>ChaqimchiAI Academy</title></Helmet>

      {/* ═══════════════════════════════════════════════════ HERO */}
      <section className={`relative overflow-hidden ${
        dark
          ? "bg-[#080d16]"
          : "bg-white"
      }`}>
        {/* SVG dot grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={dark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.3)"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>

        {/* Right-side blue ambient tint */}
        <div
          className="absolute inset-y-0 right-0 w-[55%] pointer-events-none"
          style={{
            background: dark
              ? "radial-gradient(ellipse at 80% 40%, rgba(37,99,235,0.12) 0%, transparent 65%)"
              : "radial-gradient(ellipse at 80% 40%, rgba(59,130,246,0.09) 0%, transparent 65%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-0 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-4 items-center">

            {/* Left */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="order-2 lg:order-1 pb-10 lg:pb-14"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 ${
                dark
                  ? "bg-blue-600/10 border-blue-500/25 text-blue-400"
                  : "bg-blue-50 border-blue-200 text-blue-600"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                O'zbek tilida AI ta'lim platformasi
              </motion.div>

              <motion.h1 variants={fadeUp} className={`text-5xl sm:text-6xl lg:text-[3.8rem] font-extrabold leading-[1.08] tracking-tight mb-5 ${
                dark ? "text-white" : "text-slate-900"
              }`}>
                Biz bilan<br />
                o'rganing va<br />
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  rivojlaning.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className={`text-base sm:text-[1.05rem] leading-relaxed mb-8 max-w-[440px] ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}>
                AI, dasturlash va zamonaviy texnologiyalarni oson, amaliy va sifatli tarzda o'rganing.
              </motion.p>

              <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 active:scale-95 transition-all"
                  style={{ boxShadow: "0 8px 28px rgba(37,99,235,0.35)" }}
                >
                  Kurslarni ko'rish
                  <ArrowRight size={17} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: header illustration */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              animate="show"
              className="order-1 lg:order-2 flex justify-center lg:justify-end pt-8 lg:pt-0 lg:-mr-20"
            >
              <img
                src="/header.png"
                alt="ChaqimchiAI"
                className="w-full max-w-[1100px] object-contain select-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>

        {/* Feature strip — card grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-12 mt-1"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`flex items-center gap-3 px-5 py-5 rounded-2xl border transition-colors ${
                  dark
                    ? "border-white/8 bg-white/3 hover:bg-white/5"
                    : "border-slate-200 bg-white shadow-sm hover:border-blue-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  dark ? "bg-blue-600/15" : "bg-blue-50"
                }`}>
                  <Icon size={15} className="text-blue-600" />
                </div>
                <span className={`text-[12px] sm:text-[13px] font-medium leading-snug ${
                  dark ? "text-slate-300" : "text-slate-700"
                }`}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════ YO'NALISHLAR */}
      <section className={`py-16 ${dark ? "bg-[#0B0F19]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Yo'nalishlar"
            subtitle="Kelajakka olib boradigan yo'nalishlarni tanlang"
            dark={dark}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {YO_NALISHLAR.map(({ icon: Icon, label, color, bg, bgDark }) => (
              <motion.div
                key={label}
                variants={scaleIn}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${
                  dark
                    ? "border-white/8 bg-white/3"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dark ? bgDark : bg}`}>
                  <Icon size={22} className={color} />
                </div>
                <div className="flex-1">
                  <span className={`font-semibold text-[15px] ${dark ? "text-slate-100" : "text-slate-800"}`}>
                    {label}
                  </span>
                </div>
                <ChevronRight size={16} className={`shrink-0 ${
                  dark ? "text-slate-600" : "text-slate-400"
                }`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ KURSLARIMIZ */}
      <section className={`py-16 ${dark ? "bg-[#080d16]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              title="Kurslarimiz"
              subtitle="Sizga mos kursni tanlang va o'rganishni boshlang"
              dark={dark}
              center={false}
            />
            <Link
              to="/courses"
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 mb-12 transition-colors hover:border-blue-400 hover:text-blue-600 ${
                dark ? "border-white/12 text-slate-300" : "border-slate-300 text-slate-600"
              }`}
            >
              Barcha kurslar <ArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {(displayCourses ?? []).map((course) => (
              <motion.div key={course.id} variants={fadeUp}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              to="/courses"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                dark ? "border-white/12 text-slate-300 hover:border-blue-500 hover:text-blue-400" : "border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              Barcha kurslar <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ NIMA UCHUN BIZ */}
      <section className={`py-16 ${dark ? "bg-[#0B0F19]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Nima uchun biz?"
            subtitle="Sizga eng yaxshi ta'limni berish uchun ishlaymiz"
            dark={dark}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {NIMA_UCHUN.map(({ icon: Icon, label, desc, color, bg, bgDark }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-colors ${
                  dark
                    ? "border-white/8 bg-white/3 hover:bg-white/5"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${dark ? bgDark : bg}`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className={`font-bold text-sm mb-1.5 ${dark ? "text-slate-100" : "text-slate-800"}`}>
                  {label}
                </h3>
                <p className={`text-[12px] leading-snug ${dark ? "text-slate-500" : "text-slate-500"}`}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ SO'NGGI MAQOLALAR */}
      {posts.length > 0 && (
        <section className={`py-16 ${dark ? "bg-[#080d16]" : "bg-slate-50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionTitle
              title="So'nggi maqolalar"
              subtitle="Eng yangi va qiziqarli maqolalar"
              dark={dark}
            />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className={`grid grid-cols-1 sm:grid-cols-2 ${posts.length >= 3 ? "lg:grid-cols-3" : ""} gap-5`}
            >
              {posts.map((p) => (
                <motion.div key={p.id} variants={fadeUp} className="h-full">
                  <PostCard post={p} />
                </motion.div>
              ))}
            </motion.div>
            {hasNext && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    dark ? "bg-white/8 text-slate-300 hover:bg-white/12" : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {loadingMore && <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                  {loadingMore ? "Yuklanmoqda..." : "Ko'proq ko'rish"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
