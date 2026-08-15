import type { LatLngTuple } from 'leaflet'
import type { City, Place } from '@/types/place'

/* ==========================================================================
   DATOS FICTICIOS — SOLO PARA DEMOSTRACIÓN

   Nada de este archivo es real. Los reportes, las publicaciones, las cuentas
   y las horas están inventados para poblar la interfaz.

   Los barrios, las ciudades y las coordenadas SÍ corresponden a lugares
   reales de Risaralda, Chocó, Quindío y Valle del Cauca, pero NINGUNA de las
   emergencias descritas aquí ocurrió. No publicar capturas de esta demo sin
   el aviso de contenido ficticio, y no usar en producción sin reemplazar todo
   por datos verificados.

   Convención de cuentas: los handles de Instagram, X y TikTok terminan en
   `_demo` y las páginas de Facebook llevan el sufijo `(demo)`. Ninguna existe.

   Cada punto tiene un `kind`: 'needed' (rojo, necesita ayuda) u 'offered'
   (verde, la ofrece). Cinco y cinco a propósito, repartidos entre las cuatro
   ciudades, para que el mapa muestre ambos colores desde el primer vistazo.
   ========================================================================== */

/** Encuadre inicial: muestra las cuatro ciudades a la vez. */
export const MAP_CENTER: LatLngTuple = [4.57, -76.17]
export const MAP_ZOOM = 8

/**
 * Zoom al enfocar una ciudad desde el menú del header.
 *
 * A zoom 8 la resolución es ~609 m/px, así que los puntos de una misma ciudad
 * se solapan en la vista inicial y se leen como una mancha de actividad. A
 * zoom 12 (~38 m/px) quedan claramente separados. No hay un zoom único que
 * cumpla las dos cosas: las ciudades están a ~250 km entre sí.
 */
export const CITY_ZOOM = 12

/** Alimenta el menú del header. Exactamente estas cuatro, en este orden. */
export const CITIES: City[] = [
    { id: 'pereira', name: 'Pereira', department: 'Risaralda', position: [4.8143, -75.6946] },
    { id: 'quibdo', name: 'Quibdó', department: 'Chocó', position: [5.6947, -76.6611] },
    { id: 'armenia', name: 'Armenia', department: 'Quindío', position: [4.5342, -75.6811] },
    { id: 'cali', name: 'Cali', department: 'Valle del Cauca', position: [3.4516, -76.532] }
]

