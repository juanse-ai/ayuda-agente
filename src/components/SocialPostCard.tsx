import { PLATFORMS } from '@/data/platforms'
import type { SocialPost } from '@/types/place'

interface SocialPostCardProps {
    post: SocialPost
    /**
     * Si viene, la tarjeta se vuelve un botón (Conexiones la usa para
     * prellenar la respuesta en el chat). Sin él, la tarjeta no es interactiva
     * a propósito: en el mapa los datos son ficticios y no hay URL real que
     * abrir, así que tabular por el panel no atraviesa paradas muertas.
     */
    onSelect?: () => void
}

/** Una publicación de la lista. */
export function SocialPostCard({ post, onSelect }: SocialPostCardProps) {
    const platform = PLATFORMS[post.platform]

    const content = (
        <>
            <div className="flex items-center gap-2.5">
                {/* Marco común para los logos. Son mapas de bits con fondo
                    propio —el de X es un disco negro— y no se pueden recolorear
                    con CSS, así que la coherencia la da el marco: mismo tamaño,
                    mismo borde, mismo aire. Nada de máscara circular: recortaría
                    las esquinas del cuadrado redondeado de Instagram. */}
                <span className="border-line bg-surface-muted grid size-7 shrink-0 place-items-center rounded-md border">
                    <img
                        src={platform.logo}
                        alt=""
                        width={18}
                        height={18}
                        loading="lazy"
                        decoding="async"
                        className="size-[18px] object-contain"
                    />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-fg truncate text-sm font-medium">{post.author}</p>
                    <p className="text-fg-subtle truncate text-xs">
                        {platform.label} · {post.postedAt}
                    </p>
                </div>
            </div>
            <p className="text-fg-muted mt-3 text-sm leading-relaxed">{post.content}</p>
        </>
    )

    if (onSelect === undefined) {
        return <li className="border-line bg-page rounded-lg border p-3.5">{content}</li>
    }

    // Botón dentro del <li>, nunca un <li> clicable: el elemento de lista
    // conserva su semántica y el botón aporta foco y teclado gratis.
    return (
        <li>
            <button
                type="button"
                onClick={onSelect}
                className="border-line bg-page hover:border-brand/60 block w-full rounded-lg border p-3.5 text-left transition-colors duration-200"
            >
                {content}
                <span className="text-brand mt-2 block text-xs font-medium">Responder →</span>
            </button>
        </li>
    )
}
