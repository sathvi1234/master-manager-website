"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, FileText, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react"

const activityTypes = [
  { icon: Sparkles, text: "Generated 3 tasks from client feedback", color: "text-purple-400", bgColor: "bg-purple-500/20" },
  { icon: FileText, text: "PRD document updated automatically", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { icon: AlertTriangle, text: "Scope change detected in Project Beta", color: "text-orange-400", bgColor: "bg-orange-500/20" },
  { icon: CheckCircle2, text: "5 tasks marked as complete", color: "text-green-400", bgColor: "bg-green-500/20" },
  { icon: Zap, text: "Workflow optimized for sprint planning", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
]

interface Activity {
  id: number
  icon: typeof Sparkles
  text: string
  color: string
  bgColor: string
  time: string
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [nextId, setNextId] = useState(0)

  useEffect(() => {
    // Initial activities
    const initialActivities = activityTypes.slice(0, 3).map((activity, index) => ({
      ...activity,
      id: index,
      time: `${(index + 1) * 5} min ago`,
    }))
    setActivities(initialActivities)
    setNextId(3)

    // Add new activities periodically
    const interval = setInterval(() => {
      const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const newActivity: Activity = {
        ...randomActivity,
        id: nextId,
        time: "Just now",
      }
      
      setActivities((prev) => {
        const updated = [newActivity, ...prev.slice(0, 4)]
        // Update times for existing activities
        return updated.map((a, i) => ({
          ...a,
          time: i === 0 ? "Just now" : `${i * 5} min ago`,
        }))
      })
      setNextId((prev) => prev + 1)
    }, 8000)

    return () => clearInterval(interval)
  }, [nextId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">AI Activity Feed</h2>
          <motion.div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-400">Live</span>
          </motion.div>
        </div>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <motion.div
                className={`w-8 h-8 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}
                whileHover={{ scale: 1.1 }}
              >
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{activity.text}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Processing indicator */}
      <motion.div
        className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="text-xs">AI is monitoring your projects...</span>
      </motion.div>
    </motion.div>
  )
}
