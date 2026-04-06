"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface PromptScreenProps {
  onSubmit: (prompt: string) => void
}

export function PromptScreen({ onSubmit }: PromptScreenProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = () => {
    if (prompt.trim()) onSubmit(prompt.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(150deg, #F0FDFA 0%, #CCFBF1 55%, #F0FDFA 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#134E4A] mb-2">Model Compare</h1>
          <p className="text-[#5F8A87] text-sm">
            Enter a prompt and see how 4 different AI models interpret it.
          </p>
        </div>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to generate..."
          rows={4}
          className="w-full rounded-2xl border border-[#99F6E4] bg-white px-5 py-4 text-sm text-[#134E4A] placeholder:text-[#5F8A87] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent resize-none shadow-sm"
          autoFocus
        />

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim()}
          className="w-full"
          size="lg"
        >
          Generate
        </Button>

        <p className="text-center text-xs text-[#5F8A87]">
          Press Enter to submit, Shift+Enter for new line
        </p>
      </motion.div>
    </div>
  )
}
