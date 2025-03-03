<script lang="ts">
    import type { AluvionProcesado } from '$lib/types/aluvion.types';
    import { formatters } from '$lib/utils/formatters';
    import Card from '$lib/components/atoms/Card.svelte';

    const { formatNumber } = formatters;

    export let aluviones: AluvionProcesado[] = [];

    // KPIs básicos
    $: totalEventos = aluviones.length;
    $: totalFallecidos = aluviones.reduce((sum, a) => sum + Number(a.fallecidas || 0), 0);
    $: totalHeridos = aluviones.reduce((sum, a) => sum + Number(a.heridas || 0), 0);
    $: totalDesaparecidos = aluviones.reduce(
        (sum, a) => sum + Number(a.personasDesaparecidas || 0),
        0
    );
    $: totalAfectadosDirectos = aluviones.reduce(
        (sum, a) => sum + Number(a.afectadosDirectos || 0),
        0
    );

    // KPIs estadísticos
    $: eventosPorAnio = aluviones.reduce((acc, evento) => {
        const anio = evento.anio || 'Sin año';
        acc[anio] = (acc[anio] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    $: anioMasEventos = Object.entries(eventosPorAnio).sort(([, a], [, b]) => b - a)[0] || [
        'Sin datos',
        0
    ];

    $: eventosPorMes = aluviones.reduce((acc, evento) => {
        const fecha = new Date(evento.fechaEvento);
        const mes = fecha.getMonth();
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    $: mesMasEventos = Object.entries(eventosPorMes).sort(([, a], [, b]) => b - a)[0] || ['0', 0];

    $: provinciaMasEventos = aluviones.reduce((acc, evento) => {
        const provincia = evento.provincia || 'Sin provincia';
        acc[provincia] = (acc[provincia] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    $: provinciaMasAfectada = Object.entries(provinciaMasEventos).sort(
        ([, a], [, b]) => b - a
    )[0] || ['Sin datos', 0];

    $: causasPrincipales = aluviones.reduce((acc, evento) => {
        const causa = evento.causa || 'Sin causa';
        acc[causa] = (acc[causa] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    $: causaMasComun = Object.entries(causasPrincipales).sort(([, a], [, b]) => b - a)[0] || [
        'Sin datos',
        0
    ];

    const getNombreMes = (mes: string) => {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[parseInt(mes)];
    };
</script>

<div class="kpi-grid">
    <Card additionalClass="kpi-card main">
        <div slot="content" class="kpi-content">
            <h3>Total Aluviones</h3>
            <p class="kpi-number primary">{formatNumber(totalEventos.toString())}</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Fallecidos</h3>
            <p class="kpi-number error">{formatNumber(totalFallecidos.toString())}</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Heridos</h3>
            <p class="kpi-number warning">{formatNumber(totalHeridos.toString())}</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Desaparecidos</h3>
            <p class="kpi-number secondary">{formatNumber(totalDesaparecidos.toString())}</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Afectados Directos</h3>
            <p class="kpi-number info">{formatNumber(totalAfectadosDirectos.toString())}</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Año con más aluviones</h3>
            <p class="kpi-number info">{anioMasEventos[0]}</p>
            <p class="kpi-subtitle">({anioMasEventos[1]} aluviones)</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Mes con más aluviones</h3>
            <p class="kpi-number secondary">{getNombreMes(mesMasEventos[0])}</p>
            <p class="kpi-subtitle">({mesMasEventos[1]} aluviones)</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Provincia más afectada</h3>
            <p class="kpi-number warning">{provinciaMasAfectada[0]}</p>
            <p class="kpi-subtitle">({provinciaMasAfectada[1]} aluviones)</p>
        </div>
    </Card>

    <Card additionalClass="kpi-card">
        <div slot="content" class="kpi-content">
            <h3>Causa más común</h3>
            <p class="kpi-number info">{causaMasComun[0]}</p>
            <p class="kpi-subtitle">({causaMasComun[1]} aluviones)</p>
        </div>
    </Card>
</div>

<style lang="scss">
    @import '$lib/scss/breakpoints.scss';

    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        width: 100%;
        margin-bottom: 2rem;

        @include for-phone-only {
            grid-template-columns: 1fr;
        }
    }

    .kpi-content {
        text-align: center;
        padding: 1.5rem;

        h3 {
            font-size: 1.1rem;
            color: var(--color--text-shade);
            margin-bottom: 0.5rem;
        }

        .kpi-number {
            font-size: 2rem;
            font-weight: 700;
            font-family: var(--font--title);
            margin-bottom: 0.5rem;

            &.primary { color: var(--color--primary); }
            &.error { color: var(--color--callout-accent--error); }
            &.warning { color: var(--color--callout-accent--warning); }
            &.secondary { color: var(--color--secondary); }
            &.info { color: var(--color--callout-accent--info); }
        }

        .kpi-subtitle {
            font-size: 0.9rem;
            color: var(--color--text-shade);
        }
    }
</style>