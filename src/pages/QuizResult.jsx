import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from "lucide-react"
import { getAttempt } from "../api/quizzes"
import { useThemeStore } from "../store/theme"
import Loader from "../components/Loader"

export default function QuizResult() {
  const { attemptId } = useParams()
  const { theme } = useThemeStore()
  const dark = theme === "dark"
  const [attempt, setAttempt] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => { getAttempt(attemptId).then((res) => setAttempt(res.data)).catch(() => setError(true)) }, [attemptId])
  if (!attempt && !error) return <Loader />
  if (error) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-rose-500">Natija topilmadi.</div>

  return <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12"><Link to="/tests" className={`inline-flex items-center gap-2 text-sm mb-8 ${dark ? "text-slate-400" : "text-slate-500"}`}><ArrowLeft size={15} /> Testlar</Link><div className={`rounded-2xl border p-6 sm:p-10 text-center ${dark ? "bg-[#0e1726] border-white/8" : "bg-white border-slate-200 shadow-sm"}`}><div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 ${attempt.passed ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>{attempt.passed ? <CheckCircle2 size={42} /> : <XCircle size={42} />}</div><h1 className={`text-2xl font-extrabold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{attempt.passed ? "Tabriklaymiz!" : "Yana bir bor urinib ko'ring"}</h1><p className={dark ? "text-slate-400" : "text-slate-600"}>{attempt.quiz_title}</p><div className="text-5xl font-black text-blue-500 my-7">{attempt.score}%</div><p className={`text-sm mb-8 ${dark ? "text-slate-400" : "text-slate-600"}`}>{attempt.correct_answers} / {attempt.total_questions} ta savolga to'g'ri javob berdingiz.</p><div className="flex flex-col sm:flex-row justify-center gap-3"><Link to="/tests" className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold ${dark ? "bg-white/8 text-slate-200" : "bg-slate-100 text-slate-700"}`}><ArrowLeft size={15} /> Testlar</Link><Link to={`/tests/${attempt.quiz_slug}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"><RotateCcw size={15} /> Qayta ishlash</Link></div></div></div>
}
