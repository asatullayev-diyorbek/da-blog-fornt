import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, Copy, LoaderCircle, Play, Users } from "lucide-react"
import { getArena, joinArena, startArena } from "../api/quizzes"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"
import Loader from "../components/Loader"

export default function ArenaLobby() {
  const { code } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const dark = useThemeStore((state) => state.theme) === "dark"
  const [arena, setArena] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const arenaStatus = arena?.status

  useEffect(() => {
    if (!user) return undefined
    let active = true
    const refresh = () => getArena(code).then((response) => { if (active) setArena(response.data) }).catch((requestError) => { if (active) setError(requestError.response?.data?.detail || "Arenani yuklashda xatolik yuz berdi.") }).finally(() => { if (active) setLoading(false) })
    refresh()
    const timer = setInterval(() => { if (arenaStatus === "waiting" || !arenaStatus) refresh() }, 2500)
    return () => { active = false; clearInterval(timer) }
  }, [arenaStatus, code, user])

  useEffect(() => {
    if (arenaStatus === "started") navigate(`/arena/${code}/play`)
  }, [arenaStatus, code, navigate])

  async function handleJoin() {
    setActionLoading(true)
    try { const response = await joinArena(code); setArena(response.data); setError("") } catch (requestError) { setError(requestError.response?.data?.detail || "Arenaga qo'shilishda xatolik yuz berdi.") } finally { setActionLoading(false) }
  }

  async function handleStart() {
    setActionLoading(true)
    try { const response = await startArena(code); setArena(response.data); setError("") } catch (requestError) { setError(requestError.response?.data?.detail || "Arenani boshlashda xatolik yuz berdi.") } finally { setActionLoading(false) }
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(`${window.location.origin}${arena.invite_path}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  if (!user) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-black">Arena uchun login qiling</h1><p className="mt-2 text-sm text-slate-500">Arena faqat Telegram orqali kirgan userlar uchun.</p><Link to="/login" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Login</Link></div>
  if (loading) return <Loader />
  if (!arena) return <div className="mx-auto max-w-lg px-4 py-20 text-center text-rose-500">{error || "Arena topilmadi."}</div>
  const isOwner = arena.owner_id === user.id
  const isParticipant = arena.participants.some((participant) => participant.id === user.id)

  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14"><Link to="/tests" className={`mb-6 inline-flex items-center gap-2 text-sm ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}><ArrowLeft size={15} /> Testlar</Link><section className={`overflow-hidden rounded-3xl border ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><div className="bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-7 text-white sm:px-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-100">Arena lobby</p><h1 className="mt-2 text-3xl font-black">#{arena.code}</h1><p className="mt-2 text-sm text-blue-100">{arena.question_count} ta savol · {arena.topics.join(", ")}</p></div><Users size={30} className="text-white/70" /></div><button onClick={copyInvite} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Nusxalandi" : "Invite linkni nusxalash"}</button></div><div className="p-6 sm:p-8"><div className="mb-5 flex items-center justify-between"><div><h2 className={`font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>Ishtirokchilar</h2><p className="mt-1 text-xs text-slate-500">{arena.participants.length} / {arena.max_players} qatnashchi</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${arena.status === "waiting" ? "bg-amber-400/15 text-amber-500" : "bg-emerald-400/15 text-emerald-500"}`}>{arena.status === "waiting" ? "Kutilmoqda" : "Boshlandi"}</span></div><div className="space-y-2">{arena.participants.map((participant) => <div key={participant.id} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${dark ? "bg-white/5" : "bg-slate-50"}`}><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600/15 text-sm font-bold text-blue-500">{participant.avatar ? <img src={participant.avatar} alt={participant.username} className="h-full w-full object-cover" /> : participant.username.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className={`truncate text-sm font-bold ${dark ? "text-slate-200" : "text-slate-700"}`}>{participant.full_name}</p><p className="truncate text-xs text-slate-500">@{participant.username}</p></div>{participant.is_owner && <span className="rounded-lg bg-violet-500/15 px-2 py-1 text-[10px] font-bold text-violet-500">Owner</span>}</div>)}</div>{!isParticipant && arena.status === "waiting" && <button onClick={handleJoin} disabled={actionLoading} className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{actionLoading ? "Qo‘shilmoqda..." : "Arenaga qo‘shilish"}</button>}{isOwner && arena.status === "waiting" && <button onClick={handleStart} disabled={actionLoading || arena.participants.length < 1} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{actionLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={16} />} Arenani boshlash</button>}{arena.status === "started" && <div className="mt-5 rounded-xl bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-500">Arena boshlandi. O‘yin oynasi keyingi bosqichda ulanadi.</div>}{error && <p className="mt-4 text-center text-sm text-rose-500">{error}</p>}</div></section></div>
}
