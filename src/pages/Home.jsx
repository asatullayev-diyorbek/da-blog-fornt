import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Clock, Eye, MessageCircle } from "lucide-react"
import { useThemeStore } from "../store/theme"
import { getFeaturedPost, getPosts } from "../api/blog"
import { mediaUrl, authorName } from "../utils/media"
import PostCard from "../components/PostCard"
import Loader from "../components/Loader"

// ── Shared helpers ─────────────────────────────────────────────────────────────

const cardBase = (dark) =>
  dark
    ? "bg-[#0e1726] shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-black/50"
    : "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)]"

const categoryBadge = (dark) =>
  `self-start text-[11px] font-semibold px-3 py-1 rounded-full ${
    dark ? "bg-white/[0.08] text-slate-300" : "bg-slate-100 text-slate-600"
  }`

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, dark }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <span className="block w-1 h-6 rounded-full bg-[#00E5FF]" />
          <h2 className={`text-xl md:text-2xl font-extrabold tracking-tight ${
            dark ? "text-slate-100" : "text-slate-900"
          }`}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className={`text-sm pl-4 ${dark ? "text-slate-500" : "text-slate-400"}`}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}

// ── Popular: large card ────────────────────────────────────────────────────────
function LargeCard({ post, dark }) {
  const dateStr = new Date(post.created_at).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col h-full rounded-[20px] overflow-hidden transition-all duration-300
        hover:-translate-y-1.5 ${cardBase(dark)}`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={mediaUrl(post.cover)}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-4">
          <img
            src={mediaUrl(post.author?.avatar)}
            alt={authorName(post.author)}
            className="w-10 h-10 rounded-full ring-[2.5px] ring-white shadow-md"
          />
        </div>
        <div className="absolute bottom-3 right-4">
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full
            bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm">
            {post.read_time} min Read
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-2.5 flex-1">
        <span className={categoryBadge(dark)}>{post.category?.name}</span>

        <h3 className={`text-[17px] font-extrabold leading-snug line-clamp-2 transition-colors
          group-hover:text-[#00E5FF] ${dark ? "text-slate-100" : "text-slate-900"}`}>
          {post.title}
        </h3>

        <p className={`text-sm leading-relaxed line-clamp-2 flex-1 ${
          dark ? "text-slate-400" : "text-slate-500"
        }`}>
          {post.short_description}
        </p>

        <div className={`flex items-center justify-between text-[11px] pt-2 mt-auto border-t ${
          dark ? "border-white/[0.06] text-slate-500" : "border-slate-100 text-slate-400"
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Eye size={12} /> {post.views?.toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><MessageCircle size={12} /> {post.comments_count ?? 0}</span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock size={11} /> {dateStr}
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Popular: small card (image top, content below) ────────────────────────────
function SmallCard({ post, dark }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col flex-1 rounded-[18px] overflow-hidden transition-all duration-300
        hover:-translate-y-1.5 ${cardBase(dark)}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={mediaUrl(post.cover)}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2.5 left-3">
          <img src={mediaUrl(post.author?.avatar)} alt="" className="w-7 h-7 rounded-full ring-2 ring-white shadow-md" />
        </div>
        <div className="absolute bottom-2.5 right-3">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm">
            {post.read_time} min Read
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5">
        <span className={`self-start text-[10px] font-bold uppercase tracking-wider ${
          dark ? "text-[#00E5FF]" : "text-sky-600"
        }`}>
          {post.category?.name}
        </span>
        <h4 className={`text-sm font-bold leading-snug line-clamp-2 transition-colors
          group-hover:text-[#00E5FF] ${dark ? "text-slate-100" : "text-slate-900"}`}>
          {post.title}
        </h4>
        <div className={`flex items-center gap-1.5 text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
          <Eye size={11} /> {post.views?.toLocaleString()}
          <span>·</span>
          <Clock size={10} /> {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [featured, setFeatured] = useState(null)
  const [posts, setPosts] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [trendPage, setTrendPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  useEffect(() => {
    Promise.all([getFeaturedPost(), getPosts({ page: 1 })])
      .then(([featRes, postsRes]) => {
        setFeatured(featRes.data)
        const all = postsRes.data.results ?? postsRes.data
        const nonFeatured = all.filter((p) => !p.featured).sort((a, b) => b.views - a.views)
        setPosts(nonFeatured.slice(0, 3))
        setTrending(nonFeatured.slice(3))
        setHasNext(!!postsRes.data.next)
      })
      .finally(() => setLoading(false))
  }, [])

  const loadMore = () => {
    const next = trendPage + 1
    setLoadingMore(true)
    getPosts({ page: next })
      .then((res) => {
        const results = (res.data.results ?? res.data).filter((p) => !p.featured)
        setTrending((prev) => [...prev, ...results])
        setHasNext(!!res.data.next)
        setTrendPage(next)
      })
      .finally(() => setLoadingMore(false))
  }

  if (loading) return <Loader />

  const popularBig = posts[0]
  const popularSm  = posts.slice(1, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet><title>Blog — DA Blog</title></Helmet>

      {/* ── Hero ──────────────────────────────────────────── */}
      {featured && (
        <Link to={`/blog/${featured.slug}`} className="group block mb-16">
          <div className={`relative rounded-[24px] overflow-hidden aspect-video ${
            dark ? "shadow-2xl shadow-black/50" : "shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
          }`}>
            <img
              src={mediaUrl(featured.cover)}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-t from-[#00E5FF]/8 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#00E5FF] text-[#0B0F19]">
                  {featured.category?.name}
                </span>
                <span className="text-[11px] text-white/50">
                  {new Date(featured.created_at).toLocaleDateString("uz-UZ", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-2xl md:text-[2.2rem] font-extrabold text-white leading-tight max-w-2xl mb-5
                transition-colors group-hover:text-[#00E5FF]">
                {featured.title}
              </h1>
              <div className="flex items-center gap-3">
                <img
                  src={mediaUrl(featured.author?.avatar)}
                  alt={authorName(featured.author)}
                  className="w-9 h-9 rounded-full ring-2 ring-white/25"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{authorName(featured.author)}</p>
                  <div className="flex items-center gap-3 text-[11px] text-white/50 mt-0.5">
                    <span className="flex items-center gap-1"><Eye size={10} /> {featured.views?.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {featured.read_time} min Read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Popular Post ──────────────────────────────────── */}
      {popularBig && (
        <section className="mb-16">
          <SectionHeader
            title="Popular Post"
            subtitle="Ko'p o'qilgan va yoqtirilgan maqolalar"
            dark={dark}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
            <div className="md:col-span-3">
              <LargeCard post={popularBig} dark={dark} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              {popularSm.map((p) => (
                <SmallCard key={p.id} post={p} dark={dark} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trending Post ─────────────────────────────────── */}
      {trending.length > 0 && (
        <section>
          <SectionHeader
            title="Trending Post"
            subtitle="Eng yangi va qiziqarli maqolalar"
            dark={dark}
          />
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${
            trending.length >= 3 ? "lg:grid-cols-3" : ""
          } gap-5`}>
            {trending.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>

          {hasNext && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  dark
                    ? "bg-white/8 text-slate-300 hover:bg-white/12"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:opacity-50`}
              >
                {loadingMore && <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                {loadingMore ? "Yuklanmoqda..." : "Ko'proq ko'rish"}
              </button>
            </div>
          )}
        </section>
      )}

      {!featured && posts.length === 0 && (
        <div className={`text-center py-24 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          Hozircha maqolalar yo'q.
        </div>
      )}

    </div>
  )
}
