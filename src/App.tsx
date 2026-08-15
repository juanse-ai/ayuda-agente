import { useCallback, useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { MapStage } from '@/components/MapStage'
import { SidePanel } from '@/components/SidePanel'
import { CITIES, PLACES } from '@/data/places'

export default function App() {
    // Dos ejes independientes: qué ciudad encuadra el mapa y qué punto está abierto.
    const [focusedCityId, setFocusedCityId] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // Derivados en render — no hace falta ningún efecto para mantenerlos al día.
    const focusedCity = CITIES.find((city) => city.id === focusedCityId) ?? null
    const selectedPlace = PLACES.find((place) => place.id === selectedId) ?? null

    const handleSelectPlace = useCallback((placeId: string) => setSelectedId(placeId), [])
    const handleClose = useCallback(() => setSelectedId(null), [])

    // Cambiar de ciudad cierra el detalle: el punto abierto casi nunca está en
    // el nuevo encuadre, y dejarlo abierto se lee como un error.
    const handleFocusCity = useCallback((cityId: string) => {
        setFocusedCityId(cityId)
        setSelectedId(null)
    }, [])

    return (
        <div className="bg-page text-fg grid h-dvh grid-rows-[auto_1fr] font-sans">
            <AppHeader cities={CITIES} focusedId={focusedCityId} onFocusCity={handleFocusCity} />
            <main className="relative overflow-hidden">
                <MapStage
                    places={PLACES}
                    selectedId={selectedId}
                    focusedCity={focusedCity}
                    onSelectPlace={handleSelectPlace}
                />
                <SidePanel place={selectedPlace} onClose={handleClose} />
            </main>
        </div>
    )
}
