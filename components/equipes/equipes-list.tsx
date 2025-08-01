'use client'

import { Suspense, useState, useMemo } from 'react'
import { useEquipes } from '@/hooks/equipes/use-equipes'
import { EquipeCard } from './equipe-card'
import { EquipeDetailsModal } from './equipe-details-modal'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { type EquipeWithRelations } from '@/services/equipe/equipe.service'

export function EquipesList() {
	const { data: equipes, isLoading, error, refetch } = useEquipes()
	const [selectedEquipe, setSelectedEquipe] = useState<EquipeWithRelations | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredEquipes = useMemo(() => {
		if (!equipes) return []
		if (!searchTerm) return equipes

		return equipes.filter(equipe =>
			equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			equipe.obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			equipe.obra.cei.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [equipes, searchTerm])

	const handleViewDetails = (equipe: EquipeWithRelations) => {
		setSelectedEquipe(equipe)
		setIsModalOpen(true)
	}

	const handleCloseModal = (open: boolean) => {
		setIsModalOpen(open)
		if (!open) {
			setSelectedEquipe(null)
		}
	}

	if (error) {
		return (
			<ErrorState
				message="Erro ao carregar equipes"
				onRetry={() => refetch()}
			/>
		)
	}

	if (!equipes || equipes.length === 0) {
		return <EmptyState />
	}

	return (
		<>
			<div className="mb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Buscar por nome da equipe, obra ou CEI..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<Suspense fallback={<LoadingState />}>
				{filteredEquipes.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>Nenhuma equipe encontrada para "{searchTerm}"</p>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredEquipes.map((equipe) => (
							<EquipeCard
								key={equipe.id}
								equipe={equipe}
								onViewDetails={handleViewDetails}
							/>
						))}
					</div>
				)}
			</Suspense>

			<EquipeDetailsModal
				equipe={selectedEquipe}
				open={isModalOpen}
				onOpenChange={handleCloseModal}
			/>
		</>
	)
} 