import { useRef, useState } from 'react'
import { ConnectionChat } from '@/components/connections/ConnectionChat'
import { ConnectionsGraph } from '@/components/connections/ConnectionsGraph'
import { ConnectionsLegend } from '@/components/connections/ConnectionsLegend'
import { SidePanel } from '@/components/SidePanel'
import { CONNECTIONS, GRAPH_LAYOUT, matchScenario } from '@/data/connections'
import { PLACES } from '@/data/places'
import { PLATFORMS } from '@/data/platforms'
import type { ChatMessage } from '@/types/connection'
import type { Place, SocialPlatform, SocialPost } from '@/types/place'

/**
 * Un clic resalta el punto y sus emparejados; el segundo clic sobre el mismo
 * punto abre el panel. La unión discriminada hace imposible "panel abierto sin
 * punto": no hay estados a medias que sincronizar.
 */
type Selection =
    { status: 'idle' } | { status: 'highlighted'; placeId: string } | { status: 'panel'; placeId: string }

/**
 * Respuesta sugerida al pulsar una publicación. Plantilla fija, sin IA: dos
 * variantes según si el punto pide ayuda o la ofrece.
 */
function buildSuggestedReply(place: Place, post: SocialPost): string {
    if (place.kind === 'needed') {
        return `Hola ${post.author}, vi tu publicación sobre ${place.name}. Puedo ayudar con lo que describen, ¿cómo coordinamos?`
    }
    return `Hola ${post.author}, vi lo que ofrecen en ${place.name}. Conozco a quien le vendría muy bien, ¿cómo coordinamos?`
}

const GREETING: ChatMessage = {
    id: 'agente-saludo',
    from: 'agent',
    text: 'Hola, soy el agente de conexiones. Cuéntame cómo quieres ayudar (por ejemplo: "puedo llevar agua") y te muestro quién lo necesita.'
}

/**
 * La vista Conexiones completa: grafo + leyenda + chat + panel lateral.
 *
 * Todo el estado vive aquí, no en App: la vista se monta al activar la pestaña
 * y se desmonta al salir, así que arranca de cero cada visita (la animación de
 * entrada del grafo se repite a propósito). App no sabe nada de este estado.
 *
 * Toda la función es una maqueta sobre datos ficticios: el chat no entiende
 * lenguaje (busca palabras clave), el matching viene fijado en los datos y el
 * "envío" de respuestas no llama a ninguna red ni API.
 */
export function ConnectionsView() {
    const [selection, setSelection] = useState<Selection>({ status: 'idle' })
    // El spotlight (zoom del grafo) solo lo activa el chat; cualquier clic
    // manual lo apaga: la manipulación directa manda sobre la guiada.
    const [spotlightId, setSpotlightId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
    const [draft, setDraft] = useState('')
    // Red de origen del borrador prellenado desde una publicación; null cuando
    // el usuario escribe una petición libre.
    const [draftVia, setDraftVia] = useState<SocialPlatform | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)
    const messageIdRef = useRef(0)
    const nextMessageId = () => `mensaje-${messageIdRef.current++}`

    // Derivados en render, como en App. OJO: siempre el objeto de PLACES, nunca
    // uno compuesto — el latch interno de SidePanel depende de esa identidad.
    const selectedPlace =
        selection.status === 'panel' ? (PLACES.find((place) => place.id === selection.placeId) ?? null) : null
    const highlightedId = selection.status === 'idle' ? null : selection.placeId

    const handleDotClick = (placeId: string) => {
        setSpotlightId(null)
        setSelection((prev) => {
            if (prev.status === 'highlighted' && prev.placeId === placeId) {
                return { status: 'panel', placeId }
            }
            if (prev.status === 'panel' && prev.placeId === placeId) {
                return prev
            }
            return { status: 'highlighted', placeId }
        })
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

    const handleDraftChange = (value: string) => {
        setDraft(value)
        // Si el usuario borra el prellenado, lo que escriba después es una
        // petición libre, no una respuesta hacia una red.
        if (value === '') {
            setDraftVia(null)
        }
    }

    const handleSelectPost = (post: SocialPost) => {
        if (selectedPlace === null) {
            return
        }
        setDraft(buildSuggestedReply(selectedPlace, post))
        setDraftVia(post.platform)
        inputRef.current?.focus()
    }

    const handleSend = () => {
        const text = draft.trim()
        if (text === '') {
            return
        }

        if (draftVia !== null) {
            // Respuesta prellenada: simulamos el envío a la red de origen.
            setMessages((prev) => [
                ...prev,
                { id: nextMessageId(), from: 'user', text, sentVia: draftVia },
                {
                    id: nextMessageId(),
                    from: 'agent',
                    text: `Listo: tu respuesta quedó registrada como "${PLATFORMS[draftVia].replyAction}". Es una demo — no se envió nada real.`
                }
            ])
            setDraft('')
            setDraftVia(null)
            return
        }

        const scenario = matchScenario(text)
        setMessages((prev) => [
            ...prev,
            { id: nextMessageId(), from: 'user', text },
            {
                id: nextMessageId(),
                from: 'agent',
                text:
                    scenario !== null
                        ? scenario.response
                        : 'Por ahora solo entiendo algunas peticiones de esta demo. Prueba con "agua", "ropa" o "derrumbe".'
            }
        ])
        setDraft('')
        if (scenario !== null) {
            // Zoom al punto y panel abierto a la vez: el mensaje del agente ya
            // anuncia que se abre el detalle.
            setSpotlightId(scenario.placeId)
            setSelection({ status: 'panel', placeId: scenario.placeId })
        }
    }

    return (
        // `isolate` crea un stacking context propio: el z-[1200] del panel y
        // los z bajos del grafo/chat no compiten con los del mapa ni el header.
        <section aria-label="Conexiones" className="bg-page absolute inset-0 isolate overflow-hidden">
            <ConnectionsGraph
                places={PLACES}
                connections={CONNECTIONS}
                layout={GRAPH_LAYOUT}
                highlightedId={highlightedId}
                spotlightId={spotlightId}
                onSelectDot={handleDotClick}
                onClearSelection={handleClearSelection}
            />
            <ConnectionsLegend />
            <ConnectionChat
                messages={messages}
                draft={draft}
                onDraftChange={handleDraftChange}
                onSend={handleSend}
                inputRef={inputRef}
            />
            <SidePanel place={selectedPlace} onClose={handleClosePanel} onSelectPost={handleSelectPost} />
        </section>
    )
}
