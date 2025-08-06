import { z } from 'zod'

export const atividadeSchema = z.object({
  aditivoM3: z.coerce.number().min(0, 'Aditivo M³ deve ser maior ou igual a zero').optional(),
  aditivoL: z.coerce.number().min(0, 'Aditivo L deve ser maior ou igual a zero').optional(),
  execucao: z.enum(['EXECUTADO', 'INICIAL', 'MEIO', 'FINAL'], {
    required_error: 'Status de execução é obrigatório'
  }).optional(),
  inicioExpediente: z.string().optional(),
  inicioAlmoco: z.string().optional(),
  fimAlmoco: z.string().optional(),
  fimExpediente: z.string().optional(),
  obsExecucao: z.string().max(500, 'Observação muito longa').optional(),
  obsPonto: z.string().max(500, 'Observação muito longa').optional(),
  obsQtdBetoneira: z.string().max(500, 'Observação muito longa').optional(),
  obsHOI: z.string().max(500, 'Observação muito longa').optional(),
  integranteIds: z.array(z.string()).min(1, 'Pelo menos um integrante é obrigatório'),
  obraId: z.string().min(1, 'Obra é obrigatória'),
  pavimentoId: z.string().min(1, 'Pavimento é obrigatório'),
  // Campos do pavimento
  dataExecucao: z.string().min(1, 'Data de execução é obrigatória'),
  areaExecutadaM2: z.coerce.number().min(0.01, 'Área executada deve ser maior que zero'),
}).refine(
  (data) => {
    // Validação da data de execução não pode ser no futuro
    if (data.dataExecucao) {
      const dataExec = new Date(data.dataExecucao)
      const hoje = new Date()
      hoje.setHours(23, 59, 59, 999) // Final do dia atual
      return dataExec <= hoje
    }
    return true
  },
  {
    message: 'Data de execução não pode ser no futuro',
    path: ['dataExecucao'],
  }
).refine(
  (data) => {
    // Se inicioExpediente está preenchido, deve ser anterior ao fimExpediente
    if (data.inicioExpediente && data.fimExpediente) {
      return new Date(`1970-01-01T${data.inicioExpediente}`) < new Date(`1970-01-01T${data.fimExpediente}`)
    }
    return true
  },
  {
    message: 'Início do expediente deve ser anterior ao fim do expediente',
    path: ['fimExpediente'],
  }
).refine(
  (data) => {
    // Se inicioAlmoco e fimAlmoco estão preenchidos, início deve ser anterior ao fim
    if (data.inicioAlmoco && data.fimAlmoco) {
      return new Date(`1970-01-01T${data.inicioAlmoco}`) < new Date(`1970-01-01T${data.fimAlmoco}`)
    }
    return true
  },
  {
    message: 'Início do almoço deve ser anterior ao fim do almoço',
    path: ['fimAlmoco'],
  }
)

export type AtividadeFormData = z.infer<typeof atividadeSchema>