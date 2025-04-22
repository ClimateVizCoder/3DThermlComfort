"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CVSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function CVSection({ title, children, defaultOpen = false }: CVSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="w-full justify-between text-left font-bold text-xl mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </Button>
      {isOpen && <div className="pl-4 border-l-2 border-primary">{children}</div>}
    </div>
  )
}
