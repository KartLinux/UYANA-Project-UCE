<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { investigacionesStore } from '$lib/stores/investigaciones.store';
	import type { Investigacion } from '$lib/types/investigaciones.types';

	let mapElement: HTMLDivElement;
	let map: any;
	let markers: any[] = [];
	let L: any;

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

		map = L.map(mapElement).setView([-1.831239, -78.183406], 7);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);
	}

	onMount(async () => {
		await investigacionesStore.cargarInvestigaciones();
		await initializeMap();
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</svelte:head>

<div class="map-wrapper">
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

	<div class="map-container">
		<div class="map" bind:this={mapElement} />
	</div>

	<div class="legend">
		<h3>Estado del Proyecto</h3>
		<div class="legend-items">
			<div class="legend-item">
				<span class="legend-color" style="background-color: #22c55e;" />
				<span>Completado</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background-color: #3b82f6;" />
				<span>En proceso</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background-color: #8b5cf6;" />
				<span>Planificado</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background-color: #f97316;" />
				<span>Suspendido</span>
			</div>
			<div class="legend-item">
				<span class="legend-color" style="background-color: #ef4444;" />
				<span>Cancelado</span>
			</div>
		</div>
	</div>
</div>

<style>
	.map-wrapper {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 100px);
		gap: 1rem;
		padding: 1rem;
		max-width: 1800px; /* Aumentado el ancho máximo */
		margin: 0 auto; /* Centrado en pantalla */
	}

	.filter-bar {
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.filter-content {
		padding: 1rem;
		max-width: 1800px; /* Aumentado para coincidir con map-wrapper */
		margin: 0 auto;
		width: 100%;
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
		color: #1f2937;
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
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		background-color: white;
		font-size: 0.875rem;
		color: #374151;
		cursor: pointer;
	}

	.select-filter:hover {
		border-color: #9ca3af;
	}

	.events-counter {
		font-size: 0.875rem;
		color: #6b7280;
		padding: 0.5rem 0;
	}

	.map-container {
		flex: 1;
		min-height: 500px; /* Aumentado la altura mínima */
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		width: 100%; /* Asegurar que usa todo el ancho disponible */
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.legend {
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

	/* Estilos responsivos */
	@media (max-width: 768px) {
		.map-wrapper {
			height: calc(100vh - 80px);
			padding: 0.5rem;
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
