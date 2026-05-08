"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Plus, Minus, TrendingUp, Loader2, AlertCircle, Zap, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAIContent, detectDomain } from "@/lib/ai-service"
import { useAIContext, type ScopeAnalysis } from "@/lib/ai-context"

export function ScopeDetection() {
  const { currentRequirement } = useAIContext()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [originalScope, setOriginalScope] = useState("")
  const [newScope, setNewScope] = useState("")
  const [analysis, setAnalysis] = useState<ScopeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"api" | "fallback" | null>(null)
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null)

  const analyzeScope = async () => {
    const original = originalScope.trim() || currentRequirement
    const updated = newScope.trim()
    
    if (!original) {
      setError("Please enter the original scope or generate tasks first")
      return
    }
    
    if (!updated) {
      setError("Please enter the updated/new scope to compare")
      return
    }
    
    setIsAnalyzing(true)
    setAnalysis(null)
    setError(null)
    setSource(null)

    // Detect domain for UI feedback
    const domain = detectDomain(updated)
    setDetectedDomain(domain !== "general" ? domain : null)

    try {
      const result = await generateAIContent<ScopeAnalysis>(
        "scope", 
        updated, 
        { original }
      )
      
      if (!result.data || !result.data.scopeChange) {
        throw new Error("Failed to analyze scope changes")
      }
      
      setAnalysis(result.data)
      setSource(result.source)
      
      if (result.error) {
        console.warn("[v0] Scope analysis fallback used:", result.error)
      }
    } catch (err) {
      console.error("[v0] Scope analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze scope. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "major": return "text-red-400"
      case "moderate": return "text-orange-400"
      case "minor": return "text-yellow-400"
      default: return "text-green-400"
    }
  }

  const reset = () => {
    setAnalysis(null)
    setOriginalScope("")
    setNewScope("")
    setError(null)
    setSource(null)
    setDetectedDomain(null)
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
          {analysis?.scopeChange?.detected && (
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
            {/* Input Section */}
            {!analysis && !isAnalyzing && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Original Scope</label>
                  <textarea
                    value={originalScope}
                    onChange={(e) => {
                      setOriginalScope(e.target.value)
                      setError(null)
                    }}
                    placeholder={currentRequirement 
                      ? `Using: "${currentRequirement.slice(0, 40)}..." or enter original scope`
                      : "Enter the original project scope..."
                    }
                    className="w-full h-20 bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Updated/New Scope</label>
                  <textarea
                    value={newScope}
                    onChange={(e) => {
                      setNewScope(e.target.value)
                      setError(null)
                    }}
                    placeholder="Enter the updated or new requirements to compare..."
                    className="w-full h-20 bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                  />
                </div>
                <Button
                  onClick={analyzeScope}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white rounded-xl py-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Analyze Scope Changes
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

            {/* Analyzing State */}
            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
                  >
                    <RefreshCw className="w-6 h-6 text-orange-400" />
                  </motion.div>
                  <span className="text-sm text-foreground">
                    {detectedDomain 
                      ? `Analyzing ${detectedDomain} scope changes...` 
                      : "Comparing requirements..."}
                  </span>
                  <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-4">
                {/* Success Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">Analysis complete</span>
                  </div>
                  {source === "fallback" && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Demo Mode</span>
                    </div>
                  )}
                </div>

                {/* Scope Increase Meter */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Scope Change</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        analysis.scopeChange.severity === "major" ? "bg-red-500/20 text-red-400" :
                        analysis.scopeChange.severity === "moderate" ? "bg-orange-500/20 text-orange-400" :
                        analysis.scopeChange.severity === "minor" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {analysis.scopeChange.severity}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`w-4 h-4 ${getSeverityColor(analysis.scopeChange.severity)}`} />
                        <motion.span
                          initial={{ scale: 1.5 }}
                          animate={{ scale: 1 }}
                          className={`text-lg font-bold ${getSeverityColor(analysis.scopeChange.severity)}`}
                        >
                          +{analysis.scopeChange.percentageIncrease}%
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(analysis.scopeChange.percentageIncrease, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{analysis.scopeChange.summary}</p>
                </motion.div>

                {/* Added Features */}
                {analysis.addedFeatures && analysis.addedFeatures.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Added Requirements</h4>
                    {analysis.addedFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${getTypeColor("added")}`}>
                          {getTypeIcon("added")}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-foreground">{feature.feature}</span>
                          <span className="text-xs text-muted-foreground ml-2">({feature.effort})</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          feature.impact === "high" ? "bg-red-500/20 text-red-400" :
                          feature.impact === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {feature.impact} impact
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Assessment */}
                {analysis.riskAssessment && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">Timeline Risk</p>
                      <p className="text-sm text-foreground mt-1">{analysis.riskAssessment.timeline}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">Budget Risk</p>
                      <p className="text-sm text-foreground mt-1">{analysis.riskAssessment.budget}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">Technical Risk</p>
                      <p className="text-sm text-foreground mt-1">{analysis.riskAssessment.technical}</p>
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full border-orange-500/30 hover:bg-orange-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Analyze New Changes
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
