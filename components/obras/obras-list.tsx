'use client'

import { Suspense, useState } from 'react'
import { useObras } from '@/hooks/obras/use-obras'
import { ObraCard } from './obra-card'
import { ObraDetailsModal } from './obra-details-modal'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { useObras, type SerializedObraWithRelations } from '@/hooks/obras/use-obras'

export function ObrasList() {
	const { data: obras, isLoading, error, refetch } = useObras()
	const [selectedObra, setSelectedObra] = useState<SerializedObraWithRelations | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleViewDetails = (obra: SerializedObraWithRelations) => {
		setSelectedObra(obra)
		setIsModalOpen(true)
	}

	const handleCloseModal = (open: boolean) => {
		setIsModalOpen(open)
		if (!open) {
			setSelectedObra(null)
		}
	}

	if (error) {
		return (
			<ErrorState
				message="Erro ao carregar obras"
				onRetry={() => refetch()}
			/>
		)
	}

	if (!obras || obras.length === 0) {
		return <EmptyState />
	}

	return (
		<>
			<Suspense fallback={<LoadingState />}>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{obras.map((obra) => (
						<ObraCard
							key={obra.id}
							obra={obra}
							onViewDetails={handleViewDetails}
						/>
					))}
				</div>
			</Suspense>

			<ObraDetailsModal
				obra={selectedObra}
				open={isModalOpen}
				onOpenChange={handleCloseModal}
			/>
		</>
	)
}