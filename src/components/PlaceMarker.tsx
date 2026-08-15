import { divIcon, type LeafletEventHandlerFnMap } from 'leaflet'
import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import type { Place } from '@/types/place'

const ICON_SIZE = 26

/** Hoisted so a marker's icon is never reallocated on render. Styled in styles/index.css. */
const ICON = divIcon({
    className: 'ayuda-marker',
    html: '<span></span>',
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2]
})

const ICON_SELECTED = divIcon({
    className: 'ayuda-marker ayuda-marker--selected',
    html: '<span></span>',
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2]
})

interface PlaceMarkerProps {
    place: Place
    isSelected: boolean
    onSelect: (placeId: string) => void
}

export function PlaceMarker({ place, isSelected, onSelect }: PlaceMarkerProps) {
    const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
        () => ({
            click: () => onSelect(place.id),
            // Leaflet gives markers tabIndex and role="button" but never wires
            // activation, so Enter/Space have to be handled here.
            keydown: (event) => {
                const { key } = event.originalEvent
                if (key === 'Enter' || key === ' ') {
                    event.originalEvent.preventDefault()
                    onSelect(place.id)
                }
            }
        }),
        [onSelect, place.id]
    )

    return (
        <Marker
            position={place.position}
            icon={isSelected ? ICON_SELECTED : ICON}
            // `title` names the marker; Leaflet only applies `alt` to <img> icons.
            title={place.name}
            eventHandlers={eventHandlers}
        />
    )
}
