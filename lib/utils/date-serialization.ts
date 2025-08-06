import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

/**
 * Utilitários para lidar com datas serializadas vindas de APIs
 */

/**
 * Converte uma string de data serializada para um objeto Date
 */
export function deserializeDate(dateString: string | null): Date | null {
  if (!dateString) return null
  return new Date(dateString)
}

/**
 * Formata uma data serializada diretamente para string
 */
export function formatSerializedDate(
  dateString: string | null, 
  formatPattern: string = "dd/MM/yyyy"
): string {
  if (!dateString) return "-"
  return format(new Date(dateString), formatPattern, { locale: ptBR })
}

/**
 * Formata uma hora serializada diretamente para string
 */
export function formatSerializedTime(dateString: string | null): string {
  if (!dateString) return "-"
  return format(new Date(dateString), "HH:mm", { locale: ptBR })
}

/**
 * Formata uma data e hora completa serializada
 */
export function formatSerializedDateTime(
  dateString: string | null,
  formatPattern: string = "dd/MM/yyyy 'às' HH:mm"
): string {
  if (!dateString) return "-"
  return format(new Date(dateString), formatPattern, { locale: ptBR })
}