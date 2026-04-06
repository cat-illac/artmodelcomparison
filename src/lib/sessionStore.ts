import fs from 'fs/promises'
import path from 'path'
import type { SessionRecord } from '@/types/session'

export async function saveSession(record: SessionRecord): Promise<void> {
  const storePath = path.resolve(process.env.SESSION_STORE_PATH ?? 'sessions')
  const sessionDir = path.join(storePath, record.sessionId)

  console.log('[sessionStore] writing to:', sessionDir)

  await fs.mkdir(sessionDir, { recursive: true })
  const filePath = path.join(sessionDir, 'session.json')
  await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf-8')

  console.log('[sessionStore] saved:', filePath)
}
