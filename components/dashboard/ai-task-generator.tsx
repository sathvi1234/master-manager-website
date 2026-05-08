"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, CheckCircle2, Loader2, ChevronDown, ChevronUp, AlertCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAIContent, detectDomain } from "@/lib/ai-service"
import { useAIContext, type Task } from "@/lib/ai-context"

export function AITaskGenerator() {
  const { setCurrentRequirement, setGeneratedTasks } = useAIContext()
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"api" | "fallback" | null>(null)
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null)

  const generateTasks = async () => {
    if (!input.trim()) {
      setError("Please enter a requirement description")
      return
    }
    
    setIsGenerating(true)
    setError(null)
    setTasks([])
    setDisplayedTasks([])
    setSource(null)
    
    // Detect domain for UI feedback
    const domain = detectDomain(input)
    setDetectedDomain(domain !== "general" ? domain : null)
    
    // Store in context for other components
    setCurrentRequirement(input)
    
    try {
      const result = await generateAIContent<Task[]>("tasks", input)
      
      if (!result.data || result.data.length === 0) {
        throw new Error("No tasks generated")
      }
      
      setTasks(result.data)
      setSource(result.source)
      setGeneratedTasks(result.data)
      
      // Animate tasks appearing one by one
      for (let i = 0; i < result.data.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setDisplayedTasks(prev => [...prev, result.data[i]])
      }
      
      if (result.error) {
        console.warn("[v0] AI generation fallback used:", result.error)
      }
    } catch (err) {
      console.error("[v0] Task generation failed:", err)
      setError(err instanceof Error ? err.message : "Failed to generate tasks. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "backend": return "bg-blue-500/20 text-blue-400"
      case "frontend": return "bg-purple-500/20 text-purple-400"
      case "database": return "bg-orange-500/20 text-orange-400"
      case "auth": return "bg-red-500/20 text-red-400"
      case "design": return "bg-pink-500/20 text-pink-400"
      case "testing": return "bg-green-500/20 text-green-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">AI Task Generator</h3>
            <p className="text-sm text-muted-foreground">Convert requirements into actionable tasks</p>
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
            <div className="relative mb-4">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    generateTasks()
                  }
                }}
                placeholder="Describe your project... e.g., 'Build a food delivery app with restaurant listings, order tracking, and payment integration'"
                className="w-full h-24 bg-muted/30 border border-border rounded-xl p-4 pr-12 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Button
                onClick={generateTasks}
                disabled={isGenerating || !input.trim()}
                size="icon"
                className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Loading State */}
            {isGenerating && displayedTasks.length === 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {detectedDomain 
                    ? `Analyzing ${detectedDomain} requirements...` 
                    : "Analyzing requirements..."}
                </span>
              </div>
            )}

            {/* Generated Tasks */}
            <AnimatePresence mode="popLayout">
              {displayedTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-muted-foreground">
                        {displayedTasks.length} tasks generated
                      </span>
                    </div>
                    {source === "fallback" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">Demo Mode</span>
                      </div>
                    )}
                  </div>
                  {displayedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-xs text-primary font-medium shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-foreground truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {task.category && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground w-8 text-right">{task.estimate}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
