import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ContactList } from '@/components/ContactList'
import { RequirementCard } from '@/components/RequirementCard'
import { fetchActor } from '@/lib/apiClient'
import { useResource } from '@/lib/useResource'
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
    // Depende de que `place` sea siempre el MISMO objeto de la lista de puntos:
    // uno compuesto en render dispararía este setState en cada pasada.
    const [lastPlace, setLastPlace] = useState(place)
    if (place !== null && place !== lastPlace) {
        setLastPlace(place)
    }

    // Los contactos se piden al abrir el punto, no con el grafo: doscientos
    // actores con todos sus teléfonos es una carga que nadie mira entera.
    // Van del punto abierto, no del retenido: al cerrar no hay a quién pedirle.
    const { data: actor, status: actorStatus } = useResource(fetchActor, place?.id ?? null)

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
            aria-label="Detalle del reporte"
            inert={!isOpen}
            className={cn(
                'border-line bg-surface absolute inset-y-0 right-0 z-[1200] flex w-full flex-col border-l',
                'transition-transform duration-300 ease-out sm:w-[380px]',
                isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
            )}
        >
            {lastPlace !== null ? (
                <>
                    {/* Cabecera fija. `shrink-0` para que no ceda alto cuando la
                        lista de publicaciones crece. */}
                    <div className="border-line flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4">
                        <div className="min-w-0">
                            <span className="text-brand text-[11px] font-bold tracking-[0.1em] uppercase">
                                {lastPlace.name}, {lastPlace.city}
                            </span>
                            <h2 className="text-fg mt-1.5 text-lg leading-snug font-semibold tracking-tight">
                                {lastPlace.title}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar panel"
                            className="border-line text-fg-subtle hover:bg-surface-muted hover:text-fg coarse:size-10 grid size-8 shrink-0 place-items-center rounded-md border transition-colors duration-200"
                        >
                            <X size={15} strokeWidth={2} aria-hidden />
                        </button>
                    </div>

                    {/* Única zona con scroll.
                        · `min-h-0` es obligatorio: un hijo flex no encoge por
                          debajo de su contenido sin él, y el panel entero
                          desbordaría en vez de hacer scroll.
                        · `key` remonta el contenedor al cambiar de punto, así el
                          scroll vuelve arriba sin efectos ni refs. */}
                    <div
                        key={lastPlace.id}
                        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-5"
                    >
                        <section className="flex flex-col gap-3">
                            <h3 className="text-fg-faint text-[11px] font-semibold tracking-[0.1em] uppercase">
                                {lastPlace.kind === 'needed' ? 'Necesidades' : 'Ofertas'} abiertas (
                                {lastPlace.requirements.length})
                            </h3>
                            {/* `role="list"` explícito: Preflight aplica
                                `list-style: none` y Safari/VoiceOver pierde la
                                semántica de lista sin él. */}
                            <ul role="list" className="flex flex-col gap-2.5">
                                {lastPlace.requirements.map((requirement) => (
                                    <RequirementCard key={requirement.id} requirement={requirement} />
                                ))}
                            </ul>
                        </section>

                        <section className="flex flex-col gap-3">
                            <h3 className="text-fg-faint text-[11px] font-semibold tracking-[0.1em] uppercase">
                                Cómo contactarles
                            </h3>
                            {actorStatus === 'loading' ? (
                                <p className="text-fg-subtle animate-pulse text-xs">Buscando contactos…</p>
                            ) : null}
                            {actorStatus === 'error' ? (
                                <p className="text-fg-subtle text-xs">No pude cargar los contactos.</p>
                            ) : null}
                            {actorStatus === 'ready' && actor !== null ? (
                                <ContactList contacts={actor.contacts} />
                            ) : null}
                            <p className="text-fg-faint text-[11px] leading-relaxed">
                                Nada se envía solo: cada enlace lo abre una persona.
                            </p>
                        </section>
                    </div>
                </>
            ) : null}
        </aside>
    )
}
