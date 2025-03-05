export interface Investigacion {
    id?: string;                              // ID único de la investigación (generado por Supabase)
    universidad: string;                      // Nombre de la universidad
    facultad: string;                         // Nombre de la facultad
    carrera: string;                          // Nombre de la carrera
    materia: string;                          // Nombre de la materia
    docente: string;                          // Nombre del docente responsable
    correo_institucional_docente: string;     // Correo institucional del docente
    tipo_de_investigacion: string;            // Tipo de investigación (Ej: Aplicada, Básica, etc.)
    titulo_de_la_investigacion: string;       // Título de la investigación
    colaboradores: string;                    // Lista de colaboradores como texto
    correo_institucional_colaboradores: string; // Correos institucionales de colaboradores
    fecha_de_inicio: string;                  // Fecha de inicio del proyecto
    longitud: number;                         // Coordenada de longitud
    latitud: number;                          // Coordenada de latitud
    pais: string;                             // País donde se realiza la investigación
    ciudad: string;                           // Ciudad donde se realiza la investigación
    estado_proyecto: string;                  // Estado del proyecto (Ej: Completado, En proceso, etc.)
    presupuesto_asignado: number;             // Presupuesto asignado al proyecto
    financiamiento_externo: boolean;          // Indica si tiene financiamiento externo
    fuente_financiamiento: string;            // Fuente del financiamiento
    impacto_social_esperado: string;          // Impacto social esperado (Ej: Alto, Medio, Bajo)
    resumen_de_la_investigacion: string;      // Resumen descriptivo de la investigación
    area_tematica: string;                    // Área temática de la investigación
    fecha_finalizacion: string;               // Fecha de finalización del proyecto
    colaboracion_internacional: boolean;      // Indica si hay colaboración internacional
    enlace_publicacion: string;               // Enlace a la publicación o resultados
    created_at?: string;                      // Fecha de creación del registro (manejado por Supabase)
    updated_at?: string;                      // Fecha de actualización del registro (manejado por Supabase)
}

// Tipos de estado del proyecto
export type EstadoProyecto = 'Completado' | 'En proceso' | 'Planificado' | 'Suspendido' | 'Cancelado';

// Tipos de impacto social esperado
export type ImpactoSocial = 'Alto' | 'Medio' | 'Bajo';

// Tipos de investigación
export type TipoInvestigacion = 'Básica' | 'Aplicada' | 'Desarrollo experimental' | 'Innovación';