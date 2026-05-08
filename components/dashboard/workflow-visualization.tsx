"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Brain, 
  ListTodo, 
  Rocket, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Play,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIContext, parseStreamingResponse, extractJSON, WorkflowStep } from "@/lib/ai-context"

const defaultSteps = [
  { id: 1, title: "Client Input", description: "Receive requirements", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
  { id: 2, title: "AI Analysis", description: "Process & understand", icon: Brain, color: "from-primary to-secondary" },
  { id: 3, title: "Task Generation", description: "Create actionable items", icon: ListTodo, color: "from-green-500 to-emerald-500" },
  { id: 4, title: "Execution", description: "Team delivers", icon: Rocket, color: "from-orange-500 to-yellow-500" },
]

const iconMap: Record<string, React.ElementType> = {
  "Client Input": MessageSquare,
  "AI Analysis": Brain,
  "Task Generation": ListTodo,
  "Execution": Rocket,
  "Requirements": MessageSquare,
  "Analysis": Brain,
  "Planning": ListTodo,
  "Development": Rocket,
  "Design": ListTodo,
  "Testing": Brain,
  "Deployment": Rocket,
}

const colorMap = [
  "from-blue-500 to-cyan-500",
  "from-primary to-secondary",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-yellow-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-purple-500",
]

export function WorkflowVisualization() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  const { currentRequirement } = useAIContext()

  // Use generated workflow or default
  const displaySteps = workflow.length > 0 
    ? workflow.map((step, i) => ({
        ...step,
        icon: iconMap[step.title] || ListTodo,
        color: colorMap[i % colorMap.length]
      }))
    : defaultSteps

  useEffect(() => {
    if (!isAnimating || displaySteps.length === 0) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % displaySteps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isAnimating, displaySteps.length])

  const generateWorkflow = async () => {
    const requirement = input.trim() || currentRequirement
    if (!requirement) {
      setError("Please enter a project requirement or generate tasks first")
      return
    }
    
    setIsGenerating(true)
    setWorkflow([])
    setError(null)
    setActiveStep(0)

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "workflow",
          input: requirement,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate workflow")
      }

      const fullText = await parseStreamingResponse(response)
      const parsedWorkflow = extractJSON(fullText) as WorkflowStep[]
      
      if (Array.isArray(parsedWorkflow)) {
        setWorkflow(parsedWorkflow)
        setIsAnimating(true)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Workflow generation error:", err)
      setError("Failed to generate workflow. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Workflow Visualization</h3>
            <p className="text-sm text-muted-foreground">Dynamic execution pipeline</p>
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
            {/* Generate Workflow Section */}
            {workflow.length === 0 && !isGenerating && (
              <div className="space-y-4 mb-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentRequirement || "Enter your project idea to generate a custom workflow..."}
                  className="w-full h-16 bg-muted/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-sm"
                />
                <Button
                  onClick={generateWorkflow}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white rounded-xl py-5"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate Custom Workflow
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
            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <ListTodo className="w-6 h-6 text-green-400" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-green-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-foreground">Generating workflow...</span>
                    <p className="text-xs text-muted-foreground">Creating execution pipeline for your project</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Workflow Controls */}
            {workflow.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {workflow.length} steps generated
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isAnimating 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {isAnimating ? "Live" : "Paused"}
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border hover:border-primary/50 transition-all"
                  >
                    {showDetails ? "Hide Details" : "Show Details"}
                  </button>
                </div>
              </div>
            )}

            {/* Workflow Steps */}
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-7 left-0 right-0 h-0.5 bg-border z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((activeStep + 1) / displaySteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="relative z-10 flex justify-between">
                {displaySteps.map((step, index) => {
                  const isActive = index === activeStep
                  const isCompleted = index < activeStep
                  const Icon = step.icon || ListTodo

                  return (
                    <motion.div
                      key={step.id}
                      className="flex flex-col items-center"
                      onClick={() => {
                        setActiveStep(index)
                        setIsAnimating(false)
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: isActive ? 1.15 : 1,
                          boxShadow: isActive 
                            ? "0 0 30px rgba(124, 58, 237, 0.5)" 
                            : "0 0 0px rgba(124, 58, 237, 0)",
                        }}
                        transition={{ duration: 0.3 }}
                        className={`relative w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                          isActive || isCompleted
                            ? `bg-gradient-to-br ${step.color}`
                            : "bg-muted border border-border"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isActive || isCompleted ? "text-white" : "text-muted-foreground"}`} />
                        
                        {/* Pulse effect for active */}
                        {isActive && (
                          <motion.div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color}`}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </motion.div>

                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0.6 }}
                        className="mt-3 text-center max-w-[80px]"
                      >
                        <p className={`text-xs font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </p>
                        {"duration" in step && step.duration && (
                          <p className="text-[10px] text-muted-foreground">{step.duration}</p>
                        )}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Active Step Details */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${displaySteps[activeStep]?.color || colorMap[0]} flex items-center justify-center`}>
                  {(() => {
                    const Icon = displaySteps[activeStep]?.icon || ListTodo
                    return <Icon className="w-5 h-5 text-white" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{displaySteps[activeStep]?.title}</p>
                  <p className="text-sm text-muted-foreground">{displaySteps[activeStep]?.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Show detailed tasks for generated workflows */}
              {showDetails && workflow.length > 0 && workflow[activeStep]?.tasks && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Tasks in this stage:</p>
                  <ul className="space-y-1">
                    {workflow[activeStep].tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Reset Button */}
            {workflow.length > 0 && (
              <Button
                onClick={() => { setWorkflow([]); setInput(""); setActiveStep(0); setIsAnimating(false); }}
                variant="outline"
                className="w-full mt-4 border-green-500/30 hover:bg-green-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Workflow
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
