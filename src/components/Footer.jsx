import { Link } from "react-router-dom"
import { Code2, PlayCircle, X } from "lucide-react"
import { useThemeStore } from "../store/theme"

export default function Footer() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  return (
    <footer className={`mt-24 border-t ${
      dark ? "border-white/[0.07] bg-[#080d16]" : "border-slate-200 bg-white"
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center">
              <img src={dark ? "/logo-dark.png" : "/logo-light.png"} alt="DA Blog" className="h-10 w-auto" />
            </Link>
            <p className={`text-sm mt-3 max-w-xs leading-relaxed ${
              dark ? "text-slate-500" : "text-slate-500"
            }`}>
              Developer Brand Platform — o'zbek tilida sifatli texnologiya kontenti.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                dark ? "text-slate-500" : "text-slate-400"
              }`}>Sahifalar</p>
              <div className="flex flex-col gap-2">
                {[
                  { to: "/blog", label: "Blog" },
                  { to: "/courses", label: "Kurslar" },
                  { to: "/about", label: "Biz haqimizda" },
                  { to: "/contact", label: "Aloqa" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} className={`text-sm transition-colors ${
                    dark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${
              dark ? "text-slate-500" : "text-slate-400"
            }`}>Ijtimoiy</p>
            <div className="flex items-center gap-3">
              {[
                { icon: Code2, label: "GitHub", color: dark ? "hover:text-white" : "hover:text-slate-900" },
                { icon: PlayCircle, label: "YouTube", color: "hover:text-rose-500" },
                { icon: X, label: "X", color: dark ? "hover:text-white" : "hover:text-slate-900" },
              ].map(({ icon: Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${color} ${
                    dark
                      ? "bg-white/[0.05] text-slate-500 hover:bg-white/10"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
          dark ? "border-white/[0.06] text-slate-600" : "border-slate-100 text-slate-400"
        }`}>
          <span>© {new Date().getFullYear()} DA Blog. Barcha huquqlar himoyalangan.</span>
          <span>O'zbekistonda qurilgan 🇺🇿</span>
        </div>
      </div>
    </footer>
  )
}
