'use client'

import { Suspense, useState, useMemo } from 'react'
import { useIntegrantes } from '@/hooks/integrantes/use-integrantes'
import { IntegranteCard } from './integrante-card'
import { IntegranteEditModal } from './integrante-edit-modal'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'

export function IntegrantesList() {
	const { data: integrantes, isLoading, error, refetch } = useIntegrantes()
	const [selectedIntegrante, setSelectedIntegrante] = useState<IntegranteWithRelations | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredIntegrantes = useMemo(() => {
		if (!integrantes) return []
		if (!searchTerm) return integrantes

		return integrantes.filter(integrante =>
			integrante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			integrante.equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			integrante.equipe.obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			integrante.equipe.obra.cei.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [integrantes, searchTerm])

	const handleEdit = (integrante: IntegranteWithRelations) => {
		setSelectedIntegrante(integrante)
		setIsModalOpen(true)
	}

	const handleCloseModal = (open: boolean) => {
		setIsModalOpen(open)
		if (!open) {
			setSelectedIntegrante(null)
		}
	}

	if (error) {
		return (
			<ErrorState
				message="Erro ao carregar integrantes"
				onRetry={() => refetch()}
			/>
		)
	}

	if (!integrantes || integrantes.length === 0) {
		return <EmptyState />
	}

	return (
		<>
			<div className="mb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Buscar por nome do integrante, equipe, obra ou CEI..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<Suspense fallback={<LoadingState />}>
				{filteredIntegrantes.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>Nenhum integrante encontrado para "{searchTerm}"</p>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredIntegrantes.map((integrante) => (
							<IntegranteCard
								key={integrante.id}
								integrante={integrante}
								onEdit={handleEdit}
							/>
						))}
					</div>
				)}
			</Suspense>

			<IntegranteEditModal
				integrante={selectedIntegrante}
				open={isModalOpen}
				onOpenChange={handleCloseModal}
			/>
		</>
	)
} 