export type ModelConfig = {
  id: string
  label: string
  slug: string
  category: string
  input: Record<string, unknown>
}

export const ALL_MODELS: ModelConfig[] = [
  // ── FLUX ─────────────────────────────────────────────────────────────────
  {
    id: 'fal-ai/flux-pro/v1.1-ultra',
    label: 'Flux Pro 1.1 Ultra',
    slug: 'flux-pro-ultra',
    category: 'FLUX',
    input: { aspect_ratio: '3:4', num_images: 1, safety_tolerance: 5 },
  },
  {
    id: 'fal-ai/flux-pro/v1.1',
    label: 'Flux Pro 1.1',
    slug: 'flux-pro-1-1',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1, safety_tolerance: 5 },
  },
  {
    id: 'fal-ai/flux-pro',
    label: 'Flux Pro',
    slug: 'flux-pro',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1, safety_tolerance: 5 },
  },
  {
    id: 'fal-ai/flux/dev',
    label: 'Flux Dev',
    slug: 'flux-dev',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1, guidance_scale: 3.5, num_inference_steps: 28 },
  },
  {
    id: 'fal-ai/flux/schnell',
    label: 'Flux Schnell',
    slug: 'flux-schnell',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/flux-realism',
    label: 'Flux Realism',
    slug: 'flux-realism',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/flux-lora',
    label: 'Flux LoRA',
    slug: 'flux-lora',
    category: 'FLUX',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },

  // ── Stable Diffusion ─────────────────────────────────────────────────────
  {
    id: 'fal-ai/stable-diffusion-3.5-large',
    label: 'SD 3.5 Large',
    slug: 'sd-3-5-large',
    category: 'Stable Diffusion',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/stable-diffusion-3.5-large-turbo',
    label: 'SD 3.5 Large Turbo',
    slug: 'sd-3-5-large-turbo',
    category: 'Stable Diffusion',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/stable-diffusion-3.5-medium',
    label: 'SD 3.5 Medium',
    slug: 'sd-3-5-medium',
    category: 'Stable Diffusion',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/fast-sdxl',
    label: 'Fast SDXL',
    slug: 'fast-sdxl',
    category: 'Stable Diffusion',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/hyper-sdxl',
    label: 'Hyper SDXL',
    slug: 'hyper-sdxl',
    category: 'Stable Diffusion',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },

  // ── Ideogram ─────────────────────────────────────────────────────────────
  {
    id: 'fal-ai/ideogram/v2',
    label: 'Ideogram v2',
    slug: 'ideogram-v2',
    category: 'Ideogram',
    input: { aspect_ratio: 'ASPECT_3_4' },
  },
  {
    id: 'fal-ai/ideogram/v2/turbo',
    label: 'Ideogram v2 Turbo',
    slug: 'ideogram-v2-turbo',
    category: 'Ideogram',
    input: { aspect_ratio: 'ASPECT_3_4' },
  },

  // ── Recraft ───────────────────────────────────────────────────────────────
  {
    id: 'fal-ai/recraft-v3',
    label: 'Recraft v3',
    slug: 'recraft-v3',
    category: 'Recraft',
    input: { image_size: 'portrait_4_3' },
  },

  // ── Other ─────────────────────────────────────────────────────────────────
  {
    id: 'fal-ai/aura-flow',
    label: 'AuraFlow',
    slug: 'aura-flow',
    category: 'Other',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/kolors',
    label: 'Kolors',
    slug: 'kolors',
    category: 'Other',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/playground-v25',
    label: 'Playground v2.5',
    slug: 'playground-v25',
    category: 'Other',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/pixart-sigma',
    label: 'PixArt Sigma',
    slug: 'pixart-sigma',
    category: 'Other',
    input: { image_size: 'portrait_4_3', num_images: 1 },
  },
  {
    id: 'fal-ai/omnigen-v1',
    label: 'OmniGen v1',
    slug: 'omnigen-v1',
    category: 'Other',
    input: { image_size: 'portrait_4_3' },
  },
  {
    id: 'xai/grok-imagine-image',
    label: 'Grok Aurora',
    slug: 'grok-aurora',
    category: 'Other',
    input: { image_size: 'portrait_4_3' },
  },
  {
    id: 'fal-ai/nano-banana-2',
    label: 'Nano Banana',
    slug: 'nano-banana',
    category: 'Other',
    input: { image_size: 'portrait_4_3' },
  },
]

export const DEFAULT_MODEL_SLUGS = ['flux-pro-1-1', 'flux-dev', 'grok-aurora', 'nano-banana']

export const MODEL_CATEGORIES = [...new Set(ALL_MODELS.map(m => m.category))]
