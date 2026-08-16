import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Pantalla completa con el vídeo en bucle infinito y la canción sonando
 * encima, también en bucle. Cada uno con su propia duración: el vídeo dura
 * 6 s y la canción 12 s, así que se desfasan a propósito, sin sincronizar.
 *
 * El vídeo va mudo siempre y el sonido de la página es la canción: dejar las
 * dos pistas sonando a la vez sería ruido, no música.
 */
export function VideoLoop() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [playing, setPlaying] = useState(false)

    /**
     * Los navegadores bloquean el audio con sonido hasta la primera
     * interacción del usuario (política de autoplay). Intentamos arrancar de
     * inmediato; si el navegador lo rechaza, la canción entra en el primer
     * clic o tecla que ocurra en la página.
     */
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const startOnInteraction = (event: Event) => {
            // Sobre el botón de sonido manda el botón: si arrancáramos aquí, el
            // click que llega justo después pausaría la canción recién iniciada.
            if (event.target instanceof Element && event.target.closest('[data-sound-toggle]')) {
                return
            }
            void audio.play().catch(() => {})
        }

        const cancelAutoStart = () => {
            window.removeEventListener('pointerdown', startOnInteraction)
            window.removeEventListener('keydown', startOnInteraction)
        }

        // Los oyentes se arman antes de intentar reproducir, y es el propio
        // evento `play` quien los retira: si el navegador deja la promesa de
        // `play()` pendiente en lugar de rechazarla (pestaña en segundo plano),
        // armarlos en el `catch` los dejaría sin armar para siempre y el primer
        // clic del usuario no haría nada.
        window.addEventListener('pointerdown', startOnInteraction)
        window.addEventListener('keydown', startOnInteraction)
        audio.addEventListener('play', cancelAutoStart)
        void audio.play().catch(() => {})

        return () => {
            cancelAutoStart()
            audio.removeEventListener('play', cancelAutoStart)
        }
    }, [])

    const toggleSound = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
            void audio.play().catch(() => {})
        } else {
            audio.pause()
        }
    }, [])

    const label = playing ? 'Silenciar la canción' : 'Activar la canción'

    return (
        <div className="relative h-dvh w-full overflow-hidden bg-black">
            <video
                autoPlay
                loop
                muted
                playsInline
                // `loop` ya reinicia el vídeo, pero si el navegador corta el
                // bucle (pestaña en segundo plano, decodificador que falla)
                // este `onEnded` lo vuelve a poner en marcha desde cero.
                onEnded={(event) => {
                    const video = event.currentTarget
                    video.currentTime = 0
                    void video.play().catch(() => {})
                }}
                className="h-full w-full object-contain"
            >
                {/* El original es HEVC 4K y sólo Safari lo decodifica: en Chrome
                    y Firefox la página quedaba en negro. El navegador se queda
                    con la primera fuente que dice poder reproducir, así que
                    Safari se lleva el 4K y el resto el H.264 de 1080p. */}
                <source src="/video.mp4" type='video/mp4; codecs="hvc1"' />
                <source src="/video-h264.mp4" type='video/mp4; codecs="avc1.640028"' />
            </video>
            {/* El estado del botón sigue a la pista, no al revés: así también
                refleja las pausas que no vienen de un click (autoarranque
                aceptado, sistema que corta el audio). */}
            <audio
                ref={audioRef}
                src="/cami.WAV"
                loop
                preload="auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
            <button
                type="button"
                data-sound-toggle
                onClick={toggleSound}
                aria-pressed={playing}
                aria-label={label}
                title={label}
                className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur transition-colors duration-200 hover:bg-black/70 hover:text-white"
            >
                {playing ? (
                    <Volume2 size={16} strokeWidth={2} aria-hidden />
                ) : (
                    <VolumeX size={16} strokeWidth={2} aria-hidden />
                )}
            </button>
        </div>
    )
}
