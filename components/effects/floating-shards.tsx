"use client"

import { motion } from "framer-motion"

export function FloatingShards() {
  const shards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
    duration: 8 + Math.random() * 4,
  }))

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
