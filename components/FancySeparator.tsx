"use client"

import type React from "react"
import { motion } from "framer-motion"

interface FancySeparatorProps {
  color?: string
}

const FancySeparator: React.FC<FancySeparatorProps> = ({ color = "white" }) => {
  return (
    <div className="w-full h-16 overflow-hidden">
      <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d="M0,0 L250,50 L500,0 L500,50 L0,50 Z"
          fill={color}
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

export default FancySeparator
