import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Clock3, Ghost, Layers3, Search, Sparkles, Swords, Target, Trophy } from "lucide-react"
import { createArena, getMyAttempts, getQuizzes } from "../api/quizzes"
import { useThemeStore } from "../store/theme"
import { useAuthStore } from "../store/auth"
import Loader from "../components/Loader"

function QuizCard({ quiz, dark, completedAttempt }) {
  return (
    <Link to={`/tests/${quiz.slug}`} className={`group relative overflow-hidden rounded-2xl border p-4 transition-colors duration-200 ${dark ? "border-white/8 bg-[#0e1726] hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-950/20" : "border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60"}`}>
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/8 blur-2xl transition-all group-hover:bg-blue-500/20" />
      <div className="relative mb-4 flex items-start justify-between gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 text-blue-600"}`}><BookOpen size={18} /></div><div className="flex items-center gap-2"><span className="rounded-md bg-blue-600 px-2 py-1 text-[9px] font-bold text-white">{quiz.category || "Dasturlash"}</span>{completedAttempt ? <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold tracking-wide ${dark ? "bg-emerald-400/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><CheckCircle2 size={11} /> {completedAttempt.score}%</span> : <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${dark ? "bg-emerald-400/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" /> Ochiq</span>}</div></div>
      <div className="relative"><div className="mb-2 flex flex-wrap items-center gap-2">{quiz.topic && <span className={`text-[10px] font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{quiz.topic}</span>}</div><h2 className={`min-h-[2.8rem] line-clamp-2 text-base font-extrabold leading-snug ${dark ? "text-white" : "text-slate-900"}`}>{quiz.title}</h2>{quiz.description && <p className={`mt-2 line-clamp-1 text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{quiz.description}</p>}</div>
      <div className={`relative mt-4 flex items-center gap-3 border-t pt-3 text-[11px] ${dark ? "border-white/8 text-slate-500" : "border-slate-100 text-slate-400"}`}><span className="inline-flex items-center gap-1"><Target size={13} className="text-blue-500" /> {quiz.questions_count} savol</span>{quiz.time_limit > 0 && <span className="inline-flex items-center gap-1"><Clock3 size={13} className="text-violet-500" /> {Math.ceil(quiz.time_limit / 60)} min</span>}<span className="inline-flex items-center gap-1 font-bold text-amber-500"><Sparkles size={13} /> {quiz.xp_reward || 50} XP</span><span className="ml-auto inline-flex items-center gap-1 font-bold text-blue-500">Boshlash <ArrowRight size={13} /></span></div>
    </Link>
  )
}

export default function Quizzes() {
  const dark = useThemeStore((state) => state.theme) === "dark"
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [arenaOpen, setArenaOpen] = useState(false)
  const [arenaTopics, setArenaTopics] = useState([])
  const [arenaCount, setArenaCount] = useState(10)
  const [arenaLoading, setArenaLoading] = useState(false)
  const [arenaError, setArenaError] = useState("")
  const [arenaReady, setArenaReady] = useState(false)
  const [arenaResult, setArenaResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getQuizzes(),
      getMyAttempts(),
    ])
      .then(([quizRes, attemptsRes]) => {
        setQuizzes(quizRes.data.results ?? quizRes.data)
        setAttempts(attemptsRes.data)
      })
      .catch(() => { setQuizzes([]); setAttempts([]) })
      .finally(() => setLoading(false))
  }, [user])

  const categories = useMemo(() => [...new Set(quizzes.map((quiz) => quiz.category).filter(Boolean))], [quizzes])
  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return quizzes.filter((quiz) => {
      const matchesCategory = category === "all" || quiz.category === category
      const matchesSearch = !query || [quiz.title, quiz.description, quiz.topic, quiz.category].filter(Boolean).join(" ").toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [category, quizzes, search])
  const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.questions_count || 0), 0)
  const topicCount = new Set(quizzes.map((quiz) => quiz.topic).filter(Boolean)).size
  const attemptsByQuiz = useMemo(() => new Map(attempts.map((attempt) => [attempt.quiz_slug, attempt])), [attempts])
  const arenaTopicsList = useMemo(() => [...new Set(quizzes.map((quiz) => quiz.topic).filter(Boolean))].map((topic) => ({ topic, count: quizzes.filter((quiz) => quiz.topic === topic).reduce((sum, quiz) => sum + (quiz.questions_count || 0), 0) })), [quizzes])
  const arenaAvailableQuestions = arenaTopicsList.filter((item) => arenaTopics.includes(item.topic)).reduce((sum, item) => sum + item.count, 0)

  async function createArenaQuestions() {
    setArenaError("")
    setArenaLoading(true)
    try {
      const response = await createArena(arenaTopics, arenaCount)
      setArenaResult(response.data)
      setArenaReady(true)
      navigate(`/arena/${response.data.code}`)
    } catch (requestError) {
      setArenaError(requestError.response?.data?.detail || "Arena savollarini tayyorlashda xatolik yuz berdi.")
    } finally {
      setArenaLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <aside className={`rounded-3xl border p-5 lg:sticky lg:top-24 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}>
          <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${dark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 text-blue-600"}`}><BookOpen size={20} /></div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Academy Tests</p>
          <h1 className={`mt-2 text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>Bilimingizni sinang</h1>
          <p className={`mt-3 text-sm leading-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>Darslarni mustahkamlang va natijangizni darhol ko‘ring.</p>
          <div className={`my-6 grid grid-cols-2 gap-2 border-y py-5 ${dark ? "border-white/8" : "border-slate-100"}`}><div><p className="text-[11px] text-slate-500">Testlar</p><p className={`mt-1 text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{quizzes.length}</p></div><div><p className="text-[11px] text-slate-500">Savollar</p><p className={`mt-1 text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{totalQuestions}</p></div><div><p className="text-[11px] text-slate-500">Mavzular</p><p className={`mt-1 text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{topicCount}</p></div><div><p className="text-[11px] text-slate-500">Rejim</p><p className={`mt-1 text-xl font-black ${user ? "text-blue-500" : "text-violet-500"}`}>{user ? "Member" : "Ghost"}</p></div></div>
          {!user && <div className={`mb-5 rounded-2xl border p-3.5 ${dark ? "border-violet-400/15 bg-violet-400/8" : "border-violet-100 bg-violet-50"}`}><div className="flex items-start gap-2.5"><Ghost size={17} className="mt-0.5 shrink-0 text-violet-500" /><div><p className={`text-xs font-bold ${dark ? "text-violet-200" : "text-violet-700"}`}>Ghost rejim</p><p className={`mt-1 text-[11px] leading-5 ${dark ? "text-violet-300/70" : "text-violet-600"}`}>Login qilmasdan test ishlayapsiz. Natijalarni saqlash uchun Telegram orqali kiring.</p></div></div></div>}
          <button onClick={() => { setArenaOpen(true); setArenaReady(false); setArenaResult(null); setArenaError("") }} className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"><Swords size={14} /> Arena</button><Link to="/leaderboard" className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"><Trophy size={14} /> Reytingni ko‘rish</Link>
        </aside>

        <main className="min-w-0"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-500">Barcha testlar</p><h2 className={`mt-1 text-3xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>Testlar</h2></div><div className="flex w-full gap-2 sm:max-w-[470px]"><label className={`relative flex w-44 shrink-0 items-center gap-2 rounded-2xl border px-3 py-3 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><Layers3 size={16} className="text-blue-500" /><select value={category} onChange={(event) => setCategory(event.target.value)} className={`w-full appearance-none bg-transparent pr-4 text-xs outline-none ${dark ? "text-slate-200" : "text-slate-700"}`}><option value="all">Kategoriyalar</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" /></label><label className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 py-3 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><Search size={17} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Test yoki mavzu qidiring..." className={`w-full bg-transparent text-sm outline-none ${dark ? "text-white placeholder:text-slate-600" : "text-slate-800 placeholder:text-slate-400"}`} /></label></div></div>{filteredQuizzes.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredQuizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} dark={dark} completedAttempt={attemptsByQuiz.get(quiz.slug)} />)}</div> : <div className={`rounded-3xl border p-14 text-center ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500"><Search size={24} /></div><h2 className={`mt-4 text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>Test topilmadi</h2><p className="mt-2 text-sm text-slate-500">Qidiruv yoki kategoriya filterini o‘zgartirib ko‘ring.</p></div>}</main>
      </div>
      {arenaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"><div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${dark ? "border-white/10 bg-[#0e1726]" : "border-slate-200 bg-white"}`}><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-500">Arena</p><h2 className={`mt-1 text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Mavzularni tanlang</h2><p className="mt-2 text-sm text-slate-500">Tanlangan mavzulardan bir xil random savollar olinadi.</p></div><button onClick={() => setArenaOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-900 dark:hover:text-white">×</button></div>{arenaReady ? <div className={`rounded-2xl p-5 text-center ${dark ? "bg-emerald-400/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}><p className="font-bold">Arena #{arenaResult?.code} yaratildi.</p><p className="mt-1 text-sm opacity-80">{arenaResult?.question_count} ta savol saqlandi. Invite link: {arenaResult?.invite_path}</p><p className="mt-3 text-xs opacity-70">Keyingi bosqichda lobby va ishtirokchilarni taklif qilish ulanadi.</p></div> : <><div className="mb-5 flex flex-wrap gap-2">{arenaTopicsList.map(({ topic, count }) => { const selected = arenaTopics.includes(topic); return <button key={topic} onClick={() => setArenaTopics((items) => selected ? items.filter((item) => item !== topic) : [...items, topic])} className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${selected ? "border-violet-500 bg-violet-600 text-white" : dark ? "border-white/10 text-slate-300 hover:border-violet-400" : "border-slate-200 text-slate-600 hover:border-violet-300"}`}>{topic}<span className="ml-1.5 opacity-60">{count}</span></button> })}</div><div className="mb-5"><label className="mb-2 block text-xs font-bold text-slate-500">Savollar soni</label><div className="grid grid-cols-4 gap-2">{[10, 20, 30, 50].map((count) => <button key={count} disabled={count > arenaAvailableQuestions} onClick={() => setArenaCount(count)} className={`rounded-xl border py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30 ${arenaCount === count ? "border-violet-500 bg-violet-600 text-white" : dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"}`}>{count}</button>)}</div><p className="mt-2 text-xs text-slate-500">Mavzularda mavjud: {arenaAvailableQuestions} ta savol. Minimum: 10 ta.</p></div>{!user && <p className="mb-4 text-sm text-amber-500">Arena yaratish uchun Telegram orqali login qiling.</p>}{arenaError && <p className="mb-4 text-sm text-rose-500">{arenaError}</p>}<button disabled={!user || !arenaTopics.length || arenaAvailableQuestions < 10 || arenaLoading} onClick={createArenaQuestions} className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{arenaLoading ? "Tayyorlanmoqda..." : "Arena yaratish"}</button></>}</div></div>}
    </div>
  )
}
