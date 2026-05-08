"use client"

import { motion } from "framer-motion"

interface GlowingTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function GlowingText({ children, className = "", delay = 0 }: GlowingTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {/* Glow layer */}
      <motion.span
        className="absolute inset-0 blur-lg"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #7C3AED 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
      
      {/* Main text */}
      <motion.span
        className="relative"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #7C3AED 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
