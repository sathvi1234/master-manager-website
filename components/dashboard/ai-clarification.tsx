"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Sparkles, MessageCircle, ChevronDown, ChevronUp, RefreshCw, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIContext, parseStreamingResponse, extractJSON } from "@/lib/ai-context"

interface ClarificationResponse {
  questions: string[]
  context: string
}

export function AIClarification() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [context, setContext] = useState("")
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [animatingIndex, setAnimatingIndex] = useState(-1)
  
  const { currentRequirement } = useAIContext()

  const generateQuestions = async () => {
    const requirement = input.trim() || currentRequirement
    if (!requirement) {
      setError("Please enter a requirement or generate tasks first")
      return
    }
    
    setIsGenerating(true)
    setQuestions([])
    setContext("")
    setError(null)
    setAnimatingIndex(-1)

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "clarification",
          input: requirement,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const fullText = await parseStreamingResponse(response)
      const parsedResponse = extractJSON(fullText) as ClarificationResponse
      
      if (parsedResponse && Array.isArray(parsedResponse.questions)) {
        // Animate questions appearing one by one
        for (let i = 0; i < parsedResponse.questions.length; i++) {
          setAnimatingIndex(i)
          setQuestions(prev => [...prev, parsedResponse.questions[i]])
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        setContext(parsedResponse.context || "")
        setAnimatingIndex(-1)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Clarification generation error:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
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
            {questions.length === 0 && !isGenerating && (
              <div className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentRequirement || "Enter your project requirement to generate clarification questions..."}
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
            {isGenerating && questions.length === 0 && (
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
                    <span className="text-sm text-foreground">Analyzing requirements...</span>
                    <p className="text-xs text-muted-foreground">Identifying gaps and ambiguities</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Questions List */}
            {questions.length > 0 && (
              <div className="space-y-4">
                {/* Context Summary */}
                {context && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                  >
                    <p className="text-xs text-cyan-400">{context}</p>
                  </motion.div>
                )}
                
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-cyan-500/30 transition-all ${
                        animatingIndex === index ? "ring-2 ring-cyan-500/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground text-sm leading-relaxed">{question}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">Q{index + 1}</span>
                            <span className="text-xs text-cyan-400/60">•</span>
                            <span className="text-xs text-cyan-400/60">AI Generated</span>
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
                    onClick={() => { setQuestions([]); setContext(""); setInput(""); }}
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
