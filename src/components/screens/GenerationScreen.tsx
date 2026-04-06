"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ModelImage } from "@/types/session"

const COPY_CYCLE = [
  "Sending to 4 AI models...",
  "Flux Pro is thinking...",
  "Grok Aurora is creating...",
  "Flux Dev is generating...",
  "Nano Banana is rendering...",
  "Almost there...",
]

interface GenerationScreenProps {
  prompt: string
  sessionId: string
  onComplete: (imagePaths: string[], modelImages: ModelImage[]) => void
  onError: () => void
}

export function GenerationScreen({ prompt, sessionId, onComplete, onError }: GenerationScreenProps) {
  const [copyIndex, setCopyIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  const runGeneration = async () => {
    setHasError(false)
    setIsRetrying(true)
    try {
      const genRes = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sessionId }),
      })
      if (!genRes.ok) throw new Error('Image generation failed')
      const { imagePaths, modelImages } = await genRes.json() as {
        imagePaths: string[]
        modelImages: ModelImage[]
      }

      // Save partial session immediately
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          timestamp: new Date().toISOString(),
          prompt,
          generatedImagePaths: imagePaths,
          modelImages,
          preferredModel: null,
        }),
      }).catch(() => {})

      onComplete(imagePaths, modelImages)
    } catch {
      setHasError(true)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    runGeneration()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasError) return
    const interval = setInterval(() => {
      setCopyIndex(i => (i + 1) % COPY_CYCLE.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [hasError])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ background: "linear-gradient(150deg, #FBF0F6 0%, #EDE0FF 55%, #FBF0F6 100%)" }}
    >
      {!hasError ? (
        <>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(155,114,203,0.4)_0%,transparent_70%)] animate-orb-pulse" />
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(123,82,171,0.35)_0%,transparent_70%)] animate-orb-pulse [animation-delay:0.4s]" />
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(249,200,226,0.5)_0%,transparent_70%)] animate-orb-pulse [animation-delay:0.8s]" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B72CB] to-[#7B52AB] shadow-lg" />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={copyIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-[#2D1B4E] text-lg font-semibold text-center"
            >
              {COPY_CYCLE[copyIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="max-w-sm text-center">
            <p className="text-[#8B7A9E] text-sm mb-2">Your prompt:</p>
            <p className="text-[#2D1B4E] text-sm italic bg-white/60 rounded-xl px-4 py-2">
              &ldquo;{prompt}&rdquo;
            </p>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#EDE0FF] flex items-center justify-center text-3xl">
            ✦
          </div>
          <div>
            <p className="text-[#2D1B4E] text-lg font-semibold mb-1">Something went wrong</p>
            <p className="text-[#8B7A9E] text-sm">Generation failed. Give it another go.</p>
          </div>
          <button
            onClick={runGeneration}
            disabled={isRetrying}
            className="px-8 py-3 rounded-full bg-[#7B52AB] text-white font-semibold text-sm active:scale-95 transition-all disabled:opacity-60"
          >
            Try again
          </button>
          <button
            onClick={onError}
            className="text-[#8B7A9E] text-sm underline underline-offset-2"
          >
            Back to prompt
          </button>
        </motion.div>
      )}
    </div>
  )
}
