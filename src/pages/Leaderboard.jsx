import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowDown, ArrowUp, Award, Crown, Filter, Flame, Minus, Trophy, UserRound } from "lucide-react"
import { getGamification, getLeaderboard } from "../api/auth"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"
import { mediaUrl } from "../utils/media"
import Loader from "../components/Loader"

function UserAvatar({ item }) {
  const isFirst = item.rank === 1
  const image = item.avatar
    ? <img src={mediaUrl(item.avatar)} alt={item.username} className="relative h-10 w-10 shrink-0 rounded-full border-2 border-white/60 object-cover" />
    : <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/60 bg-blue-600/15 font-bold text-blue-500">{item.username?.charAt(0).toUpperCase()}</div>
  if (!isFirst) return image
  return <div className="relative h-14 w-14 shrink-0 rounded-full p-2"><span className="leaderboard-fire-ring" />{image}</div>
}

function ProfileSidebar({ user, gamification, rank }) {
  if (!user) return <aside className="leaderboard-sidebar leaderboard-profile-sidebar"><div className="leaderboard-side-icon"><UserRound size={20} /></div><p className="leaderboard-side-label">Sizning statistkangiz</p><h2>O‘zingizni reytingda ko‘rsating</h2><p className="leaderboard-side-muted">Test ishlang, XP to‘plang va eng faol o‘quvchilar qatoriga qo‘shiling.</p><Link className="leaderboard-side-button" to="/login">Kirish</Link></aside>
  const name = user.telegram_full_name || user.first_name || user.username
  return <aside className="leaderboard-sidebar leaderboard-profile-sidebar"><div className="leaderboard-profile-avatar">{user.avatar ? <img src={mediaUrl(user.avatar)} alt={name} /> : <UserRound size={25} />}</div><h2>{name}</h2><p className="leaderboard-side-username">@{user.telegram_username || user.username}</p><div className="leaderboard-profile-rank"><span>Reytingdagi o‘rin</span><strong>{rank ? `#${rank}` : "—"}</strong></div><div className="leaderboard-stat-grid"><div><strong>{gamification?.total_points ?? 0}</strong><span>XP</span></div><div><strong>{gamification?.level ?? 1}</strong><span>LEVEL</span></div><div><strong>{gamification?.current_streak ?? 0}</strong><span>STREAK</span></div></div><div className="leaderboard-progress-label"><span>Keyingi level</span><span>{(gamification?.total_points ?? 0) % 100}/100 XP</span></div><div className="leaderboard-progress"><span style={{ width: `${Math.min(100, (gamification?.total_points ?? 0) % 100)}%` }} /></div><p className="leaderboard-streak"><Flame size={15} /> Bugungi faollikni davom ettiring</p></aside>
}

export default function Leaderboard() {
  const dark = useThemeStore((state) => state.theme) === "dark"
  const user = useAuthStore((state) => state.user)
  const [period, setPeriod] = useState("all")
  const [data, setData] = useState(null)
  const [gamification, setGamification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard(period).then((res) => setData(res.data)).finally(() => setLoading(false))
    if (user) getGamification().then((res) => setGamification(res.data)).catch(() => {})
  }, [period, user])

  if (loading && !data) return <Loader />
  const results = data?.results ?? []
  return <div className={`leaderboard-page ${dark ? "leaderboard-page-dark" : ""}`}><div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><div className="leaderboard-heading"><div className="leaderboard-title-wrap"><Award className="leaderboard-medal leaderboard-medal-left" /><div><p className="leaderboard-kicker">ChaqimchiAI Academy</p><h1>LEADERBOARD</h1></div><Award className="leaderboard-medal leaderboard-medal-right" /></div><p className="leaderboard-subtitle">Eng faol o‘quvchilar reytingi</p></div><div className="leaderboard-layout"><ProfileSidebar user={user} gamification={gamification} rank={data?.user_rank} /><section className="leaderboard-center"><div className="leaderboard-table-shell">{results.map((item) => <div key={item.username} className={`leaderboard-row ${item.rank === 1 ? "leaderboard-row-first" : ""} ${item.is_me ? "leaderboard-row-me" : ""}`}><div className="leaderboard-rank">{item.rank === 1 ? <Crown size={17} /> : String(item.rank).padStart(2, "0")}</div><div className="leaderboard-player"><UserAvatar item={item} /><div className="min-w-0"><p>{item.full_name}</p><span>@{item.username}{item.is_me && " · Siz"}</span></div></div><div className="leaderboard-points">{item.points}<small> XP</small></div><div className={`leaderboard-status leaderboard-movement-${item.rank_change}`}>{item.rank_change === "up" && <><ArrowUp size={14} /> +{item.rank_delta}</>}{item.rank_change === "down" && <><ArrowDown size={14} /> -{item.rank_delta}</>}{item.rank_change === "same" && <><Minus size={14} /> 0</>}{item.rank_change === "new" && <><Trophy size={14} /> NEW</>}</div></div>)}{!results.length && <p className="p-10 text-center text-slate-400">Hali reyting mavjud emas.</p>}</div>{!user && <p className="leaderboard-login">Ball to‘plash uchun <Link to="/login">login qiling</Link>.</p>}</section><aside className="leaderboard-sidebar leaderboard-filter-sidebar"><div className="leaderboard-filter-heading"><div className="leaderboard-side-icon"><Filter size={18} /></div><div><p className="leaderboard-side-label">Vaqt oralig‘i</p><h2>Reytingni ko‘rish</h2></div></div><div className="leaderboard-filter-options">{[["week", "Hafta", "Joriy hafta"], ["month", "Oy", "Joriy oy"], ["all", "Barcha vaqt", "Umumiy natija"]].map(([value, label, description]) => <button key={value} onClick={() => setPeriod(value)} className={period === value ? "active" : ""}><span className="leaderboard-filter-copy"><strong>{label}</strong><small>{description}</small></span><span className="leaderboard-filter-check">{period === value ? "✓" : ""}</span></button>)}</div></aside></div></div></div>
}
