import fs from 'fs/promises'
import path from 'path'
import type { SessionRecord } from '@/types/session'

export const dynamic = 'force-dynamic'

async function getSessions(): Promise<{ sessions: SessionRecord[]; storePath: string }> {
  const storePath = path.resolve(process.env.SESSION_STORE_PATH ?? 'sessions')
  try {
    const entries = await fs.readdir(storePath, { withFileTypes: true })
    const sessions: SessionRecord[] = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      try {
        const raw = await fs.readFile(path.join(storePath, entry.name, 'session.json'), 'utf-8')
        sessions.push(JSON.parse(raw) as SessionRecord)
      } catch { /* incomplete session */ }
    }
    sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return { sessions, storePath }
  } catch {
    return { sessions: [], storePath }
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key = '' } = await searchParams
  const adminKey = process.env.ADMIN_KEY ?? ''

  if (!adminKey || key !== adminKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <div className="text-center">
          <p className="text-[#134E4A] font-semibold mb-2">Admin access required</p>
          <p className="text-[#5F8A87] text-sm">Add <code className="bg-white px-1 rounded">?key=YOUR_ADMIN_KEY</code> to the URL</p>
        </div>
      </div>
    )
  }

  const { sessions, storePath } = await getSessions()

  return (
    <div className="min-h-screen bg-[#F0FDFA] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#134E4A]">Model Compare — Sessions</h1>
        <p className="text-[#5F8A87] text-sm mt-1">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} — reading from <code className="text-xs bg-white px-1 rounded">{storePath}</code>
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-[#5F8A87]">No sessions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-[#99F6E4]">
          <table className="text-sm border-collapse min-w-full">
            <thead>
              <tr className="bg-[#CCFBF1]">
                <th className="text-left px-4 py-3 font-semibold text-[#134E4A] whitespace-nowrap border-b border-[#99F6E4]">Images</th>
                <th className="text-left px-4 py-3 font-semibold text-[#134E4A] whitespace-nowrap border-b border-[#99F6E4]">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-[#134E4A] whitespace-nowrap border-b border-[#99F6E4]">Prompt</th>
                <th className="text-left px-4 py-3 font-semibold text-[#134E4A] whitespace-nowrap border-b border-[#99F6E4]">Preferred Model</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, i) => {
                const models = session.modelImages ?? []
                const paths = models.length > 0
                  ? models.map(m => m.imagePath)
                  : session.generatedImagePaths ?? []
                const labels = models.length > 0
                  ? models.map(m => m.modelLabel)
                  : paths.map((_, idx) => `Image ${idx + 1}`)

                return (
                  <tr
                    key={session.sessionId}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-[#F0FDFA]'}
                  >
                    <td className="px-4 py-3 align-top border-b border-[#CCFBF1]">
                      <div className="flex gap-1.5">
                        {paths.map((p, idx) => {
                          const imageUrl = `/api/session-image?path=${encodeURIComponent(p)}`
                          const isPreferred = session.preferredModel && models[idx]?.modelSlug === session.preferredModel
                          return (
                            <a key={idx} href={imageUrl} target="_blank" rel="noopener noreferrer" title={labels[idx]}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imageUrl}
                                alt={labels[idx]}
                                className={`w-12 h-16 object-cover rounded-lg hover:opacity-80 transition-opacity ${
                                  isPreferred ? 'ring-2 ring-[#0D9488]' : ''
                                }`}
                              />
                            </a>
                          )
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[#134E4A] align-top border-b border-[#CCFBF1] whitespace-nowrap">
                      {new Date(session.timestamp).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="px-4 py-3 text-[#134E4A] align-top border-b border-[#CCFBF1] max-w-md">
                      <div className="text-xs leading-relaxed line-clamp-4" title={session.prompt}>
                        {session.prompt}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top border-b border-[#CCFBF1] whitespace-nowrap">
                      <span className="font-semibold text-[#0D9488]">
                        {session.preferredModel ?? '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
