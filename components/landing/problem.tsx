"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { MessageSquareX, TrendingUp, Clock } from "lucide-react"
import { GlowCard } from "@/components/effects/glow-card"

const problems = [
  {
    icon: MessageSquareX,
    title: "Miscommunication",
    description: "Clients describe ideas vaguely, leading to multiple interpretations and wasted development cycles.",
    gradient: "from-red-500 to-orange-500",
    stat: "67%",
    statLabel: "of project delays",
  },
  {
    icon: TrendingUp,
    title: "Scope Creep",
    description: "Requirements constantly change and expand without clear documentation or tracking.",
    gradient: "from-orange-500 to-yellow-500",
    stat: "43%",
    statLabel: "budget overrun",
  },
  {
    icon: Clock,
    title: "Delayed Delivery",
    description: "Teams spend hours translating feedback into actionable tasks instead of building.",
    gradient: "from-yellow-500 to-red-500",
    stat: "12hrs",
    statLabel: "wasted weekly",
  },
]

export function Problem() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated warning pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
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
            className="inline-flex items-center gap-2 mb-6"
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm text-red-400 uppercase tracking-wider font-medium">Common Challenges</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            The{" "}
            <motion.span 
              className="text-red-500 inline-block"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Real
            </motion.span>
            {" "}Problem
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            Clients communicate ideas in unclear and changing ways, forcing managers to spend hours translating feedback into actionable execution.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
            >
              <GlowCard className="glass rounded-2xl p-8 h-full transition-all duration-300">
                {/* Animated stat badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="absolute top-4 right-4"
                >
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${problem.gradient} bg-opacity-20`}>
                    <span className="text-xs font-bold text-white">{problem.stat}</span>
                    <span className="text-xs text-white/70 ml-1">{problem.statLabel}</span>
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  animate={hoveredCard === index ? { 
                    rotate: [0, -10, 10, -5, 5, 0],
                    scale: 1.1 
                  } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-6 transition-shadow`}
                  style={{
                    boxShadow: hoveredCard === index 
                      ? `0 0 30px rgba(239, 68, 68, 0.4)` 
                      : `0 0 0px transparent`,
                  }}
                >
                  <problem.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-foreground transition-colors">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>

                {/* Animated progress bar */}
                <div className="mt-6 h-1 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${problem.gradient}`}
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: problem.stat.replace(/\D/g, '') + "%" } : {}}
                    transition={{ duration: 1.5, delay: 0.8 + index * 0.2, ease: "easeOut" }}
                  />
                </div>

                {/* Hover Gradient Border */}
                <motion.div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${problem.gradient} opacity-0 transition-opacity -z-10`}
                  animate={{ opacity: hoveredCard === index ? 0.1 : 0 }}
                />
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Connecting lines animation */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 pointer-events-none">
          <svg className="w-full h-20 -mt-10" viewBox="0 0 1200 80" fill="none">
            <motion.path
              d="M200 40 L400 40 L600 40 L800 40 L1000 40"
              stroke="url(#problemGradient)"
              strokeWidth="2"
              strokeDasharray="10 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
              transition={{ duration: 2, delay: 1 }}
            />
            <defs>
              <linearGradient id="problemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
