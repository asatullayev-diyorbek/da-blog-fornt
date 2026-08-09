import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { useThemeStore } from "./store/theme"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import BlogDetail from "./pages/BlogDetail"
import Category from "./pages/Category"
import Courses from "./pages/Courses"
import CourseDetail from "./pages/CourseDetail"
import LessonDetail from "./pages/LessonDetail"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import Quizzes from "./pages/Quizzes"
import QuizDetail from "./pages/QuizDetail"
import QuizResult from "./pages/QuizResult"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Leaderboard from "./pages/Leaderboard"
import ArenaLobby from "./pages/ArenaLobby"
import ArenaPlay from "./pages/ArenaPlay"
import { getMe } from "./api/auth"
import { useAuthStore } from "./store/auth"

export default function App() {
  const { theme } = useThemeStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  useEffect(() => {
    if (accessToken) getMe().then((res) => setUser(res.data)).catch(() => {})
  }, [accessToken, setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/courses/:slug/lessons/:lessonSlug" element={<LessonDetail />} />
          <Route path="/tests" element={<Quizzes />} />
          <Route path="/tests/:slug" element={<QuizDetail />} />
          <Route path="/tests/result/:attemptId" element={<QuizResult />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/arena/:code" element={<ArenaLobby />} />
          <Route path="/arena/:code/play" element={<ArenaPlay />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
