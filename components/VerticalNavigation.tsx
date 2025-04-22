"use client"

import type React from "react"

interface VerticalNavigationProps {
  sections: Array<{ id: string; title: string }>
  activeSection: string
  scrollToSection: (sectionId: string) => void
}

const VerticalNavigation: React.FC<VerticalNavigationProps> = ({ sections, activeSection, scrollToSection }) => (
  <div
    className="fixed right-[calc(4rem-0.5rem)] top-1/2 transform -translate-y-1/2 flex flex-col items-center"
    style={{ height: "40vh", justifyContent: "space-between" }}
  >
    {sections.map((section) => (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          activeSection === section.id ? "bg-[#3b82f6] w-4 h-4" : "bg-gray-300 hover:bg-[#3b82f6]"
        }`}
        aria-label={`Navigiere zu ${section.title}`}
      />
    ))}
  </div>
)

export default VerticalNavigation
