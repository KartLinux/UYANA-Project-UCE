<script lang="ts">
	import { onMount } from 'svelte';
	import { aluvionStore } from '$lib/stores/aluvion.store';
	import { formatters } from '$lib/utils/formatters';

	interface Aluvion {
		horaEvento: string | null;
	}

	interface HoraConEventos {
		hora: string;
		cantidad: number;
	}

	let top9Horas: HoraConEventos[] = []; // Cambiamos a 9 horas

	function calcularTopHoras(aluviones: Aluvion[]) {
		const horasPorEvento: { [key: string]: number } = {};

		aluviones.forEach((aluvion) => {
			if (aluvion.horaEvento) {
				const hora = aluvion.horaEvento.split(':')[0] + ':00';
				horasPorEvento[hora] = (horasPorEvento[hora] || 0) + 1;
			}
		});

		top9Horas = Object.entries(horasPorEvento)
			.map(([hora, cantidad]) => ({ hora, cantidad }))
			.sort((a, b) => b.cantidad - a.cantidad)
			.slice(0, 9); // Tomamos las top 9
	}

	$: {
		if ($aluvionStore.aluviones) {
			calcularTopHoras($aluvionStore.aluviones);
		}
	}

	onMount(() => {
		if ($aluvionStore.aluviones.length === 0) {
			aluvionStore.loadAluviones();
		}
	});

	// Un solo icono de reloj
	const clockIcon = '🕐';

	// Función mejorada para obtener el color según la posición
	function getColorClase(index: number): string {
		const colores = [
			'danger', // Rojo intenso
			'warning', // Naranja
			'info', // Azul
			'success', // Verde
			'primary', // Azul principal
			'purple', // Púrpura
			'teal', // Verde azulado
			'pink', // Rosa
			'orange' // Naranja brillante
		];
		return colores[index];
	}
</script>

<div class="clock-container">
	<div class="clock-face">
		<h3>Horas críticas de aluviones</h3>
		<div class="time-grid">
			{#each top9Horas as { hora, cantidad }, i}
				<div class="time-card {getColorClase(i)}">
					<span class="icon">{clockIcon}</span>
					<span class="time">{hora}</span>
					<span class="count">{formatters.formatNumber(cantidad.toString())}</span>
					<span class="label">aluviones</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.clock-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}

	.clock-face {
		background: var(--color--background);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 600px;

		h3 {
			margin: 0 0 1.5rem 0;
			font-size: 1.2rem;
			color: var(--color--text);
			text-align: center;
		}
	}

	.time-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr); // 3 columnas fijas para 9 elementos
		gap: 1rem;
	}

	.time-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		border-radius: 0.5rem;
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}

		&.danger {
			background: rgba(220, 53, 69, 0.1);
			border: 1px solid rgba(220, 53, 69, 0.2);
		}
		&.warning {
			background: rgba(255, 193, 7, 0.1);
			border: 1px solid rgba(255, 193, 7, 0.2);
		}
		&.info {
			background: rgba(13, 202, 240, 0.1);
			border: 1px solid rgba(13, 202, 240, 0.2);
		}
		&.success {
			background: rgba(25, 135, 84, 0.1);
			border: 1px solid rgba(25, 135, 84, 0.2);
		}
		&.primary {
			background: rgba(13, 110, 253, 0.1);
			border: 1px solid rgba(13, 110, 253, 0.2);
		}
		&.purple {
			background: rgba(111, 66, 193, 0.1);
			border: 1px solid rgba(111, 66, 193, 0.2);
		}
		&.teal {
			background: rgba(32, 201, 151, 0.1);
			border: 1px solid rgba(32, 201, 151, 0.2);
		}
		&.pink {
			background: rgba(214, 51, 132, 0.1);
			border: 1px solid rgba(214, 51, 132, 0.2);
		}
		&.orange {
			background: rgba(253, 126, 20, 0.1);
			border: 1px solid rgba(253, 126, 20, 0.2);
		}

		.icon {
			font-size: 2rem;
			margin-bottom: 0.5rem;
		}

		.time {
			font-size: 1.5rem;
			font-weight: bold;
			font-family: var(--font--title);
			color: var(--color--text);
		}

		.count {
			font-size: 1.8rem;
			font-weight: bold;
			margin: 0.5rem 0;
			color: var(--color--text);
		}

		.label {
			font-size: 0.9rem;
			color: var(--color--text-shade);
		}
	}

	@media (max-width: 992px) {
		.time-grid {
			grid-template-columns: repeat(3, 1fr); // Mantener 3 columnas en tablets grandes
		}
	}

	@media (max-width: 768px) {
		.time-grid {
			grid-template-columns: repeat(2, 1fr); // 2 columnas en tablets
		}
	}

	@media (max-width: 480px) {
		.time-grid {
			grid-template-columns: 1fr; // 1 columna en móviles
		}

		.time-card {
			padding: 0.8rem;

			.icon {
				font-size: 1.5rem;
			}
			.time {
				font-size: 1.2rem;
			}
			.count {
				font-size: 1.5rem;
			}
		}
	}
</style>
