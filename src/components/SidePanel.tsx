import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

interface SidePanelProps {
    place: Place | null
    onClose: () => void
}

/**
 * Overlay drawer. Presentational — it takes the selected place and a way to
 * close, and knows nothing about Leaflet. It sits outside the map container,
 * so clicks inside it never reach the map.
 */
export function SidePanel({ place, onClose }: SidePanelProps) {
    const isOpen = place !== null

    // Keep the last place on screen while the panel slides out, so the content
    // does not vanish mid-transition. Adjusted during render, not in an effect.
    const [lastPlace, setLastPlace] = useState(place)
    if (place !== null && place !== lastPlace) {
        setLastPlace(place)
    }

    // A document listener is the only way to catch Escape while focus is still
    // on the map marker that opened the panel.
    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    return (
        <aside
            role="complementary"
            aria-label="Detalle de la ubicación"
            inert={!isOpen}
            className={cn(
                'border-line bg-surface absolute inset-y-0 right-0 z-[1200] flex w-full flex-col border-l',
                'transition-transform duration-300 ease-out sm:w-[380px]',
                isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
            )}
        >
            {lastPlace !== null ? (
                <>
                    <div className="border-line flex items-start justify-between gap-3 border-b px-5 py-4">
                        <div className="min-w-0">
                            <span className="text-brand text-[11px] font-bold tracking-[0.1em] uppercase">
                                {lastPlace.department}
                            </span>
                            <h2 className="text-fg mt-1.5 text-lg leading-snug font-semibold tracking-tight">
                                {lastPlace.name}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar panel"
                            className="border-line text-fg-subtle hover:bg-surface-muted hover:text-fg grid size-8 shrink-0 place-items-center rounded-md border transition-colors duration-200"
                        >
                            <X size={15} strokeWidth={2} aria-hidden />
                        </button>
                    </div>

                    <div className="flex flex-col gap-5 px-5 py-5">
                        <p className="text-fg-muted text-sm leading-relaxed">{lastPlace.description}</p>

                        <div className="border-line rounded-lg border p-4">
                            <span className="text-fg-faint text-[11px] font-semibold tracking-[0.1em] uppercase">
                                Coordenadas
                            </span>
                            <p className="text-fg-muted mt-2 font-mono text-sm">
                                {lastPlace.position[0].toFixed(4)}, {lastPlace.position[1].toFixed(4)}
                            </p>
                        </div>
                    </div>
                </>
            ) : null}
        </aside>
    )
}
