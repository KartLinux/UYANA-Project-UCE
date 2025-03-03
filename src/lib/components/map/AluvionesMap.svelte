<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { aluvionStore } from '$lib/stores/aluvion.store';
	import { formatters } from '$lib/utils/formatters';

	let mapElement: HTMLDivElement;
	let map: any;
	let markers: any[] = [];
	let L: any;

	// Filtros
	let selectedProvince = 'todas';
	let selectedYear = 'todos';
	let minFallecidos = 0;
	let showAffected = false;

	$: provincias = [
		...new Set(
			$aluvionStore.aluviones.map((a) => a.provincia).filter((p): p is string => p !== null)
		)
	].sort();
	$: years = [
		...new Set($aluvionStore.aluviones.map((a) => new Date(a.fechaEvento).getFullYear()))
	].sort();

	$: provinciaStats = provincias.reduce((acc, provincia) => {
		acc[provincia] = $aluvionStore.aluviones.filter((a) => a.provincia === provincia).length;
		return acc;
	}, {} as Record<string, number>);

	// Simplificar el filtrado
	$: filteredAluviones = $aluvionStore.aluviones.filter((aluvion) => {
		if (selectedProvince !== 'todas' && aluvion.provincia !== selectedProvince) return false;
		return true;
	});

	function getColorByEventCount(count: number): string {
		if (count > 20) return '#ef4444';
		if (count > 10) return '#f97316';
		if (count > 5) return '#eab308';
		return '#22c55e';
	}

	$: if (map && filteredAluviones) {
		updateMarkers();
	}

	function updateMarkers() {
		// Limpiar marcadores existentes
		markers.forEach((marker) => marker.remove());
		markers = [];

		// Agregar nuevos marcadores filtrados
		filteredAluviones.forEach((aluvion) => {
			const lat = parseFloat(formatters.formatCoordinate(aluvion.latitud));
			const lng = parseFloat(formatters.formatCoordinate(aluvion.longitud));

			if (!isNaN(lat) && !isNaN(lng)) {
				const marker = L.marker([lat, lng])
					.bindPopup(
						`
                        <div class="popup-content">
                            <h3>${aluvion.evento || 'Evento sin título'}</h3>
                            <p><strong>Fecha:</strong> ${formatters.formatDate(
															aluvion.fechaEvento
														)}</p>
                            <p><strong>Ubicación:</strong> ${aluvion.provincia || ''} - ${
							aluvion.canton || ''
						}</p>
                            <p><strong>Descripción:</strong> ${
															aluvion.descripcionEvento || 'Sin descripción'
														}</p>
                            <div class="popup-stats">
                                <p><strong>Fallecidos:</strong> ${aluvion.fallecidas || '0'}</p>
                                <p><strong>Heridos:</strong> ${aluvion.heridas || '0'}</p>
                                <p><strong>Afectados:</strong> ${
																	aluvion.afectadosDirectos || '0'
																}</p>
                            </div>
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
		if (!mapElement) return;

		map = L.map(mapElement).setView([-1.831239, -78.183406], 7);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);
	}

	onMount(async () => {
		await aluvionStore.loadAluviones();
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
				<h2>Aluviones en Ecuador</h2>
				<div class="filter-controls">
					<select bind:value={selectedProvince} class="select-filter">
						<option value="todas">Todas las provincias</option>
						{#each provincias as provincia}
							<option value={provincia}>{provincia}</option>
						{/each}
					</select>
					<span class="events-counter">
						{filteredAluviones.length} eventos encontrados
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="map-container">
		<div class="map" bind:this={mapElement} />
	</div>
</div>

<style>
	.map-wrapper {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 100px);
		gap: 1rem;
		padding: 1rem;
	}

	.filter-bar {
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.filter-content {
		padding: 1rem;
		max-width: 1400px;
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
		gap: 1rem;
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
		min-width: 200px;
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
		min-height: 400px;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
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
	}

	/* Mantener estilos del popup */
	:global(.popup-content) {
		padding: 5px;
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

	:global(.popup-stats) {
		margin-top: 5px;
		padding-top: 5px;
		border-top: 1px solid #eee;
	}
</style>
