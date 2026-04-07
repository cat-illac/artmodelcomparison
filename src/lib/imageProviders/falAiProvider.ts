import { fal } from '@fal-ai/client'
import fs from 'fs/promises'
import path from 'path'
import type { ImageGenerationProvider } from './index'
import { ALL_MODELS } from '@/lib/models'

export type { ModelConfig } from '@/lib/models'

export interface MultiModelResult {
  modelSlug: string
  modelLabel: string
  imagePath: string
}

export class FalAiProvider implements ImageGenerationProvider {
  constructor() {
    fal.config({ credentials: process.env.FAL_API_KEY })
  }

  /** Legacy single-model method (kept for interface compat) */
  async generate(prompt: string, sessionId: string, count: number): Promise<string[]> {
    const results = await this.generateMultiModel(prompt, sessionId)
    return results.map(r => r.imagePath).slice(0, count || results.length)
  }

  /** Generate 1 image per model, all in parallel */
  async generateMultiModel(
    prompt: string,
    sessionId: string,
    modelSlugs?: string[],
  ): Promise<MultiModelResult[]> {
    const models = modelSlugs?.length
      ? ALL_MODELS.filter(m => modelSlugs.includes(m.slug))
      : ALL_MODELS

    if (models.length === 0) {
      throw new Error('No models selected')
    }

    const storeBase = path.resolve(process.env.SESSION_STORE_PATH ?? 'sessions')
    const sessionDir = path.join(storeBase, sessionId)
    await fs.mkdir(sessionDir, { recursive: true })

    const settled = await Promise.allSettled(
      models.map(async (model): Promise<MultiModelResult> => {
        console.log(`[falAi] generating with ${model.id}...`)

        const result = await fal.subscribe(model.id, {
          input: { prompt, ...model.input },
        })

        // fal.ai client v1 wraps output in { data, requestId }
        const output = (result as { data?: unknown } & Record<string, unknown>).data ?? result

        // Different models return images in slightly different shapes
        const imagesArray = (output as { images?: Array<{ url: string }> }).images
        const singleImage = (output as { image?: { url: string } }).image
        const images: Array<{ url: string }> = imagesArray
          ?? (singleImage ? [singleImage] : [])

        if (!images.length) {
          throw new Error(`No images returned from ${model.id}`)
        }

        const imageUrl = images[0].url
        const response = await fetch(imageUrl)
        const buffer = Buffer.from(await response.arrayBuffer())

        // Skip if image is suspiciously small (likely black/empty)
        if (buffer.length < 5000) {
          throw new Error(`Image from ${model.id} appears empty (${buffer.length} bytes)`)
        }

        const filePath = path.join(sessionDir, `image-${model.slug}.jpg`)
        await fs.writeFile(filePath, buffer)
        console.log(`[falAi] saved ${model.slug}:`, filePath, `(${buffer.length} bytes)`)

        return { modelSlug: model.slug, modelLabel: model.label, imagePath: filePath }
      })
    )

    const results: MultiModelResult[] = []
    for (const s of settled) {
      if (s.status === 'fulfilled') {
        results.push(s.value)
      } else {
        console.error('[falAi] model failed:', s.reason)
      }
    }

    if (results.length === 0) {
      throw new Error('All image generation models failed')
    }

    return results
  }
}
