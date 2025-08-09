import { z } from 'zod'

const statusEnum = z.enum(['EXECUCAO', 'PREPARACAO_1', 'PREPARACAO_2', 'PREPARACAO_3', 'MANUTENCAO', 'SEM_ATIVIDADE'])

export const atividadeSchema = z.object({
  // Operacionais
  status: statusEnum,
  integranteIds: z.array(z.string()).min(1, 'Pelo menos um integrante é obrigatório'),
  obraId: z.string().min(1, 'Obra é obrigatória'),
  pavimentoId: z.string().min(1, 'Pavimento é obrigatório'),

  // Datas/horários
  dataExecucao: z.string().min(1, 'Data de execução é obrigatória'),
  inicioExpediente: z.string().optional(),
  inicioAlmoco: z.string().optional(),
  fimAlmoco: z.string().optional(),
  fimExpediente: z.string().optional(),

  // Observações
  obsExecucao: z.string().max(500, 'Observação muito longa').optional(),
  obsPonto: z.string().max(500, 'Observação muito longa').optional(),
  obsQtdBetoneira: z.string().max(500, 'Observação muito longa').optional(),
  obsHOI: z.string().max(500, 'Observação muito longa').optional(),

  // Execução
  areaExecutadaM2: z.coerce.number().min(0.01, 'Área executada deve ser maior que zero').optional(),
  aditivoM3: z.coerce.number().min(0, 'Aditivo M³ deve ser maior ou igual a zero').optional(),
  aditivoL: z.coerce.number().min(0, 'Aditivo L deve ser maior ou igual a zero').optional(),

  // Preparação
  areaPreparadaM2: z.coerce.number().min(0.01, 'Área preparada deve ser maior que zero').optional(),
}).superRefine((data, ctx) => {
  // Data futura
  if (data.dataExecucao) {
    const dataExec = new Date(data.dataExecucao)
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999)
    if (dataExec > hoje) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Data de execução não pode ser no futuro', path: ['dataExecucao'] })
    }
  }

  // Regras de horário
  if (data.inicioExpediente && data.fimExpediente) {
    if (new Date(`1970-01-01T${data.inicioExpediente}`) >= new Date(`1970-01-01T${data.fimExpediente}`)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Início do expediente deve ser anterior ao fim do expediente', path: ['fimExpediente'] })
    }
  }
  if (data.inicioAlmoco && data.fimAlmoco) {
    if (new Date(`1970-01-01T${data.inicioAlmoco}`) >= new Date(`1970-01-01T${data.fimAlmoco}`)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Início do almoço deve ser anterior ao fim do almoço', path: ['fimAlmoco'] })
    }
  }

  // Condicionais por status
  switch (data.status) {
    case 'EXECUCAO': {
      if (data.areaExecutadaM2 === undefined || data.areaExecutadaM2 <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Área executada deve ser maior que zero', path: ['areaExecutadaM2'] })
      }
      break
    }
    case 'PREPARACAO_1':
    case 'PREPARACAO_2':
    case 'PREPARACAO_3': {
      if (data.areaPreparadaM2 === undefined || data.areaPreparadaM2 <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Área preparada deve ser maior que zero', path: ['areaPreparadaM2'] })
      }
      if (data.areaExecutadaM2 !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido em preparação', path: ['areaExecutadaM2'] })
      }
      if (data.aditivoM3 !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido em preparação', path: ['aditivoM3'] })
      }
      if (data.aditivoL !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido em preparação', path: ['aditivoL'] })
      }
      break
    }
    case 'MANUTENCAO':
    case 'SEM_ATIVIDADE': {
      if (data.areaExecutadaM2 !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido', path: ['areaExecutadaM2'] })
      }
      if (data.aditivoM3 !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido', path: ['aditivoM3'] })
      }
      if (data.aditivoL !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido', path: ['aditivoL'] })
      }
      if (data.areaPreparadaM2 !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Este campo não deve ser preenchido', path: ['areaPreparadaM2'] })
      }
      break
    }
  }
})

export type AtividadeFormData = z.infer<typeof atividadeSchema>