"use client"

import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { AnimatePresence, motion } from "framer-motion"
import { PromptScreen } from "@/components/screens/PromptScreen"
import { GenerationScreen } from "@/components/screens/GenerationScreen"
import { ResultsScreen } from "@/components/screens/ResultsScreen"
import type { ModelImage } from "@/types/session"

type Screen = "prompt" | "generating" | "results"

const slideVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
}

export function FlowController() {
  const [screen, setScreen] = useState<Screen>("prompt")
  const [sessionId, setSessionId] = useState(() => uuidv4())
  const [prompt, setPrompt] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [imagePaths, setImagePaths] = useState<string[]>([])
  const [modelImages, setModelImages] = useState<ModelImage[]>([])

  const handlePromptSubmit = useCallback((text: string, modelSlugs: string[]) => {
    setPrompt(text)
    setSelectedModels(modelSlugs)
    setScreen("generating")
  }, [])

  const handleGenerationComplete = useCallback((paths: string[], models: ModelImage[]) => {
    setImagePaths(paths)
    setModelImages(models)
    setScreen("results")
  }, [])

  const handleGenerationError = useCallback(() => {
    setScreen("prompt")
  }, [])

  const handleReset = useCallback(() => {
    setSessionId(uuidv4())
    setPrompt("")
    setSelectedModels([])
    setImagePaths([])
    setModelImages([])
    setScreen("prompt")
  }, [])

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "prompt" && (
          <motion.div key="prompt" {...slideVariants} transition={{ duration: 0.35 }}>
            <PromptScreen onSubmit={handlePromptSubmit} />
          </motion.div>
        )}
        {screen === "generating" && (
          <motion.div key="generating" {...slideVariants} transition={{ duration: 0.35 }}>
            <GenerationScreen
              prompt={prompt}
              sessionId={sessionId}
              modelSlugs={selectedModels}
              onComplete={handleGenerationComplete}
              onError={handleGenerationError}
            />
          </motion.div>
        )}
        {screen === "results" && (
          <motion.div key="results" {...slideVariants} transition={{ duration: 0.35 }}>
            <ResultsScreen
              prompt={prompt}
              sessionId={sessionId}
              modelImages={modelImages}
              imagePaths={imagePaths}
              expectedCount={selectedModels.length}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
