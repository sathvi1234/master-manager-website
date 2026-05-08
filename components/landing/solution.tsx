"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Sparkles, FileText, AlertTriangle, GitBranch, Mic, Users } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Task Generation",
    description: "Transform vague requirements into clear, actionable tasks automatically.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/50",
  },
  {
    icon: FileText,
    title: "Auto PRD Generator",
    description: "Create detailed product requirement documents from simple conversations.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/50",
  },
  {
    icon: AlertTriangle,
    title: "Scope Detection",
    description: "Instantly identify when requirements expand beyond the original brief.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "hover:border-orange-500/50",
  },
  {
    icon: GitBranch,
    title: "Workflow Visualization",
    description: "See the entire project flow from communication to execution.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "hover:border-green-500/50",
  },
  {
    icon: Mic,
    title: "Voice-to-Task",
    description: "Convert voice memos and meeting recordings into structured tasks.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "hover:border-pink-500/50",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Keep clients, designers, and developers aligned in one platform.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/50",
  },
]

export function Solution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">The Solution</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Introducing <span className="gradient-text">Master Manager</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            The AI-powered platform that bridges the gap between client communication and team execution.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <div className={`glass rounded-2xl p-8 h-full transition-all duration-300 border border-transparent ${feature.border}`}>
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl ${feature.bg} opacity-0 group-hover:opacity-50 transition-opacity -z-10 blur-xl`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
