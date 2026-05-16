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

export default function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
