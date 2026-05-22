import { Link } from "react-router-dom"
import { Eye, Clock, MessageCircle } from "lucide-react"
import { useThemeStore } from "../store/theme"
import { mediaUrl, authorName } from "../utils/media"

export default function PostCard({ post }) {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const dateStr = new Date(post.created_at).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-[20px] overflow-hidden transition-all duration-300
        hover:-translate-y-1.5 ${
        dark
          ? "bg-[#0e1726] shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-black/50"
          : "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
      }`}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={mediaUrl(post.cover)}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Author avatar + name — bottom-left of image */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <img
            src={mediaUrl(post.author?.avatar)}
            alt={authorName(post.author)}
            className="w-8 h-8 rounded-full ring-2 ring-white shadow-md shrink-0"
          />
          <span className="text-[11px] font-semibold text-white drop-shadow-md truncate max-w-[110px]">
            {authorName(post.author)}
          </span>
        </div>

        {/* Read time badge — bottom-right of image */}
        <div className="absolute bottom-3 right-4">
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full
            bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm">
            {post.read_time} min Read
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-2.5">

        {/* Category */}
        <span className={`self-start text-[11px] font-semibold px-3 py-1 rounded-full ${
          dark ? "bg-white/[0.08] text-slate-300" : "bg-slate-100 text-slate-600"
        }`}>
          {post.category?.name}
        </span>

        {/* Title */}
        <h3 className={`text-[15px] font-bold leading-snug line-clamp-2 transition-colors
          group-hover:text-[#00E5FF] ${dark ? "text-slate-100" : "text-slate-900"}`}>
          {post.title}
        </h3>

        {/* Stats row */}
        <div className={`flex items-center justify-between text-[11px] pt-1 ${
          dark ? "text-slate-500" : "text-slate-400"
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <Eye size={12} /> {post.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={12} /> {post.comments_count ?? 0}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock size={11} /> {dateStr}
          </span>
        </div>
      </div>
    </Link>
  )
}
