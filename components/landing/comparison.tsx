"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, X, Minus } from "lucide-react"

const features = [
  { name: "Task Management", traditional: true, chatgpt: false, masterManager: true },
  { name: "Requirement Structuring", traditional: false, chatgpt: "partial", masterManager: true },
  { name: "Scope Detection", traditional: false, chatgpt: false, masterManager: true },
  { name: "Workflow Visualization", traditional: "partial", chatgpt: false, masterManager: true },
  { name: "Communication-to-Execution Layer", traditional: false, chatgpt: false, masterManager: true },
  { name: "Auto PRD Generation", traditional: false, chatgpt: "partial", masterManager: true },
  { name: "Real-time Collaboration", traditional: true, chatgpt: false, masterManager: true },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-500/50 mx-auto" />
  }
  return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />
}

export function Comparison() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Why <span className="gradient-text">Master Manager</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we compare to traditional tools and AI assistants.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
            <div className="text-muted-foreground font-medium">Feature</div>
            <div className="text-center text-muted-foreground font-medium">Traditional PM</div>
            <div className="text-center text-muted-foreground font-medium">ChatGPT</div>
            <div className="text-center">
              <span className="gradient-text font-bold">Master Manager</span>
            </div>
          </div>

          {/* Table Rows */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              className={`grid grid-cols-4 gap-4 p-6 items-center ${
                index !== features.length - 1 ? "border-b border-border" : ""
              } hover:bg-muted/30 transition-colors`}
            >
              <div className="text-foreground font-medium">{feature.name}</div>
              <div className="text-center">
                <FeatureCell value={feature.traditional} />
              </div>
              <div className="text-center">
                <FeatureCell value={feature.chatgpt} />
              </div>
              <div className="text-center relative">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
                >
                  <FeatureCell value={feature.masterManager} />
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Highlight Footer */}
          <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-primary/20">
            <div className="flex items-center justify-center gap-2 text-center">
              <span className="text-muted-foreground">The</span>
              <span className="font-bold gradient-text">missing layer</span>
              <span className="text-muted-foreground">between communication and execution</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
