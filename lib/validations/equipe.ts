import { z } from 'zod'

export const equipeSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s\d\-_]+$/, 'Nome deve conter apenas letras, números, espaços, hífens e underscores'),
  obraId: z.string().min(1, 'Obra é obrigatória'),
})

export type EquipeFormData = z.infer<typeof equipeSchema> 