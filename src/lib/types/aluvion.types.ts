// Interfaz que coincide con los nombres de columnas originales
export interface AluvionRaw {
	ID: number;
	AÑO: string | null;
	'FECHA DEL EVENTO': string;
	PROVINCIA: string | null;
	CANTON: string | null;
	'DESCRIPCIÓN GENERAL DEL EVENTO': string | null;
	PARROQUIAS: string | null;
	'COMUNIDAD/BARRIO/SECTOR': string | null;
	LATITUD: string | null;
	LONGITUD: string | null;
	EVENTO: string | null;
	CAUSA: string | null;
	'CATEGORIA DEL EVENTO': string | null;
	'HORA DEL EVENTO': string | null;
	FALLECIDAS: string | null;
	HERIDAS: string | null;
	'PERSONAS DESAPARECIDAS': string | null;
	'FAMILIAS AFECTADAS': string | null;
	'PERSONAS AFECTADAS DIRECTAMENTE': string | null;
	'PERSONAS AFECTADAS INDIRECTAS': string | null;
	'FAMILIAS DAMNIFICADAS': string | null;
	'PERSONAS DAMNIFICADAS': string | null;
	'PERSONAS EVACUADAS': string | null;
	'PERSONAS ALBERGADAS': string | null;
	'P. EN FAMILIAS ACOGIENTES': string | null;
	'PERSONAS EN OTROS MEDIOS': string | null;
	'PERSONAS EN PROCESO DE EVACUACION': string | null;
	'PERSONAS QUE RESISTEN A LA EVACUACION': string | null;
	'VIVIENDAS AFECTADAS': string | null;
	'VIVIENDAS DESTRUIDAS': string | null;
	'ESTABLECIMIENTOS EDUCATIVOS AFECTADOS': string | null;
	'ESTABLECIMIENTOS EDUCATIVOS DESTRUIDOS': string | null;
	'CENTROS DE SALUD AFECTADOS': string | null;
	'CENTROS DE SALUD DESTRUIDOS': string | null;
	'PUENTES AFECTADOS': string | null;
	'PUENTES DESTRUIDOS': string | null;
	'BIENES PUBLICOS AFECTADOS': string | null;
	'BIENES PUBLICOS DESTRUIDOS': string | null;
	'BIENES PRIVADOS AFECTADOS': string | null;
	'BIENES PRIVADOS DESTRUIDOS': string | null;
	'METROS LINEALES DE VÍAS AFECTADAS': string | null;
	'CATEGORÍA DE VÍA': string | null;
	'Ha. CULTIVO AFECTADAS': string | null;
	'Ha. CULTIVO PERDIDAS': string | null;
	'Ha. DE COBERTURA VEGETAL QUEMADA': string | null;
	'ANIMALES AFECTADOS': string | null;
	'ANIMALES MUERTOS': string | null;
	'NIVEL DEL INF': string | null;
	Macroevento: string | null;
	'calificación del evento peligroso': string | null;
	'Estado actual de la vía o del INF': string | null;
}

// Interfaz con nombres más amigables para programar
export interface AluvionProcesado {
	id: number;
	anio: string | null;
	fechaEvento: string;
	provincia: string | null;
	canton: string | null;
	descripcionEvento: string | null;
	parroquias: string | null;
	comunidad: string | null;
	latitud: string | null;
	longitud: string | null;
	evento: string | null;
	causa: string | null;
	categoriaEvento: string | null;
	horaEvento: string | null;
	fallecidas: string | null;
	heridas: string | null;
	personasDesaparecidas: string | null;
	familiasAfectadas: string | null;
	afectadosDirectos: string | null;
	afectadosIndirectos: string | null;
	familiasDamnificadas: string | null;
	personasDamnificadas: string | null;
	personasEvacuadas: string | null;
	personasAlbergadas: string | null;
	personasEnFamiliasAcogientes: string | null;
	personasEnOtrosMedios: string | null;
	personasEnProcesoEvacuacion: string | null;
	personasResistentesEvacuacion: string | null;
	viviendasAfectadas: string | null;
	viviendasDestruidas: string | null;
	educativosAfectados: string | null;
	educativosDestruidos: string | null;
	centrosSaludAfectados: string | null;
	centrosSaludDestruidos: string | null;
	puentesAfectados: string | null;
	puentesDestruidos: string | null;
	bienesPublicosAfectados: string | null;
	bienesPublicosDestruidos: string | null;
	bienesPrivadosAfectados: string | null;
	bienesPrivadosDestruidos: string | null;
	metrosViasAfectadas: string | null;
	categoriaVia: string | null;
	hectareasAfectadas: string | null;
	hectareasPerdidas: string | null;
	hectareasQuemadas: string | null;
	animalesAfectados: string | null;
	animalesMuertos: string | null;
	nivelInf: string | null;
	macroevento: string | null;
	calificacionPeligro: string | null;
	estadoVia: string | null;
}

