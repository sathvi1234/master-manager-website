"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Task {
  id: number
  title: string
  priority: "high" | "medium" | "low"
  estimate: string
}

const sampleTasks: Task[] = [
  { id: 1, title: "Set up user authentication with OAuth", priority: "high", estimate: "4h" },
  { id: 2, title: "Design responsive dashboard layout", priority: "high", estimate: "6h" },
  { id: 3, title: "Implement data visualization charts", priority: "medium", estimate: "5h" },
  { id: 4, title: "Create API endpoints for analytics", priority: "medium", estimate: "3h" },
  { id: 5, title: "Add dark mode theme support", priority: "low", estimate: "2h" },
]

export function AITaskGenerator() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  const generateTasks = () => {
    if (!input.trim()) return
    setIsGenerating(true)
    setTasks([])
    setCurrentTaskIndex(0)
  }

  useEffect(() => {
    if (isGenerating && currentTaskIndex < sampleTasks.length) {
      const timer = setTimeout(() => {
        setTasks(prev => [...prev, sampleTasks[currentTaskIndex]])
        setCurrentTaskIndex(prev => prev + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else if (currentTaskIndex >= sampleTasks.length) {
      setIsGenerating(false)
    }
  }, [isGenerating, currentTaskIndex])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
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
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your project requirements... e.g., 'I need a modern dashboard with login, analytics, and dark mode'"
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

            {/* Loading State */}
            {isGenerating && tasks.length === 0 && (
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
                <span className="text-sm text-muted-foreground">Analyzing requirements...</span>
              </div>
            )}

            {/* Generated Tasks */}
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">
                      {tasks.length} tasks generated
                    </span>
                  </div>
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                          {index + 1}
                        </div>
                        <span className="text-foreground">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">{task.estimate}</span>
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
