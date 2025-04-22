"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: t("nav.aboutMe"), href: "#über-mich" },
    { name: t("nav.skills"), href: "#skills" },
    { name: t("nav.experience"), href: "#industrieerfahrung" },
    { name: t("nav.career"), href: "#werdegang" },
    { name: t("nav.interests"), href: "#interessen" },
    { name: t("nav.contact"), href: "#kontakt" },
  ]

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.header
          className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manuel Kipp</h2>
            <div className="flex items-center">
              <nav className="hidden md:flex space-x-4 mr-6">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button variant="ghost" className="text-lg font-medium">
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </nav>
              <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("de")}
                  className={`${language === "de" ? "bg-blue-100" : ""} py-2`}
                >
                  DE
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className={`${language === "en" ? "bg-blue-100" : ""} py-2`}
                >
                  EN
                </Button>
              </div>
              <div className="md:hidden ml-4">
                <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu size={24} />
                </Button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full text-left py-3 text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.header>
      )}
    </AnimatePresence>
  )
}

export default Header
