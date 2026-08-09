import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { GraduationCap, X, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getCourses } from "../api/courses"
import { getCategories } from "../api/blog"
import CourseCard from "../components/CourseCard"
import Loader from "../components/Loader"
import { useThemeStore } from "../store/theme"

const LEVELS = ["Boshlang'ich", "O'rta", "Yuqori"]
const PRICES = ["Bepul", "Pullik"]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

function Chip({ dark, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap border ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
          : dark
            ? "bg-white/4 text-slate-400 border-white/8 hover:text-white hover:border-white/20"
            : "bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  )
}

export default function Courses() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const [activeCategory, setActiveCategory] = useState(null)
  const [activeLevel, setActiveLevel] = useState(null)
  const [activePrice, setActivePrice] = useState(null)

  const hasFilter = activeCategory || activeLevel || activePrice

  const fetchCourses = (cat, lvl, price, pg, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = { page: pg }
    if (cat)   params.category = cat
    if (lvl)   params.level    = lvl
    if (price) params.price    = price

    getCourses(params)
      .then((res) => {
        const results = res.data.results ?? res.data
        setCourses((prev) => append ? [...prev, ...results] : results)
        setHasNext(!!res.data.next)
      })
      .finally(() => { setLoading(false); setLoadingMore(false) })
  }

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    // This effect synchronizes the server-backed list with the selected filters.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
    fetchCourses(activeCategory, activeLevel, activePrice, 1, false)
  }, [activeCategory, activeLevel, activePrice])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchCourses(activeCategory, activeLevel, activePrice, next, true)
  }

  const clearAll = () => { setActiveCategory(null); setActiveLevel(null); setActivePrice(null) }

  return (
    <>
      <Helmet><title>Kurslar — ChaqimchiAI Academy</title></Helmet>

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden border-b ${
        dark ? "bg-[#080d16] border-white/[0.07]" : "bg-white border-slate-200"
      }`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="courses-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={dark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.25)"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#courses-dots)" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* Left */}
            <div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-4 ${
                dark ? "bg-blue-600/10 border-blue-500/25 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
              }`}>
                <GraduationCap size={11} />
                Kurslar
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                dark ? "text-white" : "text-slate-900"
              }`}>
                Barcha{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  kurslar
                </span>
              </h1>
            </div>

            {/* Right: count */}
            <div className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
              dark ? "border-white/8 bg-white/3" : "border-slate-200 bg-white shadow-sm"
            }`}>
              <GraduationCap size={15} className="text-blue-600" />
              <span className={`text-sm font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                {courses.length} ta kurs
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Filters + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`flex flex-wrap gap-4 items-start p-5 rounded-2xl border mb-8 ${
            dark ? "border-white/8 bg-white/3" : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <SlidersHorizontal size={15} className={`shrink-0 mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`} />

          <div className="flex flex-wrap gap-4 flex-1">
            {/* Category */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
                Kategoriya
              </span>
              <Chip dark={dark} label="Barchasi" active={!activeCategory} onClick={() => setActiveCategory(null)} />
              {categories.map((cat) => (
                <Chip
                  dark={dark}
                  key={cat.id}
                  label={cat.name}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                />
              ))}
            </div>

            <div className={`w-px self-stretch ${dark ? "bg-white/8" : "bg-slate-200"}`} />

            {/* Level */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
                Daraja
              </span>
              {LEVELS.map((lvl) => (
                <Chip
                  dark={dark}
                  key={lvl}
                  label={lvl}
                  active={activeLevel === lvl}
                  onClick={() => setActiveLevel(activeLevel === lvl ? null : lvl)}
                />
              ))}
            </div>

            <div className={`w-px self-stretch ${dark ? "bg-white/8" : "bg-slate-200"}`} />

            {/* Price */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
                Narx
              </span>
              {PRICES.map((p) => (
                <Chip
                  dark={dark}
                  key={p}
                  label={p}
                  active={activePrice === p}
                  onClick={() => setActivePrice(activePrice === p ? null : p)}
                />
              ))}
            </div>
          </div>

          {hasFilter && (
            <button
              onClick={clearAll}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors shrink-0 mt-1 ${
                dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"
              }`}
            >
              <X size={11} /> Tozalash
            </button>
          )}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : courses.length > 0 ? (
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {courses.map((course) => (
                  <motion.div key={course.id} variants={fadeUp} layout className="h-full">
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasNext && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 hover:-translate-y-0.5 ${
                    dark
                      ? "border-white/10 bg-white/4 text-slate-300 hover:border-blue-500/40 hover:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 shadow-sm"
                  }`}
                >
                  {loadingMore && (
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  )}
                  {loadingMore ? "Yuklanmoqda..." : "Ko'proq ko'rish"}
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              dark ? "bg-white/5" : "bg-slate-100"
            }`}>
              <GraduationCap size={28} className={dark ? "text-slate-600" : "text-slate-400"} />
            </div>
            <p className={`font-semibold text-base mb-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Kurs topilmadi
            </p>
            <p className={`text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>
              Boshqa filtr bilan urinib ko'ring
            </p>
          </motion.div>
        )}
      </div>
    </>
  )
}
