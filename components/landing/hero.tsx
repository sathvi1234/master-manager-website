"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles, Zap, Shield, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleField } from "@/components/effects/particle-field"
import { FloatingShards } from "@/components/effects/floating-shards"
import { GlowingText } from "@/components/effects/glowing-text"
import { MagneticButton } from "@/components/effects/magnetic-button"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Parallax effect values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const parallaxX = useSpring(mouseX, springConfig)
  const parallaxY = useSpring(mouseY, springConfig)
  
  // Transform for parallax layers
  const layer1X = useTransform(parallaxX, [-0.5, 0.5], [-20, 20])
  const layer1Y = useTransform(parallaxY, [-0.5, 0.5], [-20, 20])
  const layer2X = useTransform(parallaxX, [-0.5, 0.5], [-40, 40])
  const layer2Y = useTransform(parallaxY, [-0.5, 0.5], [-40, 40])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseX.set(x)
      mouseY.set(y)
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.12), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(37, 99, 235, 0.12), transparent)
            `,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Particle Field */}
        <ParticleField count={60} />
        
        {/* Floating Shards */}
        <FloatingShards />

        {/* Large animated orbs with parallax */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
            left: "5%",
            top: "10%",
            filter: "blur(80px)",
            x: layer1X,
            y: layer1Y,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
            right: "5%",
            bottom: "10%",
            filter: "blur(80px)",
            x: layer2X,
            y: layer2Y,
          }}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Center glow pulse */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Light streaks */}
        <motion.div
          className="absolute h-[1px] w-[300px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.6), transparent)",
            top: "25%",
          }}
          initial={{ left: "-300px", opacity: 0 }}
          animate={{
            left: ["−300px", "calc(100% + 300px)"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 4,
          }}
        />

        <motion.div
          className="absolute h-[1px] w-[200px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.6), transparent)",
            top: "65%",
          }}
          initial={{ left: "-200px", opacity: 0 }}
          animate={{
            left: ["-200px", "calc(100% + 200px)"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 6,
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 group cursor-default"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm text-muted-foreground">AI-Powered Project Management</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Headline with Glowing Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              From{" "}
              <GlowingText delay={0.5}>Confusion</GlowingText>
              <br />
              to <GlowingText delay={0.7}>Clarity</GlowingText>
            </motion.h1>

            {/* Subheadline with typing effect appearance */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground mb-4"
            >
              Turn messy client communication into structured tasks, PRDs, and workflows using AI.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground mb-8"
            >
              Master Manager helps agencies reduce miscommunication, prevent scope creep, and move faster from idea to execution.
            </motion.p>

            {/* CTAs with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <MagneticButton
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full group inline-flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
              >
                Request Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                className="border border-border hover:bg-muted/50 text-foreground rounded-full group inline-flex items-center justify-center px-8 py-3 transition-all duration-300"
              >
                <Play className="w-4 h-4 mr-2" />
                Explore Workflow
              </MagneticButton>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="hidden lg:flex items-center gap-2 mt-12 text-muted-foreground"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MousePointer2 className="w-5 h-5" />
              </motion.div>
              <span className="text-sm">Scroll to explore</span>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Mockup with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
            style={{ x: layer1X, y: layer1Y }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-[2rem] opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), transparent, rgba(37, 99, 235, 0.3))",
                  filter: "blur(20px)",
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative glass rounded-3xl p-6 glow-purple overflow-hidden"
              >
                {/* Animated border gradient */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["200% 0", "-200% 0"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Header */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div className="text-sm text-muted-foreground">Master Manager Dashboard</div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative space-y-4">
                  {/* Task List */}
                  <motion.div 
                    className="glass rounded-xl p-4"
                    whileHover={{ scale: 1.02, borderColor: "rgba(124, 58, 237, 0.3)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="font-medium text-foreground">AI Generated Tasks</span>
                      <motion.span
                        className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Live
                      </motion.span>
                    </div>
                    <div className="space-y-2">
                      {["Create login authentication", "Design analytics dashboard", "Build responsive layout"].map((task, i) => (
                        <motion.div
                          key={task}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.2 }}
                          className="flex items-center gap-2 text-sm text-muted-foreground group"
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          />
                          <span className="group-hover:text-foreground transition-colors">{task}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* PRD Preview */}
                  <motion.div 
                    className="glass rounded-xl p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-foreground">Auto-Generated PRD</span>
                    </div>
                    <div className="space-y-2">
                      <motion.div 
                        className="h-2 bg-muted rounded w-full overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary/50 to-secondary/50"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      <motion.div 
                        className="h-2 bg-muted rounded w-3/4 overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary/50 to-secondary/50"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.3 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Cards with enhanced animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -15, 0],
                }}
                transition={{ 
                  opacity: { delay: 0.8 },
                  scale: { delay: 0.8 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 glow-blue"
                style={{ x: layer2X, y: layer2Y }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <div className="text-xs text-muted-foreground">Scope Alert</div>
                    <div className="text-sm font-medium text-foreground">Detected +2 features</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -12, 0],
                }}
                transition={{ 
                  opacity: { delay: 1 },
                  scale: { delay: 1 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-muted-foreground">AI Processing...</span>
                  <motion.div
                    className="flex gap-0.5"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* New floating element - AI Activity indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: [0, 5, 0],
                }}
                transition={{ 
                  opacity: { delay: 1.2 },
                  scale: { delay: 1.2 },
                  x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/2 -right-8 glass rounded-xl p-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
