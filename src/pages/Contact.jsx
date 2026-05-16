import { Mail, MessageSquare, Code2, PlayCircle, Send } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { useThemeStore } from "../store/theme"

const channels = [
  {
    icon: PlayCircle,
    label: "YouTube",
    desc: "Video darslar va amaliy loyihalar",
    color: "text-[#FF3D57]",
    bg: "bg-[#FF3D57]/10",
    href: "#",
  },
  {
    icon: MessageSquare,
    label: "Telegram",
    desc: "Jamiyat va tezkor javoblar",
    color: "text-[#00E5FF]",
    bg: "bg-[#00E5FF]/10",
    href: "#",
  },
  {
    icon: Code2,
    label: "GitHub",
    desc: "Loyiha kodlari va namunalar",
    color: "text-slate-400",
    bg: "bg-white/8",
    href: "#",
  },
]

export default function Contact() {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Helmet><title>Aloqa — DA Blog</title></Helmet>
      {/* Header */}
      <div className="text-center mb-14">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
          dark ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" : "bg-[#00E5FF]/10 text-cyan-600 border border-cyan-200"
        }`}>
          Aloqa
        </div>
        <h1 className={`text-4xl font-extrabold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
          Bog'laning
        </h1>
        <p className={`text-lg max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
          Savol, taklif yoki hamkorlik bo'yicha murojaat qiling. Har bir xabarga javob beramiz.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact form */}
        <div className={`rounded-2xl border p-7 ${
          dark ? "bg-[#131929] border-white/10" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h2 className={`text-lg font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
            Xabar yuborish
          </h2>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Ismingiz
              </label>
              <input
                type="text"
                placeholder="Ism Familiya"
                className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
                  dark
                    ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E5FF]/50 focus:bg-white/8"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00E5FF] focus:bg-white"
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
                  dark
                    ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E5FF]/50 focus:bg-white/8"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00E5FF] focus:bg-white"
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Xabar
              </label>
              <textarea
                rows={4}
                placeholder="Xabaringizni yozing..."
                className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors resize-none ${
                  dark
                    ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E5FF]/50 focus:bg-white/8"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00E5FF] focus:bg-white"
                }`}
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-semibold text-sm hover:bg-[#00E5FF]/88 active:scale-[0.98] transition-all duration-150"
            >
              <Send size={15} />
              Yuborish
            </button>
          </form>
        </div>

        {/* Channels */}
        <div className="flex flex-col gap-4">
          <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>
            Ijtimoiy tarmoqlar
          </h2>
          {channels.map(({ icon: Icon, label, desc, color, bg, href }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 group ${
                dark
                  ? "bg-[#131929] border-white/10 hover:border-white/20"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <div className={`text-sm font-semibold transition-colors group-hover:text-[#00E5FF] ${dark ? "text-white" : "text-slate-900"}`}>
                  {label}
                </div>
                <div className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-500"}`}>
                  {desc}
                </div>
              </div>
            </a>
          ))}

          {/* Email direct */}
          <a
            href="mailto:hello@dablog.uz"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-200 group ${
              dark
                ? "bg-[#131929] border-white/10 hover:border-white/20"
                : "bg-white border-slate-200 shadow-sm hover:shadow-md"
            }`}
          >
            <Mail size={16} className="text-slate-500 shrink-0" />
            <span className={`text-sm transition-colors group-hover:text-[#00E5FF] ${dark ? "text-slate-400" : "text-slate-600"}`}>
              hello@dablog.uz
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
