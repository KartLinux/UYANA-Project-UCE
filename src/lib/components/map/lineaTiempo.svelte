<script>
    // Variables reactivas
    export let minYear = 1900; // Año mínimo (personalizable)
    export let maxYear = 2025; // Año máximo (personalizable)
    export let initialYear = 2020; // Año inicial por defecto
  
    // Estado interno
    let selectedYear = initialYear;
    let filterType = 'until'; // Tipo de filtro: 'exact' (solo ese año) o 'until' (hasta ese año)
  
    // Función para cambiar el tipo de filtro
    function toggleFilterType() {
      filterType = filterType === 'exact' ? 'until' : 'exact';
      dispatchData();
    }
  
    // Función para emitir los datos al componente padre
    function dispatchData() {
      dispatch('update', {
        year: selectedYear,
        isExact: filterType === 'exact'
      });
    }
  
    // Importar la función createEventDispatcher de Svelte
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  </script>
  
  <style lang="scss">
    @import '$lib/scss/_themes.scss';
  
    .dial-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 220px; // Altura razonable
      
      background: linear-gradient(
  180deg,
  rgba(0, 0, 0, 0.9), /* Negro completamente opaco */
  rgba(8, 255, 107, 0.1) /* Verde más transparente */
);
      border-radius: 20px;
      border: 1px solid #85ff02;
      box-shadow: var(--card-shadow);
      overflow: hidden;
      position: relative;
  
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(var(--color--waves-start)),
          rgba(var(--color--waves-end))
        );
        animation: spin 10s linear infinite;
        transform-origin: center;
      }
    }
  
    .dial-scale {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin-top: 20px;
      position: relative;
      z-index: 2;
  
      .scale-mark {
        width: 2px; // Barras verticales finas
        height: 15px; // Altura base
        background: rgb(118, 172, 244); // Color gris transparente
        position: relative;
        transition: height 0.3s ease, background 0.3s ease;
  
        &:nth-child(5n) {
          height: 40px; // Barras más largas cada 5 años
        }
  
        &:nth-child(10n) {
          height: 60px; // Barras aún más largas cada 10 años
        }
  
        &.highlighted {
          background: #34f200; // Color azul/celeste cuando está resaltada
        }
      }
  
      .selected-year-label {
        position: absolute;
        top: -50px; /* Posición encima de la barra amarilla */
        transform: translateX(-50%);
        font-size: 1rem;
        font-weight: bold;
        color: var(--text-inverse);
        pointer-events: none; // Evitar que interfiera con el slider
        background: var(--color--primary); /* Fondo destacado */
        padding: 5px 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
  
    .slider {
      width: 80%;
      margin-top: 30px; // Separación entre la barra amarilla y el slider
      z-index: 2;
      position: relative;
  
      &::-webkit-slider-runnable-track {
        height: 5px;
        background: linear-gradient(
          90deg,
          var(--color--primary),
          var(--color--secondary)
        );
        border-radius: 5px;
      }
  
      &::-webkit-slider-thumb {
        appearance: none;
        width: 75px;
        height: 75px;
        background: #85ff02; // Color azul/celeste para el marcador del slider
        border: 3px solid var(--text-inverse);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
        transition: transform 0.2s ease-in-out;
  
        &:hover {
          transform: scale(2.2);
        }
      }
    }
  
    .filter-button {
        margin-top: 10px;
      padding: 5px 20px;
      background: linear-gradient(
            90deg,
            rgba(var(--color--primary)),
            rgba(var(--color--secondary)),
        );
      color: var(--text-inverse);
      border: 1px solid #85ff02;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      box-shadow: var(--card-shadow);
      transition: transform 0.2s ease-in-out;
  
      &:hover {
        transform: scale(1.1);
      }
    }
  </style>
  <div class="dial-container">
    <!-- Escala graduada -->
    <div class="dial-scale">
      {#each Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i) as year}
      <div
  class="scale-mark"
  data-year={year}
  class:highlighted={(year <= selectedYear && filterType === 'until') || (year === selectedYear && filterType === 'exact')}
></div>
      {/each}
  
      <!-- Etiqueta del año seleccionado -->
      <div
        class="selected-year-label"
        style={`left: ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%`}
      >
        {selectedYear}
      </div>
    </div>
  
    <!-- Slider oculto para controlar la selección -->
    <input
      type="range"
      class="slider"
      bind:value={selectedYear}
      min={minYear}
      max={maxYear}
      on:input={dispatchData}
    />
  
    <!-- Botón de filtro -->
    <button class="filter-button" on:click={toggleFilterType}>
      {filterType === 'exact' ? 'Solo este año' : 'Hasta este año'}
    </button>
  </div>