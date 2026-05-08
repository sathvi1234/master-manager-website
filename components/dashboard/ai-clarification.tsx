"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Sparkles, MessageCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const sampleQuestions = [
  "What is the expected user load for the analytics dashboard?",
  "Should the authentication support SSO providers like Google or Okta?",
  "What are the primary KPIs to display on the main dashboard?",
  "Is there a specific design system or component library preference?",
  "What is the timeline for the MVP release?",
  "Should we prioritize mobile responsiveness over desktop features?",
]

export function AIClarification() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typingText, setTypingText] = useState("")

  const generateQuestions = () => {
    setIsGenerating(true)
    setQuestions([])
    setCurrentIndex(0)
    setTypingText("")
  }

  useEffect(() => {
    if (!isGenerating) return

    if (currentIndex < sampleQuestions.length) {
      const targetText = sampleQuestions[currentIndex]
      
      if (typingText.length < targetText.length) {
        const timer = setTimeout(() => {
          setTypingText(targetText.slice(0, typingText.length + 1))
        }, 25)
        return () => clearTimeout(timer)
      } else {
        setQuestions(prev => [...prev, targetText])
        setTypingText("")
        setCurrentIndex(prev => prev + 1)
      }
    } else {
      setIsGenerating(false)
    }
  }, [isGenerating, currentIndex, typingText])

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
            {/* Generate Button */}
            {questions.length === 0 && !isGenerating && (
              <Button
                onClick={generateQuestions}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white rounded-xl py-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Clarification Questions
              </Button>
            )}

            {/* Generating State */}
            {isGenerating && questions.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">Analyzing context for questions...</span>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-3">
              {questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{question}</p>
                    <button className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ask client
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isGenerating && typingText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-foreground">
                    {typingText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 align-middle"
                    />
                  </p>
                </motion.div>
              )}
            </div>

            {/* Regenerate Button */}
            {questions.length > 0 && !isGenerating && (
              <Button
                onClick={generateQuestions}
                variant="outline"
                className="w-full mt-4 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate More Questions
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
