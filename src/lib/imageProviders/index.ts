export interface ImageGenerationProvider {
  generate(prompt: string, sessionId: string, count: number): Promise<string[]>
}
