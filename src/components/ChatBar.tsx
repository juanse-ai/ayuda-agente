import { ArrowUp } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Ref } from 'react'
import type { ChatMessage } from '@/types/connection'

interface ChatBarProps {
    messages: ChatMessage[]
    draft: string
    onDraftChange: (value: string) => void
    onSend: () => void
    /** Un turno abierto: se bloquea el envío hasta que el agente termine. */
    isStreaming?: boolean
    /** Por qué la barra no acepta nada ahora mismo; se enseña en el placeholder. */
    blockedReason?: string
    inputRef?: Ref<HTMLInputElement>
}

/**
 * Qué enseñar mientras la respuesta se está escribiendo: el paso en curso si lo
 * hay, y si no una espera. Medio minuto de silencio con un cursor parado se lee
 * como una pantalla rota; los nombres de las herramientas, no.
 */
function pendingLabel(message: ChatMessage): string | null {
    if (message.step !== undefined) {
        return message.step
    }
    return message.pending === true && message.text === '' ? 'Pensando…' : null
}

/**
 * Barra de chat compartida por Mapa y Conexiones. Presentational: pinta
 * burbujas y reporta el borrador y el envío; la conversación con el agente vive
 * en `useAgentChat`. Nunca llama a ninguna red ni API.
 *
 * `z-[1100]` porque sobre el mapa debe pintarse encima de los controles de
 * Leaflet (z 1000) y debajo del panel lateral (z 1200); en Conexiones cualquier
 * z bajo serviría, pero uno solo vale para ambos. El degradado de fondo es
 * `pointer-events-none` para no bloquear el mapa (ni el fondo del grafo) fuera
 * de la columna interactiva.
 */
export function ChatBar({
    messages,
    draft,
    onDraftChange,
    onSend,
    isStreaming,
    blockedReason,
    inputRef
}: ChatBarProps) {
    // Un solo motivo por el que la barra no acepta nada, y su texto. Escribir en
    // un campo que no reacciona se lee como una pantalla rota.
    const blockedBy = blockedReason ?? (isStreaming === true ? 'El agente está respondiendo…' : null)

    // Centinela al final de la lista: al llegar una burbuja nueva, el scroll
    // baja solo. `block: 'nearest'` evita que arrastre el resto de la página.
    const endRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [messages])

    // El input se deshabilita mientras el agente responde, y deshabilitarlo le
    // quita el foco: sin devolverlo, lo que el usuario escriba después de la
    // respuesta se pierde. Por eso hace falta una ref propia además de la de fuera.
    const localRef = useRef<HTMLInputElement>(null)
    const wasStreaming = useRef(false)
    useEffect(() => {
        if (wasStreaming.current && isStreaming !== true) {
            localRef.current?.focus()
        }
        wasStreaming.current = isStreaming === true
    }, [isStreaming])

    const attachInput = (node: HTMLInputElement | null) => {
        localRef.current = node
        if (typeof inputRef === 'function') {
            inputRef(node)
        } else if (inputRef !== undefined && inputRef !== null) {
            inputRef.current = node
        }
    }

    return (
        <div className="from-page via-page/80 pointer-events-none absolute inset-x-0 bottom-0 z-[1100] bg-gradient-to-t to-transparent px-4 pt-10 pb-4">
            <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-3">
                <div
                    role="log"
                    aria-label="Conversación"
                    // `mb-12` reserva la banda a la que sube el botón de feedback
                    // cuando esta columna llega a las esquinas (ver FeedbackButton):
                    // sin ella las burbujas quedarían debajo del botón.
                    className="mb-12 flex max-h-[40dvh] flex-col gap-2 overflow-y-auto overscroll-contain pr-1 xl:mb-0"
                >
                    {messages.map((message) => {
                        const label = pendingLabel(message)
                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex',
                                    message.from === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div
                                    className={cn(
                                        'max-w-[85%] rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                                        message.from === 'user'
                                            ? 'border-brand-strong/40 bg-brand-strong/20 text-fg'
                                            : 'border-line bg-surface text-fg-muted'
                                    )}
                                >
                                    {label !== null ? (
                                        <span className="text-fg-subtle mb-1 block animate-pulse text-xs">
                                            {label}
                                        </span>
                                    ) : null}
                                    {message.text}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={endRef} aria-hidden />
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        onSend()
                    }}
                    className="border-line bg-surface flex items-center gap-2 rounded-full border p-1.5 shadow-2xl shadow-black/50"
                >
                    <input
                        ref={attachInput}
                        type="text"
                        value={draft}
                        onChange={(event) => onDraftChange(event.target.value)}
                        // Un turno a la vez por conversación: mandar otro mensaje
                        // mientras el agente responde entrelaza las dos escrituras.
                        disabled={blockedBy !== null}
                        placeholder={blockedBy ?? 'Escribe cómo quieres ayudar…'}
                        aria-label="Mensaje"
                        // 16 px con el dedo: por debajo de eso Safari en iOS hace
                        // zoom al enfocar el campo y descuadra la pantalla entera.
                        className="text-fg placeholder:text-fg-faint coarse:text-base min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                    />
                    <button
                        type="submit"
                        disabled={draft.trim() === '' || blockedBy !== null}
                        aria-label="Enviar"
                        className="bg-brand-strong text-fg coarse:size-11 grid size-9 shrink-0 place-items-center rounded-full transition-opacity duration-200 disabled:opacity-40"
                    >
                        <ArrowUp size={16} strokeWidth={2} aria-hidden />
                    </button>
                </form>
            </div>
        </div>
    )
}
