import { writable, derived } from 'svelte/store';
import type { AluvionProcesado } from '../types/aluvion.types';
import { AluvionService } from '../services/supabase.service';
import { mapearAluvion } from '../types/aluvion.types';

function createAluvionStore() {
    const { subscribe, set, update } = writable<{
        aluviones: AluvionProcesado[];
        selectedYear: string | null;
        loading: boolean;
        error: string | null;
    }>({
        aluviones: [],
        selectedYear: null,
        loading: false,
        error: null
    });

    const filteredAluviones = derived({ subscribe }, ($store) => {
        return $store.selectedYear
            ? $store.aluviones.filter(a => a.anio === $store.selectedYear)
            : $store.aluviones;
    });

    const years = derived({ subscribe }, ($store) => {
        const uniqueYears = [...new Set($store.aluviones.map(a => a.anio))];
        return uniqueYears.filter(Boolean).sort().reverse();
    });

    return {
        subscribe,
        filteredAluviones,
        years,
        setYear: (year: string | null) => {
            update(state => ({ ...state, selectedYear: year }));
        },
        loadAluviones: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const dataRaw = await AluvionService.getAluviones();
                const dataProcesada = dataRaw.map(mapearAluvion);
                update(state => ({
                    ...state,
                    aluviones: dataProcesada,
                    error: null
                }));
            } catch (error) {
                update(state => ({
                    ...state,
                    error: 'Error al cargar los aluviones'
                }));
            } finally {
                update(state => ({ ...state, loading: false }));
            }
        }
    };
}

export const aluvionStore = createAluvionStore();