import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { Code2, Globe, Smartphone, BrainCircuit, Database, Shield, ChevronRight } from "lucide-react"
import { useThemeStore } from "../store/theme"

const TRACKS = [
  { icon: Code2,        label: "Dasturlash",           desc: "Python, JavaScript, C++ va boshqa dasturlash tillari",  color: "text-blue-600",   bg: "bg-blue-50",   bgDark: "bg-blue-600/10" },
  { icon: Globe,        label: "Web Development",      desc: "Frontend va Backend web ilovalar yaratish",             color: "text-cyan-600",   bg: "bg-cyan-50",   bgDark: "bg-cyan-600/10" },
  { icon: Smartphone,   label: "Mobil Development",    desc: "React Native va Flutter bilan mobil ilovalar",          color: "text-violet-600", bg: "bg-violet-50", bgDark: "bg-violet-600/10" },
  { icon: BrainCircuit, label: "AI & Machine Learning",desc: "Sun'iy intellekt va mashinali o'rganish asoslari",      color: "text-emerald-600",bg: "bg-emerald-50",bgDark: "bg-emerald-600/10" },
  { icon: Database,     label: "Ma'lumotlar Bazasi",   desc: "SQL, PostgreSQL, MongoDB va boshqa DBMS tizimlar",      color: "text-orange-600", bg: "bg-orange-50", bgDark: "bg-orange-600/10" },
  { icon: Shield,       label: "Cyber Security",       desc: "Axborot xavfsizligi va tarmoq himoyasi asoslari",       color: "text-red-600",    bg: "bg-red-50",    bgDark: "bg-red-600/10" },
]

export default function YoNalishlar() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Helmet><title>Yo'nalishlar — ChaqimchiAI Academy</title></Helmet>

      <div className="mb-10 text-center">
        <h1 className={`text-3xl sm:text-4xl font-extrabold mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
          Yo'nalishlar
        </h1>
        <p className={`text-base sm:text-lg max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
          Kelajakka olib boradigan yo'nalishlarni tanlang va o'rganishni boshlang
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRACKS.map(({ icon: Icon, label, desc, color, bg, bgDark }) => (
          <Link
            key={label}
            to="/courses"
            className={`group flex items-start gap-4 p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
              dark
                ? "border-white/8 bg-white/3 hover:border-blue-600/40 hover:bg-white/6"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dark ? bgDark : bg}`}>
              <Icon size={22} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className={`font-bold text-[15px] ${dark ? "text-slate-100" : "text-slate-800"}`}>{label}</h3>
                <ChevronRight size={15} className={`shrink-0 transition-transform group-hover:translate-x-1 ${dark ? "text-slate-600" : "text-slate-400"}`} />
              </div>
              <p className={`text-[13px] leading-snug ${dark ? "text-slate-400" : "text-slate-500"}`}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
