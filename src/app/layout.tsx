import type { Metadata } from 'next'
import { Quicksand, Inter } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'MemoryForge AI - Cognitive Training',
  description: 'AI-powered memory training and cognitive enhancement games. Part of the HumanOS ecosystem.',
}

import Footer from '@/components/footer'
import GoogleAnalytics from '@/components/google-analytics'
import EcosystemBar from '@/components/ecosystem-bar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} bg-[#F8FAFC] text-[#1f2937] min-h-screen`}>
        <GoogleAnalytics />
        <EcosystemBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}