import type { Obra, Torre, Pavimento, Equipe, Atividade, DashboardMetrics } from "./types"

export const mockObras: Obra[] = [
  {
    id: "1",
    nome: "Residencial Vista Verde",
    cei: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    valor_m2: 2500,
    data_inicio: new Date("2024-01-15"),
    data_fim: new Date("2024-12-15"),
    total_m2: 15000,
    total_m3: 45000,
    torres: [],
    equipes: [],
    atividades: [],
  },
  {
    id: "2",
    nome: "Edifício Comercial Central",
    cei: "98.765.432/0001-10",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    valor_m2: 3200,
    data_inicio: new Date("2024-03-01"),
    data_fim: new Date("2025-02-28"),
    total_m2: 25000,
    total_m3: 75000,
    torres: [],
    equipes: [],
    atividades: [],
  },
]

export const mockTorres: Torre[] = [
  {
    id: "1",
    nome: "Torre A",
    obra_id: "1",
    pavimentos: [],
  },
  {
    id: "2",
    nome: "Torre B",
    obra_id: "1",
    pavimentos: [],
  },
]

export const mockPavimentos: Pavimento[] = [
  {
    id: "1",
    identificador: "Térreo",
    area: 500,
    data_inicio: new Date("2024-01-15"),
    data_fim: new Date("2024-03-15"),
    total_executado: 450,
    total_a_executar: 50,
    percentual_executado: 90,
    obs: "Aguardando finalização da área comum",
    torre_id: "1",
    atividades: [],
  },
  {
    id: "2",
    identificador: "1º Andar",
    area: 480,
    data_inicio: new Date("2024-02-01"),
    data_fim: new Date("2024-04-01"),
    total_executado: 240,
    total_a_executar: 240,
    percentual_executado: 50,
    obs: "Em andamento",
    torre_id: "1",
    atividades: [],
  },
]

export const mockEquipes: Equipe[] = [
  {
    id: "1",
    nome: "Equipe Estrutura",
    integrantes: ["João Silva", "Maria Santos", "Pedro Oliveira"],
    obra_id: "1",
  },
  {
    id: "2",
    nome: "Equipe Acabamento",
    integrantes: ["Ana Costa", "Carlos Lima", "Lucia Ferreira"],
    obra_id: "1",
  },
]

export const mockAtividades: Atividade[] = [
  {
    id: "1",
    data: new Date("2024-01-20"),
    local: "Torre A - Térreo",
    identificacao_obra: "Residencial Vista Verde",
    total_m2: 100,
    total_m3: 300,
    espessura: 0.15,
    aditivo_m3: 5,
    aditivo_l: 50,
    saldo_acumulado_m2: 450,
    percentual: 20,
    execucao: "Concretagem da laje",
    obra_id: "1",
    pavimento_id: "1",
  },
  {
    id: "2",
    data: new Date("2024-01-25"),
    local: "Torre A - Térreo",
    identificacao_obra: "Residencial Vista Verde",
    total_m2: 150,
    total_m3: 450,
    espessura: 0.15,
    aditivo_m3: 8,
    aditivo_l: 80,
    saldo_acumulado_m2: 300,
    percentual: 50,
    execucao: "Concretagem das vigas",
    obra_id: "1",
    pavimento_id: "1",
  },
]

export const mockDashboardMetrics: DashboardMetrics = {
  obras_ativas: 2,
  total_m2_executado: 12500,
  percentual_medio_executado: 65,
  total_aditivos: 150,
}
