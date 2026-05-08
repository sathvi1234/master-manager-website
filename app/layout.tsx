import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PageTransition } from '@/components/effects/page-transition'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Master Manager | AI-Powered Communication to Execution',
  description: 'Turn messy client communication into structured tasks, PRDs, and workflows using AI. The missing layer between communication and execution for tech agencies.',
  keywords: ['AI', 'Project Management', 'Task Management', 'PRD Generator', 'Agency Tools', 'Workflow Automation'],
  openGraph: {
    title: 'Master Manager | From Confusion to Clarity',
    description: 'AI-powered platform that converts vague client communication into actionable tasks and PRDs.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0B0F19] scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <PageTransition>
          {children}
        </PageTransition>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
