<script lang="ts">
	import type { AluvionProcesado } from '$lib/types/aluvion.types';
	import { formatters } from '$lib/utils/formatters';

	export let aluvion: AluvionProcesado;
</script>

<div class="tooltip">
	<div class="tooltip-header">
		<h4>{aluvion.evento || 'Evento sin título'}</h4>
		<span class="fecha">{formatters.formatDate(aluvion.fechaEvento)}</span>
	</div>

	<div class="tooltip-content">
		<div class="stats-grid">
			<div class="stat-item">
				<span class="label">Familias afectadas</span>
				<span class="value">{formatters.formatNumber(aluvion.familiasAfectadas)}</span>
			</div>
			<div class="stat-item">
				<span class="label">Afectados directos</span>
				<span class="value">{formatters.formatNumber(aluvion.afectadosDirectos)}</span>
			</div>
			<div class="stat-item">
				<span class="label">Afectados indirectos</span>
				<span class="value">{formatters.formatNumber(aluvion.afectadosIndirectos)}</span>
			</div>
		</div>

		<div class="causa">
			<span class="label">Causa:</span>
			<p>{aluvion.causa || 'No especificada'}</p>
		</div>
	</div>
</div>

<style>
	.tooltip {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		padding: 1rem;
		width: 300px;
		z-index: 50;
	}

	.tooltip-header {
		border-bottom: 1px solid #e5e7eb;
		margin-bottom: 0.75rem;
		padding-bottom: 0.75rem;
	}

	.tooltip-header h4 {
		margin: 0;
		color: #1f2937;
		font-size: 1rem;
	}

	.fecha {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.value {
		font-weight: 600;
		color: #1f2937;
	}

	.causa {
		border-top: 1px solid #e5e7eb;
		padding-top: 0.75rem;
	}

	.causa p {
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
		color: #4b5563;
	}

	@media (max-width: 640px) {
		.tooltip {
			width: calc(100vw - 40px);
			max-width: 300px;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.stat-item {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.tooltip-header h4 {
			font-size: 0.875rem;
		}

		.fecha {
			font-size: 0.75rem;
		}
	}
</style>
