import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, BookOpen, ArrowRight, GraduationCap, Search, FileText } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useThemeStore } from "../store/theme"
import { getCourses } from "../api/courses"
import { getPosts } from "../api/blog"
import { mediaUrl } from "../utils/media"

export default function Navbar() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [courses, setCourses] = useState([])

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ posts: [], courses: [] })
  const [searchLoading, setSearchLoading] = useState(false)
  const searchInputRef = useRef(null)
  const searchDebounce = useRef(null)

  const location = useLocation()

  useEffect(() => {
    getCourses({ page_size: 8 }).then((res) => {
      const all = res.data.results ?? res.data
      setCourses(all)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
    setMobileCoursesOpen(false)
    setSearchOpen(false)
    setSearchQuery("")
  }, [location.pathname])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) { setSearchResults({ posts: [], courses: [] }); return }
    clearTimeout(searchDebounce.current)
    setSearchLoading(true)
    searchDebounce.current = setTimeout(() => {
      Promise.all([
        getPosts({ search: q, page_size: 4 }),
        getCourses({ search: q, page_size: 3 }),
      ])
        .then(([pRes, cRes]) => {
          setSearchResults({
            posts: pRes.data.results ?? pRes.data,
            courses: cRes.data.results ?? cRes.data,
          })
        })
        .catch(() => {})
        .finally(() => setSearchLoading(false))
    }, 300)
    return () => clearTimeout(searchDebounce.current)
  }, [searchQuery])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const pill = dark
    ? "bg-[#0c1220]/96 border-white/10 shadow-2xl shadow-black/50"
    : "bg-white/96 border-slate-200 shadow-lg shadow-slate-900/8"

  const linkCls = (isActive) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      isActive
        ? `text-[#00E5FF] ${dark ? "bg-[#00E5FF]/10" : "bg-[#00E5FF]/10"}`
        : dark
          ? "text-slate-400 hover:text-white hover:bg-white/8"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`

  const mobileLinkCls = (isActive) =>
    `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? `text-[#00E5FF] ${dark ? "bg-[#00E5FF]/10" : "bg-[#00E5FF]/8"}`
        : dark
          ? "text-slate-400 hover:text-white hover:bg-white/6"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`

  return (
    <header className="sticky top-0 z-50 flex flex-col items-center px-4 pt-3 gap-2">

      {/* ── Main pill nav ─────────────────────────────────── */}
      <div className={`w-full max-w-[82%] rounded-2xl border backdrop-blur-2xl transition-colors duration-300 ${pill}`}>
        <div className="h-[60px] flex items-center justify-between gap-4 px-4 sm:px-5">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center group">
            <img
              src={dark ? "/logo-dark.png" : "/logo-light.png"}
              alt="DA Blog"
              className="h-30 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavLink to="/blog" className={({ isActive }) => linkCls(isActive)}>
              Blog
            </NavLink>

            {/* Kurslar + dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <NavLink
                to="/courses"
                className={({ isActive }) => `inline-flex items-center gap-1.5 ${linkCls(isActive)}`}
              >
                <GraduationCap size={14} />
                Kurslar
                <ChevronDown
                  size={12}
                  className={`mt-px transition-transform duration-250 ${dropdownOpen ? "rotate-180 text-[#00E5FF]" : ""}`}
                />
              </NavLink>

              {/* Dropdown panel */}
              <div className={`absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[520px]
                rounded-2xl border p-5 transition-all duration-200 origin-top ${
                dropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              } ${
                dark
                  ? "bg-[#0a1018] border-white/10 shadow-2xl shadow-black/70"
                  : "bg-white border-slate-200 shadow-2xl shadow-slate-900/12"
              }`}>
                {/* Header */}
                <div className={`flex items-center justify-between mb-4 pb-3.5 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? "bg-[#00E5FF]/12" : "bg-[#00E5FF]/10"}`}>
                      <BookOpen size={14} className="text-[#00E5FF]" />
                    </div>
                    <span className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                      Barcha kurslar
                    </span>
                  </div>
                  <Link
                    to="/courses"
                    className="flex items-center gap-1 text-xs font-medium text-[#00E5FF] hover:opacity-70 transition-opacity group"
                  >
                    Ko'proq <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Course grid */}
                {courses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {courses.map((course) => (
                      <Link
                        key={course.id}
                        to={`/courses/${course.slug}`}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-150 group ${
                          dark ? "hover:bg-white/6" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={mediaUrl(course.cover)}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className={`text-[11px] font-semibold leading-snug line-clamp-2 mb-1.5 transition-colors group-hover:text-[#00E5FF] ${
                            dark ? "text-slate-200" : "text-slate-800"
                          }`}>
                            {course.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                              course.level === "Boshlang'ich"
                                ? dark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                                : course.level === "O'rta"
                                  ? dark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-600"
                                  : dark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
                            }`}>
                              {course.level}
                            </span>
                            <span className={`text-[10px] font-semibold ${
                              course.price === "Bepul" ? "text-emerald-500" : "text-[#FF3D57]"
                            }`}>
                              {course.price}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm text-center py-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                    Kurslar yuklanmoqda...
                  </p>
                )}

                {/* Bottom CTA */}
                <div className={`mt-4 pt-3.5 border-t ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <Link
                    to="/courses"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      dark
                        ? "bg-white/5 text-slate-300 hover:bg-[#00E5FF]/12 hover:text-[#00E5FF]"
                        : "bg-slate-50 text-slate-600 hover:bg-[#00E5FF]/8 hover:text-[#00E5FF]"
                    }`}
                  >
                    Barcha kurslarni ko'rish <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <NavLink to="/about" className={({ isActive }) => linkCls(isActive)}>Biz haqimizda</NavLink>
            <NavLink to="/contact" className={({ isActive }) => linkCls(isActive)}>Aloqa</NavLink>
          </div>

          {/* Right: search + theme + burger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Qidirish"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                searchOpen
                  ? "bg-[#00E5FF]/15 text-[#00E5FF]"
                  : dark
                    ? "text-slate-400 hover:bg-white/10 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Search size={16} />
            </button>
            <ThemeToggle dark={dark} />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menyu"
              className={`md:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                dark
                  ? "text-slate-400 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search panel ──────────────────────────────────── */}
      <div className={`w-full max-w-[82%] rounded-2xl border backdrop-blur-2xl overflow-hidden
        transition-all duration-300 ease-in-out ${pill} ${
        searchOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
      }`}>
        <div className="px-4 py-3">
          {/* Input row */}
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
            dark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
          }`}>
            <Search size={15} className={dark ? "text-slate-500 shrink-0" : "text-slate-400 shrink-0"} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Maqola yoki kurs qidiring..."
              className={`flex-1 bg-transparent text-sm outline-none ${
                dark ? "text-white placeholder:text-slate-600" : "text-slate-900 placeholder:text-slate-400"
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results */}
          {searchQuery.trim() && (
            <div className="mt-3 space-y-3">
              {searchLoading ? (
                <p className={`text-xs text-center py-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>Qidirilmoqda...</p>
              ) : searchResults.posts.length === 0 && searchResults.courses.length === 0 ? (
                <p className={`text-xs text-center py-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                  "{searchQuery}" bo'yicha hech narsa topilmadi
                </p>
              ) : (
                <>
                  {searchResults.posts.length > 0 && (
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                        Maqolalar
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.posts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              dark ? "hover:bg-white/6" : "hover:bg-slate-100"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              dark ? "bg-white/5" : "bg-slate-100"
                            }`}>
                              <FileText size={13} className={dark ? "text-slate-400" : "text-slate-500"} />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>
                                {post.title}
                              </p>
                              <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>
                                {post.category?.name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.courses.length > 0 && (
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                        Kurslar
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.courses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.slug}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              dark ? "hover:bg-white/6" : "hover:bg-slate-100"
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                              <img src={mediaUrl(course.cover)} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>
                                {course.title}
                              </p>
                              <p className={`text-[10px] truncate ${
                                course.price === "Bepul" ? "text-emerald-500" : "text-[#FF3D57]"
                              }`}>
                                {course.price} · {course.level}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile dropdown pill ───────────────────────────── */}
      <div className={`md:hidden w-full max-w-[82%] rounded-2xl border backdrop-blur-2xl overflow-hidden
        transition-all duration-300 ease-in-out ${pill} ${
        menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
      }`}>
        <div className="px-3 py-3 flex flex-col gap-1">
          <NavLink to="/blog" className={({ isActive }) => mobileLinkCls(isActive)}>Blog</NavLink>

          {/* Kurslar accordion */}
          <div className={`rounded-xl overflow-hidden ${dark ? "bg-white/4" : "bg-slate-50 border border-slate-200"}`}>
            <button
              onClick={() => setMobileCoursesOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2"><GraduationCap size={14} /> Kurslar</span>
              <ChevronDown size={13} className={`transition-transform duration-250 ${mobileCoursesOpen ? "rotate-180 text-[#00E5FF]" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-250 ${mobileCoursesOpen ? "max-h-80" : "max-h-0"}`}>
              <div className={`border-t divide-y ${dark ? "border-white/8 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
                  >
                    <img src={mediaUrl(course.cover)} alt={course.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${dark ? "text-slate-300" : "text-slate-700"}`}>{course.title}</p>
                      <p className={`text-[10px] mt-0.5 ${course.price === "Bepul" ? "text-emerald-500" : "text-[#FF3D57]"}`}>
                        {course.price} · {course.level}
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/courses"
                  className={`flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#00E5FF] transition-colors ${
                    dark ? "hover:bg-[#00E5FF]/8" : "hover:bg-[#00E5FF]/6"
                  }`}
                >
                  Barcha kurslar <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/about" className={({ isActive }) => mobileLinkCls(isActive)}>Biz haqimizda</NavLink>
          <NavLink to="/contact" className={({ isActive }) => mobileLinkCls(isActive)}>Aloqa</NavLink>
        </div>
      </div>

    </header>
  )
}
