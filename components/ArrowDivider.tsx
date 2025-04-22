"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ArrowDividerProps {
  color?: string
}

const ArrowDivider: React.FC<ArrowDividerProps> = ({ color = "rgba(255, 255, 255, 0.1)" }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const arrowProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  return (
    <div ref={ref} className="relative w-full h-24 overflow-hidden">
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 0L50 0L100 0"
          stroke={color}
          strokeWidth="2"
          style={{
            pathLength: arrowProgress,
            pathOffset: 1,
          }}
        />
        <motion.path
          d="M50 0L50 24"
          stroke={color}
          strokeWidth="2"
          style={{
            pathLength: arrowProgress,
            pathOffset: 1,
          }}
        />
      </svg>
    </div>
  )
}

export default ArrowDivider
