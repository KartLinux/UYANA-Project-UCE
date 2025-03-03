import { supabase } from '../config/supabase.config';
import type { AluvionRaw } from '../types/aluvion.types';

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