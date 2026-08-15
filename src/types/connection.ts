import type { SocialPlatform } from '@/types/place'

/**
 * Emparejamiento ficticio entre un punto que necesita ayuda y uno que la
 * ofrece. `strength` (0..1) viene fijado en los datos de muestra, nunca se
 * calcula: en esta iteración todo el "matching" es una maqueta.
 */
export interface Connection {
    id: string
    neededId: string
    offeredId: string
    strength: number
}

/** Coordenadas dentro del viewBox del grafo de conexiones. */
export interface GraphPoint {
    x: number
    y: number
}

/**
 * Petición que el chat de la demo sabe "entender": si el texto del usuario
 * contiene alguna palabra clave, el agente enfoca `placeId` y contesta con
 * `response`. Sin IA real: coincidencia de subcadenas y ya.
 */
export interface ChatScenario {
    id: string
    keywords: string[]
    placeId: string
    response: string
}

/** Burbuja del chat de Conexiones. */
export interface ChatMessage {
    id: string
    from: 'user' | 'agent'
    text: string
    /** Solo en respuestas "enviadas" a una red: pinta el logo y la acción. */
    sentVia?: SocialPlatform
}
