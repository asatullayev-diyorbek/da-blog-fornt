import { useParams, Link } from "react-router-dom"
import NotFound from "./NotFound"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { ArrowLeft, ArrowRight, Lock, BookOpen, ChevronRight } from "lucide-react"
import { getCourse, getLesson } from "../api/courses"
import { useThemeStore } from "../store/theme"
import CodeBlock from "../components/CodeBlock"
import YoutubeEmbed from "../components/YoutubeEmbed"
import Loader from "../components/Loader"

export default function LessonDetail() {
  const { slug: courseSlug, lessonSlug } = useParams()
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    Promise.all([getCourse(courseSlug), getLesson(courseSlug, lessonSlug)])
      .then(([cRes, lRes]) => {
        setCourse(cRes.data)
        setLesson(lRes.data)
      })
      .catch((err) => {
        if (err.response?.status === 403) setLocked(true)
        else setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [courseSlug, lessonSlug])

  useEffect(() => {
    if (lesson?.title) {
      document.title = `${lesson.title} — DA Blog`
    }
    return () => { document.title = "DA Blog" }
  }, [lesson?.title])

  if (loading) return <Loader />
  if (notFound) return <NotFound />

  const courseLessons = course ? [...(course.lessons ?? [])].sort((a, b) => a.order - b.order) : []
  const lessonIdx = courseLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = lessonIdx > 0 ? courseLessons[lessonIdx - 1] : null
  const nextLesson = lessonIdx < courseLessons.length - 1 ? courseLessons[lessonIdx + 1] : null
  const isCourseAccessible = course?.price === "Bepul"
  const canAccess = !locked && (lesson?.is_free || isCourseAccessible)

  const contentBg = dark ? "bg-[#131929] border-white/10" : "bg-white border-slate-200 shadow-sm"
  const sidebarBg = dark ? "bg-[#131929] border-white/10" : "bg-white border-slate-200 shadow-sm"
  const divider   = dark ? "divide-white/5" : "divide-slate-100"
  const navBorder = dark ? "border-white/10" : "border-slate-200"

  const mdComponents = {
    code({ inline, className, children }) {
      if (inline) {
        return (
          <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
            dark ? "bg-white/10 text-[#00E5FF]" : "bg-slate-100 text-sky-700"
          }`}>{children}</code>
        )
      }
      return <CodeBlock className={className}>{children}</CodeBlock>
    },
    blockquote({ children }) {
      return (
        <blockquote className={`border-l-4 border-[#00E5FF] pl-4 my-4 italic py-3 pr-4 rounded-r-lg ${
          dark ? "text-slate-400 bg-[#00E5FF]/5" : "text-slate-600 bg-sky-50"
        }`}>{children}</blockquote>
      )
    },
    h1: ({ children }) => <h1 className={`text-2xl font-bold mt-8 mb-4 ${dark ? "text-white" : "text-slate-900"}`}>{children}</h1>,
    h2: ({ children }) => (
      <h2 className={`text-xl font-bold mt-6 mb-3 pb-2 border-b ${dark ? "text-white border-white/10" : "text-slate-900 border-slate-200"}`}>{children}</h2>
    ),
    h3: ({ children }) => <h3 className={`text-lg font-semibold mt-5 mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{children}</h3>,
    p: ({ children }) => <p className={`leading-relaxed my-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</p>,
    a: ({ href, children }) => <a href={href} className="text-[#00E5FF] hover:underline" target="_blank" rel="noreferrer">{children}</a>,
    ul: ({ children }) => <ul className={`list-disc list-inside my-3 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ul>,
    ol: ({ children }) => <ol className={`list-decimal list-inside my-3 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ol>,
    th: ({ children }) => (
      <th className={`text-left px-4 py-2 border font-medium ${dark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>{children}</th>
    ),
    td: ({ children }) => <td className={`px-4 py-2 border ${dark ? "border-white/10" : "border-slate-200"}`}>{children}</td>,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className={`flex items-center gap-1.5 text-sm mb-8 flex-wrap ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <Link to="/courses" className="hover:text-[#00E5FF] transition-colors">Kurslar</Link>
        <ChevronRight size={14} />
        <Link to={`/courses/${courseSlug}`} className="hover:text-[#00E5FF] transition-colors">{course?.title}</Link>
        <ChevronRight size={14} />
        <span className={`truncate max-w-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>{lesson?.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {lesson && (
            <div className="mb-6">
              <div className={`flex items-center gap-2 mb-3 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                <span>{lesson.order}-dars</span>
                <span className={dark ? "text-slate-600" : "text-slate-300"}>·</span>
                <span>{lesson.duration}</span>
                {lesson.is_free && (
                  <>
                    <span className={dark ? "text-slate-600" : "text-slate-300"}>·</span>
                    <span className="text-emerald-500 font-medium">Bepul preview</span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl md:text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                {lesson.title}
              </h1>
            </div>
          )}

          {canAccess && lesson ? (
            <div className="mb-8">
              <YoutubeEmbed videoId={lesson.video_id} />
            </div>
          ) : (
            <div className={`mb-8 aspect-video rounded-xl border flex flex-col items-center justify-center gap-4 ${
              dark ? "bg-[#131929] border-white/10" : "bg-slate-100 border-slate-200"
            }`}>
              <Lock size={40} className={dark ? "text-slate-600" : "text-slate-400"} />
              <div className="text-center">
                <p className={`font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Bu lesson qulflangan</p>
                <p className={`text-sm mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Ko'rish uchun kursga yoziling</p>
              </div>
              <Link
                to={`/courses/${courseSlug}`}
                className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-colors"
              >
                Kursga yozilish
              </Link>
            </div>
          )}

          {canAccess && lesson?.content && (
            <div className={`border rounded-2xl p-6 md:p-8 ${contentBg}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>
                {lesson.content}
              </ReactMarkdown>
            </div>
          )}

          <div className={`flex items-center justify-between gap-4 mt-8 pt-8 border-t ${navBorder}`}>
            {prevLesson ? (
              <Link
                to={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                className={`flex items-center gap-2 text-sm transition-colors group ${
                  dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <div>
                  <div className={`text-xs mb-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Oldingi</div>
                  <div className="line-clamp-1">{prevLesson.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link
                to={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                className={`flex items-center gap-2 text-sm transition-colors group text-right ${
                  dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <div>
                  <div className={`text-xs mb-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Keyingi</div>
                  <div className="line-clamp-1">{nextLesson.title}</div>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <div className={`sticky top-24 border rounded-xl overflow-hidden ${sidebarBg}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${dark ? "border-white/10" : "border-slate-100"}`}>
              <BookOpen size={14} className="text-[#00E5FF]" />
              <span className={`text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>Darslar</span>
            </div>
            <div className={`divide-y max-h-[70vh] overflow-y-auto ${divider}`}>
              {courseLessons.map((l, idx) => {
                const isActive = l.slug === lessonSlug
                const accessible = l.is_free || isCourseAccessible

                return accessible ? (
                  <Link
                    key={l.id}
                    to={`/courses/${courseSlug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 px-4 py-3 text-xs transition-colors ${
                      isActive
                        ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                        : dark
                          ? "text-slate-400 hover:text-white hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-medium ${
                      isActive ? "bg-[#00E5FF] text-[#0B0F19]" : dark ? "bg-white/5 text-slate-500" : "bg-slate-100 text-slate-400"
                    }`}>{idx + 1}</span>
                    <span className="line-clamp-2">{l.title}</span>
                  </Link>
                ) : (
                  <div key={l.id} className={`flex items-center gap-3 px-4 py-3 text-xs opacity-50 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${dark ? "bg-white/5" : "bg-slate-100"}`}>
                      <Lock size={9} />
                    </span>
                    <span className="line-clamp-2">{l.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
