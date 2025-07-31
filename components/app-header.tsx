"use client"

import { Menu, LogOut } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Role } from "@prisma/client"
import Form from "next/form"
import { logoutAction } from "@/app/actions/logoutAction"

export function AppHeader() {
  const { data: session } = useSession()
  const { toggleSidebar } = useSidebar()

  const getUserInitials = (nome?: string, sobrenome?: string) => {
    if (!nome && !sobrenome) return "U"
    const firstInitial = nome?.charAt(0) || ""
    const lastInitial = sobrenome?.charAt(0) || ""
    return (firstInitial + lastInitial).toUpperCase()
  }

  const getFullName = (nome?: string, sobrenome?: string) => {
    if (!nome && !sobrenome) return "Usuário"
    return `${nome || ""} ${sobrenome || ""}`.trim()
  }

  const getLabelByRole = (role?: Role) => {
    if (!role) return null

    switch (role) {
      case Role.MASTER:
        return <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md capitalize">{role.toUpperCase()}</span>
      case Role.OPERADOR:
        return <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-md capitalize">{role.toUpperCase()}</span>
      default:
        return null
    }
  }

  if (!session?.user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Alternar menu</span>
        </Button>

        <div className="flex-1" />

        <div className="mr-4">
          {getLabelByRole(session.user.role)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Olá, {getFullName(session.user.nome, session.user.sobrenome)}
              </span>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(session.user.nome, session.user.sobrenome)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{getFullName(session.user.nome, session.user.sobrenome)}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Form action={logoutAction} className="w-full">
                <button className="w-full flex items-center gap-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 