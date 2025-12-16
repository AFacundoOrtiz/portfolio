"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Button variant="ghost" size="icon" disabled />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative overflow-hidden hover:bg-primary/10 transition-colors"
      title="Cambiar tema"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-primary drop-shadow-[0_0_8px_rgba(255,193,7,0.4)]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}