export const PLACES: Place[] = [
    {
        id: 'pereira-cuba',
        name: 'Barrio Cuba',
        city: 'Pereira',
        title: 'Quebrada desbordada en Barrio Cuba',
        description:
            'Tres cuadras sobre la vía principal quedaron bajo el agua tras el aguacero de la madrugada. Los vecinos reportan viviendas anegadas y piden colchonetas, agua potable y ayuda para sacar enseres.',
        kind: 'needed',
        position: [4.7938, -75.7207],
        posts: [
            {
                id: 'pereira-cuba-1',
                platform: 'instagram',
                author: '@vecinos_cuba_demo',
                postedAt: 'hace 40 min',
                content:
                    'El agua ya entró a las casas de la carrera 24. Necesitamos ayuda para sacar a los adultos mayores.'
            },
            {
                id: 'pereira-cuba-2',
                platform: 'x',
                author: '@reporta_pereira_demo',
                postedAt: 'hace 1 h',
                content:
                    'Vía principal de Cuba cerrada por inundación. Eviten la zona y reporten familias afectadas en este hilo.'
            },
            {
                id: 'pereira-cuba-3',
                platform: 'facebook',
                author: 'Junta de Acción Comunal Cuba (demo)',
                postedAt: 'hace 2 h',
                content:
                    'Estamos recibiendo colchonetas y agua en el salón comunal. Se necesitan voluntarios con botas y palas.'
            }
        ]
    },
    {
        id: 'pereira-villa-santana',
        name: 'Villa Santana',
        city: 'Pereira',
        title: 'Deslizamiento en la vía a Villa Santana',
        description:
            'Un talud cedió sobre la vía de acceso y dejó incomunicados a varios sectores del barrio. No hay heridos reportados, pero sí familias que no pueden salir ni recibir suministros.',
        kind: 'needed',
        position: [4.8137, -75.6612],
        posts: [
            {
                id: 'pereira-villa-santana-1',
                platform: 'x',
                author: '@reporta_pereira_demo',
                postedAt: 'hace 25 min',
                content:
                    'Derrumbe sobre la vía a Villa Santana. Maquinaria en camino, pero el paso sigue cerrado en ambos sentidos.'
            },
            {
                id: 'pereira-villa-santana-2',
                platform: 'facebook',
                author: 'Villa Santana Informa (demo)',
                postedAt: 'hace 1 h',
                content:
                    'Familias del sector alto llevan toda la mañana sin poder bajar. Si alguien puede subir mercados a pie, escribir por interno.'
            },
            {
                id: 'pereira-villa-santana-3',
                platform: 'instagram',
                author: '@brigada_risaralda_demo',
                postedAt: 'hace 3 h',
                content:
                    'Estamos censando las viviendas en riesgo de la ladera. Por ahora ninguna evacuación obligatoria.'
            }
        ]
    },
    {
        id: 'pereira-san-nicolas',
        name: 'Barrio San Nicolás',
        city: 'Pereira',
        title: 'San Nicolás ofrece carrotanque y voluntarios',
        description:
            'La Junta de Acción Comunal habilitó el salón comunal como centro de acopio. Tienen un carrotanque propio con agua sobrante y un grupo de voluntarios disponible para apoyar a otros barrios de Pereira.',
        kind: 'offered',
        position: [4.8352, -75.7011],
        posts: [
            {
                id: 'pereira-san-nicolas-1',
                platform: 'x',
                author: '@mesa_barrial_pereira_demo',
                postedAt: 'hace 2 h',
                content:
                    'San Nicolás tiene un carrotanque con agua de sobra. Si algún barrio la necesita, escriban por acá y coordinamos.'
            },
            {
                id: 'pereira-san-nicolas-2',
                platform: 'instagram',
                author: '@mesa_barrial_pereira_demo',
                postedAt: 'hace 5 h',
                content:
                    'Doce voluntarios listos para apoyar donde haga falta: cargar mercados, hacer censos o repartir agua.'
            },
            {
                id: 'pereira-san-nicolas-3',
                platform: 'tiktok',
                author: '@sannicolas_ayuda_demo',
                postedAt: 'hace 6 h',
                content:
                    'Así quedó el salón comunal convertido en centro de acopio. Abierto todos los días de 8 a.m. a 6 p.m.'
            }
        ]
    },
    {
        id: 'quibdo-yesquita',
        name: 'La Yesquita',
        city: 'Quibdó',
        title: 'Creciente del Atrato afecta La Yesquita',
        description:
            'El río subió durante la noche e inundó las viviendas más cercanas a la orilla. Los vecinos piden apoyo para reubicar temporalmente a unas veinte familias.',
        kind: 'needed',
        position: [5.681, -76.664],
        posts: [
            {
                id: 'quibdo-yesquita-1',
                platform: 'instagram',
                author: '@atrato_vive_demo',
                postedAt: 'hace 1 h',
                content:
                    'El agua llegó hasta la mitad de las casas de la orilla. Las familias están subiendo lo que pueden a los techos.'
            },
            {
                id: 'quibdo-yesquita-2',
                platform: 'facebook',
                author: 'Consejo Comunitario La Yesquita (demo)',
                postedAt: 'hace 2 h',
                content:
                    'Habilitamos la escuela como albergue temporal. Faltan cobijas, agua potable y alimentos no perecederos.'
            },
            {
                id: 'quibdo-yesquita-3',
                platform: 'x',
                author: '@choco_reporta_demo',
                postedAt: 'hace 4 h',
                content:
                    'Nivel del Atrato en aumento sostenido. Los barrios ribereños de Quibdó son los primeros afectados.'
            },
            {
                id: 'quibdo-yesquita-4',
                platform: 'instagram',
                author: '@juventud_quibdo_demo',
                postedAt: 'hace 6 h',
                content:
                    'Buscamos lanchas para mover familias del sector bajo. Cualquier apoyo suma, escríbannos por acá.'
            }
        ]
    },
    {
        id: 'quibdo-nino-jesus',
        name: 'Barrio Niño Jesús',
        city: 'Quibdó',
        title: 'Niño Jesús ofrece tejas y cuadrilla de trabajo',
        description:
            'Tras reparar sus propias viviendas después del vendaval, los vecinos de Niño Jesús juntaron material sobrante y organizaron una cuadrilla para ayudar a asegurar techos en otros barrios de Quibdó.',
        kind: 'offered',
        position: [5.7075, -76.6555],
        posts: [
            {
                id: 'quibdo-nino-jesus-1',
                platform: 'facebook',
                author: 'Barrio Niño Jesús Unido (demo)',
                postedAt: 'hace 3 h',
                content:
                    'Nos sobraron tejas y plásticos gruesos de la reparación del barrio. Los ofrecemos a quien los necesite.'
            },
            {
                id: 'quibdo-nino-jesus-2',
                platform: 'x',
                author: '@choco_reporta_demo',
                postedAt: 'hace 5 h',
                content:
                    'La cuadrilla de Niño Jesús se ofrece para asegurar techos en otros sectores afectados por el vendaval.'
            },
            {
                id: 'quibdo-nino-jesus-3',
                platform: 'instagram',
                author: '@atrato_vive_demo',
                postedAt: 'hace 7 h',
                content:
                    'Ocho hombres con herramienta propia, disponibles todo el fin de semana. Coordinan por este medio.'
            }
        ]
    },
    {
        id: 'armenia-puerto-espejo',
        name: 'Puerto Espejo',
        city: 'Armenia',
        title: 'Familias damnificadas por incendio en Puerto Espejo',
        description:
            'Un incendio consumió cuatro viviendas contiguas en la madrugada. Las familias están albergadas donde vecinos y necesitan ropa, enseres básicos y apoyo psicosocial.',
        kind: 'needed',
        position: [4.5175, -75.665],
        posts: [
            {
                id: 'armenia-puerto-espejo-1',
                platform: 'instagram',
                author: '@puerto_espejo_demo',
                postedAt: 'hace 50 min',
                content:
                    'Cuatro casas quemadas esta madrugada. Las familias perdieron todo, están donde los vecinos por ahora.'
            },
            {
                id: 'armenia-puerto-espejo-2',
                platform: 'x',
                author: '@quindio_alerta_demo',
                postedAt: 'hace 2 h',
                content:
                    'Incendio estructural controlado en Puerto Espejo, Armenia. Sin víctimas fatales reportadas.'
            },
            {
                id: 'armenia-puerto-espejo-3',
                platform: 'facebook',
                author: 'Red de Apoyo Armenia (demo)',
                postedAt: 'hace 4 h',
                content:
                    'Abrimos punto de acopio para las familias de Puerto Espejo: ropa de niño, cobijas y elementos de aseo.'
            }
        ]
    },
    {
        id: 'armenia-la-adiela',
        name: 'La Adiela',
        city: 'Armenia',
        title: 'Plomeros voluntarios de La Adiela ofrecen apoyo',
        description:
            'Tras resolver un colapso de alcantarillado propio, un grupo de vecinos con experiencia en plomería se ofrece para apoyar destapes y reparaciones de emergencia en otros barrios de Armenia.',
        kind: 'offered',
        position: [4.551, -75.6905],
        posts: [
            {
                id: 'armenia-la-adiela-1',
                platform: 'x',
                author: '@quindio_alerta_demo',
                postedAt: 'hace 3 h',
                content:
                    'Los plomeros de La Adiela ya resolvieron el colapso del barrio y se ofrecen para otros sectores.'
            },
            {
                id: 'armenia-la-adiela-2',
                platform: 'facebook',
                author: 'La Adiela Comunidad (demo)',
                postedAt: 'hace 6 h',
                content:
                    'Tenemos varilla, guantes y las manos disponibles el sábado. Si otro barrio necesita destape, avisen.'
            }
        ]
    },
    {
        id: 'cali-siloe',
        name: 'Siloé, Comuna 20',
        city: 'Cali',
        title: 'Deslizamiento en la parte alta de Siloé',
        description:
            'Parte de la ladera cedió sobre un pasaje peatonal y dejó tres viviendas en riesgo. Se necesita evaluación técnica y apoyo para reubicar a las familias mientras se estabiliza el terreno.',
        kind: 'needed',
        position: [3.4285, -76.5555],
        posts: [
            {
                id: 'cali-siloe-1',
                platform: 'instagram',
                author: '@siloe_resiste_demo',
                postedAt: 'hace 30 min',
                content:
                    'Se vino parte de la loma sobre el pasaje. Tres casas quedaron con la pared de atrás comprometida.'
            },
            {
                id: 'cali-siloe-2',
                platform: 'x',
                author: '@cali_reporta_demo',
                postedAt: 'hace 1 h',
                content:
                    'Deslizamiento en la parte alta de Siloé. Piden evaluación técnica urgente para tres viviendas.'
            },
            {
                id: 'cali-siloe-3',
                platform: 'facebook',
                author: 'Comuna 20 Informa (demo)',
                postedAt: 'hace 3 h',
                content:
                    'Las familias pasaron la noche donde familiares. Necesitamos saber si pueden volver o no a sus casas.'
            },
            {
                id: 'cali-siloe-4',
                platform: 'x',
                author: '@ladera_segura_demo',
                postedAt: 'hace 5 h',
                content:
                    'Con las lluvias de esta semana toda la ladera está saturada. No es el primer punto que cede.'
            }
        ]
    },
    {
        id: 'cali-el-vallado',
        name: 'El Vallado, Comuna 15',
        city: 'Cali',
        title: 'El Vallado ofrece agua embotellada sobrante',
        description:
            'Una donación grande dejó a la comunidad de El Vallado con un excedente de agua embotellada. La Junta de Acción Comunal la ofrece a otros barrios de Cali con desabastecimiento.',
        kind: 'offered',
        position: [3.4085, -76.489],
        posts: [
            {
                id: 'cali-el-vallado-1',
                platform: 'x',
                author: '@vallado_unido_demo',
                postedAt: 'hace 2 h',
                content:
                    'Nos llegó una donación más grande de la que necesitábamos. Ofrecemos el excedente de agua a quien la necesite.'
            },
            {
                id: 'cali-el-vallado-2',
                platform: 'instagram',
                author: '@vallado_unido_demo',
                postedAt: 'hace 4 h',
                content:
                    'Más de cien botellones disponibles en el salón comunal. Coordinen la recogida por este medio.'
            },
            {
                id: 'cali-el-vallado-3',
                platform: 'facebook',
                author: 'Comuna 15 Comunidad (demo)',
                postedAt: 'hace 8 h',
                content:
                    'Priorizamos colegios y centros de salud de otros sectores, pero hay para todo el que la necesite.'
            }
        ]
    },
    {
        id: 'cali-terron-colorado',
        name: 'Terrón Colorado, Comuna 1',
        city: 'Cali',
        title: 'Cuadrilla de Terrón Colorado ofrece apoyo vial',
        description:
            'Tras despejar su propia vía de un derrumbe, un grupo de vecinos con maquinaria liviana y palas se ofrece para ayudar a limpiar vías afectadas en otros sectores de la comuna.',
        kind: 'offered',
        position: [3.47, -76.557],
        posts: [
            {
                id: 'cali-terron-colorado-1',
                platform: 'facebook',
                author: 'Terrón Colorado Vive (demo)',
                postedAt: 'hace 1 h',
                content:
                    'Ya despejamos nuestro tramo. Tenemos palas y una minicargadora prestada disponibles para otro barrio.'
            },
            {
                id: 'cali-terron-colorado-2',
                platform: 'instagram',
                author: '@ladera_segura_demo',
                postedAt: 'hace 3 h',
                content:
                    'La cuadrilla de Terrón Colorado se ofrece para apoyar despejes viales en otros sectores de la comuna.'
            },
            {
                id: 'cali-terron-colorado-3',
                platform: 'tiktok',
                author: '@terroncolorado_demo',
                postedAt: 'hace 4 h',
                content:
                    'Así trabajó la cuadrilla para despejar la vía esta mañana. Disponibles el resto de la semana.'
            }
        ]
    }
]
