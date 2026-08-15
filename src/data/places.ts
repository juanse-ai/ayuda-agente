import type { LatLngTuple } from 'leaflet'
import type { Place } from '@/types/place'

/** Datos de ejemplo para el shell. Se reemplazan por completo con datos reales. */

/** Encuadre inicial: muestra las cuatro ciudades a la vez. */
export const MAP_CENTER: LatLngTuple = [4.57, -76.17]
export const MAP_ZOOM = 8

/** Zoom al enfocar una ciudad desde el menú del header. */
export const CITY_ZOOM = 12

export const PLACES: Place[] = [
    {
        id: 'pereira',
        name: 'Pereira',
        department: 'Risaralda',
        description: 'Capital de Risaralda y centro urbano del Eje Cafetero.',
        position: [4.8143, -75.6946]
    },
    {
        id: 'quibdo',
        name: 'Quibdó',
        department: 'Chocó',
        description: 'Capital del Chocó, sobre la margen derecha del río Atrato.',
        position: [5.6947, -76.6611]
    },
    {
        id: 'armenia',
        name: 'Armenia',
        department: 'Quindío',
        description: 'Capital del Quindío, en el corazón del Eje Cafetero.',
        position: [4.5342, -75.6811]
    },
    {
        id: 'cali',
        name: 'Cali',
        department: 'Valle del Cauca',
        description: 'Capital del Valle del Cauca y principal centro urbano del suroccidente.',
        position: [3.4516, -76.532]
    }
]
