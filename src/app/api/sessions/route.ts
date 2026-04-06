import { NextResponse } from 'next/server'
import type { SessionRecord } from '@/types/session'
import { saveSession } from '@/lib/sessionStore'

export async function POST(request: Request) {
  try {
    const record = (await request.json()) as SessionRecord

    if (!record.sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
    }

    await saveSession(record)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save session'
    console.error('[sessions] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
