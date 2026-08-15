import type { LatLngTuple } from 'leaflet'

export type SocialPlatform = 'instagram' | 'x' | 'facebook' | 'tiktok'

/** Si un punto reporta una necesidad (rojo) o una oferta de ayuda (verde). */
export type HelpKind = 'needed' | 'offered'

export interface SocialPost {
    id: string
    /** Handle del autor, p. ej. '@vecinos.siloe'. */
    author: string
    platform: SocialPlatform
    /** Etiqueta ya formateada, p. ej. 'hace 2 h'. */
    postedAt: string
    content: string
}

/**
 * Un punto del mapa: un reporte de ayuda localizado dentro de una ciudad.
 *
 * `city` va denormalizado en vez de un `cityId` a propósito: el panel lateral
 * retiene el último punto durante la animación de salida, y resolver la ciudad
 * aparte obligaría a un segundo latch sincronizado.
 */
export interface Place {
    id: string
    /** Barrio o sector, p. ej. 'Siloé'. */
    name: string
    city: string
    /** Titular de la situación. */
    title: string
    description: string
    /** Necesita ayuda o la ofrece; determina el color del punto en el mapa. */
    kind: HelpKind
    position: LatLngTuple
    posts: SocialPost[]
}

/** Destino del desplegable del header. */
export interface City {
    id: string
    name: string
    department: string
    position: LatLngTuple
}
