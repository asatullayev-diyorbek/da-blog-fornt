import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useThemeStore } from "../store/theme"

export default function MarkdownProse({ children, className = "" }) {
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const components = {
    p: ({ children }) => (
      <p className={`leading-relaxed my-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</p>
    ),
    strong: ({ children }) => (
      <strong className={dark ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => (
      <ul className={`list-disc list-inside my-2 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={`list-decimal list-inside my-2 space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{children}</ol>
    ),
    li: ({ children }) => <li className="ml-2">{children}</li>,
    a: ({ href, children }) => (
      <a href={href} className="text-[#00E5FF] hover:underline" target="_blank" rel="noreferrer">{children}</a>
    ),
    code: ({ children }) => (
      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
        dark ? "bg-white/10 text-[#00E5FF]" : "bg-slate-100 text-sky-700"
      }`}>{children}</code>
    ),
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
