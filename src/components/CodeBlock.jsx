import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { useThemeStore } from "../store/theme"

export default function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const { theme } = useThemeStore()
  const dark = theme === "dark"

  const language = className?.replace("language-", "") || "text"
  const code = String(children).replace(/\n$/, "")

  if (language === "svg") {
    return (
      <div
        className={`my-5 flex justify-center items-center p-6 rounded-xl border ${
          dark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
        }`}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative group my-5 rounded-xl overflow-hidden border ${
      dark ? "border-white/10" : "border-slate-200"
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        dark
          ? "bg-[#1a2236] border-white/10"
          : "bg-slate-100 border-slate-200"
      }`}>
        <span className={`text-xs font-mono ${dark ? "text-slate-500" : "text-slate-400"}`}>{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            dark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          {copied ? <Check size={13} className="text-[#00E5FF]" /> : <Copy size={13} />}
          {copied ? "Nusxalandi" : "Nusxalash"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={dark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: dark ? "#0d1424" : "#f8fafc",
          fontSize: "0.85rem",
          lineHeight: "1.6",
        }}
        showLineNumbers
        lineNumberStyle={{
          color: dark ? "#334155" : "#cbd5e1",
          minWidth: "2.5em",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
