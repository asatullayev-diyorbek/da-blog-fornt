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
  const dropdownTimeout = useRef(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ posts: [], courses: [] })
  const [searchLoading, setSearchLoading] = useState(false)
  const searchInputRef = useRef(null)
  const searchDebounce = useRef(null)

  const location = useLocation()

  useEffect(() => {
    getCourses({ page_size: 8 }).then((res) => {
      setCourses(res.data.results ?? res.data)
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

  const openDropdown = () => {
    clearTimeout(dropdownTimeout.current)
    setDropdownOpen(true)
  }
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  // ── pill-style active state, no underline needed
  const linkCls = (isActive) =>
    `px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 whitespace-nowrap ${
      isActive
        ? dark
          ? "text-blue-400 bg-blue-500/10 font-semibold"
          : "text-blue-600 bg-blue-50 font-semibold"
        : dark
          ? "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
    }`

  const mobileLinkCls = (isActive) =>
    `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? `text-blue-600 ${dark ? "bg-blue-500/10" : "bg-blue-50"}`
        : dark
          ? "text-slate-400 hover:text-white hover:bg-white/6"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      dark
        ? "bg-[#060B14]/98 border-b border-white/[0.07] backdrop-blur-2xl"
        : "bg-white/98 border-b border-slate-200/80 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)]"
    }`}>

      {/* Subtle top glow line — dark mode only */}
      {dark && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/35 to-transparent pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-[70px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2.5 group transition-opacity hover:opacity-80">
            <>
              <img src="/logo-small.png" alt="ChaqimchiAI" className="h-12 w-auto object-contain" />
              <div className="hidden sm:flex flex-col leading-none gap-[3px]">
                <span className={`font-extrabold text-[17px] tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                  Chaqimchi<span className="text-blue-500">AI</span>
                </span>
                <span className="text-[14px] font-bold text-white bg-blue-600 rounded-md px-1.5 py-[3px] text-center tracking-wide">
                  academy
                </span>
              </div>
            </>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => linkCls(isActive)}>
              Bosh sahifa
            </NavLink>

            {/* Kurslar dropdown */}
            <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <NavLink
                to="/courses"
                className={({ isActive }) => `inline-flex items-center gap-1.5 ${linkCls(isActive)}`}
              >
                <GraduationCap size={14} />
                Kurslar
                <ChevronDown
                  size={12}
                  className={`mt-px transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-blue-500" : ""}`}
                />
              </NavLink>

              {/* Dropdown panel */}
              <div
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                className={`absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[520px] rounded-2xl border p-5 transition-all duration-200 origin-top ${
                  dropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                } ${
                  dark
                    ? "bg-[#08101c] border-white/10 shadow-2xl shadow-black/70"
                    : "bg-white border-slate-200/80 shadow-2xl shadow-slate-900/10"
                }`}
              >
                <div className={`flex items-center justify-between mb-4 pb-3.5 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? "bg-blue-600/15" : "bg-blue-50"}`}>
                      <BookOpen size={14} className="text-blue-600" />
                    </div>
                    <span className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                      Barcha kurslar
                    </span>
                  </div>
                  <Link to="/courses" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:opacity-70 transition-opacity group">
                    Ko'proq <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

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
                          <p className={`text-[11px] font-semibold leading-snug line-clamp-2 mb-1.5 transition-colors group-hover:text-blue-600 ${
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
                            <span className={`text-[10px] font-semibold ${course.price === "Bepul" ? "text-emerald-500" : "text-red-500"}`}>
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

                <div className={`mt-4 pt-3.5 border-t ${dark ? "border-white/8" : "border-slate-100"}`}>
                  <Link
                    to="/courses"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      dark
                        ? "bg-white/5 text-slate-300 hover:bg-blue-600/15 hover:text-blue-400"
                        : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    Barcha kurslarni ko'rish <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <NavLink to="/blog" className={({ isActive }) => linkCls(isActive)}>
              Blog
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => linkCls(isActive)}>
              Haqida
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Qidirish"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                searchOpen
                  ? "bg-blue-600/15 text-blue-500"
                  : dark
                    ? "text-slate-400 hover:bg-white/8 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Search size={17} />
            </button>

            <ThemeToggle dark={dark} />


            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menyu"
              className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                dark
                  ? "text-slate-400 hover:bg-white/8 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search panel ── */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out border-t ${
        searchOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 border-transparent"
      } ${dark ? "border-white/8" : "border-slate-100"}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-3.5 ${dark ? "bg-[#060B14]" : "bg-white"}`}>
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

          {searchQuery.trim() && (
            <div className="mt-3 space-y-3 pb-1">
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
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>Maqolalar</p>
                      <div className="space-y-0.5">
                        {searchResults.posts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${dark ? "hover:bg-white/6" : "hover:bg-slate-100"}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-white/5" : "bg-slate-100"}`}>
                              <FileText size={13} className={dark ? "text-slate-400" : "text-slate-500"} />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>{post.title}</p>
                              <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{post.category?.name}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.courses.length > 0 && (
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>Kurslar</p>
                      <div className="space-y-0.5">
                        {searchResults.courses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.slug}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${dark ? "hover:bg-white/6" : "hover:bg-slate-100"}`}
                          >
                            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                              <img src={mediaUrl(course.cover)} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>{course.title}</p>
                              <p className={`text-[10px] truncate ${course.price === "Bepul" ? "text-emerald-500" : "text-red-500"}`}>
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

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
        menuOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0 border-transparent"
      } ${dark ? "border-white/8 bg-[#060B14]" : "border-slate-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          <NavLink to="/" end className={({ isActive }) => mobileLinkCls(isActive)}>Bosh sahifa</NavLink>

          {/* Kurslar accordion */}
          <div className={`rounded-xl overflow-hidden ${dark ? "bg-white/4" : "bg-slate-50 border border-slate-200"}`}>
            <button
              onClick={() => setMobileCoursesOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2"><GraduationCap size={14} /> Kurslar</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${mobileCoursesOpen ? "rotate-180 text-blue-600" : ""}`} />
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
                      <p className={`text-[10px] mt-0.5 ${course.price === "Bepul" ? "text-emerald-500" : "text-red-500"}`}>
                        {course.price} · {course.level}
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/courses"
                  className={`flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-blue-600 transition-colors ${dark ? "hover:bg-blue-600/8" : "hover:bg-blue-50"}`}
                >
                  Barcha kurslar <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/blog" className={({ isActive }) => mobileLinkCls(isActive)}>Blog</NavLink>
          <NavLink to="/about" className={({ isActive }) => mobileLinkCls(isActive)}>Haqida</NavLink>

        </div>
      </div>

    </header>
  )
}
