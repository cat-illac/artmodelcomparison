import { NextResponse } from 'next/server'
import { FalAiProvider } from '@/lib/imageProviders/falAiProvider'
import type { ModelImage } from '@/types/session'

export async function POST(request: Request) {
  try {
    const { prompt, sessionId } = (await request.json()) as { prompt: string; sessionId: string }

    if (!prompt || !sessionId) {
      return NextResponse.json({ error: 'prompt and sessionId are required' }, { status: 400 })
    }

    const provider = new FalAiProvider()
    const results = await provider.generateMultiModel(prompt, sessionId)

    const imagePaths = results.map(r => r.imagePath)
    const modelImages: ModelImage[] = results.map(r => ({
      modelSlug: r.modelSlug,
      modelLabel: r.modelLabel,
      imagePath: r.imagePath,
    }))

    return NextResponse.json({ imagePaths, modelImages })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Image generation failed'
    console.error('[generate-images] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
