"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface AnimatedStatCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend: string
  index: number
  color?: string
}

export function AnimatedStatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  index,
  color = "primary"
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(numericValue)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [numericValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        className="glass rounded-2xl p-6 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.02, y: -2 }}
        style={{
          boxShadow: isHovered 
            ? `0 0 30px rgba(124, 58, 237, 0.2)` 
            : `0 0 0 transparent`,
        }}
      >
        {/* Animated background gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
              animate={isHovered ? { 
                rotate: [0, -5, 5, 0],
                scale: 1.1 
              } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
            
            {/* Trend badge */}
            <motion.span 
              className={`text-xs px-2 py-1 rounded-full ${
                trend.includes('+') || trend.includes('this') 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            >
              {trend}
            </motion.span>
          </div>

          {/* Animated counter */}
          <motion.p 
            className="text-3xl font-bold text-foreground mb-1"
            key={displayValue}
          >
            {value.includes('hr') ? displayValue + 'hrs' : displayValue}
          </motion.p>
          
          <p className="text-sm text-muted-foreground">{label}</p>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min((displayValue / (numericValue || 1)) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Corner accent */}
        <motion.div
          className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl"
          animate={{ 
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.5 : 0.2 
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}
