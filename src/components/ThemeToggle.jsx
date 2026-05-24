import { Sun, Moon } from "lucide-react"
import { useThemeStore } from "../store/theme"

export default function ThemeToggle({ dark }) {
  const { toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Temani o'zgartirish"
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
        dark
          ? "bg-white/8 text-slate-400 hover:bg-white/15 hover:text-blue-400"
          : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
