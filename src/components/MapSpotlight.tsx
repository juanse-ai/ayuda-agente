import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { PLACE_ZOOM } from '@/data/graphView'
import type { Place } from '@/types/place'

interface MapSpotlightProps {
    /**
     * Envoltorio creado NUEVO en cada petición del chat, a propósito: el
     * efecto depende de su identidad, así que repetir la misma petición vuelve
     * a volar aunque el punto sea el mismo (el usuario pudo haber movido el
     * mapa entre medias). El `place` interior sí debe salir de la lista de puntos.
     */
    target: { place: Place } | null
}

/**
 * Mueve la cámara al punto que el chat del mapa encontró. Mismo patrón que
 * MapFocus: `MapContainer` congela `center` y `zoom` tras el montaje y la
 * única forma de mover el mapa es la instancia de Leaflet vía `useMap()`, que
 * solo existe dentro del contenedor. De ahí este componente sin render propio.
 */
export function MapSpotlight({ target }: MapSpotlightProps) {
    const map = useMap()

    useEffect(() => {
        if (target === null) {
            return
        }
        map.flyTo(target.place.position, PLACE_ZOOM, { duration: 1.2 })
    }, [map, target])

    return null
}
