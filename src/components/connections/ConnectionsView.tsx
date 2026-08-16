import { useCallback, useState } from 'react'
import { ChatBar } from '@/components/ChatBar'
import { ConnectionsGraph } from '@/components/connections/ConnectionsGraph'
import { HelpLegend } from '@/components/HelpLegend'
import { SidePanel } from '@/components/SidePanel'
import { findPlaceForText } from '@/lib/eventGraph'
import { useAgentChat } from '@/lib/useAgentChat'
import type { ChatMessage, Connection, GraphPoint } from '@/types/connection'
import type { Place } from '@/types/place'

/**
 * Un solo clic resalta el punto y sus emparejados y abre su panel a la vez.
 * `highlighted` existe para después de cerrar el panel: el resaltado se
 * conserva hasta que un clic en el fondo lo despeja. La unión discriminada
 * hace imposible "panel abierto sin punto": no hay estados a medias.
 */
type Selection =
    { status: 'idle' } | { status: 'highlighted'; placeId: string } | { status: 'panel'; placeId: string }

const GREETING: ChatMessage = {
    id: 'agente-saludo',
    from: 'agent',
    text: 'Hola, soy el agente de conexiones. Cuéntame cómo quieres ayudar (por ejemplo: "puedo llevar agua") y te muestro quién lo necesita.'
}

const OFFLINE_REPLY = 'Aun así te señalo en el grafo el punto que encaja con lo que escribiste.'

interface ConnectionsViewProps {
    eventId: number | null
    /** Por qué el chat no puede enviar (grafo cargando o caído); undefined si todo va bien. */
    blockedReason?: string
    places: Place[]
    connections: Connection[]
    layout: Record<string, GraphPoint>
}

/**
 * La vista Conexiones completa: grafo + leyenda + chat + panel lateral.
 *
 * Su estado (selección, spotlight, conversación) vive aquí, no en App: la vista
 * se monta al activar la pestaña y se desmonta al salir, así que arranca de cero
 * cada visita (la animación de entrada del grafo se repite a propósito). Los
 * datos, en cambio, bajan de App: son los mismos que pinta el mapa.
 */
export function ConnectionsView({
    eventId,
    blockedReason,
    places,
    connections,
    layout
}: ConnectionsViewProps) {
    const [selection, setSelection] = useState<Selection>({ status: 'idle' })
    // El spotlight (zoom del grafo) solo lo activa el chat; cualquier clic
    // manual lo apaga: la manipulación directa manda sobre la guiada.
    const [spotlightId, setSpotlightId] = useState<string | null>(null)

    // Derivados en render, como en App. OJO: siempre el objeto de `places`, nunca
    // uno compuesto — el latch interno de SidePanel depende de esa identidad.
    const selectedPlace =
        selection.status === 'panel' ? (places.find((place) => place.id === selection.placeId) ?? null) : null
    const highlightedId = selection.status === 'idle' ? null : selection.placeId

    // Igual que en el mapa: el agente contesta en prosa y no devuelve ids, así
    // que el zoom lo decide el texto del usuario y no la respuesta.
    const spotlightMatch = useCallback(
        (text: string) => {
            const place = findPlaceForText(text, places)
            if (place === null) {
                return
            }
            // Zoom al punto y panel abierto a la vez: es un solo gesto guiado.
            setSpotlightId(place.id)
            setSelection({ status: 'panel', placeId: place.id })
        },
        [places]
    )

    const { messages, draft, setDraft, send, isStreaming } = useAgentChat({
        eventId,
        greeting: GREETING,
        onUserMessage: spotlightMatch,
        offlineReply: OFFLINE_REPLY
    })

    const handleDotClick = (placeId: string) => {
        setSpotlightId(null)
        setSelection((prev) =>
            prev.status === 'panel' && prev.placeId === placeId ? prev : { status: 'panel', placeId }
        )
    }

    const handleClearSelection = () => {
        setSpotlightId(null)
        setSelection({ status: 'idle' })
    }

    // Cerrar el panel conserva el resaltado: el usuario suele querer seguir
    // mirando ese cúmulo; otro clic en el fondo ya despeja todo.
    const handleClosePanel = () => {
        setSpotlightId(null)
        setSelection((prev) =>
            prev.status === 'panel' ? { status: 'highlighted', placeId: prev.placeId } : prev
        )
    }

    return (
        // `isolate` crea un stacking context propio: el z-[1200] del panel y
        // los z bajos del grafo/chat no compiten con los del mapa ni el header.
        <section aria-label="Conexiones" className="bg-page absolute inset-0 isolate overflow-hidden">
            <ConnectionsGraph
                places={places}
                connections={connections}
                layout={layout}
                highlightedId={highlightedId}
                spotlightId={spotlightId}
                onSelectDot={handleDotClick}
                onClearSelection={handleClearSelection}
            />
            <HelpLegend showConnection />
            <ChatBar
                messages={messages}
                draft={draft}
                onDraftChange={setDraft}
                onSend={() => void send()}
                isStreaming={isStreaming}
                blockedReason={blockedReason}
            />
            <SidePanel place={selectedPlace} onClose={handleClosePanel} />
        </section>
    )
}
