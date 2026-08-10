import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Home, ArrowLeft } from "lucide-react"
import { useThemeStore } from "../store/theme"

export default function NotFound() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <Helmet><title>404 — ChaqimchiAI Academy</title></Helmet>

      <p className="text-8xl font-extrabold text-[#00E5FF] leading-none mb-4">404</p>

      <h1 className={`text-2xl font-bold mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
        Sahifa topilmadi
      </h1>
      <p className={`text-sm mb-8 max-w-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
        Siz izlayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            dark
              ? "bg-white/8 text-slate-300 hover:bg-white/12"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ArrowLeft size={15} /> Orqaga
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#00E5FF] text-[#0B0F19] hover:bg-[#00E5FF]/90 transition-colors"
        >
          <Home size={15} /> Bosh sahifa
        </Link>
      </div>
    </div>
  )
}
