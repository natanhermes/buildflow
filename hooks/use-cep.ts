import { useQuery } from '@tanstack/react-query'

export interface CepData {
  cep: string
  logradouro: string
  complemento?: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

async function fetchCep(cep: string): Promise<CepData> {
  // Remove caracteres não numéricos do CEP
  const cleanCep = cep.replace(/\D/g, '')
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
  const data = await response.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return data
}

export function useCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, '')
  
  return useQuery({
    queryKey: ['cep', cleanCep],
    queryFn: () => fetchCep(cleanCep),
    enabled: cleanCep.length === 8, // Só executa a query quando o CEP tem 8 dígitos
    staleTime: 1000 * 60 * 60, // 1 hora - CEPs não mudam com frequência
    retry: 1, // Tenta apenas uma vez em caso de erro
  })
}