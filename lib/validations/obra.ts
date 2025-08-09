import { z } from 'zod'

export const pavimentoSchema = z.object({
  identificador: z.string().min(1, 'Identificador é obrigatório'),
  areaM2: z.coerce.number().positive('Área deve ser maior que zero'),
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
  enderecoCnpj: enderecoSchema.optional(),
  enderecoAcessoObra: enderecoSchema.optional(),
  razaoSocial: z.string().optional(),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato de CNPJ inválido')
    .optional(),
  codigoSFOBRAS: z.string().optional(),
  statusConsultaSPC: z.enum(['NAO_REALIZADA', 'REALIZADA_SEM_PENDENCIAS', 'REALIZADA_COM_PENDENCIAS']).optional(),
  baseCalcMaoObraMaterial: z.coerce.number().min(0).max(100).optional(),
  baseCalcLocacaoEquip: z.coerce.number().min(0).max(100).optional(),
  medicaoPeriodoDias: z.coerce.number().int().min(1).default(15).optional(),
  medicaoPrazoLiberacaoHoras: z.coerce.number().int().min(1).default(48).optional(),
  contatos: z
    .array(
      z.object({
        funcao: z.string().min(1, 'Função é obrigatória'),
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Email inválido').optional(),
        telefone: z
          .string()
          .regex(/^\+?\d{10,15}$/,
            'Telefone deve conter entre 10 e 15 dígitos, com DDI/DDD se necessário'
          )
          .optional(),
      })
    )
    .optional(),
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