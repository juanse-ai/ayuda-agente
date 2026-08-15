import type { LatLngTuple } from 'leaflet'

export interface Place {
    id: string
    name: string
    department: string
    description: string
    position: LatLngTuple
}
