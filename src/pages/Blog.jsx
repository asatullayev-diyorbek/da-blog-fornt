import { useEffect, useState, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, FileText, SlidersHorizontal, X, Search } from "lucide-react"
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
    // Reset pagination before loading the newly filtered result set.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={`mb-8 flex flex-wrap items-center gap-2.5 rounded-2xl border p-3 ${dark ? "border-white/8 bg-white/3" : "border-slate-200 bg-white shadow-sm"}`}
        >
          <SlidersHorizontal size={16} className={`mx-1 shrink-0 ${dark ? "text-blue-400" : "text-blue-500"}`} />
          <label className={`relative flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}>
            <FileText size={15} className="shrink-0 text-blue-500" />
            <select value={activeCategory ?? ""} onChange={(event) => setActiveCategory(event.target.value ? Number(event.target.value) : null)} className={`w-full appearance-none bg-transparent pr-5 text-xs font-semibold outline-none ${dark ? "text-slate-200" : "text-slate-700"}`}>
              <option value="">Barcha kategoriyalar</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" />
          </label>
          <label className={`flex min-w-[220px] flex-[1.5] items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${dark ? "border-white/8 bg-[#0e1726] focus-within:border-blue-500/50" : "border-slate-200 bg-white shadow-sm focus-within:border-blue-400"}`}>
            <Search size={16} className="shrink-0 text-slate-400" />
            <input type="text" value={searchInput} onChange={(event) => handleSearchInput(event.target.value)} placeholder="Maqola qidiring..." className={`w-full bg-transparent text-xs outline-none ${dark ? "text-white placeholder:text-slate-600" : "text-slate-800 placeholder:text-slate-400"}`} />
            {searchInput && <button type="button" onClick={clearSearch}><X size={13} className="text-slate-400 hover:text-slate-600" /></button>}
          </label>
          {(activeCategory || search) && (
            <button
              onClick={() => { setActiveCategory(null); setSearch(""); setSearchInput("") }}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"
              }`}
            >
              <X size={11} /> Tozalash
            </button>
          )}

          <span className={`ml-auto shrink-0 text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
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
