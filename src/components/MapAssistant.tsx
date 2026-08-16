import { useCallback } from 'react'
import { ChatBar } from '@/components/ChatBar'
import { findPlaceForText } from '@/lib/eventGraph'
import { useAgentChat } from '@/lib/useAgentChat'
import type { Place } from '@/types/place'

interface MapAssistantProps {
    eventId: number | null
    /** Por qué el chat no puede enviar (grafo cargando o caído); undefined si todo va bien. */
    blockedReason?: string
    places: Place[]
    /** Reporta el punto encontrado; App decide volar hacia él y abrir su detalle. */
    onMatch: (place: Place) => void
}

const OFFLINE_REPLY = 'Aun así te llevo al punto del mapa que encaja con lo que escribiste.'

/**
 * El chat de la pestaña Mapa. La respuesta la escribe el agente de coordinación
 * del backend; el encuadre lo decide `findPlaceForText` sobre los puntos reales,
 * porque el agente contesta en prosa y nunca devuelve el id de un punto. Sigue
 * la regla del README: reporta el punto encontrado pero no lo almacena ni conoce
 * Leaflet — App conecta ambos.
 */
export function MapAssistant({ eventId, blockedReason, places, onMatch }: MapAssistantProps) {
    // Se vuela al enviar, sin esperar la respuesta: el mapa se mueve mientras el
    // agente piensa, que es justo la señal de que la petición se entendió.
    const flyToMatch = useCallback(
        (text: string) => {
            const place = findPlaceForText(text, places)
            if (place !== null) {
                onMatch(place)
            }
        },
        [onMatch, places]
    )

    const { messages, draft, setDraft, send, isStreaming } = useAgentChat({
        eventId,
        onUserMessage: flyToMatch,
        offlineReply: OFFLINE_REPLY
    })

    return (
        <ChatBar
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => void send()}
            isStreaming={isStreaming}
            blockedReason={blockedReason}
        />
    )
}
