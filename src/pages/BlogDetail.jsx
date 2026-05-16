import { useParams, Link } from "react-router-dom"
import NotFound from "./NotFound"
import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Eye, Clock, ArrowLeft, Calendar, MessageCircle, Send, ChevronDown, Link2, Check } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { useThemeStore } from "../store/theme"
import { getPost, getPosts, getComments, postComment, recordView } from "../api/blog"
import { mediaUrl, authorName } from "../utils/media"
import CodeBlock from "../components/CodeBlock"
import YoutubeEmbed from "../components/YoutubeEmbed"
import PostCard from "../components/PostCard"
import Loader from "../components/Loader"
import { parseYoutubeEmbeds } from "../utils/parseYoutube"

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.874 13.67l-2.975-.924c-.647-.204-.66-.647.136-.956l11.57-4.461c.537-.194 1.006.131.957.919z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

function ShareBar({ url, title, dark }) {
  const [copied, setCopied] = useState(false)

  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shares = [
    {
      label: "Telegram",
      icon: <TelegramIcon />,
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      color: "hover:bg-[#229ED9]/15 hover:text-[#229ED9]",
    },
    {
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      color: "hover:bg-[#0077B5]/15 hover:text-[#0077B5]",
    },
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      color: "hover:bg-[#1877F2]/15 hover:text-[#1877F2]",
    },
    {
      label: "Instagram",
      icon: <InstagramIcon />,
      href: null,
      color: "hover:bg-pink-500/15 hover:text-pink-500",
    },
  ]

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`flex items-center gap-3 py-6 border-t border-b my-10 ${dark ? "border-white/[0.07]" : "border-slate-200"}`}>
      <span className={`text-xs font-bold uppercase tracking-widest shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        Ulashing
      </span>
      <div className="flex items-center gap-2">
        {shares.map(({ label, icon, href, color }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${color} ${
                dark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              {icon}
            </a>
          ) : (
            <button
              key={label}
              onClick={copyLink}
              aria-label={`${label} (havolani nusxalash)`}
              title="Havolani nusxalash"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${color} ${
                dark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              {icon}
            </button>
          )
        )}

        <div className={`w-px h-5 mx-1 ${dark ? "bg-white/10" : "bg-slate-200"}`} />

        <button
          onClick={copyLink}
          aria-label="Havolani nusxalash"
          className={`flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium transition-all duration-150 ${
            copied
              ? "bg-emerald-500/15 text-emerald-500"
              : dark
                ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />}
          {copied ? "Nusxalandi!" : "Havola"}
        </button>
      </div>
    </div>
  )
}

