import { AttributionControl, MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import { MapFocus } from '@/components/MapFocus'
import { PlaceMarker } from '@/components/PlaceMarker'
import { MAP_CENTER, MAP_ZOOM } from '@/data/places'
import type { Place } from '@/types/place'

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

interface MapStageProps {
    places: Place[]
    selectedId: string | null
    focusedPlace: Place | null
    onSelectPlace: (placeId: string) => void
}

/**
 * The map itself. Reports which place was clicked; knows nothing about what
 * consumes that selection.
 */
export function MapStage({ places, selectedId, focusedPlace, onSelectPlace }: MapStageProps) {
    return (
        <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom
            className="h-full w-full"
        >
            <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} subdomains="abcd" maxZoom={20} />
            {/* Both controls live bottom-left so the panel never covers the
                required OpenStreetMap/CARTO attribution. */}
            <ZoomControl position="bottomleft" />
            <AttributionControl position="bottomleft" prefix={false} />
            <MapFocus place={focusedPlace} />
            {places.map((place) => (
                <PlaceMarker
                    key={place.id}
                    place={place}
                    isSelected={place.id === selectedId}
                    onSelect={onSelectPlace}
                />
            ))}
        </MapContainer>
    )
}
