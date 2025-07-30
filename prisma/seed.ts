import { PrismaClient, Role, Status } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpar dados existentes
  await prisma.atividade.deleteMany()
  await prisma.integrante.deleteMany()
  await prisma.equipe.deleteMany()
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
        username: 'inativo',
        password: hashedPassword,
        role: Role.OPERADOR,
        status: Status.INACTIVE,
        nome: 'Carlos',
        sobrenome: 'Oliveira',
        email: 'inativo@buildflow.com'
      }
    })
  ])

  console.log(`✅ Criados ${usuarios.length} usuários`)

  // Criar obras
  const obras = []
  const enderecosObras = [
    'Av. Paulista, 1000 - São Paulo/SP',
    'Rua Augusta, 2500 - São Paulo/SP',
    'Av. Brigadeiro Faria Lima, 1500 - São Paulo/SP',
    'Rua Oscar Freire, 800 - São Paulo/SP',
    'Av. Ibirapuera, 3000 - São Paulo/SP'
  ]

  for (let i = 0; i < 5; i++) {
    const dataInicio = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const dataFim = new Date(dataInicio.getTime() + (Math.random() * 365 + 180) * 24 * 60 * 60 * 1000)
    const totalGeral = Math.floor(Math.random() * 9000000) + 1000000
    const totalExecutado = Math.floor(totalGeral * (Math.random() * 0.8))
    const totalPendente = totalGeral - totalExecutado

    const obra = await prisma.obra.create({
      data: {
        nome: `Residencial ${['Aurora', 'Bosque', 'Central', 'Diamante', 'Esperança'][i]}`,
        cei: `${Math.floor(Math.random() * 90000000) + 10000000}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 90000) + 10000}`,
        endereco: enderecosObras[i],
        valorM2: Math.floor(Math.random() * 3000) + 2000,
        dataInicio,
        dataFim,
        totalGeral,
        totalExecutado,
        totalPendente,
        criadoPorId: usuarios[Math.floor(Math.random() * 2)].id // Apenas usuários ativos criam obras
      }
    })
    obras.push(obra)
  }

  console.log(`✅ Criadas ${obras.length} obras`)

  // Criar torres
  const torres = []
  for (const obra of obras) {
    const numTorres = Math.floor(Math.random() * 4) + 1 // 1-4 torres por obra
    for (let i = 0; i < numTorres; i++) {
      const torre = await prisma.torre.create({
        data: {
          nome: `Torre ${String.fromCharCode(65 + i)}`, // Torre A, B, C, D
          obraId: obra.id
        }
      })
      torres.push(torre)
    }
  }

  console.log(`✅ Criadas ${torres.length} torres`)

  // Criar pavimentos
  const pavimentos = []
  for (const torre of torres) {
    const numPavimentos = Math.floor(Math.random() * 15) + 5 // 5-19 pavimentos por torre
    for (let i = 0; i < numPavimentos; i++) {
      const areaM2 = Math.floor(Math.random() * 500) + 200
      const areaExecutadaM2 = Math.floor(areaM2 * (Math.random() * 0.9))
      const percentualExecutado = (areaExecutadaM2 / areaM2) * 100

      const pavimento = await prisma.pavimento.create({
        data: {
          identificador: i === 0 ? 'Térreo' : `${i}º Andar`,
          dataExecucao: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          areaM2,
          areaExecutadaM2,
          percentualExecutado,
          argamassaM3: Math.floor(Math.random() * 50) + 10,
          espessuraCM: Math.floor(Math.random() * 15) + 5,
          obs: Math.random() > 0.5 ? null : 'Observações sobre a execução do pavimento',
          torreId: torre.id
        }
      })
      pavimentos.push(pavimento)
    }
  }

  console.log(`✅ Criados ${pavimentos.length} pavimentos`)

  // Criar equipes
  const equipes = []
  for (const obra of obras) {
    const numEquipes = Math.floor(Math.random() * 4) + 1 // 1-4 equipes por obra
    for (let i = 0; i < numEquipes; i++) {
      const equipe = await prisma.equipe.create({
        data: {
          nome: `Equipe ${['Alpha', 'Beta', 'Gamma', 'Delta'][i]}`,
          obraId: obra.id
        }
      })
      equipes.push(equipe)
    }
  }

  console.log(`✅ Criadas ${equipes.length} equipes`)

  // Criar integrantes
  const nomes = ['Ana', 'Pedro', 'Lucas', 'Carla', 'Rafael', 'Fernanda', 'Diego', 'Juliana', 'Roberto', 'Patrícia']
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Ferreira', 'Costa', 'Pereira', 'Rodrigues', 'Almeida']
  
  for (const equipe of equipes) {
    const numIntegrantes = Math.floor(Math.random() * 8) + 3 // 3-10 integrantes por equipe
    for (let i = 0; i < numIntegrantes; i++) {
      const nome = nomes[Math.floor(Math.random() * nomes.length)]
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
      
      await prisma.integrante.create({
        data: {
          nome: `${nome} ${sobrenome}`,
          equipeId: equipe.id
        }
      })
    }
  }

  console.log(`✅ Criados integrantes para as equipes`)

  // Criar atividades
  const atividades = []
  for (let i = 0; i < 20; i++) {
    const obra = obras[Math.floor(Math.random() * obras.length)]
    const equipe = equipes.find(e => e.obraId === obra.id) || equipes[0]
    const pavimento = pavimentos[Math.floor(Math.random() * pavimentos.length)]
    const usuario = usuarios[Math.floor(Math.random() * 2)] // Apenas usuários ativos

    const inicioExpediente = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1, 7, 0)
    const inicioAlmoco = new Date(inicioExpediente.getTime() + 4 * 60 * 60 * 1000) // 4h depois
    const fimAlmoco = new Date(inicioAlmoco.getTime() + 60 * 60 * 1000) // 1h depois
    const fimExpediente = new Date(fimAlmoco.getTime() + 4 * 60 * 60 * 1000) // 4h depois

    const atividade = await prisma.atividade.create({
      data: {
        aditivoM3: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
        aditivoL: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
        saldoAcumuladoM2: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 100 : null,
        percentualSaldoAcumulado: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null,
        execucao: Math.random() > 0.5 ? 'Execução de contrapiso' : null,
        inicioExpediente,
        inicioAlmoco,
        fimAlmoco,
        fimExpediente,
        obsExecucao: Math.random() > 0.5 ? 'Execução realizada conforme planejado' : null,
        obsPonto: Math.random() > 0.5 ? 'Todos os funcionários presentes' : null,
        obsQtdBetoneira: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1} betoneiras utilizadas` : null,
        obsHOI: Math.random() > 0.5 ? 'Sem ocorrências' : null,
        equipeId: equipe.id,
        usuarioId: usuario.id,
        obraId: obra.id,
        pavimentoId: pavimento.id
      }
    })
    atividades.push(atividade)
  }

  console.log(`✅ Criadas ${atividades.length} atividades`)

  console.log('🎉 Seed concluído com sucesso!')
  
  // Resumo dos dados criados
  const counts = await Promise.all([
    prisma.usuario.count(),
    prisma.obra.count(),
    prisma.torre.count(),
    prisma.pavimento.count(),
    prisma.equipe.count(),
    prisma.integrante.count(),
    prisma.atividade.count()
  ])

  console.log('\n📊 Resumo dos dados criados:')
  console.log(`👤 Usuários: ${counts[0]}`)
  console.log(`🏗️  Obras: ${counts[1]}`)
  console.log(`🏢 Torres: ${counts[2]}`)
  console.log(`🏠 Pavimentos: ${counts[3]}`)
  console.log(`👥 Equipes: ${counts[4]}`)
  console.log(`👷 Integrantes: ${counts[5]}`)
  console.log(`📋 Atividades: ${counts[6]}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
