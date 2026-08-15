import { useRef, useState } from 'react'
import { ChatBar } from '@/components/ChatBar'
import { CHAT_FALLBACK, matchScenario } from '@/data/connections'
import { PLACES } from '@/data/places'
import type { ChatMessage } from '@/types/connection'
import type { Place } from '@/types/place'

interface MapAssistantProps {
    /** Reporta el punto encontrado; App decide volar hacia él y abrir su detalle. */
    onMatch: (place: Place) => void
}

const GREETING: ChatMessage = {
    id: 'agente-saludo-mapa',
    from: 'agent',
    text: 'Hola, soy el agente del mapa. Cuéntame cómo quieres ayudar (por ejemplo: "puedo llevar agua") y te llevo al punto que lo necesita.'
}

/**
 * El chat de la pestaña Mapa. Reutiliza la ChatBar y el matching por palabras
 * clave de Conexiones, pero su acierto se traduce en volar el mapa al punto en
 * vez de hacer zoom sobre el grafo. Sigue la regla del README: reporta el
 * punto encontrado pero no lo almacena ni conoce Leaflet — App conecta ambos.
 *
 * Como todo el chat, es una maqueta: sin IA, sin geolocalización real y sin
 * llamadas a APIs.
 */
export function MapAssistant({ onMatch }: MapAssistantProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
    const [draft, setDraft] = useState('')

    const messageIdRef = useRef(0)
    const nextMessageId = () => `mensaje-mapa-${messageIdRef.current++}`

    const handleSend = () => {
        const text = draft.trim()
        if (text === '') {
            return
        }

        const scenario = matchScenario(text)
        // Invariante de connections.ts: todo placeId de un escenario existe en PLACES.
        const place = scenario !== null ? (PLACES.find((p) => p.id === scenario.placeId) ?? null) : null

        setMessages((prev) => [
            ...prev,
            { id: nextMessageId(), from: 'user', text },
            {
                id: nextMessageId(),
                from: 'agent',
                text:
                    place !== null
                        ? `Encontré un punto que encaja: ${place.title}. ${place.description} Te llevo al punto y te abro su detalle.`
                        : CHAT_FALLBACK
            }
        ])
        setDraft('')

        if (place !== null) {
            onMatch(place)
        }
    }

    return <ChatBar messages={messages} draft={draft} onDraftChange={setDraft} onSend={handleSend} />
}
