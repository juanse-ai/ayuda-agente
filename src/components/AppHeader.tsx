import { LocationMenu } from '@/components/LocationMenu'
import { MusicToggle } from '@/components/MusicToggle'
import { cn } from '@/lib/utils'
import type { City } from '@/types/place'

/** Vistas de nivel superior de la app. Exactamente estas dos. */
export type AppTab = 'mapa' | 'conexiones'

const TABS: { id: AppTab; label: string }[] = [
    { id: 'mapa', label: 'Mapa' },
    { id: 'conexiones', label: 'Conexiones' }
]

interface AppHeaderProps {
    cities: City[]
    focusedId: string | null
    activeTab: AppTab
    onFocusCity: (cityId: string) => void
    onSelectTab: (tab: AppTab) => void
}

export function AppHeader({ cities, focusedId, activeTab, onFocusCity, onSelectTab }: AppHeaderProps) {
    return (
        // `relative z-[1300]` para que el menú desplegable se pinte por encima
        // del mapa y del panel lateral, que vienen después en el DOM.
        <header className="border-line bg-page relative z-[1300] flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            {/* width/height son el tamaño intrínseco real del archivo: reservan
                el espacio correcto y evitan el salto de layout al cargar. */}
            <img
                src="/logo.svg"
                alt="Ayuda Agente"
                width={5792}
                height={1256}
                className="h-13 w-auto shrink-0"
            />
            <div
                role="tablist"
                aria-label="Vistas"
                className="border-line bg-surface flex shrink-0 gap-1 rounded-full border p-1"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        className={cn(
                            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                            activeTab === tab.id ? 'bg-surface-muted text-fg' : 'text-fg-subtle hover:text-fg'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
                {/* El menú solo mueve la cámara del mapa. En Conexiones se oculta
                    con visibility (no display) para no dejar hueco ni desplazar
                    las pestañas; `inert` lo saca del tab-order mientras tanto. */}
                <div className={cn(activeTab !== 'mapa' && 'invisible')} inert={activeTab !== 'mapa'}>
                    <LocationMenu cities={cities} focusedId={focusedId} onFocusCity={onFocusCity} />
                </div>
                {/* La música es global: el botón sigue visible en todas las pestañas. */}
                <MusicToggle />
            </div>
        </header>
    )
}
