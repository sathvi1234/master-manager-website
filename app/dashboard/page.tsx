"use client"

import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AITaskGenerator } from "@/components/dashboard/ai-task-generator"
import { AutoPRDGenerator } from "@/components/dashboard/auto-prd-generator"
import { ScopeDetection } from "@/components/dashboard/scope-detection"
import { WorkflowVisualization } from "@/components/dashboard/workflow-visualization"
import { AIClarification } from "@/components/dashboard/ai-clarification"
import { VoiceToTask } from "@/components/dashboard/voice-to-task"
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed"
import { AnimatedStatCard } from "@/components/dashboard/animated-stat-card"
import { ParticleField } from "@/components/effects/particle-field"

const stats = [
  { label: "Active Projects", value: "12", icon: LayoutDashboard, trend: "+2 this week" },
  { label: "Tasks Generated", value: "248", icon: CheckCircle2, trend: "+34 today" },
  { label: "PRDs Created", value: "18", icon: FileText, trend: "+3 this week" },
  { label: "Scope Alerts", value: "5", icon: AlertTriangle, trend: "-2 resolved" },
]

const recentTasks = [
  { title: "Design authentication flow", status: "In Progress", project: "Client Portal" },
  { title: "Build analytics dashboard", status: "Pending", project: "SaaS App" },
  { title: "Create API documentation", status: "Completed", project: "Developer Tools" },
  { title: "Implement dark mode", status: "In Progress", project: "Mobile App" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField count={30} />
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      {/* Dashboard Header */}
      <header className="glass sticky top-0 z-50 border-b border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Master<span className="gradient-text">Manager</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-medium">
                  D
                </div>
                <span className="text-sm hidden sm:block">Demo User</span>
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Exit Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to the Demo</h1>
          <p className="text-muted-foreground">
            This is a preview of the Master Manager dashboard. Explore the AI-powered features.
          </p>
        </motion.div>

        {/* Stats Grid with Animated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              index={index}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent AI-Generated Tasks</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === "Completed" ? "bg-green-500" :
                      task.status === "In Progress" ? "bg-primary" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <p className="text-foreground font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                    task.status === "In Progress" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {task.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, label: "New AI Conversation", desc: "Generate tasks from ideas" },
                { icon: FileText, label: "Create PRD", desc: "Auto-generate requirements" },
                { icon: Users, label: "Team Overview", desc: "View team workload" },
                { icon: TrendingUp, label: "Analytics", desc: "Track project metrics" },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live AI Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <LiveActivityFeed />
        </motion.div>

        {/* AI-Powered Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI-Powered Features</h2>
              <p className="text-sm text-muted-foreground">Interactive tools to supercharge your workflow</p>
            </div>
          </div>

          {/* AI Widgets Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <AITaskGenerator />
              <AutoPRDGenerator />
              <ScopeDetection />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <WorkflowVisualization />
              <AIClarification />
              <VoiceToTask />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
