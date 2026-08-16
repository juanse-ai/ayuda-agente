/**
 * Cliente HTTP base de la aplicación.
 *
 * Único punto que conoce el origen de la API. Todas las futuras
 * llamadas al backend deben hacerse a través de esta instancia.
 */
import axios from 'axios'

export const API_BASE_URL = 'https://api.ayudagente.help'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000
})
