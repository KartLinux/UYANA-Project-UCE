<script lang="ts">
	import { aluvionStore } from '$lib/stores/aluvion.store';
	import { formatters } from '$lib/utils/formatters';
	import { onMount } from 'svelte';
	import EventTooltip from '../molecules/EventTooltip.svelte';
	import { fly } from 'svelte/transition';

	let showTooltip: number | null = null;
	let tooltipX = 0;
	let tooltipY = 0;

	$: years = [
		...new Set($aluvionStore.aluviones.map((a) => new Date(a.fechaEvento).getFullYear().toString()))
	].sort();

	onMount(() => {
		aluvionStore.loadAluviones();
	});

	function handleMouseMove(event: MouseEvent) {
		tooltipX = event.clientX + 10;
		tooltipY = event.clientY + 10;
	}
</script>

<div class="timeline-container">
	<div class="year-filter">
		<select
			bind:value={$aluvionStore.selectedYear}
			on:change={() => aluvionStore.setYear($aluvionStore.selectedYear)}
		>
			<option value={null}>Todos los años</option>
			{#each years as year}
				<option value={year}>{year}</option>
			{/each}
		</select>
	</div>

	{#if $aluvionStore.loading}
		<div class="loading">
			<div class="loader" />
			<span>Cargando eventos...</span>
		</div>
	{:else if $aluvionStore.error}
		<div class="error" transition:fly={{ y: 20 }}>
			{$aluvionStore.error}
		</div>
	{:else}
		<div class="timeline">
			{#each $aluvionStore.aluviones.filter((a) => !$aluvionStore.selectedYear || new Date(a.fechaEvento)
						.getFullYear()
						.toString() === $aluvionStore.selectedYear) as aluvion (aluvion.id)}
				<div
					class="timeline-item"
					on:mouseenter={() => (showTooltip = aluvion.id)}
					on:mouseleave={() => (showTooltip = null)}
					on:mousemove={handleMouseMove}
					transition:fly={{ y: 20, duration: 300 }}
				>
					<div class="timeline-dot" />
					<div class="timeline-content">
						<div class="timeline-date">
							{formatters.formatDate(aluvion.fechaEvento)}
						</div>
						<div class="timeline-card">
							<h3>{aluvion.evento || 'Evento sin título'}</h3>
							<div class="timeline-location">
								📍 {aluvion.provincia || ''} - {aluvion.canton || ''}
							</div>
							<p class="timeline-description">
								{aluvion.descripcionEvento || 'Sin descripción disponible'}
							</p>
							<div class="timeline-stats">
								<div class="stat">
									<span class="stat-label">Afectados:</span>
									<span class="stat-value"
										>{formatters.formatNumber(aluvion.afectadosDirectos)}</span
									>
								</div>
								{#if aluvion.viviendasAfectadas}
									<div class="stat">
										<span class="stat-label">Viviendas:</span>
										<span class="stat-value"
											>{formatters.formatNumber(aluvion.viviendasAfectadas)}</span
										>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				{#if showTooltip === aluvion.id}
					<div
						class="tooltip-container"
						style="position: fixed; left: {tooltipX}px; top: {tooltipY}px;"
					>
						<EventTooltip {aluvion} />
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.timeline-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.timeline {
		position: relative;
		padding: 2rem 0;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 100%;
		background-color: #e2e8f0;
		transform: translateX(calc(2rem - 1px));
	}

	.timeline-item {
		position: relative;
		padding-left: 4rem;
		margin-bottom: 2rem;
	}

	.timeline-dot {
		position: absolute;
		left: calc(2rem - 5px);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #3b82f6;
		border: 2px solid white;
	}

	.timeline-content {
		position: relative;
	}

	.timeline-date {
		font-size: 0.875rem;
		color: #64748b;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.timeline-card {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.timeline-card h3 {
		margin: 0 0 0.5rem 0;
		color: #1e293b;
		font-size: 1.125rem;
	}

	.timeline-location {
		font-size: 0.875rem;
		color: #64748b;
		margin-bottom: 0.75rem;
	}

	.timeline-description {
		color: #475569;
		margin: 0.75rem 0;
		line-height: 1.5;
	}

	.timeline-stats {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid #e2e8f0;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #64748b;
	}

	.stat-value {
		font-weight: 600;
		color: #1e293b;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
		color: #64748b;
	}

	.error {
		color: #ef4444;
	}

	@media (max-width: 640px) {
		.timeline-container {
			padding: 0 0.5rem;
		}

		.timeline-item {
			padding-left: 3rem;
		}

		.timeline::before {
			transform: translateX(calc(1.5rem - 1px));
		}

		.timeline-dot {
			left: calc(1.5rem - 5px);
		}
	}

	.year-filter {
		margin-bottom: 2rem;
		text-align: center;
	}

	.year-filter select {
		padding: 0.5rem 2rem 0.5rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		background-color: white;
		font-size: 1rem;
		color: #1e293b;
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
	}

	.tooltip-container {
		position: fixed;
		z-index: 1000;
		pointer-events: none;
	}

	.loader {
		width: 2rem;
		height: 2rem;
		border: 3px solid #e2e8f0;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.timeline-container {
			padding: 0;
		}

		.timeline-item {
			padding-left: 2.5rem;
		}

		.timeline::before {
			transform: translateX(calc(1rem - 1px));
		}

		.timeline-dot {
			left: calc(1rem - 5px);
		}

		.timeline-card {
			padding: 0.75rem;
		}

		.timeline-card h3 {
			font-size: 1rem;
		}

		.timeline-stats {
			flex-direction: column;
			gap: 0.5rem;
		}

		.year-filter select {
			width: 100%;
			max-width: 300px;
		}
	}

	@media (max-width: 480px) {
		.timeline-description {
			font-size: 0.875rem;
		}

		.stat {
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
		}
	}
</style>
