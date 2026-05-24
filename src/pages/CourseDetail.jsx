import { useParams, Link } from "react-router-dom"
import NotFound from "./NotFound"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, BookOpen, Clock, Users, Lock, Play, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { getCourse } from "../api/courses"
import { mediaUrl, authorName } from "../utils/media"
import { useThemeStore } from "../store/theme"
import Loader from "../components/Loader"
import MarkdownProse from "../components/MarkdownProse"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const levelColor = {
  "Boshlang'ich": "bg-emerald-500/20 text-emerald-300",
  "O'rta":        "bg-amber-500/20 text-amber-300",
  "Yuqori":       "bg-rose-500/20 text-rose-300",
}

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

  if (loading) return <Loader />
  if (notFound || !course) return <NotFound />

  const courseLessons = [...(course.lessons ?? [])].sort((a, b) => a.order - b.order)
  const freeLessons   = courseLessons.filter((l) => l.is_free)
  const isFree        = course.price === "Bepul"

  return (
    <>
      <Helmet>
        <title>{course.title} — ChaqimchiAI Academy</title>
        <meta name="description"        content={course.short_description} />
        <meta property="og:title"       content={`${course.title} — ChaqimchiAI Academy`} />
        <meta property="og:description" content={course.short_description} />
        <meta property="og:image"       content={mediaUrl(course.cover)} />
        <meta property="og:url"         content={window.location.href} />
        <meta property="og:type"        content="website" />
      </Helmet>

      {/* ── Cover ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl">
          <img
            src={mediaUrl(course.cover)}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Back button */}
          <div className="absolute top-5 left-4 sm:left-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/60 transition-colors border border-white/15"
            >
              <ArrowLeft size={15} /> Kurslar
            </Link>
          </div>

          {/* Bottom overlay: badges + title + instructor */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-7">
            <div className="flex flex-wrap gap-2 mb-3">
              {course.category && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                  {course.category.name}
                </span>
              )}
              {course.level && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  levelColor[course.level] ?? "bg-white/15 text-white/80"
                }`}>
                  {course.level}
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isFree ? "bg-emerald-500/25 text-emerald-300" : "bg-rose-500/25 text-rose-300"
              }`}>
                {isFree ? "Bepul" : "Pullik"}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-lg mb-4">
              {course.title}
            </h1>

            {course.instructor && (
              <div className="flex items-center gap-2.5">
                {mediaUrl(course.instructor.avatar) ? (
                  <img
                    src={mediaUrl(course.instructor.avatar)}
                    alt={authorName(course.instructor)}
                    className="w-8 h-8 rounded-full ring-2 ring-white/40 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full ring-2 ring-white/40 bg-slate-600 flex items-center justify-center shrink-0">
                    <GraduationCap size={14} className="text-white" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-white/50 leading-tight">O'qituvchi</p>
                  <p className="text-sm font-semibold text-white leading-tight">
                    {authorName(course.instructor)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Left ── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Short description */}
            <motion.div variants={fadeUp}>
              <MarkdownProse className={`text-base ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {course.short_description}
              </MarkdownProse>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className={`grid grid-cols-3 rounded-2xl border overflow-hidden ${
                dark ? "bg-[#0e1726] border-white/8" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {[
                { icon: BookOpen, value: course.lessons_count,              label: "Lesson"      },
                { icon: Clock,    value: course.duration,                   label: "Davomiyligi" },
                { icon: Users,    value: course.students?.toLocaleString(), label: "O'quvchi"    },
              ].map(({ icon: Icon, value, label }, i) => (
                <div
                  key={label}
                  className={`flex flex-col items-center py-6 px-4 text-center ${
                    i > 0 ? (dark ? "border-l border-white/8" : "border-l border-slate-100") : ""
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                    dark ? "bg-blue-600/15" : "bg-blue-50"
                  }`}>
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <div className={`text-xl font-extrabold mb-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
                    {value}
                  </div>
                  <div className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Description (Markdown) */}
            {course.description && (
              <motion.div
                variants={fadeUp}
                className={`p-6 rounded-2xl border ${
                  dark ? "bg-[#0e1726] border-white/8" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <h2 className={`font-bold text-lg mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
                  Kurs haqida
                </h2>
                <MarkdownProse>{course.description}</MarkdownProse>
              </motion.div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`sticky top-24 rounded-2xl border overflow-hidden ${
                dark ? "bg-[#0e1726] border-white/8" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {/* Enroll CTA */}
              {!isFree && (
                <div className={`p-5 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <button
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all"
                    style={{ boxShadow: "0 6px 20px rgba(37,99,235,0.35)" }}
                  >
                    Kursga yozilish
                  </button>
                  {freeLessons.length > 0 && (
                    <p className={`text-center text-xs mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                      {freeLessons.length} ta lesson bepul ko'rish mumkin
                    </p>
                  )}
                </div>
              )}

              {/* Lesson list header */}
              <div className={`px-5 py-4 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
                <h2 className={`font-bold text-base ${dark ? "text-white" : "text-slate-900"}`}>
                  Kurs dasturi
                </h2>
                <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  {courseLessons.length} ta lesson · {course.duration}
                </p>
              </div>

              {/* Lessons */}
              <div className={`divide-y max-h-[500px] overflow-y-auto ${
                dark ? "divide-white/[0.05]" : "divide-slate-100"
              }`}>
                {courseLessons.map((lesson, idx) => {
                  const canAccess = lesson.is_free || isFree
                  return canAccess ? (
                    <Link
                      key={lesson.id}
                      to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className={`flex items-center gap-3 px-5 py-3.5 transition-colors group ${
                        dark ? "hover:bg-white/[0.04]" : "hover:bg-blue-50/60"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                        dark
                          ? "bg-blue-600/15 text-blue-400 group-hover:bg-blue-600 group-hover:text-white"
                          : "bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate transition-colors ${
                          dark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"
                        }`}>{lesson.title}</p>
                        {lesson.duration && (
                          <p className={`text-xs mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                      <Play size={12} className={`shrink-0 transition-colors ${
                        dark ? "text-slate-600 group-hover:text-blue-400" : "text-slate-400 group-hover:text-blue-500"
                      }`} />
                    </Link>
                  ) : (
                    <div key={lesson.id} className={`flex items-center gap-3 px-5 py-3.5 cursor-not-allowed ${
                      dark ? "opacity-40" : "opacity-50"
                    }`}>
                      <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${
                        dark ? "bg-white/5 border border-white/10 text-slate-600" : "bg-slate-100 border border-slate-200 text-slate-400"
                      }`}>{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{lesson.title}</p>
                        {lesson.duration && (
                          <p className={`text-xs mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                      <Lock size={12} className={`shrink-0 ${dark ? "text-slate-700" : "text-slate-400"}`} />
                    </div>
                  )
                })}
              </div>

              {/* Free badge */}
              {isFree && courseLessons.length > 0 && (
                <div className={`p-4 border-t ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <div className={`text-center text-xs font-semibold py-2 px-3 rounded-lg ${
                    dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    Bu kurs bepul — boshlang!
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </>
  )
}
