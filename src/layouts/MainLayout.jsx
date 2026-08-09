import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout() {
  const location = useLocation()
  const isQuizRun = /^\/tests\/[^/]+$/.test(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!isQuizRun && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isQuizRun && <Footer />}
    </div>
  )
}
