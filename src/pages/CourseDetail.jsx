import { useParams, Link } from "react-router-dom"
import NotFound from "./NotFound"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, BookOpen, Clock, Users, Lock, Play } from "lucide-react"
import { getCourse } from "../api/courses"
import { mediaUrl, authorName } from "../utils/media"
import { useThemeStore } from "../store/theme"
import Loader from "../components/Loader"
import MarkdownProse from "../components/MarkdownProse"

export default function CourseDetail() {
  const { slug } = useParams()
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getCourse(slug)
      .then((res) => setCourse(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (course?.title) {
      document.title = `${course.title} — DA Blog`
    }
    return () => { document.title = "DA Blog" }
  }, [course?.title])

  if (loading) return <Loader />
  if (notFound || !course) return <NotFound />

  const courseLessons = [...(course.lessons ?? [])].sort((a, b) => a.order - b.order)
  const freeLessons = courseLessons.filter((l) => l.is_free)
  const isFree = course.price === "Bepul"

  const levelColor = {
    "Boshlang'ich": dark
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
      : "text-emerald-700 bg-emerald-50 border-emerald-200",
    "O'rta": dark
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      : "text-amber-700 bg-amber-50 border-amber-200",
    "Yuqori": dark
      ? "text-[#FF3D57] bg-[#FF3D57]/10 border-[#FF3D57]/30"
      : "text-rose-700 bg-rose-50 border-rose-200",
  }

  const sidebarBg  = dark ? "bg-[#131929] border-white/10"  : "bg-white border-slate-200 shadow-sm"
  const statsBg    = dark ? "bg-[#131929] border-white/10"  : "bg-white border-slate-200 shadow-sm"
  const statsBorder = dark ? "border-white/10" : "border-slate-200"
  const dividerCls = dark ? "divide-white/5" : "divide-slate-100"

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>{course.title} — DA Blog</title>
        <meta name="description" content={course.short_description} />
        <meta property="og:title" content={`${course.title} — DA Blog`} />
        <meta property="og:description" content={course.short_description} />
        <meta property="og:image" content={course.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Link
        to="/courses"
        className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors ${
          dark ? "text-slate-400 hover:text-[#00E5FF]" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <ArrowLeft size={16} /> Kurslarga qaytish
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className={`rounded-2xl overflow-hidden aspect-video mb-8 border ${
            dark ? "border-white/10" : "border-slate-200"
          }`}>
            <img src={mediaUrl(course.cover)} alt={course.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              dark ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30" : "bg-sky-50 text-sky-700 border-sky-200"
            }`}>{course.category?.name}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              levelColor[course.level] ?? (dark ? "text-slate-400 bg-white/5 border-white/10" : "text-slate-600 bg-slate-100 border-slate-200")
            }`}>{course.level}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              isFree
                ? dark ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                : dark ? "bg-[#FF3D57]/20 text-[#FF3D57] border-[#FF3D57]/30" : "bg-rose-50 text-rose-700 border-rose-200"
            }`}>{course.price}</span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>{course.title}</h1>
          <MarkdownProse className={`text-lg mb-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {course.short_description}
          </MarkdownProse>

          <div className={`grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-5 rounded-xl border mb-8 ${statsBg}`}>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>{course.lessons_count}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                <BookOpen size={11} /> Lesson
              </div>
            </div>
            <div className={`text-center border-x ${statsBorder}`}>
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>{course.duration}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                <Clock size={11} /> Davomiyligi
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>{course.students?.toLocaleString()}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                <Users size={11} /> O'quvchi
              </div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-1">
          <div className={`sticky top-24 border rounded-2xl overflow-hidden ${sidebarBg}`}>
            <div className={`p-5 border-b ${dark ? "border-white/10" : "border-slate-100"}`}>
              <h2 className={`font-bold text-lg mb-1 ${dark ? "text-white" : "text-slate-900"}`}>Kurs dasturi</h2>
              <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {courseLessons.length} ta lesson · {course.duration}
              </p>
            </div>

            <div className={`divide-y max-h-[600px] overflow-y-auto ${dividerCls}`}>
              {courseLessons.map((lesson, idx) => {
                const canAccess = lesson.is_free || isFree
                return canAccess ? (
                  <Link
                    key={lesson.id}
                    to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className={`flex items-center gap-3 px-5 py-4 transition-colors group ${
                      dark ? "hover:bg-white/5" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full text-[#00E5FF] text-xs flex items-center justify-center shrink-0 transition-colors
                      group-hover:bg-[#00E5FF] group-hover:text-[#0B0F19] ${
                      dark ? "bg-[#00E5FF]/10 border border-[#00E5FF]/30" : "bg-sky-50 border border-sky-200"
                    }`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate transition-colors ${
                        dark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"
                      }`}>{lesson.title}</p>
                      <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{lesson.duration}</p>
                    </div>
                    <Play size={13} className={`shrink-0 transition-colors group-hover:text-[#00E5FF] ${dark ? "text-slate-600" : "text-slate-400"}`} />
                  </Link>
                ) : (
                  <div key={lesson.id} className="flex items-center gap-3 px-5 py-4 opacity-50 cursor-not-allowed">
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${
                      dark ? "bg-white/5 border border-white/10 text-slate-500" : "bg-slate-100 border border-slate-200 text-slate-400"
                    }`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{lesson.title}</p>
                      <p className={`text-xs mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{lesson.duration}</p>
                    </div>
                    <Lock size={13} className={dark ? "text-slate-600 shrink-0" : "text-slate-400 shrink-0"} />
                  </div>
                )
              })}
            </div>

            {!isFree && (
              <div className={`p-5 border-t ${dark ? "border-white/10" : "border-slate-100"}`}>
                <button className="w-full py-3 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-colors">
                  Kursga yozilish
                </button>
                <p className={`text-center text-xs mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  {freeLessons.length} ta lesson bepul ko'rish mumkin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
