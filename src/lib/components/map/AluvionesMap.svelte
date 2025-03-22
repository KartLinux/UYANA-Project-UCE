<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { aluvionStore } from '$lib/stores/aluvion.store';
    import { formatters } from '$lib/utils/formatters';

    // Leaflet
    let mapElement: HTMLDivElement;
    let map: any;
    let markers: any[] = [];
    let L: any;

    // Filtros
    let selectedProvince = 'todas';
    let selectedYear = 'todos';
    let minFallecidos = 0;
    let showAffected = false;
    let selectedCause = 'todas'; // Nueva variable para filtrar por causa
    let selectedDangerLevel = 'todas'; // Nueva variable para filtrar por nivel de peligro

    // Datos derivados
    $: provincias = [
        ...new Set(
            $aluvionStore.aluviones.map((a) => a.provincia).filter((p): p is string => p !== null)
        )
    ].sort();

    $: years = [
        ...new Set($aluvionStore.aluviones.map((a) => new Date(a.fechaEvento).getFullYear()))
    ].sort();

    $: causes = [
        ...new Set($aluvionStore.aluviones.map((a) => a.causa).filter(Boolean))
    ].sort();

    $: dangerLevels = [
        ...new Set($aluvionStore.aluviones.map((a) => a.calificacionPeligro).filter(Boolean))
    ].sort();

    // Filtrado avanzado
    $: filteredAluviones = $aluvionStore.aluviones.filter((aluvion) => {
        if (selectedProvince !== 'todas' && aluvion.provincia !== selectedProvince) return false;
        if (selectedYear !== 'todos' && new Date(aluvion.fechaEvento).getFullYear() != Number(selectedYear)) return false;
        if (minFallecidos > 0 && (aluvion.fallecidas || 0) < minFallecidos) return false;
        if (showAffected && !(aluvion.afectadosDirectos > 0)) return false;
        if (selectedCause !== 'todas' && aluvion.causa !== selectedCause) return false;
        if (selectedDangerLevel !== 'todas' && aluvion.calificacionPeligro !== selectedDangerLevel) return false;
        return true;
    });

    // Gráficos
    let humanImpactChart: any;
    let infrastructureChart: any;

    function initializeCharts() {
        const humanImpactCtx = document.getElementById('human-impact-chart');
        const infrastructureCtx = document.getElementById('infrastructure-chart');

        if (humanImpactCtx && infrastructureCtx) {
            humanImpactChart = new Chart(humanImpactCtx, {
                type: 'pie',
                data: {
                    labels: ['Fallecidos', 'Heridos', 'Desaparecidos'],
                    datasets: [{
                        label: 'Impacto Humano',
                        data: [
                            filteredAluviones.reduce((sum, a) => sum + (a.fallecidas || 0), 0),
                            filteredAluviones.reduce((sum, a) => sum + (a.heridas || 0), 0),
                            filteredAluviones.reduce((sum, a) => sum + (a.desaparecidos || 0), 0)
                        ],
                        backgroundColor: ['#ef4444', '#f97316', '#eab308']
                    }]
                },
                options: { responsive: true }
            });

            infrastructureChart = new Chart(infrastructureCtx, {
                type: 'bar',
                data: {
                    labels: ['Viviendas Afectadas', 'Escuelas Afectadas', 'Hospitales Afectados'],
                    datasets: [{
                        label: 'Infraestructura Afectada',
                        data: [
                            filteredAluviones.reduce((sum, a) => sum + (a.viviendasAfectadas || 0), 0),
                            filteredAluviones.reduce((sum, a) => sum + (a.educativosAfectados || 0), 0),
                            filteredAluviones.reduce((sum, a) => sum + (a.centrosSaludAfectados || 0), 0)
                        ],
                        backgroundColor: ['#22c55e', '#3b82f6', '#6366f1']
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    function updateCharts() {
        if (humanImpactChart && infrastructureChart) {
            humanImpactChart.data.datasets[0].data = [
                filteredAluviones.reduce((sum, a) => sum + (a.fallecidas || 0), 0),
                filteredAluviones.reduce((sum, a) => sum + (a.heridas || 0), 0),
                filteredAluviones.reduce((sum, a) => sum + (a.desaparecidos || 0), 0)
            ];
            humanImpactChart.update();

            infrastructureChart.data.datasets[0].data = [
                filteredAluviones.reduce((sum, a) => sum + (a.viviendasAfectadas || 0), 0),
                filteredAluviones.reduce((sum, a) => sum + (a.educativosAfectados || 0), 0),
                filteredAluviones.reduce((sum, a) => sum + (a.centrosSaludAfectados || 0), 0)
            ];
            infrastructureChart.update();
        }
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
        await aluvionStore.loadAluviones();
        await initializeMap();
        initializeCharts();
    });

    function updateMarkers() {
        markers.forEach((marker) => marker.remove());
        markers = [];

        filteredAluviones.forEach((aluvion) => {
            const lat = parseFloat(formatters.formatCoordinate(aluvion.latitud));
            const lng = parseFloat(formatters.formatCoordinate(aluvion.longitud));

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng])
                    .bindPopup(
                        `
                        <div class="popup-content">
                            <h3>${aluvion.evento || 'Evento sin título'}</h3>
                            <p><strong>Fecha:</strong> ${formatters.formatDate(aluvion.fechaEvento)}</p>
                            <p><strong>Ubicación:</strong> ${aluvion.provincia || ''} - ${aluvion.canton || ''}</p>
                            <p><strong>Descripción:</strong> ${aluvion.descripcionEvento || 'Sin descripción'}</p>
                            <div class="popup-stats">
                                <p><strong>Fallecidos:</strong> ${aluvion.fallecidas || '0'}</p>
                                <p><strong>Heridos:</strong> ${aluvion.heridas || '0'}</p>
                                <p><strong>Afectados:</strong> ${aluvion.afectadosDirectos || '0'}</p>
                            </div>
                        </div>
                    `
                    )
                    .addTo(map);
                markers.push(marker);
            }
        });
    }

    $: if (map && filteredAluviones) {
        updateMarkers();
        updateCharts();
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div class="map-wrapper">
    <!-- Controles de filtro en la parte derecha -->
    <div class="filters-sidebar">
        <div class="filters-header">
            <h2>Filtros</h2>
        </div>
        <div class="filters-body">
            <!-- Selector de provincia -->
            <div class="filter-item">
                <label for="province">Provincia:</label>
                <select bind:value={selectedProvince} id="province" class="select-filter">
                    <option value="todas">Todas las provincias</option>
                    {#each provincias as provincia}
                        <option value={provincia}>{provincia}</option>
                    {/each}
                </select>
            </div>

            <!-- Selector de año -->
            <div class="filter-item">
                <label for="year">Año:</label>
                <select bind:value={selectedYear} id="year" class="select-filter">
                    <option value="todos">Todos los años</option>
                    {#each years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </div>

            <!-- Filtro por causa del evento -->
            <div class="filter-item">
                <label for="cause">Causa del Evento:</label>
                <select bind:value={selectedCause} id="cause" class="select-filter">
                    <option value="todas">Todas las causas</option>
                    {#each causes as cause}
                        <option value={cause}>{cause}</option>
                    {/each}
                </select>
            </div>

            <!-- Filtro por nivel de peligro -->
            <div class="filter-item">
                <label for="danger-level">Nivel de Peligro:</label>
                <select bind:value={selectedDangerLevel} id="danger-level" class="select-filter">
                    <option value="todas">Todos los niveles</option>
                    {#each dangerLevels as level}
                        <option value={level}>{level}</option>
                    {/each}
                </select>
            </div>

            <!-- Filtro por número mínimo de fallecidos -->
            <div class="filter-item">
                <label for="min-deaths">Mínimo de fallecidos:</label>
                <input
                    type="number"
                    id="min-deaths"
                    bind:value={minFallecidos}
                    min="0"
                    class="number-input"
                />
            </div>

            <!-- Checkbox para mostrar afectados -->
            <div class="filter-item">
                <label for="show-affected">
                    <input type="checkbox" id="show-affected" bind:checked={showAffected} />
                    Mostrar solo eventos con afectados
                </label>
            </div>

            <!-- Contador de eventos -->
            <div class="events-counter">
                {filteredAluviones.length} eventos encontrados
            </div>

            <!-- Gráficos -->
            <div class="charts-container">
                <canvas id="human-impact-chart" width="300" height="300"></canvas>
                <canvas id="infrastructure-chart" width="300" height="300"></canvas>
            </div>
        </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="map-container">
        <div class="map" bind:this={mapElement}></div>
    </div>
</div>

<style>
    /* Contenedor principal de la página */
    .page-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Altura mínima de la página */
    }

    /* Contenedor principal del mapa y filtros */
    .map-wrapper {
        display: flex;
        flex: 1; /* Ocupa todo el espacio disponible */
        height: calc(100vh - 60px); /* Resta el espacio del footer */
        overflow: hidden; /* Evita desbordamientos */
    }

    /* Sidebar de filtros */
    .filters-sidebar {
        width: 300px;
        background: white;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto; /* Permite desplazamiento si el contenido es demasiado largo */
    }

    .filters-header h2 {
        font-size: 1.25rem;
        margin: 0;
        color: #1f2937;
    }

    .filters-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .filter-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .filter-item label {
        font-size: 0.875rem;
        color: #374151;
    }

    .select-filter,
    .number-input {
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        font-size: 0.875rem;
    }

    .number-input {
        width: 100%;
    }

    .events-counter {
        font-size: 0.875rem;
        color: #6b7280;
        text-align: center;
        padding: 0.5rem;
        background: #f3f4f6;
        border-radius: 0.375rem;
    }

    .charts-container {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Contenedor del mapa */
    .map-container {
        flex: 1; /* Ocupa el espacio restante */
        position: relative;
    }

    .map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /* Footer */
    .footer {
        background: #1f2937;
        color: white;
        text-align: center;
        padding: 1rem;
        font-size: 0.875rem;
    }

    /* Estilos responsivos */
    @media (max-width: 768px) {
        .map-wrapper {
            flex-direction: column;
            height: auto;
        }

        .filters-sidebar {
            width: 100%;
            padding: 0.5rem;
        }

        .map-container {
            height: 400px; /* Altura fija para pantallas pequeñas */
        }
    }
</style>
