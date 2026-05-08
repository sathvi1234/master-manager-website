"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(37, 99, 235, 0.15), transparent),
              radial-gradient(ellipse 40% 30% at 40% 80%, rgba(124, 58, 237, 0.1), transparent)
            `,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)",
          left: "10%",
          top: "20%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)",
          right: "10%",
          bottom: "20%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Light streaks */}
      <motion.div
        className="absolute h-[2px] w-[200px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent)",
          top: "30%",
          left: "-200px",
        }}
        animate={{
          left: ["−200px", "calc(100% + 200px)"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3,
        }}
      />

      <motion.div
        className="absolute h-[1px] w-[150px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.5), transparent)",
          top: "60%",
          left: "-150px",
        }}
        animate={{
          left: ["-150px", "calc(100% + 150px)"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
          delay: 2,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
