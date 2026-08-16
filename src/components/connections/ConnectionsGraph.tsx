import { useEffect, useMemo, useRef } from 'react'
import { GRAPH_VIEWBOX } from '@/data/graphView'
import type { Connection, GraphPoint } from '@/types/connection'
import type { Place } from '@/types/place'

interface ConnectionsGraphProps {
    places: Place[]
    connections: Connection[]
    layout: Record<string, GraphPoint>
    highlightedId: string | null
    spotlightId: string | null
    onSelectDot: (placeId: string) => void
    onClearSelection: () => void
}

const SETTLE_MS = 1400
const SPOTLIGHT_SCALE = 1.8

/**
 * A partir de aquí las etiquetas estorban más de lo que ayudan: los nombres
 * reales son largos y con muchos puntos se pisan unos a otros. El nombre sigue
 * a un clic de distancia, en el panel.
 */
const MAX_LABELLED_DOTS = 25
const MAX_LABEL_CHARS = 22

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
}

/** Nombre del actor recortado a lo que cabe bajo un punto. */
function shortLabel(name: string): string {
    return name.length > MAX_LABEL_CHARS ? `${name.slice(0, MAX_LABEL_CHARS - 1).trimEnd()}…` : name
}

/**
 * Posición inicial del punto i antes de asentarse: un corrillo determinista
 * alrededor del centro. Nada de Math.random — la entrada se ve igual siempre.
 */
function scatterPoint(index: number): GraphPoint {
    return {
        x: GRAPH_VIEWBOX.width / 2 + Math.cos(index * 2.4) * 60,
        y: GRAPH_VIEWBOX.height / 2 + Math.sin(index * 2.4) * 60
    }
}

/**
 * El grafo en sí: SVG dibujado a mano, sin librería de grafos. Las posiciones
 * de reposo vienen calculadas de fuera (la geografía real proyectada sobre el
 * viewBox), así que aquí no hay layout que resolver: solo pintar y animar.
 *
 * Presentational: reporta clics y pinta lo que le digan las props, sin estado
 * propio. La única maquinaria es un bucle rAF que escribe transform de puntos
 * y extremos de líneas vía refs — así los hilos quedan pegados a los puntos a
 * la deriva sin re-render por frame. El bucle jamás toca `opacity`: las
 * transiciones CSS de resaltar/atenuar son dueñas de esa propiedad.
 */
