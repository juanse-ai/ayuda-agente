import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

/**
 * Pantalla completa con el vídeo en bucle infinito.
 *
 * Arranca en silencio a propósito: los navegadores sólo dejan autoreproducir
 * un vídeo mudo, así que empezar con sonido significaría no empezar. El botón
 * de audio lo enciende con el gesto del usuario, que es lo único que la
 * política de autoplay acepta.
 */
export function VideoLoop() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [muted, setMuted] = useState(true)

    const toggleSound = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.muted = !video.muted
        setMuted(video.muted)
        // Encender el sonido es también el gesto que desbloquea la
        // reproducción si el navegador la había frenado.
        if (!video.muted) void video.play().catch(() => {})
    }, [])

    const label = muted ? 'Activar el sonido' : 'Silenciar el vídeo'

    return (
        <div className="relative h-dvh w-full overflow-hidden bg-black">
            <video
                ref={videoRef}
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
            <button
                type="button"
                onClick={toggleSound}
                aria-pressed={!muted}
                aria-label={label}
                title={label}
                className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur transition-colors duration-200 hover:bg-black/70 hover:text-white"
            >
                {muted ? (
                    <VolumeX size={16} strokeWidth={2} aria-hidden />
                ) : (
                    <Volume2 size={16} strokeWidth={2} aria-hidden />
                )}
            </button>
        </div>
    )
}
