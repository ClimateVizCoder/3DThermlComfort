import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${jakarta.variable} bg-background`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "Manuel Kipp – Projektmanager, Ingenieur & Gründer von ThermalNext",
  description:
    "Projektmanager bei KNDS Deutschland, Gründer von ThermalNext und Ingenieur der Fahrzeugtechnik mit Promotion an der TU München.",
  generator: "v0.app",
}
