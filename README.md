# Ayuda Agente

Interfaz de mapa oscura construida con React 19, Vite, TypeScript, Tailwind CSS v4 y react-leaflet.

Todo lo que se ve sale del backend: una sola llamada a `GET /api/events/<id>/graph/` trae los actores
de la emergencia, sus necesidades u ofertas abiertas y los emparejamientos entre ellos.

La cabecera lleva el **selector de emergencia** —el ámbito de todo lo demás— y, a su derecha, el de
ubicaciones. Expone dos pestañas. **Mapa** es el escenario principal: al hacer clic en un punto se
abre un panel lateral superpuesto con lo que ese actor pide u ofrece, cómo contactarle y las
publicaciones de donde salió cada necesidad. **Conexiones** muestra el mismo conjunto como grafo
flotante, con un hilo por emparejamiento. Ambas pestañas llevan un chat en la parte inferior que
habla con el agente de coordinación; además, en Mapa vuela la cámara al punto que coincide con la
petición y en Conexiones hace zoom sobre el grafo.

### Qué endpoints se consumen

| Endpoint                    | Para qué                                      |
| --------------------------- | --------------------------------------------- |
| `GET /events/`              | el selector de emergencia                     |
| `GET /events/{id}/`         | los recuentos de la emergencia abierta        |
| `GET /events/{id}/graph/`   | el mapa y el grafo enteros                    |
| `GET /actors/{id}/`         | los contactos, al abrir un punto              |
| `GET /requirements/{id}/`   | las publicaciones, al desplegar una necesidad |
| `POST /agent/coordination/` | el chat                                       |

Quedan sin usar `observations/`, `outreach/`, `requirements/` filtrado y `resource-types/`: son las
piezas de la vista de radar, de los borradores de contacto y de los filtros, que todavía no existen.

## Comandos

```bash
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview   # sirve el build de producción
npm run lint      # oxlint
npm run format    # prettier --write .
```

Dos variables, en `.env` (ignorado por git) o `.env.local`. **Solo se exponen al navegador las que
empiezan por `VITE_`**: una llamada `X-API-Key` no llega al código y el backend responde 401.

```bash
VITE_API_BASE_URL=https://…      # origen del backend; sin ella, el túnel de src/lib/apiClient.ts
VITE_API_KEY=…                   # obligatoria: todo /api/ responde 401 sin clave
```

`VITE_API_KEY` viaja en la cabecera `X-API-Key` de cada petición, incluida la del agente. Ojo con lo
que dice `docs/api.md` del backend: lo que llega al navegador es público, así que esta debe ser una
clave de solo lectura y revocable. Esconderla de verdad exige un servidor propio que haga de proxy,
y este frontend no lo tiene.

## Estructura

```
src/
├── App.tsx                    Raíz de composición: carga el grafo y reparte pestaña, ciudad y punto
├── components/
│   ├── AppHeader.tsx          Barra superior: pestañas + selector de emergencia + de ubicación
│   ├── ContactList.tsx        Cómo contactar a un actor, en el orden que manda el backend
│   ├── ChatBar.tsx            Barra de chat compartida por las dos pestañas (presentational)
│   ├── HelpLegend.tsx         Leyenda de colores compartida (fila de conexión solo en el grafo)
│   ├── EventMenu.tsx          Desplegable de emergencias (nombre + recuentos)
│   ├── EvidenceCard.tsx       Una publicación como evidencia de una necesidad
│   ├── LocationMenu.tsx       Desplegable de ubicaciones
│   ├── SelectMenu.tsx         El desplegable en sí, compartido por los dos menús
│   ├── MapAssistant.tsx       El chat de la pestaña Mapa (agente + vuelo al punto)
│   ├── MapFit.tsx             Encuadra todos los puntos la primera vez que llegan
│   ├── MapFocus.tsx           Vuela la cámara a la ubicación enfocada
│   ├── MapSpotlight.tsx       Vuela la cámara al punto que encontró el chat
│   ├── MapStage.tsx           MapContainer + capa de teselas + marcadores
│   ├── PlaceMarker.tsx        Un punto → un marcador de Leaflet
│   ├── RequirementCard.tsx    Una necesidad u oferta abierta dentro del panel
│   ├── SidePanel.tsx          Panel lateral superpuesto
│   └── connections/
│       ├── ConnectionsView.tsx   La vista Conexiones completa (su estado vive aquí)
│       └── ConnectionsGraph.tsx  Grafo SVG: puntos a la deriva, hilos, cámara y spotlight
├── data/
│   ├── graphView.ts           Constantes de encuadre: centro, zooms y viewBox del grafo
│   ├── labels.ts              Slug del backend → texto en español (amenazas, contactos, fechas)
│   └── platforms.ts           Red social → etiqueta y logo
├── lib/
│   ├── apiClient.ts           Cliente Axios base — único punto que conoce la URL de la API
│   ├── agentApi.ts            El protocolo del agente: un POST leído como flujo de eventos (SSE)
│   ├── eventGraph.ts          Del payload del backend a puntos, conexiones, ciudades y posiciones
│   ├── useEvents.ts           Las emergencias activas y cuál se está mirando
│   ├── useEventGraph.ts       Carga el grafo de la emergencia seleccionada
│   ├── useGraphViewport.ts    La cámara del grafo: arrastrar, acercar, encuadrar
│   ├── useResource.ts         Un detalle que se pide al abrirlo (contactos, publicaciones)
│   ├── useAgentChat.ts        La conversación: burbujas, borrador, hilo y turno en curso
│   ├── useBackgroundMusic.ts  Hook de la música de fondo
│   └── utils.ts               cn()
├── styles/index.css           Tokens del tema, CSS de Leaflet y ajustes para modo oscuro
└── types/
    ├── graph.ts               El payload del backend, tal cual
    ├── place.ts               Place, PlaceRequirement, City
    └── connection.ts          Connection, GraphPoint, ChatMessage
```

