<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { investigacionesStore } from '$lib/stores/investigaciones.store';
	import type { Feature } from 'geojson'; // Importa el tipo Feature de GeoJSON
	import LineaTiempo from './lineaTiempo.svelte';
	import type { Investigacion } from '$lib/types/investigaciones.types';

	let mapElement: HTMLDivElement;
	let map: any;
	let markers: any[] = [];
	let L: any;
	let geojsonData: GeoJSON.FeatureCollection | undefined; // Variable para almacenar los datos GeoJSON
	let geojsonLayer: L.GeoJSON | undefined; // Variable global para almacenar la capa GeoJSON
	let infoControl: L.Control & { update: (props: { facultad?: string; area?: string; decano?: string } | null) => void };
	// Filtros
	let selectedUniversidad = 'todas';
	let selectedTipoInvestigacion = 'todos';
	let selectedEstadoProyecto = 'todos';
	let selectedAreaTematica = 'todas';

	$: universidades = [
		...new Set(
			$investigacionesStore.investigaciones
				.map((i) => i.universidad)
				.filter((u): u is string => u !== null)
		)
	].sort();

	$: tiposInvestigacion = [
		...new Set(
			$investigacionesStore.investigaciones
				.map((i) => i.tipo_de_investigacion)
				.filter((t): t is string => t !== null)
		)
	].sort();

	$: estadosProyecto = [
		...new Set(
			$investigacionesStore.investigaciones
				.map((i) => i.estado_proyecto)
				.filter((e): e is string => e !== null)
		)
	].sort();

	$: areasTematicas = [
		...new Set(
			$investigacionesStore.investigaciones
				.map((i) => i.area_tematica)
				.filter((a): a is string => a !== null)
		)
	].sort();

	$: universidadStats = universidades.reduce((acc, universidad) => {
		acc[universidad] = $investigacionesStore.investigaciones.filter(
			(i) => i.universidad === universidad
		).length;
		return acc;
	}, {} as Record<string, number>);

	// Filtrado de investigaciones
	$: filteredInvestigaciones = $investigacionesStore.investigaciones.filter((investigacion) => {
		if (selectedUniversidad !== 'todas' && investigacion.universidad !== selectedUniversidad)
			return false;
		if (
			selectedTipoInvestigacion !== 'todos' &&
			investigacion.tipo_de_investigacion !== selectedTipoInvestigacion
		)
			return false;
		if (
			selectedEstadoProyecto !== 'todos' &&
			investigacion.estado_proyecto !== selectedEstadoProyecto
		)
			return false;
		if (selectedAreaTematica !== 'todas' && investigacion.area_tematica !== selectedAreaTematica)
			return false;
		return true;
	});

	function getColorByEstadoProyecto(estado: string): string {
		switch (estado) {
			case 'Completado':
				return '#22c55e'; // verde
			case 'En proceso':
				return '#3b82f6'; // azul
			case 'Planificado':
				return '#8b5cf6'; // morado
			case 'Suspendido':
				return '#f97316'; // naranja
			case 'Cancelado':
				return '#ef4444'; // rojo
			default:
				return '#6b7280'; // gris
		}
	}

	$: if (map && filteredInvestigaciones) {
		updateMarkers();
	}

	function updateMarkers() {
		// Limpiar marcadores existentes
		markers.forEach((marker) => marker.remove());
		markers = [];

		// Agregar nuevos marcadores filtrados
		filteredInvestigaciones.forEach((investigacion) => {
			const lat = investigacion.latitud;
			const lng = investigacion.longitud;

			if (!isNaN(lat) && !isNaN(lng)) {
				// Crear un ícono personalizado según el estado del proyecto
				const customIcon = L.divIcon({
					className: 'custom-marker',
					html: `<div style="background-color: ${getColorByEstadoProyecto(
						investigacion.estado_proyecto
					)}"></div>`,
					iconSize: [15, 15],
					iconAnchor: [7, 7]
				});

				const marker = L.marker([lat, lng], { icon: customIcon })
					.bindPopup(
						`
                        <div class="popup-content">
                            <h3>${
															investigacion.titulo_de_la_investigacion || 'Investigación sin título'
														}</h3>
                            <p><strong>Universidad:</strong> ${investigacion.universidad || ''}</p>
                            <p><strong>Facultad:</strong> ${investigacion.facultad || ''}</p>
                            <p><strong>Área temática:</strong> ${
															investigacion.area_tematica || 'No especificada'
														}</p>
                            <p><strong>Docente:</strong> ${investigacion.docente || ''}</p>
                            <p><strong>Estado:</strong> <span style="color: ${getColorByEstadoProyecto(
															investigacion.estado_proyecto
														)}">${investigacion.estado_proyecto || 'No especificado'}</span></p>
                            <p><strong>Fechas:</strong> ${investigacion.fecha_de_inicio || '?'} - ${
							investigacion.fecha_finalizacion || 'En curso'
						}</p>
                            <p><strong>Ubicación:</strong> ${investigacion.ciudad || ''}, ${
							investigacion.pais || ''
						}</p>
                            <p><strong>Presupuesto:</strong> $${
															investigacion.presupuesto_asignado?.toLocaleString() || '0'
														}</p>
                            <div class="popup-description">
                                <p><strong>Resumen:</strong> ${
																	investigacion.resumen_de_la_investigacion ||
																	'Sin resumen disponible'
																}</p>
                            </div>
                            ${
															investigacion.enlace_publicacion
																? `<p><a href="${investigacion.enlace_publicacion}" target="_blank">Ver publicación</a></p>`
																: ''
														}
                        </div>
                    `
					)
					.addTo(map);
				markers.push(marker);
			}
		});
	}

	async function initializeMap() {
		if (!browser) return;
		const leaflet = await import('leaflet');
		L = leaflet.default;
		if (!mapElement) return;

		// Coordenadas centrales de la Universidad Central del Ecuador
		map = L.map(mapElement).setView([-0.199667, -78.506322], 16); // Zoom más cercano

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '🇷🇺​'
		}).addTo(map);

		// Actualizar el mapa cuando cambie el filtro
		$: if (map && geojsonData) {
			map.eachLayer((layer: L.Layer) => {
      		if (layer instanceof L.GeoJSON) {
        		map.removeLayer(layer);
      		}
    		});
    			loadGeoJSON();
  		}

		// Agregar un control de escala
		L.control.scale({ position: 'bottomright' }).addTo(map);

		// Agregar un control de capas
		L.control.layers(null, null, { collapsed: false }).addTo(map);
	}
	// Estilo para las áreas de las facultades
	function style(feature: Feature) {
		const facultad = feature.properties?.facultad || 'No especificada';
  		const className = getColorByFacultad(facultad);
    	return {
			fillColor: className,
      		weight: 2,
      		opacity: 1,
      		color: 'gray',
      		dashArray: '1',
      		fillOpacity: 0.3
    	};
  	}

  // Función para asignar colores a las facultades
  function getColorByFacultad(facultad: string) {
    const colors = {
      'Facultad de Artes': '#FF5733',
      'Facultad de Arquitectura y Urbanismo': '#33FF57',
      'Facultad de Ciencias': '#3357FF',
	  'Facultad de Ciencias Administrativas': '#FF5733',
	  'Facultad de Ciencias Agrícolas': '#33FF57',
	  'Facultad de Ciencias Biológicas': '#3357FF',
	  'Facultad de Ciencias de la Discapacidad, atención prehospitalaria y desastres': '#FF5733',
	  'Facultad de Ciencias Económicas': '#33FF57',
	  'Facultad de Ciencias Médicas': '#3357FF',
	  'Facultad de Ciencias Psicológicas': '#FF5733',
	  'Facultad de Ciencias Químicas': '#33FF57',
	  'Facultad de Ciencias Sociales y Humanas': '#3357FF',
	  'Facultad de Comunicación Social': '#FF5733',
	  'Facultad de Cultura Física': '#33FF57',
	  'Facultad de Ingeniería y Ciencias Aplicadas': '#3357FF',
	  'Facultad de Filosofía Letras y CIencias de la Educación': '#FF5733',
	  'Facultad de Ingeniería en Geología, Minas, Petróleos y Ambiental': '#33FF57',
	  'Facultad de Ingeniería Química': '#3357FF',
	  'Facultad de Jurisprudencia Ciencias Políticas y Sociales': '#FF5733',
	  'Facultad de Medicina Veterinaria y Zootecnia': '#33FF57',
	  'Facultad de Odontología': '#3357FF',
      // Agrega más facultades y colores aquí
    };
	// Si hay coincidencia, devuelve el color sólido
	if (facultad in colors) {
    	return colors[facultad as keyof typeof colors];
  	}

  	// Si no hay coincidencia, devuelve un degradado elegante
  	return 'skyblue'; // Clase CSS para el degradado
  }

  // Cargar los datos GeoJSON usando fetch
  async function loadGeoJSON() {
    try {
      const response = await fetch('/data_static/map_uce_facultades_v4.geojson'); // Ruta al archivo GeoJSON en la carpeta static
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo GeoJSON: ${response.statusText}`);
      }
      geojsonData = await response.json(); // Parsear los datos como JSON
      console.log('Datos GeoJSON cargados:', geojsonData);

      // Agregar los datos GeoJSON al mapa
      geojsonLayer = L.geoJson(geojsonData, {
        style: style,
		onEachFeature: onEachFeature,
        filter: (feature: Feature) => {
          // Filtrar por área temática
          if (selectedAreaTematica === 'todas') return true;
          return feature.properties?.area === selectedAreaTematica;
        }
        
      }).addTo(map);
    } catch (error) {
      console.error('Error al cargar el GeoJSON:', error);
    }
  }

	onMount(async () => {
		await investigacionesStore.cargarInvestigaciones();
		await initializeMap();
		// Carga los datos GeoJSON al inicializar el mapa
		await loadGeoJSON(); 
		infoControl = createInfoControl(map); // Crea el control después de inicializar el mapa
	});

	// Función para resaltar una facultad al pasar el mouse
	function highlightFeature(e: L.LeafletEvent) {
    const layer = e.target;

    	// Cambiar el estilo al pasar el mouse
    	layer.setStyle({
      		weight: 5, // Borde más grueso
      		color: '#666', // Color del borde
      		dashArray: '', // Sin línea discontinua
      		fillOpacity: 0.8 // Opacidad del relleno
    	});

    	// Traer la capa al frente para evitar problemas de superposición
    	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
    	}
		
		// Actualizar el control con la información de la facultad
		if (infoControl) {
			(infoControl as typeof infoControl & { update: (props: { facultad?: string; area?: string; decano?: string } | null) => void }).update(layer.feature.properties);
  		}
  	}
	// Función para restablecer el estilo original
	function resetHighlight(e: L.LeafletEvent) {
		if (geojsonLayer) {
    		geojsonLayer.resetStyle(e.target); // Restablece el estilo original
  		}
		// Limpiar el control cuando se quite el mouse
		if (infoControl) {
    		infoControl.update(null);
  		}
  	}
	// Asignar eventos y popups a cada capa del GeoJSON
	function onEachFeature(feature: Feature, layer: L.Layer) {
  	// Crear contenido del popup
  	const popupContent = `
    	<div class="popup-content">
      	<h3>${feature.properties ? feature.properties.facultad : 'Facultad no especificada'}</h3>
      	<p><strong>Área:</strong> ${feature.properties?.area || 'No especificada'}</p>
      	<p><strong>Decano/a:</strong> ${feature.properties?.decano || 'No especificado'}</p>
      	<p><strong>Subdecano/a:</strong> ${feature.properties?.subdecano || 'No especificado'}</p>
      	<p><strong>Carreras:</strong> ${
        	feature.properties?.carreras
          	? feature.properties.carreras
          	: 'No especificadas'
      	}</p>
      	${
        	feature.properties?.icono
      	}
    	</div>
  		`;
  		layer.bindPopup(popupContent);

  		// Asignar eventos interactivos
  		layer.on({
    		mouseover: highlightFeature, // Resalta al pasar el mouse
    		mouseout: resetHighlight // Restablece al quitar el mouse
  		});
	}
	// Función para crear el control personalizado
	function createInfoControl(map: L.Map) {
  		const info = L.control();

  		info.onAdd = function () {
    		this._div = L.DomUtil.create('div', 'info');
    		this.update();
    		return this._div;
  		};

  		info.update = function (props: { facultad?: string; area?: string; decano?: string } | null) {
    		this._div.innerHTML = '<h4>Información de la Facultad</h4>' + (props ?
      		`<b>${props.facultad}</b><br />Área: ${props.area || 'No especificada'}<br />Decano/a: ${
        	props.decano || 'No especificado'
      	}` : 'Pasa el mouse sobre una facultad');
		  // Aplicar estilos directamente al div
  			this._div.style.backgroundColor = '#2c3e50'; // Fondo oscuro elegante
  			this._div.style.color = '#ecf0f1'; // Texto blanco claro
  			this._div.style.padding = '10px'; // Espaciado interno
  			this._div.style.borderRadius = '8px'; // Bordes redondeados
  			this._div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)'; // Sombra suave
  			this._div.style.fontFamily = 'Arial, sans-serif'; // Fuente legible
  			this._div.style.fontSize = '14px'; // Tamaño de fuente adecuado
  			this._div.style.lineHeight = '1.4'; // Espaciado entre líneas
  		};
  		info.addTo(map);

  		return info; // Devuelve el control para usarlo en otras funciones
	}


</script>

<svelte:head>	
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</svelte:head>
<div class="container-lineaTiempo">
	<LineaTiempo
	  minYear={1900}
	  maxYear={2025}
	  initialYear={2020}
	/>
</div>

<div class="main-container">
	<!-- Filtros -->
	<div class="filter-bar">
	  <div class="filter-content">
		<div class="filter-group">
		  <h2>Mapa de Investigaciones Universitarias</h2>
		  <div class="filter-controls">
			<select bind:value={selectedUniversidad} class="select-filter">
			  <option value="todas">Todas las universidades</option>
			  {#each universidades as universidad}
				<option value={universidad}>{universidad}</option>
			  {/each}
			</select>
			<select bind:value={selectedTipoInvestigacion} class="select-filter">
			  <option value="todos">Todos los tipos</option>
			  {#each tiposInvestigacion as tipo}
				<option value={tipo}>{tipo}</option>
			  {/each}
			</select>
			<select bind:value={selectedEstadoProyecto} class="select-filter">
			  <option value="todos">Todos los estados</option>
			  {#each estadosProyecto as estado}
				<option value={estado}>{estado}</option>
			  {/each}
			</select>
			<select bind:value={selectedAreaTematica} class="select-filter">
			  <option value="todas">Todas las áreas temáticas</option>
			  {#each areasTematicas as area}
				<option value={area}>{area}</option>
			  {/each}
			</select>
			<span class="events-counter">
			  {filteredInvestigaciones.length} investigaciones encontradas
			</span>
		  </div>
		</div>
	  </div>
	</div>
  
	<!-- Mapa -->
	<div class="map-wrapper">
	  <div class="map-container">
		<div class="map" bind:this={mapElement}></div>
	  </div>
	  <div class="legend">
		<h3>Estado del Proyecto</h3>
		<div class="legend-items">
		  <div class="legend-item">
			<span class="legend-color" style="background-color: #22c55e;"></span>
			<span>Completado</span>
		  </div>
		  <div class="legend-item">
			<span class="legend-color" style="background-color: #3b82f6;"></span>
			<span>En proceso</span>
		  </div>
		  <div class="legend-item">
			<span class="legend-color" style="background-color: #8b5cf6;"></span>
			<span>Planificado</span>
		  </div>
		  <div class="legend-item">
			<span class="legend-color" style="background-color: #f97316;"></span>
			<span>Suspendido</span>
		  </div>
		  <div class="legend-item">
			<span class="legend-color" style="background-color: #ef4444;"></span>
			<span>Cancelado</span>
		  </div>
		</div>
	  </div>
	</div>
  </div>

<style>
	/* Contenedor principal */
	.main-container {
		display: flex;
		flex-direction: row; /* Cambia a columna en pantallas pequeñas */
		gap: 1rem; /* Espacio entre los filtros y el mapa */
		height: calc(100vh - 120px); /* Altura del contenedor principal */
	}
	/* Mapa */
	.map-wrapper {
  		flex-grow: 1; /* El mapa ocupa el espacio restante */
  		display: flex;
  		flex-direction: column;
  		gap: 1rem;
	}

	/* Filtros */
	.filter-bar {
  		width: 300px; /* Ancho fijo para los filtros */
  		background: rgb(2, 10, 0);
  		border-radius: 0.5rem;
  		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  		padding: 1rem;
  		overflow-y: auto; /* Permite desplazamiento si hay muchos filtros */
	}

	.filter-content {
		padding: 1rem;
		
	}

	.filter-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.filter-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #b2c8a6;
		margin: 0;
	}

	.filter-controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.select-filter {
		padding: 0.5rem 2rem 0.5rem 1rem;
		width: 100%;
		border: 1px solid #1a431b;
		border-radius: 0.375rem;
		background-color: rgb(19, 22, 19);
		font-size: 0.875rem;
		color: #c4f7aa;
		cursor: pointer;
	}

	.select-filter:hover {
		border-color: #1adc01;
	}

	.events-counter {
		font-size: 0.875rem;
		color: #a4c1fb;
		padding: 0.5rem 0;
	}

	.map-container {
		flex-grow: 1; /* El mapa ocupa el espacio restante */
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(198, 4, 4, 0.1);
		/*width: 100%; /* Asegurar que usa todo el ancho disponible */
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.legend {
		background: rgb(11, 23, 9);
		border-radius: 0.5rem;
		box-shadow: 0 1px 2px rgb(21, 255, 0);
		padding: 0.75rem 1rem;
		margin-top: 0.5rem;
	}

	.legend h3 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.legend-items {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: block;
	}
	.container-lineaTiempo {
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
  	}

	/* Estilos responsivos */
	@media (max-width: 768px) {
		.main-container {
    		flex-direction: column; /* Cambia a columna en pantallas pequeñas */
   	 		gap: 1rem; /* Espacio entre los filtros y el mapa */
    		height: auto; /* Altura automática para ajustarse al contenido */
  		}

  		.filter-bar {
    		width: 100%; /* Los filtros ocupan todo el ancho */
    		max-height: 200px; /* Altura máxima para los filtros */
    		overflow-y: auto; /* Permite desplazamiento si hay muchos filtros */
    		padding: 0.5rem; /* Reducir el padding para pantallas pequeñas */
  		}

  		.map-wrapper {
    		height: 50vh; /* El mapa ocupa el 50% de la altura de la pantalla */
    		width: 100%; /* Ocupa todo el ancho disponible */
  		}

  		.map-container {
    		min-height: 300px; /* Altura mínima para evitar colapsos */
    		height: 100%; /* Asegura que usa toda la altura disponible */
    		position: relative;
  		}
		.filter-group {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.select-filter {
			width: 100%;
		}

		.events-counter {
			text-align: center;
		}

		.legend-items {
			gap: 0.5rem;
		}
	}

	/* Media queries para escritorio */
	@media (min-width: 1200px) {
		.map-wrapper {
			height: calc(100vh - 120px); /* Más alto en escritorios */
		}

		.map-container {
			min-height: 600px; /* Mayor altura en escritorios */
		}
	}

	/* Estilos para el marcador personalizado */
	:global(.custom-marker) {
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
	}

	:global(.custom-marker div) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	/* Mantener estilos del popup */
	:global(.popup-content) {
		padding: 5px;
		max-width: 300px;
	}

	:global(.popup-content h3) {
		margin: 0 0 5px 0;
		color: #2c3e50;
		font-size: 16px;
	}

	:global(.popup-content p) {
		margin: 3px 0;
		font-size: 14px;
	}

	:global(.popup-description) {
		margin-top: 5px;
		padding-top: 5px;
		border-top: 1px solid #eee;
		max-height: 100px;
		overflow-y: auto;
	}

	:global(.popup-content a) {
		color: #3b82f6;
		text-decoration: none;
	}

	:global(.popup-content a:hover) {
		text-decoration: underline;
	}
</style>
