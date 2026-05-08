"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, CheckCircle2, AlertTriangle, Zap } from "lucide-react"

const notifications = [
  { icon: Sparkles, text: "AI generated 3 new tasks", type: "success" },
  { icon: CheckCircle2, text: "PRD document ready", type: "info" },
  { icon: AlertTriangle, text: "Scope change detected", type: "warning" },
  { icon: Zap, text: "Workflow optimized", type: "success" },
]

export function NotificationPopup() {
  const [currentNotification, setCurrentNotification] = useState<number | null>(null)

  useEffect(() => {
    const showNotification = () => {
      const randomIndex = Math.floor(Math.random() * notifications.length)
      setCurrentNotification(randomIndex)
      
      setTimeout(() => {
        setCurrentNotification(null)
      }, 4000)
    }

    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(showNotification, 5000)
    
    // Then show notifications periodically
    const interval = setInterval(showNotification, 12000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {currentNotification !== null && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="glass rounded-2xl p-4 flex items-center gap-3 glow-purple">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {(() => {
                const Icon = notifications[currentNotification].icon
                return <Icon className="w-5 h-5 text-primary" />
              })()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {notifications[currentNotification].text}
              </p>
              <p className="text-xs text-muted-foreground">Just now</p>
            </div>
            <motion.div
              className="w-1 h-full absolute right-0 top-0 bg-gradient-to-b from-primary to-secondary rounded-r-2xl"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              style={{ originY: 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
