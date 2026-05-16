import { Link } from "react-router-dom"
import { BookOpen, Clock, Users } from "lucide-react"
import { useThemeStore } from "../store/theme"
import { mediaUrl } from "../utils/media"

export default function CourseCard({ course }) {
  const { theme } = useThemeStore()
  const dark = theme === "dark"
  const isFree = course.price === "Bepul"

  const levelCls = {
    "Boshlang'ich": dark
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-emerald-50 text-emerald-700",
    "O'rta": dark
      ? "bg-amber-500/10 text-amber-400"
      : "bg-amber-50 text-amber-700",
    "Yuqori": dark
      ? "bg-rose-500/10 text-rose-400"
      : "bg-rose-50 text-rose-700",
  }

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={`group flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
        dark
          ? "bg-[#0e1726] shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-black/50"
          : "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
      }`}
    >
      {/* Cover */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={mediaUrl(course.cover)}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Price */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            isFree
              ? dark
                ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                : "bg-emerald-50 text-emerald-700"
              : dark
                ? "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30"
                : "bg-rose-50 text-rose-700"
          }`}>
            {isFree ? "Bepul" : "Pullik"}
          </span>
        </div>
        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            dark
              ? "bg-[rgba(0,229,255,0.15)] text-[#00E5FF] ring-1 ring-[rgba(0,229,255,0.25)]"
              : "bg-white/90 text-sky-700 shadow-sm backdrop-blur-sm"
          }`}>
            {course.category.name}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        {/* Level */}
        <span className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          levelCls[course.level] ?? (dark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500")
        }`}>
          {course.level}
        </span>

        <h3 className={`text-[15px] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[#00E5FF] ${
          dark ? "text-slate-100" : "text-slate-900"
        }`}>
          {course.title}
        </h3>

        <p className={`text-sm leading-relaxed line-clamp-2 flex-1 ${
          dark ? "text-slate-400" : "text-slate-500"
        }`}>
          {course.short_description}
        </p>

        {/* Stats */}
        <div className={`flex items-center gap-4 text-[11px] pt-3 mt-1 border-t ${
          dark ? "border-white/[0.06] text-slate-500" : "border-slate-100 text-slate-400"
        }`}>
          <span className="flex items-center gap-1.5">
            <BookOpen size={11} /> {course.lessons_count} lesson
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={11} /> {course.students.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  )
}
