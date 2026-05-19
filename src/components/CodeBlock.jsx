import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"

export default function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace("language-", "") || "text"
  const code = String(children).replace(/\n$/, "")

  if (language === "svg") {
    return (
      <div
        className="my-5 flex justify-center items-center"
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
    <div className="relative group my-5 rounded-xl overflow-hidden border border-white/10">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a2236] border-b border-white/10">
        <span className="text-xs text-slate-500 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
        >
          {copied ? <Check size={13} className="text-[#00E5FF]" /> : <Copy size={13} />}
          {copied ? "Nusxalandi" : "Nusxalash"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#0d1424",
          fontSize: "0.85rem",
          lineHeight: "1.6",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
