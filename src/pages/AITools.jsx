import { Helmet } from "react-helmet-async"
import { BrainCircuit, Sparkles } from "lucide-react"
import { useThemeStore } from "../store/theme"

export default function AITools() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <Helmet><title>AI Vositalar — ChaqimchiAI Academy</title></Helmet>

      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
        dark ? "bg-blue-600/15" : "bg-blue-50"
      }`}>
        <BrainCircuit size={28} className="text-blue-600" />
      </div>

      <h1 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
        AI Vositalar
      </h1>

      <p className={`text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed ${
        dark ? "text-slate-400" : "text-slate-600"
      }`}>
        Bu bo'lim hozircha tayyorlanmoqda. AI vositalar va resurslar tez orada qo'shiladi.
      </p>

      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
        dark ? "bg-blue-600/15 text-blue-400" : "bg-blue-50 text-blue-600"
      }`}>
        <Sparkles size={14} />
        Tez kunda
      </span>
    </div>
  )
}
