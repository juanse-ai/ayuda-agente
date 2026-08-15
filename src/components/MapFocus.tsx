import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { CITY_ZOOM } from '@/data/places'
import type { Place } from '@/types/place'

interface MapFocusProps {
    place: Place | null
}

/**
 * Mueve la cámara a la ubicación enfocada.
 *
 * `MapContainer` congela `center` y `zoom` después del montaje, así que la
 * única forma de mover el mapa es a través de la instancia de Leaflet, y
 * `useMap()` solo existe dentro del contenedor. De ahí este componente sin
 * render propio.
 */
export function MapFocus({ place }: MapFocusProps) {
    const map = useMap()

    useEffect(() => {
        if (place === null) {
            return
        }
        map.flyTo(place.position, CITY_ZOOM, { duration: 1.2 })
    }, [map, place])

    return null
}