`src/types/graph.ts` es el contrato con el backend y `src/lib/eventGraph.ts` la única frontera que lo
traduce: los componentes solo conocen `Place`, `Connection` y `City`, y no saben que existe una API.

`MapStage` reporta qué punto se seleccionó pero no lo almacena; `SidePanel` no conoce Leaflet. `App`
es lo único que conoce a ambos, y también el único que carga datos.

## Notas

- **Tema:** variante oscura del design system de Fail Fast. Los tokens viven en un único bloque
  `@theme` en `src/styles/index.css`.
- **Teselas:** CARTO `dark_all`, sin API key. La atribución de OpenStreetMap y CARTO es obligatoria.
- **Marcadores:** se usa `divIcon` en lugar del icono por defecto de Leaflet, cuyos PNG no se
  resuelven bajo Vite.
- **Pestañas:** la capa del mapa queda siempre montada y se oculta con `visibility` (nunca
  `display: none`): Leaflet mide su contenedor al montar y perdería la cámara. Conexiones, en cambio,
  se monta al activarse: su animación de entrada se repite y su estado arranca de cero.
- **Cambiar de emergencia** recarga el grafo y reinicia lo que había en pantalla: ubicación
  enfocada, punto abierto y las dos conversaciones. Lo último no es cosmética — un `thread_id`
  pertenece al agente construido para un evento, y arrastrarlo al siguiente mezclaría contextos.
- **Detalles a demanda:** los contactos se piden al abrir un punto y las publicaciones al desplegar
  una necesidad. Con doscientos actores, traerlo todo por adelantado sería una carga que nadie mira
  entera. Los contactos se pintan en el orden que manda el backend (`preference_rank`) y con su
  `times_seen`: un teléfono repetido en cinco publicaciones y otro visto una vez no merecen la misma
  confianza. Las cuentas de pago y las direcciones se enseñan como dato, nunca como acción.
- **Chat:** cada pestaña mantiene su propia conversación con `POST /api/agent/coordination/`. La
  respuesta llega en streaming (SSE) y se va escribiendo token a token; mientras tanto se enseña qué
  herramienta está usando el agente. El `thread_id` que devuelve el servidor se reenvía en los turnos
  siguientes, y solo se permite un turno a la vez por conversación.
- **Encuadre guiado:** el agente contesta en prosa y nunca devuelve el id de un punto, así que a
  dónde volar lo decide `findPlaceForText` sobre el texto del usuario: primero por recurso, ubicación
  o nombre del actor, y si nada encaja, por las palabras del reporte original. Ante un empate gana
  quien necesita ayuda.
- **Qué se pinta y qué no:** un actor no aparece si no trae coordenadas, si su ubicación es más
  gruesa que `admin_2` (un centroide de departamento como marcador afirma un sitio que nadie
  reportó) o si no tiene nada abierto (no hay color que asignarle sin decir algo que no dijo). Un
  hilo con un extremo fuera se descarta con él.
- **Simplificación conocida:** una arista con `via_transport_actor` se dibuja recta entre oferta y
  necesidad; el transportista que haría la entrega no se ve en el hilo.
- **Grafo:** las posiciones de reposo son la geografía real proyectada sobre el viewBox, así que los
  cúmulos del grafo son los del mapa. Los actores de un mismo barrio caerían en el mismo píxel, por
  lo que se reparten en corrillo alrededor de su posición. Los puntos no llevan etiqueta: los
  nombres reales son largos y se pisan entre sí, y acercarse no lo arregla porque el zoom agranda
  por igual el texto y la distancia; el nombre está en el panel y en el `aria-label` del punto.
- **Recorrer el grafo:** el viewBox es el encuadre de partida, no el borde del mundo. `useGraphViewport`
  arrastra y acerca sin topes —ratón, dedo, pellizco, rueda, botones y teclado (flechas, `+`, `−`,
  `0` para ver todo)— así que la red se explora entera. Un arrastre nunca selecciona ni despeja: la
  selección la decide el par pointerdown/pointerup, y no el `click`, porque con el puntero capturado
  el navegador reetiqueta el `click` al SVG y el manejador del punto no llegaría a ejecutarse. El
  vuelo guiado del chat sigue existiendo, pero apagarlo ya no devuelve la cámara a su sitio: el
  recorrido es del usuario. La malla de fondo viaja con el grafo — sin una referencia fija detrás,
  arrastrar una zona vacía no se vería.
- **Nada se envía:** la interfaz no publica ni contacta a nadie. Contactar pasa por el agente, que
  redacta un borrador con enlace para que una persona lo abra.
