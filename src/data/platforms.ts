import type { SocialPlatform } from '@/types/place'

interface PlatformMeta {
    label: string
    /**
     * Ruta servida desde `public/`, que Vite copia tal cual sin procesar.
     *
     * Las mayúsculas importan: en Linux la ruta distingue mayúsculas y
     * `/logos/instagram.png` daría 404 en despliegue aunque funcione en macOS.
     * Y sí, `X.svg.webp` es un WebP pese al nombre del archivo.
     */
    logo: string
}

/**
 * Único punto del código donde vive lo específico de cada red.
 *
 * Al estar tipado como `Record<SocialPlatform, …>`, añadir una plataforma a la
 * unión rompe la compilación hasta que se registra aquí: una red nueva son una
 * entrada y un archivo, sin tocar ningún componente.
 */
export const PLATFORMS: Record<SocialPlatform, PlatformMeta> = {
    instagram: { label: 'Instagram', logo: '/logos/Instagram.png' },
    x: { label: 'X', logo: '/logos/X.svg.webp' },
    facebook: { label: 'Facebook', logo: '/logos/Facebook.webp' },
    tiktok: { label: 'TikTok', logo: '/logos/TikTok.jpg' }
}
