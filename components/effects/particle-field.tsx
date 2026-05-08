"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
  animDuration: number
}

// Seeded random for consistent values
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export function ParticleField({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const random = seededRandom(123)
    const initialParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random() * 100,
      y: random() * 100,
      size: random() * 4 + 1,
      speedX: (random() - 0.5) * 0.3,
      speedY: (random() - 0.5) * 0.3,
      opacity: random() * 0.5 + 0.2,
      hue: random() > 0.5 ? 262 : 217,
      animDuration: 2 + random() * 2,
    }))
    setParticles(initialParticles)
  }, [count])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (particles.length === 0) return
    
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          if (newX > 100) newX = 0
          if (newX < 0) newX = 100
          if (newY > 100) newY = 0
          if (newY < 0) newY = 100

          const dx = mousePosition.x - newX
          const dy = mousePosition.y - newY
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 20) {
            newX += dx * 0.01
            newY += dy * 0.01
          }

          return { ...particle, x: newX, y: newY }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [mousePosition, particles.length])

  // Don't render particles during SSR
  if (!mounted) {
    return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`,
            boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 80%, 60%, ${particle.opacity * 0.5})`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.animDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
