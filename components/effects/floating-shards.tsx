"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Shard {
  id: number
  size: number
  x: number
  y: number
  rotation: number
  delay: number
  duration: number
}

// Seeded random number generator for consistent server/client rendering
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export function FloatingShards() {
  const [shards, setShards] = useState<Shard[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Generate shards only on client side to avoid hydration mismatch
    const random = seededRandom(42)
    const generatedShards = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: random() * 30 + 10,
      x: random() * 100,
      y: random() * 100,
      rotation: random() * 360,
      delay: random() * 2,
      duration: 8 + random() * 4,
    }))
    setShards(generatedShards)
  }, [])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted || shards.length === 0) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          className="absolute"
          style={{
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            width: shard.size,
            height: shard.size,
          }}
          initial={{ opacity: 0, rotate: shard.rotation }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            rotate: [shard.rotation, shard.rotation + 180, shard.rotation + 360],
            y: [0, -30, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: shard.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shard.delay,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill="none"
              stroke="url(#shardGradient)"
              strokeWidth="1"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="shardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
