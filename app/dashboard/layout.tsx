"use client"

import { AIContextProvider } from "@/lib/ai-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AIContextProvider>
      {children}
    </AIContextProvider>
  )
}
