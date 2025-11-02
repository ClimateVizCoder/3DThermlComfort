"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected")
    setShowBanner(false)
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  const text = {
    de: {
      title: "Cookie-Einstellungen",
      description:
        "Diese Website verwendet nur technisch notwendige Cookies, um die Funktionalität der Website zu gewährleisten. Es werden keine Tracking- oder Marketing-Cookies verwendet. Ihre Daten werden nicht an Dritte weitergegeben.",
      accept: "Akzeptieren",
      reject: "Ablehnen",
      privacy: "Datenschutzerklärung",
    },
    en: {
      title: "Cookie Settings",
      description:
        "This website only uses technically necessary cookies to ensure the functionality of the website. No tracking or marketing cookies are used. Your data will not be shared with third parties.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy Policy",
    },
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl border border-gray-200">
            <div className="relative p-6 md:p-8">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a365d] mb-3">{text[language].title}</h3>
                <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">{text[language].description}</p>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <Button onClick={handleAccept} className="bg-[#1a365d] hover:bg-[#2a4a7f] text-white px-6 py-2">
                    {text[language].accept}
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="border-[#1a365d] text-[#1a365d] hover:bg-gray-100 px-6 py-2 bg-transparent"
                  >
                    {text[language].reject}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
