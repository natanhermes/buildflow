export interface Usuario {
  id: string
  nome: string
  sobrenome: string
  email: string
}

export interface Obra {
  id: string
  nome: string
  cei: string
  endereco: string
  valor_m2: number
  data_inicio: Date
  data_fim: Date
  total_m2: number
  total_m3: number
  torres: Torre[]
  equipes: Equipe[]
  atividades: Atividade[]
}

export interface Torre {
  id: string
  nome: string
  obra_id: string
  pavimentos: Pavimento[]
}

export interface Pavimento {
  id: string
  identificador: string
  area: number
  data_inicio: Date
  data_fim: Date
  total_executado: number
  total_a_executar: number
  percentual_executado: number
  obs: string
  torre_id: string
  atividades: Atividade[]
}

export interface Equipe {
  id: string
  nome: string
  integrantes: string[]
  obra_id: string
}

export interface Atividade {
  id: string
  data: Date
  local: string
  identificacao_obra: string
  total_m2: number
  total_m3: number
  espessura: number
  aditivo_m3: number
  aditivo_l: number
  saldo_acumulado_m2: number
  percentual: number
  execucao: string
  obra_id: string
  pavimento_id: string
}

export interface DashboardMetrics {
  obras_ativas: number
  total_m2_executado: number
  percentual_medio_executado: number
  total_aditivos: number
}
