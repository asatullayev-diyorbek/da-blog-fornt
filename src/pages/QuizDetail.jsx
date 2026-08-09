import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Ghost,
  ListChecks,
  Send,
  Sparkles,
} from "lucide-react";
import { getQuiz, startQuiz, submitQuiz } from "../api/quizzes";
import { useThemeStore } from "../store/theme";
import { useAuthStore } from "../store/auth";
import Loader from "../components/Loader";

export default function QuizDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dark = useThemeStore((state) => state.theme) === "dark";
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const progressKey = `quiz-progress:${slug}:${user?.id || accessToken || "guest"}`;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let savedProgress = null;
    try {
      savedProgress = JSON.parse(localStorage.getItem(progressKey) || "null");
    } catch {
      savedProgress = null;
    }

    Promise.all([
      getQuiz(slug),
      savedProgress?.attemptId ? Promise.resolve(null) : startQuiz(slug),
    ])
      .then(([quizRes, startRes]) => {
        const quizData = quizRes.data;
        const savedQuestionIds = savedProgress?.questionOrder || [];
        if (savedQuestionIds.length && quizData.questions) {
          const questionsById = new Map(
            quizData.questions.map((item) => [item.id, item]),
          );
          const savedQuestions = savedQuestionIds
            .map((id) => questionsById.get(id))
            .filter(Boolean);
          const savedQuestionSet = new Set(savedQuestionIds);
          quizData.questions = [
            ...savedQuestions,
            ...quizData.questions.filter((item) => !savedQuestionSet.has(item.id)),
          ];
        }

        setQuiz(quizData);
        setAttemptId(savedProgress?.attemptId || startRes.data.attempt_id);
        if (savedProgress) {
          setAnswers(savedProgress.answers || {});
          setCurrent(savedProgress.current || 0);
          setSecondsLeft(savedProgress.secondsLeft ?? null);
        } else if (quizData.time_limit > 0) {
          setSecondsLeft(quizData.time_limit);
        }
        setHydrated(true);
      })
      .catch(() => setError("Testni yuklashda xatolik yuz berdi."))
      .finally(() => setLoading(false));
  }, [progressKey, slug]);

  useEffect(() => {
    if (!hydrated || !quiz || !attemptId) return;
    localStorage.setItem(
      progressKey,
      JSON.stringify({
        attemptId,
        answers,
        current,
        secondsLeft,
        questionOrder: quiz.questions.map((item) => item.id),
      }),
    );
  }, [answers, attemptId, current, hydrated, progressKey, quiz, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === null || submitting) return undefined;
    if (secondsLeft <= 0) {
      handleSubmit();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitting]);

  useEffect(() => {
    if (loading || submitting) return undefined;

    function warnBeforeLeave(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [loading, submitting]);

  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
  const question = questions[current];
  const timeProgress =
    quiz?.time_limit > 0 && secondsLeft !== null
      ? Math.max(0, Math.min(100, (secondsLeft / quiz.time_limit) * 100))
      : 0;
  const answeredCount = Object.keys(answers).length;
  const formattedTime = useMemo(
    () =>
      secondsLeft === null
        ? null
        : `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`,
    [secondsLeft],
  );

  useEffect(() => {
    function handleQuestionNavigation(event) {
      if (submitting || !questions.length) return;
      const optionIndex = ["a", "b", "c", "d"].indexOf(event.key.toLowerCase());
      const currentOptions = questions[current]?.options ?? [];
      if (optionIndex >= 0 && currentOptions[optionIndex]) {
        event.preventDefault();
        setAnswers((previous) => ({
          ...previous,
          [questions[current].id]: currentOptions[optionIndex].id,
        }));
        return;
      }
      if (event.key === "ArrowLeft") {
        setCurrent((value) => Math.max(0, value - 1));
      }
      if (event.key === "ArrowRight") {
        setCurrent((value) => Math.min(questions.length - 1, value + 1));
      }
    }

    window.addEventListener("keydown", handleQuestionNavigation);
    return () => window.removeEventListener("keydown", handleQuestionNavigation);
  }, [current, questions, submitting]);

  function selectAnswer(optionId) {
    setAnswers((previous) => ({ ...previous, [question.id]: optionId }));
  }

  async function handleSubmit() {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      await submitQuiz(attemptId, answers);
      localStorage.removeItem(progressKey);
      navigate(`/tests/result/${attemptId}`);
    } catch {
      setError(
        "Javoblarni yuborishda xatolik yuz berdi. Qayta urinib ko'ring.",
      );
      setSubmitting(false);
    }
  }

  if (loading) return <Loader />;
  if (error && !quiz)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-rose-500">
        {error}
      </div>
    );
  if (!quiz || !question)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        Bu testda savollar yo'q.
      </div>
    );

  return (
    <div className="h-[100dvh] overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <Link
          to="/tests"
          onClick={(event) => {
            if (!window.confirm("Testdan chiqmoqchimisiz? Davom etayotgan natijalar saqlanadi.")) {
              event.preventDefault();
            }
          }}
          className={`mb-4 inline-flex shrink-0 items-center gap-2 text-sm ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
        >
          <ArrowLeft size={15} /> Testlar
        </Link>
        <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          <aside
            className={`hidden rounded-2xl border p-4 lg:block ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  Test jarayoni
                </p>
                <h1
                  className={`mt-1 line-clamp-2 text-sm font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {quiz.title}
                </h1>
              </div>
              <ListChecks size={18} className="shrink-0 text-blue-500" />
            </div>
            <div
              className={`mb-4 h-2 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"}`}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${(answeredCount / questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {answeredCount}/{questions.length} javob
              </span>
              <span>
                {Math.round(((current + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((item, index) => {
                const answered = answers[item.id] !== undefined;
                const active = index === current;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrent(index)}
                    className={`flex h-8 items-center justify-center rounded-lg text-xs font-bold transition ${active ? "bg-blue-600 text-white" : answered ? (dark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600") : dark ? "bg-white/5 text-slate-500 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div
              className={`mt-5 border-t pt-4 text-xs ${dark ? "border-white/8 text-slate-500" : "border-slate-100 text-slate-400"}`}
            >
              <div className="flex items-center justify-between">
                <span>Ball</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                  <Sparkles size={13} /> {quiz.xp_reward || 50} XP gacha
                </span>
              </div>
              {formattedTime && (
                <div className="mt-3">
                  <div
                    className={`mb-1.5 flex items-center justify-between ${secondsLeft < 30 ? "text-rose-500" : ""}`}
                  >
                    <span>Vaqt</span>
                    <span className="inline-flex items-center gap-1 font-bold">
                      <Clock size={13} /> {formattedTime}
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${secondsLeft < 30 ? "bg-rose-500" : "bg-blue-500"}`}
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
          <main
            className={`min-h-0 rounded-3xl border p-4 sm:p-5 ${dark ? "border-white/8 bg-[#0e1726]" : "border-slate-200 bg-white shadow-sm"}`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    {quiz.category || "Test"}
                  </span>
                  {quiz.topic && (
                    <span className="text-xs text-slate-500">{quiz.topic}</span>
                  )}
                </div>
                <p className="text-xs font-bold text-blue-500">
                  {current + 1} / {questions.length}-savol
                </p>
              </div>
              <div
                className={`hidden items-center gap-1.5 text-sm font-bold sm:flex ${secondsLeft !== null && secondsLeft < 30 ? "text-rose-500" : "text-blue-500"}`}
              >
                <Clock size={16} /> {formattedTime || "Timer yo'q"}
              </div>
            </div>
            {!user && (
              <div
                className={`mb-6 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs ${dark ? "bg-violet-400/8 text-violet-300" : "bg-violet-50 text-violet-700"}`}
              >
                <Ghost size={14} /> Ghost rejim — natijangizni saqlash uchun
                Telegram orqali kiring.
              </div>
            )}
            {formattedTime && (
              <div className="mb-6 sm:hidden">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} /> Qolgan vaqt
                  </span>
                  <span
                    className={
                      secondsLeft < 30
                        ? "text-rose-500"
                        : dark
                          ? "text-blue-300"
                          : "text-blue-600"
                    }
                  >
                    {formattedTime}
                  </span>
                </div>
                <div
                  className={`h-2 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${secondsLeft < 30 ? "bg-rose-500" : "bg-blue-500"}`}
                    style={{ width: `${timeProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div
              className={`mb-5 h-1.5 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"}`}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <div
              className={`mb-4 rounded-2xl border p-4 sm:p-5 ${dark ? "border-white/8 bg-white/[0.025]" : "border-slate-100 bg-slate-50/70"}`}
            >
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Savol {current + 1}
              </span>
              <h2
                className={`text-lg font-extrabold leading-snug sm:text-xl ${dark ? "text-white" : "text-slate-900"}`}
              >
                {question.text}
              </h2>
            </div>
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => selectAnswer(option.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all sm:p-3 ${selected ? "border-blue-500 bg-blue-600/10 shadow-sm shadow-blue-500/10" : dark ? "border-white/10 text-slate-300 hover:border-blue-500/50 hover:bg-white/[0.03]" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40"}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${selected ? "bg-blue-600 text-white" : dark ? "bg-white/8 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-sm">{option.text}</span>
                    {selected && (
                      <CheckCircle2 size={18} className="text-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div
              className={`mt-5 flex items-center justify-between gap-3 border-t pt-4 ${dark ? "border-white/8" : "border-slate-100"}`}
            >
              <p
                className={`shrink-0 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}
              >
                {answeredCount} / {questions.length}{" "}
                <span className="hidden sm:inline">
                  ta savolga javob berildi
                </span>
              </p>
              <button
                disabled={current === 0}
                onClick={() => setCurrent((value) => value - 1)}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold disabled:opacity-30 sm:px-4 ${dark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}
              >
                <ArrowLeft size={15} />{" "}
                <span className="hidden sm:inline">Oldingi</span>
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent((value) => value + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Keyingi <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Yuborilmoqda..." : "Yakunlash"}{" "}
                  <Send size={15} />
                </button>
              )}
            </div>
            {error && (
              <p className="mt-3 text-center text-sm text-rose-500">{error}</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
