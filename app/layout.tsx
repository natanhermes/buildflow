import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/auth-provider"
import AuthenticatedLayout from "@/components/authenticated-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BuildFlow RN",
  description: "Sistema de gestão de obras civis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
