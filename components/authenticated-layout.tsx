"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const pathname = usePathname()

    const publicPages = ["/signin"]
    const isPublicPage = publicPages.includes(pathname)

    if (status === "loading") {
        return <>{children}</>
    }

    if (isPublicPage) {
        return <>{children}</>
    }

    if (!session) {
        window.location.href = "/signin"
        return null
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
                <AppHeader />
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </SidebarProvider>
    )
}