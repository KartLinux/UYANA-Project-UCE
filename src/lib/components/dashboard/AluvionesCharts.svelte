<script lang="ts">
	import type { AluvionProcesado } from '$lib/types/aluvion.types';
	import Card from '$lib/components/atoms/Card.svelte';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';

	export let aluviones: AluvionProcesado[] = [];

	let chartCalificacion: Chart;
	let chartEventosPorAnio: Chart;
	let chartEventosPorProvincia: Chart;
	let chartEventosPorMes: Chart;
	let chartCausasEventos: Chart;
	let chartSerieTemporal: Chart;

	onMount(() => {
		// Gráfico de Calificación de Peligro
		const ctx = document.getElementById('chartCalificacion') as HTMLCanvasElement;
		const calificacionesData = aluviones.reduce((acc, evento) => {
			const calificacion = evento.calificacionPeligro || 'Sin calificar';
			acc[calificacion] = (acc[calificacion] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		chartCalificacion = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: Object.keys(calificacionesData),
				datasets: [
					{
						data: Object.values(calificacionesData),
						backgroundColor: ['#75e563', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF']
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom'
					},
					title: {
						display: true,
						text: 'Distribución por Calificación de Peligro'
					}
				}
			}
		});

		// Eventos por año
		const eventosPorAnio = aluviones.reduce((acc, evento) => {
			const anio = evento.anio || 'Sin año';
			acc[anio] = (acc[anio] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const ctxLine = document.getElementById('chartEventosAnual') as HTMLCanvasElement;
		const eventosAnualesData = Object.entries(eventosPorAnio).sort(([a], [b]) =>
			a.localeCompare(b)
		);

		chartEventosPorAnio = new Chart(ctxLine, {
			type: 'line',
			data: {
				labels: eventosAnualesData.map(([year]) => year),
				datasets: [
					{
						label: 'Aluviones por Año',
						data: eventosAnualesData.map(([, count]) => count),
						borderColor: '#4BC0C0',
						tension: 0.1,
						fill: false
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Evolución de aluviones por Año'
					},
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});

		// Eventos por provincia
		const provinciaMasEventos = aluviones.reduce((acc, evento) => {
			const provincia = evento.provincia || 'Sin provincia';
			acc[provincia] = (acc[provincia] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const ctxBar = document.getElementById('chartEventosProvincia') as HTMLCanvasElement;
		const eventosProvincia = Object.entries(provinciaMasEventos)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10);

		chartEventosPorProvincia = new Chart(ctxBar, {
			type: 'bar',
			data: {
				labels: eventosProvincia.map(([provincia]) => provincia),
				datasets: [
					{
						label: 'Aluviones por Provincia',
						data: eventosProvincia.map(([, count]) => count),
						backgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
							'#9966FF',
							'#FF9F40',
							'#8AC926',
							'#FF595E',
							'#6A4C93',
							'#1982C4'
						]
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Top 10 Provincias con más aluviones'
					},
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});

		// Eventos por mes
		const eventosPorMes = aluviones.reduce((acc, evento) => {
			const fecha = new Date(evento.fechaEvento);
			const mes = fecha.getMonth();
			acc[mes] = (acc[mes] || 0) + 1;
			return acc;
		}, {} as Record<number, number>);

		const ctxMes = document.getElementById('chartEventosMes') as HTMLCanvasElement;
		const eventosMesData = Array(12).fill(0);
		Object.entries(eventosPorMes).forEach(([mes, cantidad]) => {
			eventosMesData[parseInt(mes)] = cantidad;
		});

		chartEventosPorMes = new Chart(ctxMes, {
			type: 'bar',
			data: {
				labels: [
					'Ene',
					'Feb',
					'Mar',
					'Abr',
					'May',
					'Jun',
					'Jul',
					'Ago',
					'Sep',
					'Oct',
					'Nov',
					'Dic'
				],
				datasets: [
					{
						label: 'aluviones por Mes',
						data: eventosMesData,
						backgroundColor: '#36A2EB',
						borderColor: '#2693e6',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Distribución de aluviones por Mes'
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: { stepSize: 1 }
					}
				}
			}
		});

		// Causas vs eventos
		const causasPrincipales = aluviones.reduce((acc, evento) => {
			const causa = evento.causa || 'Sin causa';
			acc[causa] = (acc[causa] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const ctxCausas = document.getElementById('chartCausas') as HTMLCanvasElement;
		const causasData = Object.entries(causasPrincipales)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 8);

		chartCausasEventos = new Chart(ctxCausas, {
			type: 'doughnut',
			data: {
				labels: causasData.map(([causa]) => causa),
				datasets: [
					{
						data: causasData.map(([, count]) => count),
						backgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
							'#9966FF',
							'#FF9F40',
							'#8AC926',
							'#FF595E'
						]
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Principales Causas de los aluviones'
					},
					legend: {
						position: 'right'
					}
				}
			}
		});

		// Serie temporal
		const serieData = aluviones.reduce((acc, evento) => {
			const fecha = new Date(evento.fechaEvento);
			const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const ctxSerie = document.getElementById('chartSerieTemporal') as HTMLCanvasElement;
		const sortedDates = Object.keys(serieData).sort();

		chartSerieTemporal = new Chart(ctxSerie, {
			type: 'line',
			data: {
				labels: sortedDates,
				datasets: [
					{
						label: 'Cantidad de aluviones',
						data: sortedDates.map((date) => serieData[date]),
						borderColor: '#4BC0C0',
						backgroundColor: 'rgba(75, 192, 192, 0.1)',
						fill: true,
						tension: 0.4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: 'Serie Temporal de aluviones por Mes'
					},
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Fecha'
						},
						ticks: {
							maxRotation: 45,
							minRotation: 45
						}
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Número de aluviones'
						},
						ticks: { stepSize: 1 }
					}
				}
			}
		});

		return () => {
			chartCalificacion?.destroy();
			chartEventosPorAnio?.destroy();
			chartEventosPorProvincia?.destroy();
			chartEventosPorMes?.destroy();
			chartCausasEventos?.destroy();
			chartSerieTemporal?.destroy();
		};
	});
</script>

<div class="charts-grid">
	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartCalificacion" />
		</div>
	</Card>

	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartEventosAnual" />
		</div>
	</Card>

	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartEventosProvincia" />
		</div>
	</Card>

	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartEventosMes" />
		</div>
	</Card>

	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartCausas" />
		</div>
	</Card>
</div>

<div class="serie-temporal">
	<Card additionalClass="chart-card">
		<div slot="content">
			<canvas id="chartSerieTemporal" />
		</div>
	</Card>
</div>

<style lang="scss">
	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
		width: 100%;
	}

	.serie-temporal {
		margin-top: 2rem;
		width: 100%;
	}

	@media (max-width: 768px) {
		.charts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