function PersonaDropdown({ dark, personas, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
        Siz kimsiniz?
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border transition-colors ${
          dark
            ? "bg-white/5 border-white/10 text-white hover:border-white/20"
            : "bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
            dark ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-sky-50 text-sky-600"
          }`}>
            {value.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          {value}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`} />
      </button>

      {open && (
        <div className={`absolute z-50 mt-1.5 w-full rounded-xl border overflow-hidden shadow-xl ${
          dark ? "bg-[#0e1726] border-white/10" : "bg-white border-slate-200"
        }`}>
          <div className="max-h-52 overflow-y-auto py-1">
            {personas.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { onChange(p); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                  p === value
                    ? dark ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-sky-50 text-sky-700"
                    : dark ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  p === value
                    ? dark ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "bg-sky-100 text-sky-600"
                    : dark ? "bg-white/8 text-slate-400" : "bg-slate-100 text-slate-500"
                }`}>
                  {p.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BlogDetail() {
  const { slug } = useParams()
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [comments, setComments] = useState([])
  const IT_PERSONAS = [
    "Linus Torvalds", "Alan Turing", "Dennis Ritchie", "Ken Thompson",
    "Tim Berners-Lee", "Donald Knuth", "Richard Stallman", "Brian Kernighan",
    "Guido van Rossum", "Bjarne Stroustrup", "James Gosling", "John Carmack",
    "Paul Graham", "Andrej Karpathy", "Yann LeCun", "Geoffrey Hinton",
    "Sam Altman", "Elon Musk", "Bill Gates", "Steve Wozniak",
  ]

  const [form, setForm] = useState({ name: IT_PERSONAS[0], content: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setComments([])
    setSubmitted(false)
    getPost(slug)
      .then((res) => {
        setPost(res.data)
        if (res.data.category?.id) {
          getPosts({ category: res.data.category.id, page_size: 4 })
            .then((r) => {
              const all = r.data.results ?? r.data
              setRelated(all.filter((p) => p.slug !== slug).slice(0, 3))
            })
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))

    getComments(slug).then((r) => setComments(r.data)).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!post?.title) return
    document.title = `${post.title} — DA Blog`
    return () => { document.title = "DA Blog" }
  }, [post?.title])

  useEffect(() => {
    if (!post?.slug) return
    const key = `viewed_${post.slug}`
    if (!localStorage.getItem(key)) {
      recordView(post.slug)
        .then(() => localStorage.setItem(key, "1"))
        .catch(() => {})
    }
  }, [post?.slug])

  if (loading) return <Loader />
  if (notFound || !post) return <NotFound />

  const formattedDate = new Date(post.created_at).toLocaleDateString("uz-UZ", {
    year: "numeric", month: "long", day: "numeric",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) {
      setFormError("Ism va izoh majburiy.")
      return
    }
    setFormError("")
    setSubmitting(true)
    postComment(slug, { name: form.name, content: form.content })
      .then((r) => {
        setComments((prev) => [r.data, ...prev])
        setForm({ name: IT_PERSONAS[0], content: "" })
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
      })
      .catch(() => setFormError("Xatolik yuz berdi. Qayta urinib ko'ring."))
      .finally(() => setSubmitting(false))
  }

  const components = {
    code({ node, inline, className, children, ...props }) {
      if (inline) {
        return (
          <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
            dark ? "bg-white/10 text-[#00E5FF]" : "bg-slate-100 text-sky-700"
          }`} {...props}>
            {children}
          </code>
        )
      }
      return <CodeBlock className={className}>{children}</CodeBlock>
    },
    blockquote({ children }) {
      return (
        <blockquote className={`border-l-4 border-[#00E5FF] pl-4 my-4 italic py-3 pr-4 rounded-r-lg ${
          dark ? "text-slate-400 bg-[#00E5FF]/5" : "text-slate-600 bg-sky-50"
        }`}>
          {children}
        </blockquote>
      )
    },
    h1({ children }) {
      return <h1 className={`text-3xl font-bold mt-8 mb-4 ${dark ? "text-white" : "text-slate-900"}`}>{children}</h1>
    },
    h2({ children }) {
      return (
        <h2 className={`text-2xl font-bold mt-8 mb-3 pb-2 border-b ${
          dark ? "text-white border-white/10" : "text-slate-900 border-slate-200"
        }`}>
          {children}
        </h2>
      )
    },
    h3({ children }) {
      return <h3 className={`text-xl font-semibold mt-6 mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{children}</h3>
    },
    p({ children }) {
      return <p className={`leading-relaxed my-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</p>
    },
    a({ href, children }) {
      return <a href={href} className="text-[#00E5FF] hover:underline" target="_blank" rel="noreferrer">{children}</a>
    },
    ul({ children }) {
      return <ul className={`list-disc list-inside my-3 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ul>
    },
    ol({ children }) {
      return <ol className={`list-decimal list-inside my-3 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ol>
    },
    div({ className, "data-id": dataId, children, ...props }) {
      if (className === "yt-embed" && dataId) return <YoutubeEmbed videoId={dataId} />
      return <div className={className} {...props}>{children}</div>
    },
  }

  const processedContent = parseYoutubeEmbeds(post.content)

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
    dark
      ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E5FF]/40"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00E5FF]"
  }`

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>{post.title} — DA Blog</title>
        <meta name="description" content={post.short_description} />
        <meta property="og:title" content={`${post.title} — DA Blog`} />
        <meta property="og:description" content={post.short_description} />
        <meta property="og:image" content={post.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.short_description} />
        <meta name="twitter:image" content={post.cover} />
      </Helmet>
      <Link
        to="/"
        className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors ${
          dark ? "text-slate-400 hover:text-[#00E5FF]" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <ArrowLeft size={16} /> Orqaga
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            to={`/category/${post.category?.id}`}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              dark
                ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30 hover:bg-[#00E5FF]/30"
                : "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
            }`}
          >
            {post.category?.name}
          </Link>
          {post.tags?.map((tag) => (
            <span
              key={tag.id}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                dark ? "bg-white/5 text-slate-400 border-white/10" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {post.title}
        </h1>
      </div>

      <div className={`rounded-2xl overflow-hidden aspect-video mb-6 border ${
        dark ? "border-white/10" : "border-slate-200"
      }`}>
        <img src={mediaUrl(post.cover)} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className={`flex flex-wrap items-center gap-4 text-sm mb-10 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <div className="flex items-center gap-2">
          <img src={mediaUrl(post.author?.avatar)} alt="" className="w-7 h-7 rounded-full" />
          <span className={dark ? "text-slate-300" : "text-slate-700"}>{authorName(post.author)}</span>
        </div>
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate}</span>
        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.read_time} min o'qish</span>
        <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views?.toLocaleString()} ko'rish</span>
        <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {comments.length || post.comments_count || 0} izoh</span>
      </div>

      <article className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
          {processedContent}
        </ReactMarkdown>
      </article>

      <ShareBar
        url={window.location.href}
        title={post.title}
        dark={dark}
      />

      {/* ── Comments ── */}
      <div className={`mt-16 pt-10 border-t ${dark ? "border-white/10" : "border-slate-200"}`}>
        <h2 className={`text-xl font-bold mb-8 flex items-center gap-2 ${dark ? "text-white" : "text-slate-900"}`}>
          <MessageCircle size={20} className="text-[#00E5FF]" />
          Izohlar
          {comments.length > 0 && (
            <span className={`text-sm font-normal ${dark ? "text-slate-500" : "text-slate-400"}`}>
              · {comments.length} ta
            </span>
          )}
        </h2>

        {/* Comment list */}
        {comments.length > 0 && (
          <div className="space-y-4 mb-10">
            {comments.map((c) => (
              <div key={c.id} className={`flex gap-4 p-5 rounded-2xl border ${
                dark ? "bg-[#0e1726] border-white/[0.07]" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  dark ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-sky-50 text-sky-600"
                }`}>
                  {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>
                      {c.name}
                    </span>
                    <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
                      {new Date(c.created_at).toLocaleDateString("uz-UZ", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment form */}
        <div className={`rounded-2xl border p-6 ${
          dark ? "bg-[#0e1726] border-white/[0.07]" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h3 className={`text-base font-bold mb-5 ${dark ? "text-white" : "text-slate-900"}`}>
            Izoh qoldiring
          </h3>

          {submitted && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
              Izohingiz qabul qilindi!
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PersonaDropdown
              dark={dark}
              personas={IT_PERSONAS}
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Izoh <span className="text-[#FF3D57]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Fikringizni yozing..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className={`${inputCls} resize-none`}
              />
            </div>

            {formError && (
              <p className="text-xs text-[#FF3D57]">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="self-start flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-semibold text-sm hover:bg-[#00E5FF]/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
            >
              <Send size={14} />
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </form>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className={`mt-16 pt-10 border-t ${dark ? "border-white/10" : "border-slate-200"}`}>
          <h2 className={`text-xl font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
            O'xshash maqolalar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
