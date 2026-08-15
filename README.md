# Ayuda Agente

Interfaz de mapa oscura construida con React 19, Vite, TypeScript, Tailwind CSS v4 y react-leaflet.

El mapa es el escenario principal de la aplicación. Al hacer clic en una ubicación se abre un panel
lateral superpuesto con su detalle.

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
├── App.tsx                  Raíz de composición: mantiene la ubicación seleccionada
├── components/
│   ├── AppHeader.tsx        Barra superior
│   ├── MapStage.tsx         MapContainer + capa de teselas + marcadores
│   ├── PlaceMarker.tsx      Una ubicación → un marcador de Leaflet
│   └── SidePanel.tsx        Panel lateral superpuesto
├── data/places.ts           Datos de ejemplo (reemplazar por datos reales)
├── lib/utils.ts             cn()
├── styles/index.css         Tokens del tema, CSS de Leaflet y ajustes para modo oscuro
└── types/place.ts           Tipo Place
```

`MapStage` reporta qué ubicación se seleccionó pero no la almacena; `SidePanel` no conoce Leaflet.
`App` es lo único que conoce a ambos.

## Notas

- **Tema:** variante oscura del design system de Fail Fast. Los tokens viven en un único bloque
  `@theme` en `src/styles/index.css`.
- **Teselas:** CARTO `dark_all`, sin API key. La atribución de OpenStreetMap y CARTO es obligatoria.
- **Marcadores:** se usa `divIcon` en lugar del icono por defecto de Leaflet, cuyos PNG no se
  resuelven bajo Vite.
- **Datos:** `src/data/places.ts` contiene ubicaciones de ejemplo en Bogotá. Es el único archivo que
  cambia al conectar datos reales.
