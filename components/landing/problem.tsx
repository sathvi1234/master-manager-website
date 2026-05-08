"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { MessageSquareX, TrendingUp, Clock } from "lucide-react"

const problems = [
  {
    icon: MessageSquareX,
    title: "Miscommunication",
    description: "Clients describe ideas vaguely, leading to multiple interpretations and wasted development cycles.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Scope Creep",
    description: "Requirements constantly change and expand without clear documentation or tracking.",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: Clock,
    title: "Delayed Delivery",
    description: "Teams spend hours translating feedback into actionable tasks instead of building.",
    gradient: "from-yellow-500 to-red-500",
  },
]

export function Problem() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            The <span className="text-red-500">Real</span> Problem
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
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-8 h-full transition-all duration-300 glass-hover">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}
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

                {/* Hover Gradient Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity -z-10 p-[1px]">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${problem.gradient} opacity-20`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
