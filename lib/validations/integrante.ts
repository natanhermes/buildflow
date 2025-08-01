import { z } from 'zod'

export const integranteSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  equipeId: z.string().min(1, 'Equipe é obrigatória'),
})

export type IntegranteFormData = z.infer<typeof integranteSchema> 