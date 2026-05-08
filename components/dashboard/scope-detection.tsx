"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Plus, Minus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScopeItem {
  id: number
  text: string
  type: "added" | "removed" | "modified"
}

const sampleChanges: ScopeItem[] = [
  { id: 1, text: "Add real-time notifications system", type: "added" },
  { id: 2, text: "Include admin panel with user management", type: "added" },
  { id: 3, text: "Remove email verification step", type: "removed" },
  { id: 4, text: "Extend analytics to include custom reports", type: "modified" },
  { id: 5, text: "Add multi-language support", type: "added" },
]

export function ScopeDetection() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [changes, setChanges] = useState<ScopeItem[]>([])
  const [scopeIncrease, setScopeIncrease] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  const analyzeScope = () => {
    setIsAnalyzing(true)
    setChanges([])
    setScopeIncrease(0)
    setShowWarning(false)

    setTimeout(() => {
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < sampleChanges.length) {
          setChanges(prev => [...prev, sampleChanges[currentIndex]])
          if (sampleChanges[currentIndex].type === "added") {
            setScopeIncrease(prev => prev + 15)
          }
          currentIndex++
        } else {
          clearInterval(interval)
          setIsAnalyzing(false)
          setShowWarning(true)
        }
      }, 400)
    }, 800)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "added": return <Plus className="w-3 h-3" />
      case "removed": return <Minus className="w-3 h-3" />
      default: return <RefreshCw className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "added": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "removed": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Scope Detection</h3>
            <p className="text-sm text-muted-foreground">Monitor requirement changes automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showWarning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-xs text-red-400 font-medium">Scope Increase Detected</span>
            </motion.div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
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
            {/* Analyze Button */}
            {changes.length === 0 && !isAnalyzing && (
              <Button
                onClick={analyzeScope}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white rounded-xl py-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Scope Changes
              </Button>
            )}

            {/* Analyzing State */}
            {isAnalyzing && changes.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
                  >
                    <RefreshCw className="w-6 h-6 text-orange-400" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">Comparing requirements...</span>
                </div>
              </div>
            )}

            {/* Scope Increase Meter */}
            {scopeIncrease > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Scope Increase</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    <motion.span
                      key={scopeIncrease}
                      initial={{ scale: 1.5, color: "#f87171" }}
                      animate={{ scale: 1, color: "#f87171" }}
                      className="text-lg font-bold"
                    >
                      +{scopeIncrease}%
                    </motion.span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(scopeIncrease, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Changes List */}
            <div className="space-y-2">
              {changes.map((change, index) => (
                <motion.div
                  key={change.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${getTypeColor(change.type)}`}>
                    {getTypeIcon(change.type)}
                  </div>
                  <span className="text-sm text-foreground flex-1">{change.text}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(change.type)}`}>
                    {change.type}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Reset Button */}
            {changes.length > 0 && !isAnalyzing && (
              <Button
                onClick={analyzeScope}
                variant="outline"
                className="w-full mt-4 border-orange-500/30 hover:bg-orange-500/10"
              >
                Re-analyze Changes
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
