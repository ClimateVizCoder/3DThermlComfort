import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
