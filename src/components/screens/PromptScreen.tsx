"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ALL_MODELS, DEFAULT_MODEL_SLUGS, MODEL_CATEGORIES } from "@/lib/models"

interface PromptScreenProps {
  onSubmit: (prompt: string, modelSlugs: string[]) => void
}

export function PromptScreen({ onSubmit }: PromptScreenProps) {
  const [prompt, setPrompt] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_MODEL_SLUGS))

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const toggleCategory = (category: string) => {
    const categoryModels = ALL_MODELS.filter(m => m.category === category).map(m => m.slug)
    const allSelected = categoryModels.every(s => selected.has(s))
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) {
        categoryModels.forEach(s => next.delete(s))
      } else {
        categoryModels.forEach(s => next.add(s))
      }
      return next
    })
  }

  const handleSubmit = () => {
    if (prompt.trim() && selected.size > 0) {
      onSubmit(prompt.trim(), [...selected])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
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
            Enter a prompt and compare AI models side by side.
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

        {/* Model picker */}
        <div className="rounded-2xl border border-[#99F6E4] bg-white/70 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#CCFBF1]">
            <span className="text-sm font-semibold text-[#134E4A]">
              Models
              <span className="ml-2 text-xs font-normal text-[#5F8A87]">
                {selected.size} of {ALL_MODELS.length} selected
              </span>
            </span>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSelected(new Set(ALL_MODELS.map(m => m.slug)))}
                className="text-[#0D9488] hover:underline"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-[#5F8A87] hover:underline"
              >
                None
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#F0FDFA]">
            {MODEL_CATEGORIES.map(category => {
              const categoryModels = ALL_MODELS.filter(m => m.category === category)
              const allSelected = categoryModels.every(m => selected.has(m.slug))
              const someSelected = categoryModels.some(m => selected.has(m.slug))

              return (
                <div key={category}>
                  {/* Category header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 transition-colors text-left"
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      allSelected
                        ? "bg-[#0D9488] border-[#0D9488]"
                        : someSelected
                          ? "bg-[#0D9488]/30 border-[#0D9488]"
                          : "border-[#99F6E4] bg-white"
                    }`}>
                      {(allSelected || someSelected) && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-[#5F8A87] uppercase tracking-wide">
                      {category}
                    </span>
                    <span className="text-xs text-[#5F8A87]/60 ml-auto">
                      {categoryModels.filter(m => selected.has(m.slug)).length}/{categoryModels.length}
                    </span>
                  </button>

                  {/* Model rows */}
                  {categoryModels.map(model => (
                    <button
                      key={model.slug}
                      type="button"
                      onClick={() => toggle(model.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0FDFA] transition-colors text-left"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected.has(model.slug)
                          ? "bg-[#0D9488] border-[#0D9488]"
                          : "border-[#99F6E4] bg-white"
                      }`}>
                        {selected.has(model.slug) && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-[#134E4A]">{model.label}</span>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || selected.size === 0}
          className="w-full"
          size="lg"
        >
          {selected.size === 0
            ? "Select at least one model"
            : `Generate with ${selected.size} model${selected.size !== 1 ? "s" : ""}`}
        </Button>

        <p className="text-center text-xs text-[#5F8A87]">
          Press Enter to submit · Shift+Enter for new line
        </p>
      </motion.div>
    </div>
  )
}
