<script lang="ts">
	import type { AluvionProcesado } from '$lib/types/aluvion.types';
	import AluvionesKPICards from './AluvionesKPICards.svelte';
	import AluvionesCharts from './AluvionesCharts.svelte';

	export let aluviones: AluvionProcesado[] = [];
</script>

<section class="dashboard">
	<AluvionesKPICards {aluviones} />
	<AluvionesCharts {aluviones} />
</section>
