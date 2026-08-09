import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Clock3, LoaderCircle, Trophy } from "lucide-react"
import { answerArena, getArenaGame } from "../api/quizzes"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"
import Loader from "../components/Loader"

export default function ArenaPlay() {
  const { code } = useParams()
  const user = useAuthStore((state) => state.user)
  const dark = useThemeStore((state) => state.theme) === "dark"
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answering, setAnswering] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return undefined
    let active = true
    const refresh = () => getArenaGame(code).then((response) => { if (active) setState(response.data) }).catch((requestError) => { if (active) setError(requestError.response?.data?.detail || "Arena o‘yinini yuklashda xatolik yuz berdi.") }).finally(() => { if (active) setLoading(false) })
    refresh()
    const timer = setInterval(refresh, 1000)
    return () => { active = false; clearInterval(timer) }
  }, [code, user])

  async function selectAnswer(optionId) {
    if (!state?.question || state.answered || answering) return
    setAnswering(true)
    try { const response = await answerArena(code, state.question.id, optionId); setState(response.data); setError("") } catch (requestError) { setError(requestError.response?.data?.detail || "Javobni yuborishda xatolik yuz berdi.") } finally { setAnswering(false) }
  }

  if (!user) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-black">Arena uchun login qiling</h1><Link to="/login" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Login</Link></div>
  if (loading && !state) return <Loader />
  if (!state) return <div className="mx-auto max-w-lg px-4 py-20 text-center text-rose-500">{error || "Arena topilmadi."}</div>
  if (state.status === "waiting") return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className={`text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Arena hali boshlanmadi</h1><p className="mt-2 text-sm text-slate-500">Owner arenani boshlashini kuting.</p><Link to={`/arena/${code}`} className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white">Lobbyga qaytish</Link></div>
  if (state.status === "finished") return <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6"><div className={`rounded-3xl border p-6 sm:p-8 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><div className="text-center"><Trophy className="mx-auto text-amber-500" size={40} /><h1 className={`mt-4 text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Arena yakunlandi</h1><p className="mt-2 text-sm text-slate-500">Yakuniy natijalar</p></div><div className="mt-6 space-y-2">{state.participants.map((participant) => <div key={participant.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${participant.id === user.id ? dark ? "bg-blue-500/10" : "bg-blue-50" : dark ? "bg-white/5" : "bg-slate-50"}`}><span className={`w-7 text-center text-sm font-black ${participant.rank <= 3 ? "text-amber-500" : "text-slate-500"}`}>{participant.rank}</span><div className="min-w-0 flex-1"><p className={`truncate text-sm font-bold ${dark ? "text-slate-200" : "text-slate-700"}`}>{participant.full_name}{participant.id === user.id && <span className="ml-1 text-xs text-blue-500">(siz)</span>}</p><p className="text-xs text-slate-500">{participant.correct_answers || 0} ta to‘g‘ri javob · {participant.score} ball</p></div>{participant.xp > 0 && <span className="shrink-0 text-sm font-black text-amber-500">+{participant.xp} XP</span>}</div>)}</div><Link to="/tests" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Testlarga qaytish</Link></div></div>
  const answered = state.answered
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-500">Arena #{code}</p><p className="mt-1 text-sm text-slate-500">Savol {state.question_index + 1} / {state.question_count}</p></div><div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${state.remaining_seconds <= 5 ? "bg-rose-500/15 text-rose-500" : dark ? "bg-white/5 text-slate-300" : "bg-white text-slate-600 shadow-sm"}`}><Clock3 size={16} /> {state.remaining_seconds}s</div></div><div className={`rounded-3xl border p-5 sm:p-8 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><div className={`mb-6 h-2 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"}`}><div className={`h-full rounded-full transition-all ${state.remaining_seconds <= 5 ? "bg-rose-500" : "bg-violet-600"}`} style={{ width: `${(state.remaining_seconds / 20) * 100}%` }} /></div><h1 className={`text-xl font-black leading-snug sm:text-2xl ${dark ? "text-white" : "text-slate-900"}`}>{state.question.text}</h1><div className="mt-7 grid gap-3 sm:grid-cols-2">{state.question.options.map((option, index) => <button key={option.id} disabled={answered || answering} onClick={() => selectAnswer(option.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition ${answered ? "cursor-default opacity-60" : dark ? "border-white/10 text-slate-300 hover:border-violet-400 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:border-violet-400 hover:bg-violet-50"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">{String.fromCharCode(65 + index)}</span>{option.text}</button>)}</div>{answering && <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={14} className="animate-spin" /> Javob yuborilmoqda...</p>}{error && <p className="mt-4 text-sm text-rose-500">{error}</p>}</div></div>
}
