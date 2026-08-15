import { useEffect } from 'react'

const SONG_URL = '/song.m4a'

/**
 * Reproduce la canción de fondo al abrir la web.
 *
 * Los navegadores bloquean el audio con sonido hasta la primera interacción
 * del usuario (política de autoplay). Intentamos reproducir de inmediato;
 * si el navegador lo rechaza, arrancamos en el primer click, tecla o toque.
 */
export function useBackgroundMusic() {
    useEffect(() => {
        const audio = new Audio(SONG_URL)
        audio.preload = 'auto'

        const startOnInteraction = () => {
            removeListeners()
            void audio.play()
        }

        function removeListeners() {
            window.removeEventListener('pointerdown', startOnInteraction)
            window.removeEventListener('keydown', startOnInteraction)
        }

        audio.play().catch(() => {
            window.addEventListener('pointerdown', startOnInteraction)
            window.addEventListener('keydown', startOnInteraction)
        })

        return () => {
            removeListeners()
            audio.pause()
            audio.src = ''
        }
    }, [])
}
