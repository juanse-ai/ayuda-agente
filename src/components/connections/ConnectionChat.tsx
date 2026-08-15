import { Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PLATFORMS } from '@/data/platforms'
import { cn } from '@/lib/utils'
import type { Ref } from 'react'
import type { ChatMessage } from '@/types/connection'

interface ConnectionChatProps {
    messages: ChatMessage[]
    draft: string
    onDraftChange: (value: string) => void
    onSend: () => void
    inputRef?: Ref<HTMLInputElement>
}

/**
 * Barra de chat de Conexiones. Presentational: pinta burbujas y reporta el
 * borrador y el envío; toda la "inteligencia" (que no la hay: es una maqueta)
 * vive en ConnectionsView. Nunca llama a ninguna red ni API.
 */
export function ConnectionChat({ messages, draft, onDraftChange, onSend, inputRef }: ConnectionChatProps) {
    // Centinela al final de la lista: al llegar una burbuja nueva, el scroll
    // baja solo. `block: 'nearest'` evita que arrastre el resto de la página.
    const endRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [messages])

    return (
        <div className="from-page via-page/80 absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t to-transparent px-4 pt-10 pb-4">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
                <div
                    role="log"
                    aria-label="Conversación"
                    className="flex max-h-[40dvh] flex-col gap-2 overflow-y-auto overscroll-contain pr-1"
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn('flex', message.from === 'user' ? 'justify-end' : 'justify-start')}
                        >
                            <div
                                className={cn(
                                    'max-w-[85%] rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed',
                                    message.from === 'user'
                                        ? 'border-brand-strong/40 bg-brand-strong/20 text-fg'
                                        : 'border-line bg-surface text-fg-muted'
                                )}
                            >
                                {message.sentVia !== undefined ? (
                                    // Mismo marco de logo que las tarjetas de
                                    // publicación: la burbuja "enviada" declara
                                    // a qué red iría la respuesta (simulada).
                                    <span className="mb-2 flex items-center gap-2">
                                        <span className="border-line bg-surface-muted grid size-7 shrink-0 place-items-center rounded-md border">
                                            <img
                                                src={PLATFORMS[message.sentVia].logo}
                                                alt=""
                                                width={18}
                                                height={18}
                                                className="size-[18px] object-contain"
                                            />
                                        </span>
                                        <span className="text-fg-subtle text-xs">
                                            {PLATFORMS[message.sentVia].replyAction}
                                        </span>
                                    </span>
                                ) : null}
                                {message.text}
                            </div>
                        </div>
                    ))}
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
                        ref={inputRef}
                        type="text"
                        value={draft}
                        onChange={(event) => onDraftChange(event.target.value)}
                        placeholder="Escribe cómo quieres ayudar…"
                        aria-label="Mensaje"
                        className="text-fg placeholder:text-fg-faint min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                    />
                    <button
                        type="submit"
                        disabled={draft.trim() === ''}
                        aria-label="Enviar"
                        className="bg-brand-strong text-fg grid size-9 shrink-0 place-items-center rounded-full transition-opacity duration-200 disabled:opacity-40"
                    >
                        <Send size={16} strokeWidth={2} aria-hidden />
                    </button>
                </form>
            </div>
        </div>
    )
}
