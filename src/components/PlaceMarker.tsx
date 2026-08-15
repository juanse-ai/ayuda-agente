import { divIcon, type DivIcon, type LeafletEventHandlerFnMap } from 'leaflet'
import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import type { HelpKind, Place } from '@/types/place'

const ICON_SIZE = 26

function buildIcon(kind: HelpKind, isSelected: boolean): DivIcon {
    return divIcon({
        className: `ayuda-marker ayuda-marker--${kind}${isSelected ? ' ayuda-marker--selected' : ''}`,
        html: '<span></span>',
        iconSize: [ICON_SIZE, ICON_SIZE],
        iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2]
    })
}

/** Hoisted so a marker's icon is never reallocated on render. Styled in styles/index.css. */
const ICONS: Record<HelpKind, { default: DivIcon; selected: DivIcon }> = {
    needed: { default: buildIcon('needed', false), selected: buildIcon('needed', true) },
    offered: { default: buildIcon('offered', false), selected: buildIcon('offered', true) }
}

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
            icon={isSelected ? ICONS[place.kind].selected : ICONS[place.kind].default}
            // `title` names the marker; Leaflet only applies `alt` to <img> icons.
            // Se usa el titular del reporte, que identifica el punto mejor que
            // el nombre del barrio a secas.
            title={place.title}
            eventHandlers={eventHandlers}
        />
    )
}
