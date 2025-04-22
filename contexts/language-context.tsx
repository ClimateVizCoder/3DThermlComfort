"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/app/translations"

type Language = "de" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string | any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      return savedLanguage && (savedLanguage === "de" || savedLanguage === "en") ? savedLanguage : "de"
    }
    return "de"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "de" || savedLanguage === "en")) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
    }
  }, [language])

  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        return key
      }
    }

    return value
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
