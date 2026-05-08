"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageCircle, Brain, FileCheck, Users, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Client Shares Idea",
    description: "Clients communicate through email, chat, calls, or meetings in their natural way.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Understands Context",
    description: "Our AI analyzes the communication, understanding intent, requirements, and nuances.",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Tasks + PRD Generated",
    description: "Structured tasks and detailed PRDs are automatically created with priorities.",
    color: "from-primary to-secondary",
  },
  {
    number: "04",
    icon: Users,
    title: "Team Executes Clearly",
    description: "Developers and designers work from clear, actionable specifications.",
    color: "from-green-500 to-emerald-500",
  },
]

export function Workflow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="workflow" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless four-step process that transforms chaos into clarity.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="glass rounded-2xl p-8 text-center h-full relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-background rounded-full text-xs font-mono text-muted-foreground border border-border">
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity -z-10 blur-xl`} />
                </motion.div>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      <ArrowRight className="w-8 h-8 text-muted-foreground" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
