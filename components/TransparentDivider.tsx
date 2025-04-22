import type React from "react"

interface TransparentDividerProps {
  height?: number
  color?: string
}

const TransparentDivider: React.FC<TransparentDividerProps> = ({
  height = 80,
  color = "rgba(255, 255, 255, 0.05)",
}) => {
  return (
    <div
      className="w-full"
      style={{
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  )
}

export default TransparentDivider
