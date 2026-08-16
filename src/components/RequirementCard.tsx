import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { EvidenceCard } from '@/components/EvidenceCard'
import { fetchRequirement } from '@/lib/apiClient'
import { useResource } from '@/lib/useResource'
import { cn } from '@/lib/utils'
import type { Urgency } from '@/types/graph'
import type { PlaceRequirement } from '@/types/place'

/** Etiqueta y color de cada urgencia. Solo `critical` y `high` gritan. */
const URGENCY: Record<Urgency, { label: string; className: string }> = {
    critical: { label: 'Crítica', className: 'border-need/50 text-need' },
    high: { label: 'Alta', className: 'border-need/30 text-need' },
    medium: { label: 'Media', className: 'border-line text-fg-subtle' },
    low: { label: 'Baja', className: 'border-line text-fg-faint' }
}

interface RequirementCardProps {
    requirement: PlaceRequirement
}

/**
 * Una necesidad u oferta abierta del punto, con sus publicaciones a un clic.
 *
 * La evidencia se pide al desplegar, no al abrir el panel: un punto con seis
 * necesidades serían seis peticiones para algo que casi nunca se mira entero.
 * Y llega como lista porque lo es: una publicación puede producir varias
 * necesidades y una necesidad puede estar respaldada por varias publicaciones,
 * así que enseñar "la" publicación acierta tan a menudo como falla.
 */
export function RequirementCard({ requirement }: RequirementCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const urgency = URGENCY[requirement.urgency]
    const { data, status } = useResource(fetchRequirement, isOpen ? requirement.id : null)

    return (
        <li className="border-line bg-page rounded-lg border">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="w-full p-3.5 text-left"
            >
                <div className="flex items-start justify-between gap-3">
                    <p className="text-fg min-w-0 text-sm font-medium">{requirement.resource}</p>
                    <span
                        className={cn(
                            'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                            urgency.className
                        )}
                    >
                        {urgency.label}
                    </span>
                </div>
                {requirement.outstanding !== null ? (
                    <p className="text-fg-muted mt-1.5 text-xs">
                        {requirement.kind === 'needed' ? 'Pendiente' : 'Disponible'}:{' '}
                        {requirement.outstanding}
                    </p>
                ) : null}
                {requirement.detail !== '' ? (
                    <p className="text-fg-muted mt-3 text-sm leading-relaxed">{requirement.detail}</p>
                ) : null}
                <span className="text-fg-subtle mt-3 flex items-center gap-1.5 text-xs font-medium">
                    <ChevronDown
                        size={13}
                        strokeWidth={2}
                        aria-hidden
                        className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                    {isOpen ? 'Ocultar publicaciones' : 'Ver publicaciones'}
                </span>
            </button>

            {isOpen ? (
                <div className="border-line border-t px-3.5 py-3">
                    {status === 'loading' ? (
                        <p className="text-fg-subtle animate-pulse text-xs">Buscando publicaciones…</p>
                    ) : null}
                    {status === 'error' ? (
                        <p className="text-fg-subtle text-xs">No pude cargar las publicaciones.</p>
                    ) : null}
                    {status === 'ready' && data !== null ? (
                        data.evidence.length === 0 ? (
                            <p className="text-fg-subtle text-xs">Sin publicaciones asociadas todavía.</p>
                        ) : (
                            <ul role="list" className="flex flex-col gap-2.5">
                                {data.evidence.map((observation) => (
                                    <EvidenceCard key={observation.id} observation={observation} />
                                ))}
                            </ul>
                        )
                    ) : null}
                </div>
            ) : null}
        </li>
    )
}
