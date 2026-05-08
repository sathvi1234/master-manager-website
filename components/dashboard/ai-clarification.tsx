"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Sparkles, MessageCircle, ChevronDown, ChevronUp, RefreshCw, Loader2, AlertCircle, Zap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAIContent, detectDomain } from "@/lib/ai-service"
import { useAIContext, type ClarificationQuestion } from "@/lib/ai-context"

export function AIClarification() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([])
  const [displayedQuestions, setDisplayedQuestions] = useState<ClarificationQuestion[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"api" | "fallback" | null>(null)
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null)
  
  const { currentRequirement } = useAIContext()

  const generateQuestions = async () => {
    const requirement = input.trim() || currentRequirement
    if (!requirement) {
      setError("Please enter a requirement or generate tasks first")
      return
    }
    
    setIsGenerating(true)
    setQuestions([])
    setDisplayedQuestions([])
    setError(null)
    setSource(null)

    // Detect domain for UI feedback
    const domain = detectDomain(requirement)
    setDetectedDomain(domain !== "general" ? domain : null)

    try {
      const result = await generateAIContent<ClarificationQuestion[]>("clarification", requirement)
      
      if (!result.data || result.data.length === 0) {
        throw new Error("No questions generated")
      }
      
      setQuestions(result.data)
      setSource(result.source)
      
      // Animate questions appearing one by one
      for (let i = 0; i < result.data.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDisplayedQuestions(prev => [...prev, result.data[i]])
      }
      
      if (result.error) {
        console.warn("[v0] Clarification generation fallback used:", result.error)
      }
    } catch (err) {
      console.error("[v0] Clarification generation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical": return "bg-blue-500/20 text-blue-400"
      case "ux": return "bg-purple-500/20 text-purple-400"
      case "business": return "bg-green-500/20 text-green-400"
      case "timeline": return "bg-yellow-500/20 text-yellow-400"
      case "compliance": return "bg-red-500/20 text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical": return "border-red-500/30 bg-red-500/10"
      case "important": return "border-yellow-500/30 bg-yellow-500/10"
      default: return "border-border bg-muted/30"
    }
  }

  const reset = () => {
    setQuestions([])
    setDisplayedQuestions([])
    setInput("")
    setError(null)
    setSource(null)
    setDetectedDomain(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">AI Clarification Questions</h3>
            <p className="text-sm text-muted-foreground">Smart follow-ups to reduce ambiguity</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            {/* Input Section */}
            {displayedQuestions.length === 0 && !isGenerating && (
              <div className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setError(null)
                  }}
                  placeholder={currentRequirement 
                    ? `Using: "${currentRequirement.slice(0, 50)}..." or enter new requirement`
                    : "Enter your project requirement to generate clarification questions..."
                  }
                  className="w-full h-20 bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                />
                <Button
                  onClick={generateQuestions}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white rounded-xl py-6"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Clarification Questions
                </Button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Generating State */}
            {isGenerating && displayedQuestions.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-cyan-400" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-cyan-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-foreground">
                      {detectedDomain 
                        ? `Analyzing ${detectedDomain} requirements...` 
                        : "Analyzing requirements..."}
                    </span>
                    <p className="text-xs text-muted-foreground">Identifying gaps and ambiguities</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Questions List */}
            {displayedQuestions.length > 0 && (
              <div className="space-y-4">
                {/* Success Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">
                      {displayedQuestions.length} questions generated
                    </span>
                  </div>
                  {source === "fallback" && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Demo Mode</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {displayedQuestions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group p-4 rounded-xl border transition-all ${getImportanceColor(q.importance)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground text-sm leading-relaxed">{q.question}</p>
                          {q.context && (
                            <p className="text-xs text-muted-foreground mt-2 italic">{q.context}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(q.category)}`}>
                              {q.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {q.importance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Still generating indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-2 p-3">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-sm text-muted-foreground">Generating more questions...</span>
                  </div>
                )}

                {/* Reset Button */}
                {!isGenerating && (
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full border-cyan-500/30 hover:bg-cyan-500/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Questions
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
