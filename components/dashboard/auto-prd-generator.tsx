"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Play, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Users, Target, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PRDSection {
  title: string
  icon: React.ElementType
  content: string[]
}

const samplePRD: PRDSection[] = [
  {
    title: "Features",
    icon: Target,
    content: [
      "User authentication with social login support",
      "Real-time analytics dashboard with charts",
      "Customizable widget layout system",
      "Export reports to PDF/CSV formats",
      "Team collaboration with role-based access",
    ],
  },
  {
    title: "User Flow",
    icon: Users,
    content: [
      "1. User lands on login page",
      "2. Authenticates via email or OAuth",
      "3. Redirected to personalized dashboard",
      "4. Views analytics and key metrics",
      "5. Customizes widgets and preferences",
    ],
  },
  {
    title: "Acceptance Criteria",
    icon: ListChecks,
    content: [
      "Dashboard loads within 2 seconds",
      "All charts update in real-time",
      "Mobile responsive design",
      "WCAG 2.1 AA accessibility compliance",
      "99.9% uptime SLA requirement",
    ],
  },
]

export function AutoPRDGenerator() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSections, setGeneratedSections] = useState<PRDSection[]>([])
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [typingText, setTypingText] = useState("")

  const generatePRD = () => {
    setIsGenerating(true)
    setGeneratedSections([])
    setCurrentSectionIndex(0)
    setCurrentItemIndex(0)
    setTypingText("")
  }

  useEffect(() => {
    if (!isGenerating) return

    if (currentSectionIndex < samplePRD.length) {
      const section = samplePRD[currentSectionIndex]
      
      if (currentItemIndex === 0 && typingText === "") {
        // Add new section
        setGeneratedSections(prev => [...prev, { ...section, content: [] }])
      }

      if (currentItemIndex < section.content.length) {
        const targetText = section.content[currentItemIndex]
        
        if (typingText.length < targetText.length) {
          const timer = setTimeout(() => {
            setTypingText(targetText.slice(0, typingText.length + 1))
          }, 20)
          return () => clearTimeout(timer)
        } else {
          // Finished typing current item
          setGeneratedSections(prev => {
            const updated = [...prev]
            const lastSection = updated[updated.length - 1]
            if (lastSection && !lastSection.content.includes(targetText)) {
              lastSection.content.push(targetText)
            }
            return updated
          })
          setTypingText("")
          setCurrentItemIndex(prev => prev + 1)
        }
      } else {
        // Move to next section
        setCurrentSectionIndex(prev => prev + 1)
        setCurrentItemIndex(0)
      }
    } else {
      setIsGenerating(false)
    }
  }, [isGenerating, currentSectionIndex, currentItemIndex, typingText])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Auto PRD Generator</h3>
            <p className="text-sm text-muted-foreground">Generate structured requirements automatically</p>
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
            {generatedSections.length === 0 && !isGenerating && (
              <Button
                onClick={generatePRD}
                className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white rounded-xl py-6"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate PRD from Latest Tasks
              </Button>
            )}

            {/* Loading State */}
            {isGenerating && generatedSections.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Analyzing project context...</span>
                </div>
              </div>
            )}

            {/* Generated PRD Sections */}
            <div className="space-y-4">
              {generatedSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-muted/30 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 border-b border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-medium text-foreground">{section.title}</h4>
                    {section.content.length === samplePRD[sectionIndex]?.content.length && (
                      <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2"
                      >
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </motion.div>
                    ))}
                    {/* Typing indicator */}
                    {isGenerating && 
                     currentSectionIndex === sectionIndex && 
                     typingText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-2"
                      >
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground">
                          {typingText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                          />
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reset Button */}
            {generatedSections.length > 0 && !isGenerating && (
              <Button
                onClick={generatePRD}
                variant="outline"
                className="w-full mt-4 border-primary/30 hover:bg-primary/10"
              >
                Regenerate PRD
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
