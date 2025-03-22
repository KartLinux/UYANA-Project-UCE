import { writable, derived } from 'svelte/store';
import type { AluvionProcesado } from '../types/aluvion.types';
import { AluvionService } from '../services/supabase.service';
import { mapearAluvion } from '../types/aluvion.types';

function createAluvionStore() {
    const { subscribe, set, update } = writable<{
        aluviones: AluvionProcesado[];
        selectedYear: string | null;
        selectedCause: string | null; // NUEVO: Para filtrar por causa
        selectedDangerLevel: string | null; // NUEVO: Para filtrar por nivel de peligro
        loading: boolean;
        error: string | null;
    }>({
        aluviones: [],
        selectedYear: null,
        selectedCause: null, // Inicializa como null (todas las causas)
        selectedDangerLevel: null, // Inicializa como null (todos los niveles)
        loading: false,
        error: null
    });

    // Derivado para obtener años únicos
    const years = derived({ subscribe }, ($store) => {
        const uniqueYears = [...new Set($store.aluviones.map(a => a.anio))];
        return uniqueYears.filter(Boolean).sort().reverse();
    });

    // Derivado para obtener causas únicas
    const causes = derived({ subscribe }, ($store) => {
        const uniqueCauses = [...new Set($store.aluviones.map(a => a.causa).filter(Boolean))];
        return uniqueCauses.sort();
    });

    // Derivado para obtener niveles de peligro únicos
    const dangerLevels = derived({ subscribe }, ($store) => {
        const uniqueLevels = [
            ...new Set($store.aluviones.map(a => a.calificacionPeligro).filter(Boolean))
        ];
        return uniqueLevels.sort();
    });

    // Derivado para filtrar eventos según múltiples criterios
    const filteredAluviones = derived({ subscribe }, ($store) => {
        return $store.aluviones.filter((aluvion) => {
            if ($store.selectedYear && aluvion.anio !== $store.selectedYear) return false;
            if ($store.selectedCause && aluvion.causa !== $store.selectedCause) return false;
            if (
                $store.selectedDangerLevel &&
                aluvion.calificacionPeligro !== $store.selectedDangerLevel
            )
                return false;
            return true;
        });
    });

    return {
        subscribe,
        filteredAluviones,
        years,
        causes, // NUEVO: Propiedad para acceder a las causas únicas
        dangerLevels, // NUEVO: Propiedad para acceder a los niveles de peligro únicos
        setYear: (year: string | null) => {
            update(state => ({ ...state, selectedYear: year }));
        },
        setCause: (cause: string | null) => {
            // NUEVO: Función para establecer la causa seleccionada
            update(state => ({ ...state, selectedCause: cause }));
        },
        setDangerLevel: (level: string | null) => {
            // NUEVO: Función para establecer el nivel de peligro seleccionado
            update(state => ({ ...state, selectedDangerLevel: level }));
        },
        loadAluviones: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const dataRaw = await AluvionService.getAluviones();
                const dataProcesada = dataRaw.map(mapearAluvion); // Mapea los datos crudos
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