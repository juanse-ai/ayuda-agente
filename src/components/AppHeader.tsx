import { EventMenu } from '@/components/EventMenu'
import { LocationMenu } from '@/components/LocationMenu'
import { MusicToggle } from '@/components/MusicToggle'
import { cn } from '@/lib/utils'
import type { EventBrief, EventSummary } from '@/types/graph'
import type { City } from '@/types/place'

/** Vistas de nivel superior de la app. Exactamente estas dos. */
export type AppTab = 'mapa' | 'conexiones'

const TABS: { id: AppTab; label: string }[] = [
    { id: 'mapa', label: 'Mapa' },
    { id: 'conexiones', label: 'Conexiones' }
]

interface AppHeaderProps {
    events: EventBrief[]
    selectedEventId: number | null
    eventSummary: EventSummary | null
    cities: City[]
    focusedId: string | null
    activeTab: AppTab
    onSelectEvent: (eventId: number) => void
    onFocusCity: (cityId: string) => void
    onSelectTab: (tab: AppTab) => void
}

export function AppHeader({
    events,
    selectedEventId,
    eventSummary,
    cities,
    focusedId,
    activeTab,
    onSelectEvent,
    onFocusCity,
    onSelectTab
}: AppHeaderProps) {
    return (
        // `relative z-[1300]` para que el menú desplegable se pinte por encima
        // del mapa y del panel lateral, que vienen después en el DOM.
        <header className="border-line bg-page relative z-[1300] flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            {/* width/height son el tamaño intrínseco real del archivo: reservan
                el espacio correcto y evitan el salto de layout al cargar. */}
            <img
                src="/logo.png"
                alt="Ayuda Agente"
                width={939}
                height={200}
                className="h-8 w-auto shrink-0 sm:h-10"
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
                {/* La emergencia es el ámbito de todo —mapa, grafo y los dos
                    chats—, así que su selector no se esconde en ninguna pestaña. */}
                <EventMenu
                    events={events}
                    selectedId={selectedEventId}
                    summary={eventSummary}
                    onSelect={onSelectEvent}
                />
                {/* El de ubicaciones solo mueve la cámara del mapa. En Conexiones
                    se oculta con visibility (no display) para no dejar hueco ni
                    desplazar las pestañas; `inert` lo saca del tab-order. */}
                <div className={cn(activeTab !== 'mapa' && 'invisible')} inert={activeTab !== 'mapa'}>
                    <LocationMenu cities={cities} focusedId={focusedId} onFocusCity={onFocusCity} />
                </div>
                {/* La música es global: el botón sigue visible en todas las pestañas. */}
                <MusicToggle />
            </div>
        </header>
    )
}
