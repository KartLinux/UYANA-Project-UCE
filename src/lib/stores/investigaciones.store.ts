import { writable, derived } from 'svelte/store';
import { InvestigacionService } from '../services/supabase.service';
import type { Investigacion } from '../types/investigaciones.types';

// Estado inicial de la tienda
interface InvestigacionesState {
    investigaciones: Investigacion[];
    investigacionActual: Investigacion | null;
    cargando: boolean;
    error: string | null;
    filtros: Partial<Investigacion>;
}

const estadoInicial: InvestigacionesState = {
    investigaciones: [],
    investigacionActual: null,
    cargando: false,
    error: null,
    filtros: {}
};

// Crear la tienda
function crearTiendaInvestigaciones() {
    const { subscribe, set, update } = writable<InvestigacionesState>(estadoInicial);

    return {
        subscribe,

        // Cargar todas las investigaciones
        cargarInvestigaciones: async () => {
            update(state => ({ ...state, cargando: true, error: null }));
            try {
                const investigaciones = await InvestigacionService.getInvestigaciones();
                update(state => ({
                    ...state,
                    investigaciones,
                    cargando: false
                }));
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
            }
        },

        // Cargar una investigación específica por ID
        cargarInvestigacion: async (id: string) => {
            update(state => ({ ...state, cargando: true, error: null }));
            try {
                const investigacion = await InvestigacionService.getInvestigacionById(id);
                update(state => ({
                    ...state,
                    investigacionActual: investigacion,
                    cargando: false
                }));
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
            }
        },

        // Crear una nueva investigación
        crearInvestigacion: async (investigacion: Omit<Investigacion, 'id' | 'created_at' | 'updated_at'>) => {
            update(state => ({ ...state, cargando: true, error: null }));
            try {
                const nuevaInvestigacion = await InvestigacionService.crearInvestigacion(investigacion);
                update(state => ({
                    ...state,
                    investigaciones: [...state.investigaciones, nuevaInvestigacion],
                    investigacionActual: nuevaInvestigacion,
                    cargando: false
                }));
                return nuevaInvestigacion;
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
                throw error;
            }
        },

        // Actualizar una investigación existente
        actualizarInvestigacion: async (id: string, investigacion: Partial<Investigacion>) => {
            update(state => ({ ...state, cargando: true, error: null }));
            try {
                const investigacionActualizada = await InvestigacionService.actualizarInvestigacion(id, investigacion);
                update(state => ({
                    ...state,
                    investigaciones: state.investigaciones.map(item =>
                        item.id === id ? investigacionActualizada : item
                    ),
                    investigacionActual: state.investigacionActual?.id === id
                        ? investigacionActualizada
                        : state.investigacionActual,
                    cargando: false
                }));
                return investigacionActualizada;
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
                throw error;
            }
        },

        // Eliminar una investigación
        eliminarInvestigacion: async (id: string) => {
            update(state => ({ ...state, cargando: true, error: null }));
            try {
                await InvestigacionService.eliminarInvestigacion(id);
                update(state => ({
                    ...state,
                    investigaciones: state.investigaciones.filter(item => item.id !== id),
                    investigacionActual: state.investigacionActual?.id === id ? null : state.investigacionActual,
                    cargando: false
                }));
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
                throw error;
            }
        },

        // Aplicar filtros a las investigaciones
        filtrarInvestigaciones: async (filtros: Partial<Investigacion>) => {
            update(state => ({ ...state, cargando: true, error: null, filtros }));
            try {
                const investigaciones = await InvestigacionService.filtrarInvestigaciones(filtros);
                update(state => ({
                    ...state,
                    investigaciones,
                    cargando: false
                }));
            } catch (error) {
                update(state => ({
                    ...state,
                    cargando: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                }));
            }
        },

        // Limpiar filtros
        limpiarFiltros: async () => {
            update(state => ({ ...state, filtros: {} }));
            const investigaciones = await InvestigacionService.getInvestigaciones();
            update(state => ({
                ...state,
                investigaciones
            }));
        },

        // Limpiar la investigación actual
        limpiarInvestigacionActual: () => {
            update(state => ({ ...state, investigacionActual: null }));
        },

        // Resetear el estado
        reset: () => set(estadoInicial)
    };
}

// Crear la instancia de la tienda
export const investigacionesStore = crearTiendaInvestigaciones();

// Stores derivados para acceder fácilmente a partes específicas del estado
export const investigaciones = derived(
    investigacionesStore,
    $store => $store.investigaciones
);

export const investigacionActual = derived(
    investigacionesStore,
    $store => $store.investigacionActual
);

export const cargandoInvestigaciones = derived(
    investigacionesStore,
    $store => $store.cargando
);

export const errorInvestigaciones = derived(
    investigacionesStore,
    $store => $store.error
);

export const filtrosInvestigaciones = derived(
    investigacionesStore,
    $store => $store.filtros
);