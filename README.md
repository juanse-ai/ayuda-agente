# Ayuda Agente

Interfaz de mapa oscura construida con React 19, Vite, TypeScript, Tailwind CSS v4 y react-leaflet.

La cabecera expone dos pestañas. **Mapa** es el escenario principal: al hacer clic en una ubicación
se abre un panel lateral superpuesto con su detalle. **Conexiones** muestra un grafo flotante que
empareja puntos que necesitan ayuda con puntos que la ofrecen. Ambas pestañas llevan un chat de
demostración en la parte inferior: en Mapa vuela la cámara al punto que coincide con la petición;
en Conexiones hace zoom sobre el grafo.

## Comandos

```bash
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview   # sirve el build de producción
npm run lint      # oxlint
npm run format    # prettier --write .
```

## Estructura

```
src/
├── App.tsx                    Raíz de composición: pestaña activa + ciudad enfocada + punto seleccionado
├── components/
│   ├── AppHeader.tsx          Barra superior con las pestañas Mapa / Conexiones
│   ├── ChatBar.tsx            Barra de chat de demostración compartida por las dos pestañas
│   ├── HelpLegend.tsx         Leyenda de colores compartida (fila de conexión solo en el grafo)
│   ├── LocationMenu.tsx       Desplegable de ciudades
│   ├── MapAssistant.tsx       El chat de la pestaña Mapa (matching → volar al punto)
│   ├── MapFocus.tsx           Vuela la cámara a la ciudad enfocada
│   ├── MapSpotlight.tsx       Vuela la cámara al punto que encontró el chat
│   ├── MapStage.tsx           MapContainer + capa de teselas + marcadores
│   ├── PlaceMarker.tsx        Un punto → un marcador de Leaflet
│   ├── SidePanel.tsx          Panel lateral superpuesto
│   ├── SocialPostCard.tsx     Una publicación de una red social
│   └── connections/
│       ├── ConnectionsView.tsx   La vista Conexiones completa (todo su estado vive aquí)
│       └── ConnectionsGraph.tsx  Grafo SVG: puntos a la deriva, hilos y spotlight
├── data/
│   ├── places.ts              CIUDADES y PUNTOS de ejemplo (datos ficticios)
│   ├── connections.ts         Emparejamientos, posiciones del grafo y escenarios del chat (ficticios)
│   └── platforms.ts           Plataforma → etiqueta + ruta del logo + acción de respuesta
├── lib/
│   ├── apiClient.ts           Cliente Axios base — único punto que conoce la URL de la API
│   ├── useBackgroundMusic.ts  Hook de la música de fondo
│   └── utils.ts               cn()
├── styles/index.css           Tokens del tema, CSS de Leaflet y ajustes para modo oscuro
└── types/
    ├── place.ts               Place, City, SocialPost, SocialPlatform
    └── connection.ts          Connection, GraphPoint, ChatScenario, ChatMessage
```

Dos entidades: **ciudades**, que alimentan el desplegable del header y el vuelo del mapa, y
**puntos**, que son los reportes sobre el mapa. Cada punto tiene un título, una descripción y una
lista de publicaciones de Instagram, X, Facebook y TikTok.

`MapStage` reporta qué punto se seleccionó pero no lo almacena; `SidePanel` no conoce Leaflet.
`App` es lo único que conoce a ambos.

## Notas

- **Tema:** variante oscura del design system de Fail Fast. Los tokens viven en un único bloque
  `@theme` en `src/styles/index.css`.
- **Teselas:** CARTO `dark_all`, sin API key. La atribución de OpenStreetMap y CARTO es obligatoria.
- **Marcadores:** se usa `divIcon` en lugar del icono por defecto de Leaflet, cuyos PNG no se
  resuelven bajo Vite.
- **Pestañas:** la capa del mapa queda siempre montada y se oculta con `visibility` (nunca
  `display: none`): Leaflet mide su contenedor al montar y perdería la cámara. Conexiones, en
  cambio, se monta al activarse: su animación de entrada se repite y su estado arranca de cero.
- **Conexiones:** todo es maqueta sobre datos ficticios. El chat busca palabras clave (sin IA), los
  emparejamientos y sus fuerzas vienen fijados en `src/data/connections.ts` y el "envío" de
  respuestas a las redes es solo visual: no hay ninguna llamada a APIs ni publicación real.
- **Datos:** `src/data/places.ts` y `src/data/connections.ts` contienen **datos ficticios** de
  demostración. Ver el aviso al inicio de cada archivo. Son los únicos archivos que cambian al
  conectar datos reales.
- **Logos:** viven en `public/logos/` y son mapas de bits sin posibilidad de recolorear. Se muestran
  dentro de un marco común porque el de X es un disco negro que, suelto, se pierde sobre el fondo
  oscuro. `src/data/platforms.ts` es el único punto que conoce sus rutas.
- **Zoom:** a zoom 8 (vista inicial) los puntos de una misma ciudad se solapan; se separan al volar
  a la ciudad (zoom 12). No hay un zoom único que muestre las cuatro ciudades y a la vez separe los
  puntos dentro de cada una.
