import { useParams, Link } from "react-router-dom"
import NotFound from "./NotFound"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft } from "lucide-react"
import { getCategories, getPosts } from "../api/blog"
import PostCard from "../components/PostCard"
import Loader from "../components/Loader"
import { useThemeStore } from "../store/theme"

export default function Category() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"
  const { id } = useParams()
  const categoryId = parseInt(id)

  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    Promise.all([getCategories(), getPosts({ category: categoryId, page_size: 50 })])
      .then(([catRes, postRes]) => {
        const cats = catRes.data
        setCategories(cats)
        if (!cats.find((c) => c.id === categoryId)) {
          setNotFound(true)
          return
        }
        const all = postRes.data.results ?? postRes.data
        setPosts(all)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [categoryId])

  if (loading) return <Loader />
  if (notFound) return <NotFound />

  const category = categories.find((c) => c.id === categoryId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet><title>{category?.name} — ChaqimchiAI Academy</title></Helmet>
      <Link
        to="/"
        className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors ${
          dark ? "text-slate-500 hover:text-slate-100" : "text-slate-400 hover:text-slate-900"
        }`}
      >
        <ArrowLeft size={15} /> Orqaga
      </Link>

      <div className="mb-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${
          dark
            ? "bg-[rgba(0,229,255,0.1)] text-[#00E5FF] ring-1 ring-[rgba(0,229,255,0.2)]"
            : "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
        }`}>
          Kategoriya
        </div>
        <h1 className={`text-3xl md:text-4xl font-extrabold mb-2 ${dark ? "text-slate-100" : "text-slate-900"}`}>
          {category?.name}
        </h1>
        <p className={dark ? "text-slate-500" : "text-slate-500"}>
          {posts.length} ta maqola topildi
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
              cat.id === categoryId
                ? "bg-[#00E5FF] text-[#0B0F19] shadow-sm"
                : dark
                  ? "bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className={`text-center py-20 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          Bu kategoriyada hozircha maqola yo'q.
        </div>
      )}
    </div>
  )
}
