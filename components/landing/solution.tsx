"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Sparkles, FileText, AlertTriangle, GitBranch, Mic, Users } from "lucide-react"
import { GlowCard } from "@/components/effects/glow-card"

const features = [
  {
    icon: Sparkles,
    title: "AI Task Generation",
    description: "Transform vague requirements into clear, actionable tasks automatically.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    glowColor: "rgba(168, 85, 247, 0.4)",
    border: "hover:border-purple-500/50",
  },
  {
    icon: FileText,
    title: "Auto PRD Generator",
    description: "Create detailed product requirement documents from simple conversations.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    glowColor: "rgba(59, 130, 246, 0.4)",
    border: "hover:border-blue-500/50",
  },
  {
    icon: AlertTriangle,
    title: "Scope Detection",
    description: "Instantly identify when requirements expand beyond the original brief.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    glowColor: "rgba(251, 146, 60, 0.4)",
    border: "hover:border-orange-500/50",
  },
  {
    icon: GitBranch,
    title: "Workflow Visualization",
    description: "See the entire project flow from communication to execution.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    glowColor: "rgba(74, 222, 128, 0.4)",
    border: "hover:border-green-500/50",
  },
  {
    icon: Mic,
    title: "Voice-to-Task",
    description: "Convert voice memos and meeting recordings into structured tasks.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    glowColor: "rgba(244, 114, 182, 0.4)",
    border: "hover:border-pink-500/50",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Keep clients, designers, and developers aligned in one platform.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    glowColor: "rgba(34, 211, 238, 0.4)",
    border: "hover:border-cyan-500/50",
  },
]

export function Solution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Central glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/50"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [
                Math.cos((i * Math.PI * 2) / 6) * 300,
                Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 300,
                Math.cos((i * Math.PI * 2) / 6) * 300,
              ],
              y: [
                Math.sin((i * Math.PI * 2) / 6) * 200,
                Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 200,
                Math.sin((i * Math.PI * 2) / 6) * 200,
              ],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">The Solution</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Introducing{" "}
            <motion.span 
              className="gradient-text inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Master Manager
            </motion.span>
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
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <GlowCard className={`glass rounded-2xl p-8 h-full transition-all duration-300 border border-transparent ${feature.border}`}>
                {/* Icon with animation */}
                <motion.div
                  animate={hoveredIndex === index ? { 
                    scale: 1.15,
                    rotate: [0, -5, 5, 0],
                  } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 relative`}
                  style={{
                    boxShadow: hoveredIndex === index 
                      ? `0 0 30px ${feature.glowColor}` 
                      : `0 0 0px transparent`,
                  }}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  
                  {/* Pulse ring on hover */}
                  {hoveredIndex === index && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl ${feature.bg}`}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated underline on hover */}
                <motion.div
                  className={`mt-4 h-0.5 rounded-full ${feature.bg}`}
                  initial={{ width: "0%" }}
                  animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />

                {/* Background glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl ${feature.bg} opacity-0 transition-opacity -z-10 blur-2xl`}
                  animate={{ opacity: hoveredIndex === index ? 0.3 : 0 }}
                />
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom connector animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 text-muted-foreground"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">See it in action</span>
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
