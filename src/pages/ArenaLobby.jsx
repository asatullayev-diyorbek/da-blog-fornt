import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, Copy, Flame, LoaderCircle, Play, Shield, Swords, Users, Zap } from "lucide-react"
import { getArena, joinArena, startArena } from "../api/quizzes"
import { useAuthStore } from "../store/auth"
import Loader from "../components/Loader"

function FighterAvatar({ participant, large = false }) {
  return <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/30 bg-violet-500/15 font-black text-violet-200 ${large ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm"}`}>
    {participant.avatar ? <img src={participant.avatar} alt={participant.username} className="h-full w-full object-cover" /> : participant.username.charAt(0).toUpperCase()}
    <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[#0a0e19] bg-emerald-400 p-1" />
  </div>
}

export default function ArenaLobby() {
  const { code } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
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

  useEffect(() => { if (arenaStatus === "started") navigate(`/arena/${code}/play`) }, [arenaStatus, code, navigate])

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

  if (!user) return <div className="arena-shell min-h-[calc(100vh-5rem)] px-4 py-20 text-center"><Swords className="mx-auto text-violet-400" size={42} /><h1 className="mt-5 text-2xl font-black text-white">Jang maydoniga kirish uchun login qiling</h1><p className="mt-2 text-sm text-slate-400">Arena faqat Telegram orqali kirgan jangchilar uchun.</p><Link to="/login" className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white">Jangga kirish</Link></div>
  if (loading) return <Loader />
  if (!arena) return <div className="arena-shell min-h-[calc(100vh-5rem)] px-4 py-20 text-center text-rose-400">{error || "Arena topilmadi."}</div>

  const isOwner = arena.owner_id === user.id
  const isParticipant = arena.participants.some((participant) => participant.id === user.id)
  const isCancelled = arena.status === "cancelled"

  return <div className="arena-shell min-h-[calc(100vh-5rem)] px-4 py-7 text-slate-200 sm:px-6 sm:py-12"><div className="mx-auto max-w-5xl"><Link to="/tests" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-300"><ArrowLeft size={14} /> Testlar bazasi</Link><section className="arena-panel relative overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[#0c101d]/90"><div className="arena-scanline pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-violet-400/10 to-transparent" /><header className="relative border-b border-white/8 px-6 py-7 sm:px-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.28em] text-violet-300"><Flame className="arena-glow text-rose-400" size={15} /> Battle arena · lobby</div><h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">#{arena.code}</h1><p className="mt-2 text-sm text-slate-400">{arena.question_count} raund · {arena.topics.join(" · ")}</p></div><div className="flex items-center gap-2"><span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300">{isCancelled ? "Arena yopilgan" : arena.status === "waiting" ? "Jangchilar kutilmoqda" : "Jang boshlandi"}</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black text-slate-400">{arena.participants.length}/{arena.max_players}</span></div></div>{!isCancelled && <button onClick={copyInvite} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-200 hover:bg-violet-500/20">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Link nusxalandi" : "Jangchiga taklif yuborish"}</button>}</header><div className="relative grid gap-6 p-6 sm:grid-cols-2 sm:p-10">{isCancelled ? <div className="sm:col-span-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-8 text-center"><p className="text-lg font-black text-white">Bu arena muddati tugagani uchun yopilgan.</p><p className="mt-2 text-sm text-slate-500">Yangi arena ochib jangni qaytadan boshlang.</p><Link to="/tests" className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Yangi arena ochish</Link></div> : <><div className="sm:col-span-2 mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-slate-500"><Users size={15} className="text-violet-400" /> Jangchilar ro'yxati</div>{arena.participants.map((participant, index) => <div key={participant.id} className={`arena-float rounded-2xl border p-4 ${participant.id === user.id ? "border-violet-400/50 bg-violet-500/12" : "border-white/8 bg-white/[.03]"}`} style={{ animationDelay: `${index * 120}ms` }}><div className="flex items-center gap-3"><FighterAvatar participant={participant} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-white">{participant.full_name}</p><p className="truncate text-xs text-slate-500">@{participant.username}</p></div>{participant.is_owner && <Shield size={17} className="shrink-0 text-amber-300" />}</div><div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500"><span>{participant.is_owner ? "Arena egasi" : "Jangchi"}</span><span className="text-emerald-400">Ready</span></div></div>)}{arena.participants.length === 1 && <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-600">Raqib shu yerda paydo bo‘ladi</div>}</>}</div><footer className="border-t border-white/8 bg-black/10 px-6 py-6 sm:px-10">{!isCancelled && !isParticipant && arena.status === "waiting" && <button onClick={handleJoin} disabled={actionLoading} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-950/40 disabled:opacity-50">{actionLoading ? <LoaderCircle className="animate-spin" size={17} /> : <Swords size={17} />} {actionLoading ? "Maydonga kirilmoqda..." : "Jangga qo‘shilish"}</button>}{!isCancelled && isOwner && arena.status === "waiting" && <button onClick={handleStart} disabled={actionLoading || arena.participants.length < 2} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3.5 text-sm font-black text-rose-200 hover:bg-rose-500/20 disabled:opacity-50">{actionLoading ? <LoaderCircle className="animate-spin" size={17} /> : <Play size={17} />} {arena.participants.length < 2 ? "Kamida 2 jangchi kerak" : "Jangni boshlash"}</button>}{error && <p className="mt-4 text-center text-sm text-rose-300">{error}</p>}<p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600"><Zap size={13} className="text-amber-400" /> Har bir to‘g‘ri javob — ball va XP uchun zarba</p></footer></section></div></div>
}
