import { latLngBounds } from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { PLACE_ZOOM } from '@/data/graphView'
import type { Place } from '@/types/place'

/** Duración del vuelo, la misma se acerque a un punto o encuadre varios. */
const FLIGHT_SECONDS = 1.2

interface MapSpotlightProps {
    /**
     * Envoltorio creado NUEVO en cada respuesta del chat, a propósito: el
     * efecto depende de su identidad, así que repetir la misma petición vuelve
     * a volar aunque los puntos sean los mismos (el usuario pudo haber movido el
     * mapa entre medias). Los `places` de dentro sí deben salir de la lista de puntos.
     */
    target: { places: Place[] } | null
}

/**
 * Mueve la cámara a lo que el agente acabó señalando. Mismo patrón que
 * MapFocus: `MapContainer` congela `center` y `zoom` tras el montaje y la
 * única forma de mover el mapa es la instancia de Leaflet vía `useMap()`, que
 * solo existe dentro del contenedor. De ahí este componente sin render propio.
 *
 * Un punto se mira de cerca; varios se encuadran juntos. Acercarse a uno de los cinco que
 * la respuesta menciona afirmaría que es *el* sitio, y el encuadre dice lo que de verdad
 * dijo el agente: están todos ahí.
 */
export function MapSpotlight({ target }: MapSpotlightProps) {
    const map = useMap()

    useEffect(() => {
        const places = target?.places ?? []
        if (places.length === 0) {
            return
        }
        if (places.length === 1) {
            map.flyTo(places[0].position, PLACE_ZOOM, { duration: FLIGHT_SECONDS })
            return
        }
        map.flyToBounds(latLngBounds(places.map((place) => place.position)), {
            padding: [60, 60],
            duration: FLIGHT_SECONDS
        })
    }, [map, target])

    return null
}
