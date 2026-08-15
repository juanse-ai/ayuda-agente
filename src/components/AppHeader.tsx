import { LocationMenu } from '@/components/LocationMenu'
import type { Place } from '@/types/place'

interface AppHeaderProps {
    places: Place[]
    focusedId: string | null
    onFocusPlace: (placeId: string) => void
}

export function AppHeader({ places, focusedId, onFocusPlace }: AppHeaderProps) {
    return (
        // `relative z-[1300]` para que el menú desplegable se pinte por encima
        // del mapa y del panel lateral, que vienen después en el DOM.
        <header className="border-line bg-page relative z-[1300] flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            {/* Lockup apilado (marca sobre wordmark) — por debajo de ~52px el
                wordmark deja de leerse, y eso fija la altura del header. */}
            <img src="/logo.svg" alt="Ayuda Agente" width={2078} height={1086} className="h-13 w-auto" />
            <LocationMenu places={places} focusedId={focusedId} onFocusPlace={onFocusPlace} />
        </header>
    )
}
