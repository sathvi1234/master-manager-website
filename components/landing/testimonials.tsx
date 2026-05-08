"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Most delays happen because requirements are misunderstood. Master Manager fixes that at the source.",
    author: "Sarah Chen",
    role: "CTO, TechFlow Agency",
    avatar: "SC",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    quote: "This feels like the missing layer between communication and execution. Finally, clarity from chaos.",
    author: "Marcus Rodriguez",
    role: "Founder, DevScale Studios",
    avatar: "MR",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "Reduces communication overhead significantly. Our team now spends time building, not translating.",
    author: "Emily Watson",
    role: "Project Manager, Digital Craft",
    avatar: "EW",
    gradient: "from-primary to-secondary",
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What <span className="gradient-text">Leaders</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from agency leaders who transformed their workflow.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="glass rounded-2xl p-8 h-full relative">
                {/* Quote Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className={`absolute -top-4 right-8 w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}
                >
                  <Quote className="w-5 h-5 text-white" />
                </motion.div>

                {/* Quote */}
                <p className="text-foreground text-lg leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
