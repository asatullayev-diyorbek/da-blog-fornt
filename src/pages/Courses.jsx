import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, GraduationCap, Search, X, SlidersHorizontal } from "lucide-react"
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

function FilterSelect({ dark, label, value, onChange, options, allLabel }) {
  return (
    <label className={`relative flex min-w-[155px] flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}>
      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</span>
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value || null)} className={`w-full appearance-none bg-transparent pr-5 text-xs font-semibold outline-none ${dark ? "text-slate-200" : "text-slate-700"}`}>
        <option value="">{allLabel}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" />
    </label>
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
  const [search, setSearch] = useState("")

  const hasFilter = activeCategory || activeLevel || activePrice || search

  const fetchCourses = (cat, lvl, price, query, pg, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = { page: pg }
    if (cat)   params.category = cat
    if (lvl)   params.level    = lvl
    if (price) params.price    = price
    if (query.trim()) params.search = query.trim()

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
    fetchCourses(activeCategory, activeLevel, activePrice, search, 1, false)
  }, [activeCategory, activeLevel, activePrice, search])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchCourses(activeCategory, activeLevel, activePrice, search, next, true)
  }

  const clearAll = () => { setActiveCategory(null); setActiveLevel(null); setActivePrice(null); setSearch("") }

  return (
    <>
      <Helmet><title>Kurslar — ChaqimchiAI Academy</title></Helmet>

      {/* ── Filters + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`flex flex-wrap items-center gap-2.5 rounded-2xl border p-3 mb-8 ${
            dark ? "border-white/8 bg-white/3" : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <SlidersHorizontal size={16} className={`mx-1 shrink-0 ${dark ? "text-blue-400" : "text-blue-500"}`} />
          <label className={`relative flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 sm:w-56 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}>
            <Search size={16} className="shrink-0 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kurs qidiring..." className={`w-full bg-transparent text-xs outline-none ${dark ? "text-white placeholder:text-slate-600" : "text-slate-700 placeholder:text-slate-400"}`} />
          </label>
          <div className="flex min-w-0 flex-1 flex-wrap gap-2.5">
            <FilterSelect dark={dark} label="Kategoriya" value={activeCategory} onChange={(value) => setActiveCategory(value ? Number(value) : null)} allLabel="Barcha kategoriyalar" options={categories.map((cat) => ({ value: cat.id, label: cat.name }))} />
            <FilterSelect dark={dark} label="Daraja" value={activeLevel} onChange={setActiveLevel} allLabel="Barcha darajalar" options={LEVELS.map((level) => ({ value: level, label: level }))} />
            <FilterSelect dark={dark} label="Narx" value={activePrice} onChange={setActivePrice} allLabel="Barcha narxlar" options={PRICES.map((price) => ({ value: price, label: price }))} />
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
