import { PLATFORMS } from '@/data/platforms'
import type { SocialPost } from '@/types/place'

interface SocialPostCardProps {
    post: SocialPost
}

/**
 * Una publicación de la lista.
 *
 * No enlaza a ninguna parte: los datos son ficticios y no hay URL real que
 * abrir. La tarjeta no es interactiva a propósito, así que tabular por el panel
 * no atraviesa decenas de paradas muertas.
 */
export function SocialPostCard({ post }: SocialPostCardProps) {
    const platform = PLATFORMS[post.platform]

    return (
        <li className="border-line bg-page rounded-lg border p-3.5">
            <div className="flex items-center gap-2.5">
                {/* Marco común para los tres logos. Son mapas de bits con fondo
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
        </li>
    )
}
