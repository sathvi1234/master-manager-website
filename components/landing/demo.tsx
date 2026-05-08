"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Sparkles, Send, CheckCircle2, Loader2, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const generatedTasks = [
  { id: 1, text: "Create login authentication flow", priority: "High" },
  { id: 2, text: "Design analytics dashboard layout", priority: "High" },
  { id: 3, text: "Implement dark mode toggle", priority: "Medium" },
  { id: 4, text: "Build responsive navigation", priority: "Medium" },
]

const loadingSteps = [
  { text: "Analyzing requirements...", icon: Sparkles },
  { text: "Generating tasks...", icon: FileText },
  { text: "Creating PRD...", icon: CheckCircle2 },
]

export function Demo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = async () => {
    if (!inputValue.trim()) {
      setInputValue("I need a modern dashboard with login and analytics")
    }
    
    setIsGenerating(true)
    setShowResults(false)
    setCurrentStep(0)

    for (let i = 0; i < loadingSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsGenerating(false)
    setShowResults(true)
  }

  const resetDemo = () => {
    setShowResults(false)
    setInputValue("")
  }

  return (
    <section id="demo" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Interactive Demo</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            See <span className="gradient-text">AI</span> in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Type a project idea and watch Master Manager transform it into structured tasks.
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-3xl p-8 glow-purple"
        >
          {/* Input Area */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="I need a modern dashboard with login and analytics"
                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 pr-32 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                disabled={isGenerating}
              />
              <Button
                onClick={showResults ? resetDemo : handleGenerate}
                disabled={isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl px-6"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : showResults ? (
                  "Reset"
                ) : (
                  <>
                    Generate <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Loading States */}
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {loadingSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isComplete = index < currentStep

                  return (
                    <motion.div
                      key={step.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isActive ? "glass border-primary/50" : isComplete ? "opacity-50" : "opacity-30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? "bg-gradient-to-r from-primary to-secondary" : isComplete ? "bg-green-500/20" : "bg-muted"
                      }`}>
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isActive ? (
                          <Icon className="w-5 h-5 text-white animate-pulse" />
                        ) : (
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.text}
                      </span>
                      {isActive && (
                        <div className="ml-auto flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Results */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Tasks */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-foreground">Generated Tasks</span>
                  </div>
                  <div className="grid gap-3">
                    {generatedTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                          <span className="text-foreground">{task.text}</span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          task.priority === "High" 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {task.priority}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* PRD Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-secondary" />
                    <span className="font-semibold text-foreground">PRD Generated</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-full w-full animate-shimmer" />
                    <div className="h-3 bg-muted rounded-full w-5/6 animate-shimmer" style={{ animationDelay: "0.1s" }} />
                    <div className="h-3 bg-muted rounded-full w-4/6 animate-shimmer" style={{ animationDelay: "0.2s" }} />
                  </div>
                </motion.div>

                {/* Scope Alert */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="glass rounded-xl p-4 border border-orange-500/30 bg-orange-500/5"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <div>
                      <span className="font-medium text-orange-400">Scope Alert</span>
                      <p className="text-sm text-muted-foreground">Dark mode toggle detected as additional feature not in original scope.</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
