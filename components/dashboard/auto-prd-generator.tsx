"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Send, ChevronDown, ChevronUp, Loader2, AlertCircle, Zap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAIContent } from "@/lib/ai-service"
import { useAIContext, type PRDData } from "@/lib/ai-context"

export function AutoPRDGenerator() {
  const { currentRequirement } = useAIContext()
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [prd, setPrd] = useState<PRDData | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"api" | "fallback" | null>(null)
  const [generatingPhase, setGeneratingPhase] = useState<string>("")

  const generatePRD = async () => {
    const requirement = input.trim() || currentRequirement
    
    if (!requirement) {
      setError("Please enter a project description or generate tasks first")
      return
    }
    
    setIsGenerating(true)
    setError(null)
    setPrd(null)
    setActiveSection(null)
    setSource(null)
    
    // Show progress phases
    const phases = ["Analyzing requirements...", "Identifying features...", "Generating PRD..."]
    for (const phase of phases) {
      setGeneratingPhase(phase)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    try {
      const result = await generateAIContent<PRDData>("prd", requirement)
      
      if (!result.data || Object.keys(result.data).length === 0) {
        throw new Error("No PRD generated")
      }
      
      setPrd(result.data)
      setSource(result.source)
      setActiveSection("overview")
      
      if (result.error) {
        console.warn("[v0] PRD generation fallback used:", result.error)
      }
    } catch (err) {
      console.error("[v0] PRD generation failed:", err)
      setError(err instanceof Error ? err.message : "Failed to generate PRD. Please try again.")
    } finally {
      setIsGenerating(false)
      setGeneratingPhase("")
    }
  }

  const sections = prd ? [
    { id: "overview", label: "Overview", available: !!prd.projectOverview },
    { id: "features", label: "Features", available: !!prd.features?.length },
    { id: "roles", label: "User Roles", available: !!prd.userRoles?.length },
    { id: "requirements", label: "Requirements", available: !!prd.functionalRequirements?.length },
    { id: "flow", label: "User Flow", available: !!prd.userFlow?.length },
    { id: "technical", label: "Technical", available: !!prd.technicalRequirements },
    { id: "risks", label: "Risks", available: !!prd.risks?.length },
  ].filter(s => s.available) : []

  const renderSectionContent = () => {
    if (!prd || !activeSection) return null

    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">{prd.projectOverview?.title}</h4>
            <p className="text-muted-foreground">{prd.projectOverview?.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                {prd.projectOverview?.domain}
              </span>
              {prd.projectOverview?.targetUsers?.map((user, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  {user}
                </span>
              ))}
            </div>
          </div>
        )
      
      case "features":
        return (
          <div className="space-y-2">
            {prd.features?.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{feature.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    feature.priority === "must-have" 
                      ? "bg-red-500/20 text-red-400" 
                      : feature.priority === "should-have"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {feature.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        )
      
      case "roles":
        return (
          <div className="space-y-3">
            {prd.userRoles?.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                    {role.role.charAt(0)}
                  </span>
                  <span className="font-medium text-foreground">{role.role}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.map((perm, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {perm}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case "requirements":
        return (
          <div className="space-y-2">
            {prd.functionalRequirements?.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
                    {req.id}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-1">{req.requirement}</p>
                <p className="text-xs text-muted-foreground">Acceptance: {req.acceptance}</p>
              </motion.div>
            ))}
          </div>
        )
      
      case "flow":
        return (
          <div className="relative">
            {prd.userFlow?.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 mb-4 last:mb-0"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                    {step.step}
                  </div>
                  {i < (prd.userFlow?.length || 0) - 1 && (
                    <div className="absolute top-8 left-1/2 w-0.5 h-8 -translate-x-1/2 bg-primary/20" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-foreground">{step.action}</p>
                  <p className="text-xs text-muted-foreground">Screen: {step.screen}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case "technical":
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(prd.technicalRequirements || {}).map(([key, values], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <h5 className="text-sm font-medium text-foreground capitalize mb-2">{key}</h5>
                <div className="flex flex-wrap gap-1">
                  {(values as string[])?.map((item, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case "risks":
        return (
          <div className="space-y-2">
            {prd.risks?.map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground">{risk.risk}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    risk.severity === "high" 
                      ? "bg-red-500/20 text-red-400" 
                      : risk.severity === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Mitigation: {risk.mitigation}</p>
              </motion.div>
            ))}
          </div>
        )
      
      default:
        return null
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Auto PRD Generator</h3>
            <p className="text-sm text-muted-foreground">Generate comprehensive product requirements</p>
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
                placeholder={currentRequirement 
                  ? `Using: "${currentRequirement.slice(0, 50)}..." or enter new description`
                  : "Describe your project for PRD generation..."
                }
                className="w-full h-20 bg-muted/30 border border-border rounded-xl p-4 pr-12 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Button
                onClick={generatePRD}
                disabled={isGenerating}
                size="icon"
                className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 rounded-lg"
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
            {isGenerating && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{generatingPhase}</span>
              </div>
            )}

            {/* Generated PRD */}
            {prd && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Source indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">PRD generated</span>
                  </div>
                  {source === "fallback" && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Demo Mode</span>
                    </div>
                  )}
                </div>

                {/* Section Tabs */}
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>

                {/* Section Content */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border min-h-[200px] max-h-[400px] overflow-y-auto">
                  {renderSectionContent()}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
