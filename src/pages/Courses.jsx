import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { GraduationCap, X } from "lucide-react"
import { getCourses } from "../api/courses"
import { getCategories } from "../api/blog"
import CourseCard from "../components/CourseCard"
import Loader from "../components/Loader"
import { useThemeStore } from "../store/theme"

const levels = ["Boshlang'ich", "O'rta", "Yuqori"]
const prices = ["Bepul", "Pullik"]

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

  const chip = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
      active
        ? "bg-[#00E5FF] text-[#0B0F19]"
        : dark
          ? "bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20"
          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
    }`

  const divider = (
    <span className={`w-px h-5 shrink-0 self-center ${dark ? "bg-white/10" : "bg-slate-200"}`} />
  )

  const fetchCourses = (cat, lvl, price, pg, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = { page: pg }
    if (cat) params.category = cat
    if (lvl) params.level = lvl
    if (price) params.price = price

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
    setPage(1)
    fetchCourses(activeCategory, activeLevel, activePrice, 1, false)
  }, [activeCategory, activeLevel, activePrice])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchCourses(activeCategory, activeLevel, activePrice, next, true)
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet><title>Kurslar — DA Blog</title></Helmet>

      {/* ── Title + filter row ── */}
      <div className={`flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b ${
        dark ? "border-white/[0.07]" : "border-slate-200"
      }`}>

        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            dark ? "bg-[#00E5FF]/10" : "bg-sky-50"
          }`}>
            <GraduationCap size={18} className="text-[#00E5FF]" />
          </div>
          <h1 className={`text-2xl font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>
            Barcha kurslar
          </h1>
          <span className={`text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>
            · {courses.length} ta
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setActiveCategory(null)} className={chip(activeCategory === null)}>
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
              className={chip(activeCategory === cat.id)}
            >
              {cat.name}
            </button>
          ))}

          {divider}

          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl === activeLevel ? null : lvl)}
              className={chip(activeLevel === lvl)}
            >
              {lvl}
            </button>
          ))}

          {divider}

          {prices.map((p) => (
            <button
              key={p}
              onClick={() => setActivePrice(p === activePrice ? null : p)}
              className={chip(activePrice === p)}
            >
              {p}
            </button>
          ))}

          {hasFilter && (
            <>
              {divider}
              <button
                onClick={() => { setActiveCategory(null); setActiveLevel(null); setActivePrice(null) }}
                className={`flex items-center gap-1 text-[11px] transition-colors ${
                  dark ? "text-slate-500 hover:text-[#00E5FF]" : "text-slate-400 hover:text-[#00E5FF]"
                }`}
              >
                <X size={11} /> Tozalash
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Course grid ── */}
      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>

          {hasNext && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  dark
                    ? "bg-white/8 text-slate-300 hover:bg-white/12"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:opacity-50`}
              >
                {loadingMore && <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                {loadingMore ? "Yuklanmoqda..." : "Ko'proq ko'rish"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={`text-center py-20 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          Bu filtr bo'yicha kurs topilmadi.
        </div>
      )}
    </div>
  )
}
