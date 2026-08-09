import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getLeaderboard } from "../api/auth"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"
import { mediaUrl } from "../utils/media"
import Loader from "../components/Loader"

function UserAvatar({ item }) {
  const isFirst = item.rank === 1
  const image = item.avatar ? <img src={mediaUrl(item.avatar)} alt={item.username} className="relative h-10 w-10 shrink-0 rounded-full object-cover" /> : <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/15 font-bold text-blue-500">{item.username?.charAt(0).toUpperCase()}</div>
  if (!isFirst) return image
  return <div className="relative h-14 w-14 shrink-0 rounded-full p-2"><span className="leaderboard-fire-ring" />{image}</div>
}

export default function Leaderboard() {
  const dark = useThemeStore((state) => state.theme) === "dark"
  const user = useAuthStore((state) => state.user)
  const [period, setPeriod] = useState("all")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard(period).then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [period])

  if (loading && !data) return <Loader />
  const results = data?.results ?? []
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-semibold text-blue-500">Eng faol o‘quvchilar</p><h1 className={`text-3xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Leaderboard</h1></div><div className={`flex w-fit rounded-xl p-1 ${dark ? "bg-white/5" : "bg-slate-100"}`}>{[["week", "Hafta"], ["month", "Oy"], ["all", "Barcha vaqt"]].map(([value, label]) => <button key={value} onClick={() => setPeriod(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === value ? "bg-blue-600 text-white" : dark ? "text-slate-400" : "text-slate-600"}`}>{label}</button>)}</div></div>{user && data?.user_rank && <p className={`mb-4 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>Sizning o‘rningiz: <strong className="text-blue-500">#{data.user_rank}</strong></p>}<div className={`overflow-hidden rounded-2xl border ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}><div className={`flex items-center gap-4 border-b px-4 py-3 text-[11px] font-bold uppercase tracking-wider sm:px-5 ${dark ? "border-white/8 text-slate-500" : "border-slate-100 text-slate-400"}`}><span className="w-8 text-center">#</span><span className="w-10">Rasm</span><span className="flex-1">Foydalanuvchi</span><span>XP</span></div>{results.map((item) => <div key={item.username} className={`flex min-w-0 items-center gap-4 border-b px-4 py-3.5 last:border-0 sm:px-5 ${item.is_me ? dark ? "bg-blue-600/10" : "bg-blue-50" : ""} ${dark ? "border-white/5 hover:bg-white/[0.025]" : "border-slate-100 hover:bg-slate-50"}`}><span className={`w-8 shrink-0 text-center text-sm font-bold ${item.rank <= 3 ? "text-amber-500" : dark ? "text-slate-500" : "text-slate-400"}`}>{item.rank}</span><UserAvatar item={item} /><div className={`min-w-0 flex-1 text-sm ${dark ? "text-slate-200" : "text-slate-700"}`}><p className="truncate font-bold">{item.full_name}</p><p className="truncate text-xs text-slate-500">@{item.username}{item.is_me && <span className="ml-1.5 text-blue-500">· Siz</span>}</p></div><span className="shrink-0 text-sm font-bold text-blue-500">{item.points} XP</span></div>)}{!results.length && <p className={`p-10 text-center ${dark ? "text-slate-500" : "text-slate-400"}`}>Hali reyting mavjud emas.</p>}</div>{!user && <p className={`mt-6 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Ball to‘plash uchun <Link className="font-semibold text-blue-500" to="/login">login qiling</Link>.</p>}</div>
}