export function ConnectionsGraph({
    places,
    connections,
    layout,
    highlightedId,
    spotlightId,
    onSelectDot,
    onClearSelection
}: ConnectionsGraphProps) {
    const dotRefs = useRef(new Map<string, SVGGElement>())
    const lineRefs = useRef(new Map<string, SVGLineElement>())

    // Posiciones de arranque por id, para que el primer frame ya pinte el
    // corrillo (sin esto habría un destello de puntos en el origen).
    const scatterById = useMemo(
        () => new Map(places.map((place, index) => [place.id, scatterPoint(index)])),
        [places]
    )

    // Con un punto resaltado, sus emparejados siguen vivos y el resto se atenúa.
    const connectedIds = useMemo(() => {
        if (highlightedId === null) {
            return null
        }
        const ids = new Set([highlightedId])
        for (const connection of connections) {
            if (connection.neededId === highlightedId) {
                ids.add(connection.offeredId)
            }
            if (connection.offeredId === highlightedId) {
                ids.add(connection.neededId)
            }
        }
        return ids
    }, [highlightedId, connections])

    useEffect(() => {
        let frame = 0
        const start = performance.now()

        const tick = (now: number) => {
            const elapsed = now - start
            const settle = easeOutCubic(Math.min(1, elapsed / SETTLE_MS))
            const positions = new Map<string, GraphPoint>()

            places.forEach((place, index) => {
                const target = layout[place.id]
                if (target === undefined) {
                    return
                }
                const scatter = scatterPoint(index)
                // La deriva entra multiplicada por `settle` para no sacudir el
                // corrillo inicial; dos frecuencias distintas evitan que todos
                // los puntos respiren al unísono.
                const x =
                    scatter.x +
                    (target.x - scatter.x) * settle +
                    Math.sin(elapsed / 1700 + index * 1.7) * 6 * settle
                const y =
                    scatter.y +
                    (target.y - scatter.y) * settle +
                    Math.cos(elapsed / 2300 + index * 2.1) * 6 * settle
                positions.set(place.id, { x, y })
                dotRefs.current.get(place.id)?.setAttribute('transform', `translate(${x} ${y})`)
            })

            for (const connection of connections) {
                const a = positions.get(connection.neededId)
                const b = positions.get(connection.offeredId)
                if (a === undefined || b === undefined) {
                    continue
                }
                for (const key of [`${connection.id}:glow`, `${connection.id}:core`]) {
                    const line = lineRefs.current.get(key)
                    if (line === undefined) {
                        continue
                    }
                    line.setAttribute('x1', String(a.x))
                    line.setAttribute('y1', String(a.y))
                    line.setAttribute('x2', String(b.x))
                    line.setAttribute('y2', String(b.y))
                }
            }

            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [places, connections, layout])

    // El zoom del spotlight solo ocurre con el panel lateral (380px) abierto —
    // el chat abre ambos a la vez — así que el centro se corre 120 unidades a
    // la izquierda para que el punto no quede debajo del panel.
    const spotlightTarget = spotlightId !== null ? (layout[spotlightId] ?? null) : null
    const zoomTransform =
        spotlightTarget !== null
            ? `translate(${GRAPH_VIEWBOX.width / 2 - 120 - SPOTLIGHT_SCALE * spotlightTarget.x}px, ${
                  GRAPH_VIEWBOX.height / 2 - SPOTLIGHT_SCALE * spotlightTarget.y
              }px) scale(${SPOTLIGHT_SCALE})`
            : 'none'

    return (
        <svg
            viewBox={`0 0 ${GRAPH_VIEWBOX.width} ${GRAPH_VIEWBOX.height}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
        >
            <defs>
                {/* Región amplia: sin ella el blur se recorta al bounding box
                    de la línea, que en tramos casi horizontales es finísimo. */}
                <filter id="hilo-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" />
                </filter>
            </defs>

            {/* Fondo clicable para deshacer la selección. Fuera del grupo con
                zoom, así cubre la pantalla también durante el spotlight. */}
            <rect
                width={GRAPH_VIEWBOX.width}
                height={GRAPH_VIEWBOX.height}
                fill="none"
                pointerEvents="all"
                onClick={onClearSelection}
            />

            <g style={{ transform: zoomTransform, transition: 'transform 700ms ease' }}>
                {connections.map((connection) => {
                    const isActive =
                        highlightedId === null ||
                        connection.neededId === highlightedId ||
                        connection.offeredId === highlightedId
                    const a = scatterById.get(connection.neededId)
                    const b = scatterById.get(connection.offeredId)
                    const endpoints =
                        a !== undefined && b !== undefined
                            ? { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
                            : undefined
                    return (
                        <g
                            key={connection.id}
                            className="transition-opacity duration-300"
                            style={{
                                // Brillo proporcional a la fuerza del enlace;
                                // casi apagado si el resaltado va por otro lado.
                                opacity: (0.25 + connection.strength * 0.55) * (isActive ? 1 : 0.15)
                            }}
                        >
                            <line
                                ref={(el) => {
                                    if (el !== null) {
                                        lineRefs.current.set(`${connection.id}:glow`, el)
                                    } else {
                                        lineRefs.current.delete(`${connection.id}:glow`)
                                    }
                                }}
                                {...endpoints}
                                stroke="var(--color-fg)"
                                strokeWidth={4 + connection.strength * 6}
                                strokeLinecap="round"
                                filter="url(#hilo-glow)"
                            />
                            <line
                                ref={(el) => {
                                    if (el !== null) {
                                        lineRefs.current.set(`${connection.id}:core`, el)
                                    } else {
                                        lineRefs.current.delete(`${connection.id}:core`)
                                    }
                                }}
                                {...endpoints}
                                stroke="var(--color-fg)"
                                strokeWidth={1 + connection.strength * 2.5}
                                strokeLinecap="round"
                            />
                        </g>
                    )
                })}

                {places.map((place) => {
                    const scatter = scatterById.get(place.id)
                    const isDimmed = connectedIds !== null && !connectedIds.has(place.id)
                    const isHighlighted = place.id === highlightedId
                    const color = place.kind === 'needed' ? 'var(--color-need)' : 'var(--color-offer)'
                    return (
                        <g
                            key={place.id}
                            ref={(el) => {
                                if (el !== null) {
                                    dotRefs.current.set(place.id, el)
                                } else {
                                    dotRefs.current.delete(place.id)
                                }
                            }}
                            transform={
                                scatter !== undefined ? `translate(${scatter.x} ${scatter.y})` : undefined
                            }
                            role="button"
                            tabIndex={0}
                            aria-label={`${place.name}, ${place.city} — ${
                                place.kind === 'needed' ? 'necesita ayuda' : 'ofrece ayuda'
                            }`}
                            onClick={() => onSelectDot(place.id)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    onSelectDot(place.id)
                                }
                            }}
                            className="focus-visible:outline-brand cursor-pointer transition-opacity duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                            style={{ opacity: isDimmed ? 0.12 : 1 }}
                        >
                            {place.id === spotlightId ? (
                                <circle
                                    r={10}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={2}
                                    className="conexiones-pulse"
                                />
                            ) : null}
                            <circle r={13} fill={color} opacity={0.18} />
                            {/* Resaltado con el mismo lenguaje del marcador
                                seleccionado del mapa: núcleo blanco, aro de color. */}
                            <circle
                                r={7}
                                fill={isHighlighted ? 'var(--color-fg)' : color}
                                stroke={isHighlighted ? color : 'none'}
                                strokeWidth={isHighlighted ? 3 : 0}
                            />
                            {places.length <= MAX_LABELLED_DOTS ? (
                                <text
                                    y={30}
                                    textAnchor="middle"
                                    fill="var(--color-fg-subtle)"
                                    fontSize={11}
                                    className="pointer-events-none select-none"
                                >
                                    {shortLabel(place.name)}
                                </text>
                            ) : null}
                        </g>
                    )
                })}
            </g>
        </svg>
    )
}
