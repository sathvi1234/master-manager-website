"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Shared AI context for all dashboard widgets
// Stores the current requirement/input so all widgets can generate contextual outputs

interface AIContextType {
  currentRequirement: string
  setCurrentRequirement: (req: string) => void
  projectDomain: string | null
  setProjectDomain: (domain: string | null) => void
  generatedTasks: Task[]
  setGeneratedTasks: (tasks: Task[]) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export interface Task {
  id: number
  title: string
  priority: "high" | "medium" | "low"
  estimate: string
  category?: string
}

export interface GeneratedTask {
  id: number
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  estimate?: string
  category?: string
}

export interface PRDSection {
  title: string
  content: string[]
}

export interface PRDData {
  projectOverview?: {
    title: string
    description: string
    domain: string
    targetUsers: string[]
  }
  features?: Array<{
    name: string
    description: string
    priority: string
  }>
  userRoles?: Array<{
    role: string
    permissions: string[]
    description: string
  }>
  functionalRequirements?: Array<{
    id: string
    requirement: string
    acceptance: string
  }>
  userFlow?: Array<{
    step: number
    action: string
    screen: string
  }>
  technicalRequirements?: {
    frontend: string[]
    backend: string[]
    database: string[]
    integrations: string[]
  }
  risks?: Array<{
    risk: string
    mitigation: string
    severity: string
  }>
}

export interface WorkflowStep {
  id: number
  title: string
  description: string
  tasks: string[]
  duration: string
  dependencies: number[]
}

export interface ClarificationQuestion {
  id: number
  question: string
  category: string
  importance: string
  context: string
}

export interface ScopeAnalysis {
  scopeChange: {
    detected: boolean
    severity: string
    percentageIncrease: number
    summary: string
  }
  addedFeatures: Array<{
    feature: string
    effort: string
    impact: string
  }>
  removedFeatures: string[]
  changedFeatures: Array<{
    original: string
    new: string
    impact: string
  }>
  recommendations: string[]
  riskAssessment: {
    timeline: string
    budget: string
    technical: string
  }
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [currentRequirement, setCurrentRequirement] = useState("")
  const [projectDomain, setProjectDomain] = useState<string | null>(null)
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <AIContext.Provider
      value={{
        currentRequirement,
        setCurrentRequirement,
        projectDomain,
        setProjectDomain,
        generatedTasks,
        setGeneratedTasks,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAIContext() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAIContext must be used within an AIContextProvider")
  }
  return context
}

// Helper function to parse streaming AI response
export async function parseStreamingResponse(
  response: Response,
  onChunk?: (text: string) => void
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) throw new Error("No reader available")

  const decoder = new TextDecoder()
  let fullText = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    // Parse the data stream format
    const lines = chunk.split("\n")
    for (const line of lines) {
      if (line.startsWith("0:")) {
        // Text chunk in AI SDK data stream format
        const text = line.slice(2).trim()
        if (text.startsWith('"') && text.endsWith('"')) {
          const parsed = JSON.parse(text)
          fullText += parsed
          onChunk?.(parsed)
        }
      }
    }
  }

  return fullText
}

// Helper to extract JSON from AI response
export function extractJSON(text: string): unknown {
  // Try to find JSON in the response
  const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      // If parsing fails, try to clean up the text
      const cleaned = jsonMatch[0]
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      return JSON.parse(cleaned)
    }
  }
  throw new Error("No valid JSON found in response")
}
