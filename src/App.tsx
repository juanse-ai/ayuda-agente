import { useCallback, useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { MapStage } from '@/components/MapStage'
import { SidePanel } from '@/components/SidePanel'
import { PLACES } from '@/data/places'

export default function App() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [focusedId, setFocusedId] = useState<string | null>(null)

    // Derivados en render — no hace falta ningún efecto para mantenerlos al día.
    const selectedPlace = PLACES.find((place) => place.id === selectedId) ?? null
    const focusedPlace = PLACES.find((place) => place.id === focusedId) ?? null

    const handleSelectPlace = useCallback((placeId: string) => setSelectedId(placeId), [])
    const handleFocusPlace = useCallback((placeId: string) => setFocusedId(placeId), [])
    const handleClose = useCallback(() => setSelectedId(null), [])

    return (
        <div className="bg-page text-fg grid h-dvh grid-rows-[auto_1fr] font-sans">
            <AppHeader places={PLACES} focusedId={focusedId} onFocusPlace={handleFocusPlace} />
            <main className="relative overflow-hidden">
                <MapStage
                    places={PLACES}
                    selectedId={selectedId}
                    focusedPlace={focusedPlace}
                    onSelectPlace={handleSelectPlace}
                />
                <SidePanel place={selectedPlace} onClose={handleClose} />
            </main>
        </div>
    )
}
