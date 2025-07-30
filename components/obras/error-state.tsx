import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  onRetry?: () => void
  message?: string
}

export function ErrorState({ onRetry, message = "Erro ao carregar obras" }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Ops! Algo deu errado</h3>
            <p className="text-sm text-muted-foreground">
              {message}. Tente novamente em alguns instantes.
            </p>
          </div>

          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}