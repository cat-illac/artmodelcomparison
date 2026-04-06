import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: 'Model Compare — Multi-Model Image Generation',
  description: 'Compare images from different AI models side by side.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${dmSans.className} min-h-full`}>{children}</body>
    </html>
  )
}