// Función para mapear de Raw a Procesado
export function mapearAluvion(raw: AluvionRaw): AluvionProcesado {
	return {
		id: raw.ID,
		anio: raw.AÑO,
		fechaEvento: raw['FECHA DEL EVENTO'],
		provincia: raw.PROVINCIA,
		canton: raw.CANTON,
		descripcionEvento: raw['DESCRIPCIÓN GENERAL DEL EVENTO'],
		parroquias: raw.PARROQUIAS,
		comunidad: raw['COMUNIDAD/BARRIO/SECTOR'],
		latitud: raw.LATITUD,
		longitud: raw.LONGITUD,
		evento: raw.EVENTO,
		causa: raw.CAUSA,
		categoriaEvento: raw['CATEGORIA DEL EVENTO'],
		horaEvento: raw['HORA DEL EVENTO'],
		fallecidas: raw.FALLECIDAS,
		heridas: raw.HERIDAS,
		personasDesaparecidas: raw['PERSONAS DESAPARECIDAS'],
		familiasAfectadas: raw['FAMILIAS AFECTADAS'],
		afectadosDirectos: raw['PERSONAS AFECTADAS DIRECTAMENTE'],
		afectadosIndirectos: raw['PERSONAS AFECTADAS INDIRECTAS'],
		familiasDamnificadas: raw['FAMILIAS DAMNIFICADAS'],
		personasDamnificadas: raw['PERSONAS DAMNIFICADAS'],
		personasEvacuadas: raw['PERSONAS EVACUADAS'],
		personasAlbergadas: raw['PERSONAS ALBERGADAS'],
		personasEnFamiliasAcogientes: raw['P. EN FAMILIAS ACOGIENTES'],
		personasEnOtrosMedios: raw['PERSONAS EN OTROS MEDIOS'],
		personasEnProcesoEvacuacion: raw['PERSONAS EN PROCESO DE EVACUACION'],
		personasResistentesEvacuacion: raw['PERSONAS QUE RESISTEN A LA EVACUACION'],
		viviendasAfectadas: raw['VIVIENDAS AFECTADAS'],
		viviendasDestruidas: raw['VIVIENDAS DESTRUIDAS'],
		educativosAfectados: raw['ESTABLECIMIENTOS EDUCATIVOS AFECTADOS'],
		educativosDestruidos: raw['ESTABLECIMIENTOS EDUCATIVOS DESTRUIDOS'],
		centrosSaludAfectados: raw['CENTROS DE SALUD AFECTADOS'],
		centrosSaludDestruidos: raw['CENTROS DE SALUD DESTRUIDOS'],
		puentesAfectados: raw['PUENTES AFECTADOS'],
		puentesDestruidos: raw['PUENTES DESTRUIDOS'],
		bienesPublicosAfectados: raw['BIENES PUBLICOS AFECTADOS'],
		bienesPublicosDestruidos: raw['BIENES PUBLICOS DESTRUIDOS'],
		bienesPrivadosAfectados: raw['BIENES PRIVADOS AFECTADOS'],
		bienesPrivadosDestruidos: raw['BIENES PRIVADOS DESTRUIDOS'],
		metrosViasAfectadas: raw['METROS LINEALES DE VÍAS AFECTADAS'],
		categoriaVia: raw['CATEGORÍA DE VÍA'],
		hectareasAfectadas: raw['Ha. CULTIVO AFECTADAS'],
		hectareasPerdidas: raw['Ha. CULTIVO PERDIDAS'],
		hectareasQuemadas: raw['Ha. DE COBERTURA VEGETAL QUEMADA'],
		animalesAfectados: raw['ANIMALES AFECTADOS'],
		animalesMuertos: raw['ANIMALES MUERTOS'],
		nivelInf: raw['NIVEL DEL INF'],
		macroevento: raw.Macroevento,
		calificacionPeligro: raw['calificación del evento peligroso'],
		estadoVia: raw['Estado actual de la vía o del INF']
	};
}

export interface FormatHelpers {
	formatDate: (dateString: string) => string;
	formatValue: (value: string | null) => string;
	formatNumber: (value: string | null) => string;
	formatCoordinate: (coordinate: string | null) => string;
	// Nuevas funciones para formato de hora
	formatHour: (value: string | null) => string | null;
}
