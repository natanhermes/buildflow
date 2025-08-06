import { z } from 'zod'

export const integranteSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  cpf: z.string()
    .min(1, 'CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido (000.000.000-00)'),
})

export type IntegranteFormData = z.infer<typeof integranteSchema> 