import type { ChatScenario, Connection, GraphPoint } from '@/types/connection'

/* ==========================================================================
   DATOS FICTICIOS — SOLO PARA DEMOSTRACIÓN

   Igual que `places.ts`: nada de este archivo es real. Las conexiones, sus
   fuerzas y los escenarios del chat están inventados para poblar la vista de
   Conexiones. No hay ningún algoritmo de matching: la fuerza de cada enlace
   y la posición de cada punto vienen fijadas aquí a mano.

   Invariante: cada `neededId`, `offeredId` y `placeId` de este archivo, y
   cada clave de `GRAPH_LAYOUT`, debe existir en `PLACES`. Con diez puntos de
   maqueta no hace falta guardia en tiempo de ejecución: un id roto se nota a
   simple vista porque el punto o el hilo no aparecen.
   ========================================================================== */

/**
 * Tamaño del viewBox del grafo. El SVG usa `preserveAspectRatio` en modo
 * `slice`, así que en pantallas muy anchas o muy altas se recortan los bordes:
 * por eso todas las posiciones se mantienen en la zona segura x 120–880,
 * y 120–520.
 */
export const GRAPH_VIEWBOX = { width: 1000, height: 620 }

/**
 * Posición de reposo de cada punto. Los puntos emparejados y cercanos se
 * agrupan por ciudad; los de Armenia, sin pareja, quedan a un lado a propósito
 * (el rojo aislado es el "nadie ha ofrecido ayuda todavía" de la demo).
 */
export const GRAPH_LAYOUT: Record<string, GraphPoint> = {
    // Cúmulo de Pereira (arriba a la izquierda)
    'pereira-cuba': { x: 170, y: 190 },
    'pereira-san-nicolas': { x: 240, y: 250 },
    'pereira-villa-santana': { x: 280, y: 330 },
    // Cúmulo de Quibdó (arriba a la derecha)
    'quibdo-yesquita': { x: 600, y: 170 },
    'quibdo-nino-jesus': { x: 690, y: 225 },
    // Cúmulo de Cali (abajo en el centro); El Vallado tira hacia Quibdó por
    // su enlace débil a distancia.
    'cali-siloe': { x: 420, y: 450 },
    'cali-terron-colorado': { x: 505, y: 405 },
    'cali-el-vallado': { x: 560, y: 300 },
    // Sin pareja, apartados de todo cúmulo
    'armenia-puerto-espejo': { x: 850, y: 470 },
    'armenia-la-adiela': { x: 830, y: 150 }
}

/** Complementario + cercano = fuerte; c5 cruza 250 km y por eso es el más débil. */
export const CONNECTIONS: Connection[] = [
    { id: 'c1', neededId: 'pereira-cuba', offeredId: 'pereira-san-nicolas', strength: 0.9 },
    { id: 'c2', neededId: 'pereira-villa-santana', offeredId: 'pereira-san-nicolas', strength: 0.55 },
    { id: 'c3', neededId: 'quibdo-yesquita', offeredId: 'quibdo-nino-jesus', strength: 0.65 },
    { id: 'c4', neededId: 'cali-siloe', offeredId: 'cali-terron-colorado', strength: 0.8 },
    { id: 'c5', neededId: 'quibdo-yesquita', offeredId: 'cali-el-vallado', strength: 0.3 }
]

export const CHAT_SCENARIOS: ChatScenario[] = [
    {
        id: 'agua',
        keywords: ['agua', 'botellones', 'sed'],
        placeId: 'quibdo-yesquita',
        response:
            'La escuela de La Yesquita, en Quibdó, funciona como albergue tras la creciente del Atrato y les falta agua potable. El Vallado, en Cali, ofrece botellones sobrantes, pero está a 250 km. Te abro el detalle para que respondas a una de sus publicaciones.'
    },
    {
        id: 'ropa',
        keywords: ['ropa', 'cobijas', 'incendio'],
        placeId: 'armenia-puerto-espejo',
        response:
            'En Puerto Espejo, Armenia, cuatro familias perdieron todo en un incendio y necesitan ropa, cobijas y enseres. Nadie ha ofrecido ayuda para este punto todavía: la tuya sería la primera. Te abro el detalle para que respondas a una publicación.'
    },
    {
        id: 'derrumbe',
        keywords: ['derrumbe', 'palas', 'escombros', 'via'],
        placeId: 'cali-siloe',
        response:
            'En la parte alta de Siloé, Cali, un deslizamiento dejó tres viviendas en riesgo y piden manos, palas y evaluación técnica. La cuadrilla de Terrón Colorado ya se ofreció, así que puedes sumarte. Te abro el detalle para que respondas a una publicación.'
    }
]

/** Disculpa común de los dos chats (Mapa y Conexiones) cuando nada coincide. */
export const CHAT_FALLBACK =
    'Por ahora solo entiendo algunas peticiones de esta demo. Prueba con "agua", "ropa" o "derrumbe".'

/**
 * "Comprensión" de lenguaje de la demo: minúsculas, sin tildes, y basta con
 * que aparezca una palabra clave. Devuelve null si ningún escenario aplica —
 * el que llama decide el mensaje de disculpa.
 */
export function matchScenario(input: string): ChatScenario | null {
    const text = input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    return (
        CHAT_SCENARIOS.find((scenario) => scenario.keywords.some((keyword) => text.includes(keyword))) ?? null
    )
}
