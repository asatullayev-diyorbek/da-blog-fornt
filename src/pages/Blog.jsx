import { useEffect, useState, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { FileText, X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getPosts, getCategories } from "../api/blog"
import PostCard from "../components/PostCard"
import Loader from "../components/Loader"
import { useThemeStore } from "../store/theme"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

export default function Blog() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const debounceRef = useRef(null)

  const fetchPosts = (cat, pg, q, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = { page: pg }
    if (cat) params.category = cat
    if (q)   params.search   = q

    getPosts(params)
      .then((res) => {
        const results = res.data.results ?? res.data
        setPosts((prev) => append ? [...prev, ...results] : results)
        setHasNext(!!res.data.next)
      })
      .finally(() => { setLoading(false); setLoadingMore(false) })
  }

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setPage(1)
    fetchPosts(activeCategory, 1, search, false)
  }, [activeCategory, search])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchPosts(activeCategory, next, search, true)
  }

  const handleSearchInput = (val) => {
    setSearchInput(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(val.trim()), 350)
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearch("")
  }

  return (
    <>
      <Helmet><title>Blog — ChaqimchiAI Academy</title></Helmet>

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden border-b ${
        dark
          ? "bg-[#080d16] border-white/[0.07]"
          : "bg-white border-slate-200"
      }`}>

        {/* dot grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={dark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.25)"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-dots)" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* Left: badge + title */}
            <div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-4 ${
                dark ? "bg-blue-600/10 border-blue-500/25 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
              }`}>
                <FileText size={11} />
                Maqolalar
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                dark ? "text-white" : "text-slate-900"
              }`}>
                Bilim va{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  tajriba
                </span>
              </h1>
            </div>

            {/* Right: live search */}
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border w-full sm:w-80 shrink-0 ${
              dark
                ? "bg-white/5 border-white/10 focus-within:border-blue-500/50"
                : "bg-white border-slate-200 focus-within:border-blue-400 shadow-sm"
            } transition-colors`}>
              <Search size={15} className={dark ? "text-slate-500 shrink-0" : "text-slate-400 shrink-0"} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Maqola qidiring..."
                className={`flex-1 bg-transparent text-sm outline-none ${
                  dark ? "text-white placeholder:text-slate-600" : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
              {searchInput && (
                <button type="button" onClick={clearSearch}>
                  <X size={13} className={dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Category chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-2 flex-wrap mb-8"
        >
          {[{ id: null, name: "Barchasi" }, ...categories].map((cat) => {
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id ?? "all"}
                onClick={() => setActiveCategory(active ? null : cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap border ${
                  active
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                    : dark
                      ? "bg-white/4 text-slate-400 border-white/8 hover:text-white hover:border-white/20"
                      : "bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {cat.name}
              </button>
            )
          })}
          {(activeCategory || search) && (
            <button
              onClick={() => { setActiveCategory(null); setSearch(""); setSearchInput("") }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"
              }`}
            >
              <X size={11} /> Tozalash
            </button>
          )}

          <span className={`ml-auto text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>
            {posts.length} ta maqola
          </span>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : posts.length > 0 ? (
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div key={post.id} variants={fadeUp} layout className="h-full">
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasNext && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 hover:-translate-y-0.5 ${
                    dark
                      ? "border-white/10 bg-white/4 text-slate-300 hover:border-blue-500/40 hover:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-900 shadow-sm"
                  }`}
                >
                  {loadingMore && (
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  )}
                  {loadingMore ? "Yuklanmoqda..." : "Ko'proq ko'rish"}
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              dark ? "bg-white/5" : "bg-slate-100"
            }`}>
              <FileText size={28} className={dark ? "text-slate-600" : "text-slate-400"} />
            </div>
            <p className={`font-semibold text-base mb-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Maqola topilmadi
            </p>
            <p className={`text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>
              Boshqa kategoriya yoki kalit so'z bilan urinib ko'ring
            </p>
          </motion.div>
        )}
      </div>
    </>
  )
}
