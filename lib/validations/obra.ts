import { z } from 'zod'

export const pavimentoSchema = z.object({
  identificador: z.string().min(1, 'Identificador é obrigatório'),
  areaM2: z.coerce.number().positive('Área deve ser maior que zero'),
  argamassaM3: z.coerce.number().positive('Argamassa deve ser maior que zero'),
  espessuraCM: z.coerce.number().positive('Espessura deve ser maior que zero'),
})

export const torreSchema = z.object({
  nome: z.string().min(1, 'Nome da torre é obrigatório'),
  pavimentos: z.array(pavimentoSchema).min(1, 'Pelo menos um pavimento é obrigatório'),
})

export const obraSchema = z.object({
  nome: z.string().min(1, 'Nome da obra é obrigatório'),
  cei: z.string().min(1, 'CEI é obrigatório').regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato de CEI inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  valorM2: z.coerce.number().positive('Valor por m² deve ser maior que zero'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  torres: z.array(torreSchema).min(1, 'Pelo menos uma torre é obrigatória'),
}).refine(
  (data) => new Date(data.dataInicio) < new Date(data.dataFim),
  {
    message: 'Data de início deve ser anterior à data de fim',
    path: ['dataFim'],
  }
)

export type ObraFormData = z.infer<typeof obraSchema>
export type TorreFormData = z.infer<typeof torreSchema>
export type PavimentoFormData = z.infer<typeof pavimentoSchema> 