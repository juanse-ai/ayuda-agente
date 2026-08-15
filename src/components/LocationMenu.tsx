import { Check, ChevronDown, MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { City } from '@/types/place'

interface LocationMenuProps {
    cities: City[]
    focusedId: string | null
    onFocusCity: (cityId: string) => void
}

export function LocationMenu({ cities, focusedId, onFocusCity }: LocationMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const focusedCity = cities.find((city) => city.id === focusedId) ?? null

    // Cerrar con Escape o al pulsar fuera. Un listener en `document` es la única
    // forma de enterarse de un clic que no pasa por este subárbol.
    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handlePointerDown(event: PointerEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                // El panel lateral también cierra con Escape desde `document`.
                // Este listener va en fase de captura y detiene la propagación
                // para que un Escape cierre solo lo que está más arriba —el
                // menú— y deje el panel abierto.
                event.stopPropagation()
                setIsOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown, true)
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown, true)
        }
    }, [isOpen])

    const handleToggle = useCallback(() => setIsOpen((open) => !open), [])

    const handleSelect = useCallback(
        (cityId: string) => {
            onFocusCity(cityId)
            setIsOpen(false)
        },
        [onFocusCity]
    )

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={handleToggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="border-line text-fg-muted hover:bg-surface hover:text-fg flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200"
            >
                <MapPin size={13} strokeWidth={2} aria-hidden />
                {focusedCity === null ? 'Ubicaciones afectadas' : focusedCity.name}
                <ChevronDown
                    size={13}
                    strokeWidth={2}
                    aria-hidden
                    className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : '')}
                />
            </button>

            {isOpen ? (
                <div
                    role="menu"
                    aria-label="Ubicaciones afectadas"
                    className="border-line bg-surface absolute top-full right-0 mt-2 w-60 overflow-hidden rounded-xl border shadow-2xl shadow-black/50"
                >
                    {cities.map((city) => (
                        <button
                            key={city.id}
                            type="button"
                            role="menuitemradio"
                            aria-checked={city.id === focusedId}
                            onClick={() => handleSelect(city.id)}
                            className="hover:bg-surface-muted flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-200"
                        >
                            <span className="min-w-0">
                                <span className="text-fg block truncate text-sm font-medium">
                                    {city.name}
                                </span>
                                <span className="text-fg-subtle block truncate text-xs">
                                    {city.department}
                                </span>
                            </span>
                            {city.id === focusedId ? (
                                <Check
                                    size={15}
                                    strokeWidth={2}
                                    aria-hidden
                                    className="text-brand shrink-0"
                                />
                            ) : null}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
