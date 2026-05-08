"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Brain, ListTodo, Rocket, ChevronRight } from "lucide-react"

const steps = [
  { id: 1, title: "Client Input", description: "Receive requirements", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
  { id: 2, title: "AI Analysis", description: "Process & understand", icon: Brain, color: "from-primary to-secondary" },
  { id: 3, title: "Task Generation", description: "Create actionable items", icon: ListTodo, color: "from-green-500 to-emerald-500" },
  { id: 4, title: "Execution", description: "Team delivers", icon: Rocket, color: "from-orange-500 to-yellow-500" },
]

export function WorkflowVisualization() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workflow Visualization</h3>
          <p className="text-sm text-muted-foreground">Real-time pipeline status</p>
        </div>
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
      </div>

      {/* Workflow Steps */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeStep
            const isCompleted = index < activeStep

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
                  <step.icon className={`w-6 h-6 ${isActive || isCompleted ? "text-white" : "text-muted-foreground"}`} />
                  
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
                  className="mt-3 text-center"
                >
                  <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
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
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center`}>
            {(() => {
              const Icon = steps[activeStep].icon
              return <Icon className="w-5 h-5 text-white" />
            })()}
          </div>
          <div className="flex-1">
            <p className="text-foreground font-medium">{steps[activeStep].title}</p>
            <p className="text-sm text-muted-foreground">{steps[activeStep].description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </motion.div>
    </motion.div>
  )
}
