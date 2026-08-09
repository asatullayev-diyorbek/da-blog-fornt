import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Award, Crown, Trophy } from "lucide-react"
import { getLeaderboard } from "../api/auth"
import { useAuthStore } from "../store/auth"
import { useThemeStore } from "../store/theme"
import { mediaUrl } from "../utils/media"
import Loader from "../components/Loader"

function UserAvatar({ item }) {
  const isFirst = item.rank === 1
  const image = item.avatar ? <img src={mediaUrl(item.avatar)} alt={item.username} className="relative h-10 w-10 shrink-0 rounded-full border-2 border-white/60 object-cover" /> : <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/60 bg-blue-600/15 font-bold text-blue-500">{item.username?.charAt(0).toUpperCase()}</div>
  if (!isFirst) return image
  return <div className="relative h-14 w-14 shrink-0 rounded-full p-2"><span className="leaderboard-fire-ring" />{image}</div>
}

export default function Leaderboard() {
  const dark = useThemeStore((state) => state.theme) === "dark"
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard("all").then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading && !data) return <Loader />
  const results = data?.results ?? []
  return <div className={`leaderboard-page ${dark ? "leaderboard-page-dark" : ""}`}><div className="leaderboard-orb leaderboard-orb-one" /><div className="leaderboard-orb leaderboard-orb-two" /><div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"><div className="leaderboard-heading"><div className="leaderboard-title-wrap"><Award className="leaderboard-medal leaderboard-medal-left" /><div><p className="leaderboard-kicker">ChaqimchiAI Academy</p><h1>LEADERBOARD</h1></div><Award className="leaderboard-medal leaderboard-medal-right" /></div><p className="leaderboard-subtitle">Eng faol o‘quvchilar reytingi</p></div><div className="leaderboard-table-shell"><div className="leaderboard-table-head"><span>RANKING</span><span>PLAYER</span><span>XP POINTS</span><span>STATUS</span></div>{results.map((item) => <div key={item.username} className={`leaderboard-row ${item.rank === 1 ? "leaderboard-row-first" : ""} ${item.is_me ? "leaderboard-row-me" : ""}`}><div className="leaderboard-rank">{item.rank === 1 ? <Crown size={17} /> : String(item.rank).padStart(2, "0")}</div><div className="leaderboard-player"><UserAvatar item={item} /><div className="min-w-0"><p>{item.full_name}</p><span>@{item.username}{item.is_me && " · Siz"}</span></div></div><div className="leaderboard-points">{item.points}<small> XP</small></div><div className="leaderboard-status">{item.rank <= 3 ? <><Trophy size={14} /> TOP {item.rank}</> : "ACTIVE"}</div></div>)}{!results.length && <p className="p-10 text-center text-slate-400">Hali reyting mavjud emas.</p>}</div>{!user && <p className="leaderboard-login">Ball to‘plash uchun <Link to="/login">login qiling</Link>.</p>}</div></div>
}
