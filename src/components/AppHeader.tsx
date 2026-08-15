import { LocationMenu } from '@/components/LocationMenu'
import type { City } from '@/types/place'

interface AppHeaderProps {
    cities: City[]
    focusedId: string | null
    onFocusCity: (cityId: string) => void
}

export function AppHeader({ cities, focusedId, onFocusCity }: AppHeaderProps) {
    return (
        // `relative z-[1300]` para que el menú desplegable se pinte por encima
        // del mapa y del panel lateral, que vienen después en el DOM.
        <header className="border-line bg-page relative z-[1300] flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            {/* width/height son el tamaño intrínseco real del archivo: reservan
                el espacio correcto y evitan el salto de layout al cargar. */}
            <img src="/logo.svg" alt="Ayuda Agente" width={5792} height={1256} className="h-13 w-auto" />
            <LocationMenu cities={cities} focusedId={focusedId} onFocusCity={onFocusCity} />
        </header>
    )
}
