import { supabase } from '../config/supabase.config';
import type { AluvionRaw } from '../types/aluvion.types';
import type { Investigacion } from '../types/investigaciones.types';

export class AluvionService {
  private static readonly TABLE_NAME = 'aluviones_2010_2023';

  public static async getAluviones(): Promise<AluvionRaw[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*');

      if (error) {
        console.error('Error al obtener datos:', error);
        throw new Error('Error al cargar los aluviones');
      }

      return data || [];
    } catch (error) {
      console.error('Error en el servicio:', error);
      throw error;
    }
  }
}

export class InvestigacionService {
  private static readonly TABLE_NAME = 'investigaciones';

  public static async getInvestigaciones(): Promise<Investigacion[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*');

      if (error) {
        console.error('Error al obtener investigaciones:', error);
        throw new Error('Error al cargar las investigaciones');
      }

      return data || [];
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }

  public static async getInvestigacionById(id: string): Promise<Investigacion | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al obtener investigación:', error);
        throw new Error('Error al cargar la investigación');
      }

      return data;
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }

  public static async crearInvestigacion(investigacion: Omit<Investigacion, 'id' | 'created_at' | 'updated_at'>): Promise<Investigacion> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(investigacion)
        .select()
        .single();

      if (error) {
        console.error('Error al crear investigación:', error);
        throw new Error('Error al crear la investigación');
      }

      return data;
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }

  public static async actualizarInvestigacion(id: string, investigacion: Partial<Investigacion>): Promise<Investigacion> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(investigacion)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar investigación:', error);
        throw new Error('Error al actualizar la investigación');
      }

      return data;
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }

  public static async eliminarInvestigacion(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar investigación:', error);
        throw new Error('Error al eliminar la investigación');
      }
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }

  public static async filtrarInvestigaciones(filtros: Partial<Investigacion>): Promise<Investigacion[]> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*');

      // Aplicar filtros dinámicamente
      Object.entries(filtros).forEach(([campo, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') {
          query = query.eq(campo, valor);
        }
      });

      const { data, error } = await query;

      if (error) {
        console.error('Error al filtrar investigaciones:', error);
        throw new Error('Error al filtrar las investigaciones');
      }

      return data || [];
    } catch (error) {
      console.error('Error en el servicio de investigaciones:', error);
      throw error;
    }
  }
}