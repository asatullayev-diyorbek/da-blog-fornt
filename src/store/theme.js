import { create } from "zustand"

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "dark",

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)
      document.documentElement.className = next
      return { theme: next }
    }),
}))
