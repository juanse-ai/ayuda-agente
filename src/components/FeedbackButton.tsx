import { MessageCircle } from 'lucide-react'

/**
 * Llamada al feedback, anclada abajo a la izquierda sobre las dos pestañas.
 *
 * Es un enlace y no un `button` porque lleva a otra URL: así el navegador da
 * gratis el "abrir en pestaña nueva", el clic con el botón central y la vista
 * previa del destino. `z-[1150]` lo deja sobre el degradado del chat (1100) y
 * por debajo del panel de detalle (1200), que sí debe taparlo.
 */
export function FeedbackButton() {
    return (
        <a
            href="/cami"
            className="border-line bg-surface text-fg-muted hover:text-fg hover:border-brand/60 absolute bottom-4 left-4 z-[1150] flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-2xl shadow-black/50 transition-colors duration-200"
        >
            <MessageCircle size={14} strokeWidth={2} aria-hidden />
            Déjanos tu feedback
        </a>
    )
}
