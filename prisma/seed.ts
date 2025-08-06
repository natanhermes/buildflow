import { PrismaClient, Role, Status, Execucao } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpar dados existentes
  await prisma.atividade.deleteMany()
  await prisma.integrante.deleteMany()
  await prisma.pavimento.deleteMany()
  await prisma.torre.deleteMany()
  await prisma.obra.deleteMany()
  await prisma.usuario.deleteMany()

  // Criptografar senha
  const hashedPassword = await bcrypt.hash('66611812', 10)

  // Criar usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        username: 'master',
        password: hashedPassword,
        role: Role.MASTER,
        status: Status.ACTIVE,
        nome: 'João',
        sobrenome: 'Silva',
        email: 'master@buildflow.com'
      }
    }),
    prisma.usuario.create({
      data: {
        username: 'operador',
        password: hashedPassword,
        role: Role.OPERADOR,
        status: Status.ACTIVE,
        nome: 'Maria',
        sobrenome: 'Santos',
        email: 'operador@buildflow.com'
      }
    }),
    prisma.usuario.create({
      data: {
        username: 'supervisor',
        password: hashedPassword,
        role: Role.OPERADOR,
        status: Status.ACTIVE,
        nome: 'Carlos',
        sobrenome: 'Pereira',
        email: 'supervisor@buildflow.com'
      }
    }),
    prisma.usuario.create({
      data: {
        username: 'inativo',
        password: hashedPassword,
        role: Role.OPERADOR,
        status: Status.INACTIVE,
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'inativo@buildflow.com'
      }
    })
  ])

  console.log(`✅ Criados ${usuarios.length} usuários`)

  // Criar obras realistas
  const obrasData = [
    {
      nome: 'Residencial Vista Verde',
      cei: '12.345.678/0001-90',
      endereco: 'Rua das Palmeiras, 123 - Jardim das Flores, Natal/RN',
      valorM2: 2800,
      dataInicio: new Date('2024-01-15'),
      dataFim: new Date('2025-06-15'),
      torres: ['Torre A', 'Torre B'],
      pavimentosPorTorre: 12
    },
    {
      nome: 'Edifício Comercial Central',
      cei: '98.765.432/0001-10',
      endereco: 'Av. Engenheiro Roberto Freire, 1000 - Capim Macio, Natal/RN',
      valorM2: 3500,
      dataInicio: new Date('2024-03-01'),
      dataFim: new Date('2025-12-01'),
      torres: ['Torre Única'],
      pavimentosPorTorre: 20
    },
    {
      nome: 'Condomínio Jardim das Flores',
      cei: '11.222.333/0001-44',
      endereco: 'Rua dos Girassóis, 456 - Ponta Negra, Natal/RN',
      valorM2: 2200,
      dataInicio: new Date('2024-02-10'),
      dataFim: new Date('2025-08-10'),
      torres: ['Bloco 1', 'Bloco 2', 'Bloco 3'],
      pavimentosPorTorre: 8
    }
  ]

  const obras = []
  for (const obraData of obrasData) {
    // Calcular área total estimada
    const areaTotalEstimada = obraData.torres.length * obraData.pavimentosPorTorre * (Math.floor(Math.random() * 200) + 150)
    const totalGeral = areaTotalEstimada * obraData.valorM2

    const obra = await prisma.obra.create({
      data: {
        nome: obraData.nome,
        cei: obraData.cei,
        endereco: obraData.endereco,
        valorM2: obraData.valorM2,
        dataInicio: obraData.dataInicio,
        dataFim: obraData.dataFim,
        totalGeral: totalGeral,
        totalExecutado: Math.floor(totalGeral * (Math.random() * 0.4 + 0.1)), // 10-50% executado
        totalPendente: Math.floor(totalGeral * (Math.random() * 0.4 + 0.5)), // 50-90% pendente
        criadoPorId: usuarios[0].id
      }
    })
    obras.push({ ...obra, config: obraData })
  }

  console.log(`✅ Criadas ${obras.length} obras`)

  // Criar torres e pavimentos com relacionamento
  const torres = []
  const pavimentos = []
  
  for (const obra of obras) {
    for (const nomeTorre of obra.config.torres) {
      const torre = await prisma.torre.create({
        data: {
          nome: nomeTorre,
          obraId: obra.id
        }
      })
      torres.push({ ...torre, obraId: obra.id })

      // Criar pavimentos para cada torre
      for (let i = 0; i < obra.config.pavimentosPorTorre; i++) {
        const identificador = i === 0 ? 'Térreo' : 
                             i === 1 ? '1º Andar' : 
                             `${i}º Andar`
        
        const areaM2 = Math.floor(Math.random() * 150) + 120 // 120-270 m²
        
        const pavimento = await prisma.pavimento.create({
          data: {
            identificador,
            dataExecucao: Math.random() > 0.6 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : null,
            areaExecutadaM2: Math.random() > 0.4 ? Math.floor(areaM2 * (Math.random() * 0.8 + 0.2)) : null, // 20-100% da área
            areaM2: areaM2,
            percentualExecutado: Math.random() > 0.4 ? Math.floor(Math.random() * 100) : null,
            argamassaM3: Math.floor(areaM2 * 0.05) + Math.floor(Math.random() * 10), // Baseado na área
            espessuraCM: Math.floor(Math.random() * 10) + 8, // 8-18cm
            obs: Math.random() > 0.7 ? `Observações específicas para ${identificador} da ${nomeTorre}` : null,
            torreId: torre.id
          }
        })
        pavimentos.push({ ...pavimento, torre, obra })
      }
    }
  }

  console.log(`✅ Criadas ${torres.length} torres e ${pavimentos.length} pavimentos`)

  // Criar integrantes realistas com especialidades
  const nomesCompletos = [
    'João Silva Santos', 'Maria Fernanda Costa', 'Pedro Henrique Lima', 'Ana Carolina Souza',
    'Carlos Eduardo Ferreira', 'Juliana Beatriz Almeida', 'Rafael Augusto Pereira', 'Fernanda Cristina Oliveira',
    'Diego Martins Rodrigues', 'Patrícia Helena Barbosa', 'Lucas Gabriel Nascimento', 'Carla Vitória Ribeiro',
    'Roberto Carlos Mendes', 'Luciana Aparecida Gomes', 'André Luís Cardoso', 'Vanessa Cristina Araújo',
    'Marcos Antônio Silva', 'Renata Flávia Moreira', 'Felipe Eduardo Costa', 'Adriana Márcia Teixeira',
    'Thiago Bruno Freitas', 'Camila Roberta Dias', 'Bruno César Martins', 'Daniela Cristiane Rocha',
    'Leonardo Fábio Correia', 'Jéssica Letícia Campos', 'Vinícius Rafael Monteiro', 'Priscila Fernanda Lopes',
    'Guilherme Henrique Vieira', 'Tatiane Aparecida Morais'
  ]

  const integrantes = []
  
  // Criar integrantes com CPFs únicos
  for (let i = 0; i < nomesCompletos.length; i++) {
    // Gerar CPF único e sequencial para evitar duplicatas
    const cpfBase = String(100000000 + i).padStart(9, '0')
    const cpf = `${cpfBase.slice(0,3)}.${cpfBase.slice(3,6)}.${cpfBase.slice(6,9)}-${String(Math.floor(Math.random() * 90) + 10)}`
    
    const integrante = await prisma.integrante.create({
      data: {
        nome: nomesCompletos[i],
        cpf
      }
    })
    integrantes.push(integrante)
  }

  console.log(`✅ Criados ${integrantes.length} integrantes`)

  // Criar atividades com relacionamentos realistas
  const atividades = []
  const execucaoOptions: Execucao[] = ['EXECUTADO', 'INICIAL', 'MEIO', 'FINAL']
  const observacoesExecucao = [
    'Execução de contrapiso conforme especificação técnica',
    'Aplicação de argamassa niveladora nos pavimentos',
    'Acabamento em piso cerâmico de alta qualidade',
    'Instalação de revestimentos nas áreas molhadas',
    'Aplicação de impermeabilização nas lajes',
    'Execução de regularização de superfície',
    'Assentamento de pisos vinílicos nas áreas comuns'
  ]
  
  const observacoesPonto = [
    'Equipe completa presente no horário',
    'Falta de 1 funcionário - justificada',
    'Todos os colaboradores presentes',
    'Atraso de 30 minutos devido ao trânsito',
    'Equipe reduzida devido a feriado municipal',
    'Presença total da equipe técnica'
  ]

  const observacoesBetoneira = [
    '3 betoneiras utilizadas para argamassa',
    '5 betoneiras de concreto para laje',
    '2 betoneiras para acabamento',
    '4 betoneiras utilizadas - produção normal',
    '1 betoneira em manutenção - utilizadas 3',
    '6 betoneiras para grande volume de concreto'
  ]

  // Criar atividades distribuídas ao longo de 6 meses
  const dataInicio = new Date('2024-01-01')
  const dataFim = new Date('2024-06-30')
  const diasTrabalho = Math.floor((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))

  // Criar histórico de atividades para simular progresso real
  for (let dia = 0; dia < diasTrabalho; dia += Math.floor(Math.random() * 3) + 1) { // A cada 1-3 dias
    const dataAtividade = new Date(dataInicio.getTime() + dia * 24 * 60 * 60 * 1000)
    
    // Pular fins de semana (0 = domingo, 6 = sábado)
    if (dataAtividade.getDay() === 0 || dataAtividade.getDay() === 6) continue

    // Escolher obra baseada na data (simular cronograma)
    let obraEscolhida
    if (dataAtividade < new Date('2024-03-01')) {
      obraEscolhida = obras[0] // Residencial Vista Verde
    } else if (dataAtividade < new Date('2024-04-15')) {
      obraEscolhida = obras[Math.floor(Math.random() * 2)] // Vista Verde ou Comercial Central
    } else {
      obraEscolhida = obras[Math.floor(Math.random() * obras.length)] // Todas as obras
    }

    // Filtrar pavimentos da obra escolhida
    const pavimentosObra = pavimentos.filter(p => p.obra.id === obraEscolhida.id)
    const pavimentoEscolhido = pavimentosObra[Math.floor(Math.random() * pavimentosObra.length)]

    // Escolher 1-4 integrantes para a atividade
    const numIntegrantes = Math.floor(Math.random() * 4) + 1 // 1-4 integrantes
    const integrantesSelecionados = []
    const integrantesDisponiveis = [...integrantes]
    
    for (let i = 0; i < numIntegrantes && integrantesDisponiveis.length > 0; i++) {
      const index = Math.floor(Math.random() * integrantesDisponiveis.length)
      integrantesSelecionados.push(integrantesDisponiveis[index])
      integrantesDisponiveis.splice(index, 1) // Remove para evitar duplicatas
    }

    // Escolher usuário responsável
    const usuarioResponsavel = usuarios[Math.floor(Math.random() * 3)] // Apenas usuários ativos

    // Horários realistas de trabalho
    const inicioExpediente = new Date(dataAtividade)
    inicioExpediente.setHours(7, Math.floor(Math.random() * 30), 0) // 7:00-7:30

    const inicioAlmoco = new Date(inicioExpediente)
    inicioAlmoco.setHours(12, Math.floor(Math.random() * 30), 0) // 12:00-12:30

    const fimAlmoco = new Date(inicioAlmoco)
    fimAlmoco.setHours(13, Math.floor(Math.random() * 30), 0) // 13:00-13:30

    const fimExpediente = new Date(fimAlmoco)
    fimExpediente.setHours(17, Math.floor(Math.random() * 60), 0) // 17:00-18:00

    // Calcular saldo acumulado progressivo (buscar última atividade do pavimento)
    const ultimaAtividadePavimento = await prisma.atividade.findFirst({
      where: { pavimentoId: pavimentoEscolhido.id },
      orderBy: { createdAt: 'desc' }
    })

    const saldoAnterior = ultimaAtividadePavimento?.saldoAcumuladoM2 
      ? Number(ultimaAtividadePavimento.saldoAcumuladoM2) 
      : 0
    
    const incremento = Number(pavimentoEscolhido.areaM2) * (Math.random() * 0.3 + 0.1) // 10-40% da área
    const novoSaldo = saldoAnterior + incremento

    const atividade = await prisma.atividade.create({
      data: {
        aditivoM3: Math.random() > 0.4 ? Math.floor(Math.random() * 30) + 5 : null,
        aditivoL: Math.random() > 0.4 ? Math.floor(Math.random() * 80) + 10 : null,
        saldoAcumuladoM2: novoSaldo,
        execucao: execucaoOptions[Math.floor(Math.random() * execucaoOptions.length)],
        inicioExpediente,
        inicioAlmoco,
        fimAlmoco,
        fimExpediente,
        obsExecucao: Math.random() > 0.3 ? observacoesExecucao[Math.floor(Math.random() * observacoesExecucao.length)] : null,
        obsPonto: Math.random() > 0.4 ? observacoesPonto[Math.floor(Math.random() * observacoesPonto.length)] : null,
        obsQtdBetoneira: Math.random() > 0.5 ? observacoesBetoneira[Math.floor(Math.random() * observacoesBetoneira.length)] : null,
        obsHOI: Math.random() > 0.7 ? 'Sem ocorrências reportadas' : Math.random() > 0.9 ? 'Pequeno atraso devido à chuva' : null,
        usuarioId: usuarioResponsavel.id,
        obraId: obraEscolhida.id,
        pavimentoId: pavimentoEscolhido.id,
        createdAt: dataAtividade, // Definir data específica
        atividadeIntegrantes: {
          create: integrantesSelecionados.map(integrante => ({
            integranteId: integrante.id
          }))
        }
      }
    })
    atividades.push(atividade)
  }

  console.log(`✅ Criadas ${atividades.length} atividades`)

  console.log('🎉 Seed concluído com sucesso!')
  
  // Resumo detalhado dos dados criados
  const counts = await Promise.all([
    prisma.usuario.count(),
    prisma.obra.count(),
    prisma.torre.count(),
    prisma.pavimento.count(),
    prisma.integrante.count(),
    prisma.atividade.count()
  ])

  // Estatísticas de relacionamentos
  const atividadesPorObra = await prisma.atividade.groupBy({
    by: ['obraId'],
    _count: { id: true }
  })
  
  const integrantesMaisAtivos = await prisma.atividade.groupBy({
    by: ['integranteId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  })

  console.log('\n📊 Resumo dos dados criados:')
  console.log(`👤 Usuários: ${counts[0]}`)
  console.log(`🏗️ Obras: ${counts[1]}`)
  console.log(`🏢 Torres: ${counts[2]}`)
  console.log(`🏠 Pavimentos: ${counts[3]}`)
  console.log(`👷 Integrantes: ${counts[4]}`)
  console.log(`⚡ Atividades: ${counts[5]}`)

  console.log('\n🔗 Relacionamentos criados:')
  console.log(`📈 Atividades distribuídas entre ${counts[1]} obras`)
  console.log(`👥 ${counts[4]} integrantes participando de atividades`)
  console.log(`🏗️ Média de ${Math.round(counts[5] / counts[1])} atividades por obra`)
  console.log(`📅 Atividades distribuídas ao longo de 6 meses`)
  
  // Buscar integrante mais ativo para exemplo
  const integranteMaisAtivo = await prisma.integrante.findFirst({
    include: {
      atividades: {
        include: { obra: { select: { nome: true } } },
        take: 1
      }
    },
    where: {
      atividades: { some: {} }
    }
  })

  if (integranteMaisAtivo && integranteMaisAtivo.atividades.length > 0) {
    const totalAtividades = await prisma.atividade.count({
      where: { integranteId: integranteMaisAtivo.id }
    })
    console.log(`🌟 Integrante mais ativo: ${integranteMaisAtivo.nome} (${totalAtividades} atividades)`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })