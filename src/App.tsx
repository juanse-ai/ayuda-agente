import { useCallback, useState } from 'react'
import { AppHeader, type AppTab } from '@/components/AppHeader'
import { ConnectionsView } from '@/components/connections/ConnectionsView'
import { MapStage } from '@/components/MapStage'
import { SidePanel } from '@/components/SidePanel'
import { CITIES, PLACES } from '@/data/places'
import { cn } from '@/lib/utils'

export default function App() {
    const [activeTab, setActiveTab] = useState<AppTab>('mapa')
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

    // Cambiar de pestaña también lo cierra, por la misma razón: al volver, un
    // panel abierto sobre un contexto viejo se lee como un error.
    const handleSelectTab = useCallback((tab: AppTab) => {
        setActiveTab(tab)
        setSelectedId(null)
    }, [])

    const isMapa = activeTab === 'mapa'

    return (
        <div className="bg-page text-fg grid h-dvh grid-rows-[auto_1fr] font-sans">
            <AppHeader
                cities={CITIES}
                focusedId={focusedCityId}
                activeTab={activeTab}
                onFocusCity={handleFocusCity}
                onSelectTab={handleSelectTab}
            />
            <main className="relative overflow-hidden">
                {/* El mapa queda montado siempre y se oculta con visibility:
                    Leaflet mide su contenedor al montar, y desmontarlo (o un
                    display:none, que lo deja sin tamaño) perdería la cámara. */}
                <div className={cn('absolute inset-0', !isMapa && 'invisible')} inert={!isMapa}>
                    <MapStage
                        places={PLACES}
                        selectedId={selectedId}
                        focusedCity={focusedCity}
                        onSelectPlace={handleSelectPlace}
                    />
                    <SidePanel place={selectedPlace} onClose={handleClose} />
                </div>
                {/* Conexiones sí se monta al activarse: su animación de entrada
                    se repite y su estado (chat, selección) arranca de cero. */}
                {activeTab === 'conexiones' ? <ConnectionsView /> : null}
            </main>
        </div>
    )
}
