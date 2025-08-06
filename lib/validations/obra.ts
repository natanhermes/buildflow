import { z } from 'zod'

export const pavimentoSchema = z.object({
  identificador: z.string().min(1, 'Identificador é obrigatório'),
  areaM2: z.coerce.number().positive('Área deve ser maior que zero'),
  argamassaM3: z.coerce.number().positive('Argamassa deve ser maior que zero'),
})

export const torreSchema = z.object({
  nome: z.string().min(1, 'Nome da torre é obrigatório'),
  pavimentos: z.array(pavimentoSchema).min(1, 'Pelo menos um pavimento é obrigatório'),
})

export const enderecoSchema = z.object({
  cep: z.string().min(1, 'CEP é obrigatório').regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
})

export const obraSchema = z.object({
  nome: z.string().min(1, 'Nome da obra é obrigatório'),
  cei: z.string().min(1, 'CEI é obrigatório').regex(/^\d{2}\.\d{3}\.\d{5}\/\d{2}$/, 'Formato de CEI inválido'),
  construtora: z.string().min(1, 'Construtora é obrigatória'),
  endereco: enderecoSchema,
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
export type EnderecoFormData = z.infer<typeof enderecoSchema> 