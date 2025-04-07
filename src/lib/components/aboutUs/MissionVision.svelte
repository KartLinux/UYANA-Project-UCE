<script lang="ts">
  import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
  import { fade, fly } from 'svelte/transition';
  
  // Añadimos una prop para controlar la animación
  export let animationDelay = 0;
  
  // Datos estructurados para las tarjetas
  const cards = [
    {
      title: 'Nuestra Misión',
      icon: '🎯',
      highlight: 'UYANA!',
      description: 'Nuestra misión es informar a toda la comunidad.....'
    },
    {
      title: 'Nuestra Visión',
      icon: '🔭',
      description: 'En UYANA, nuestra visión es un mundo en el que la....'
    }
  ];
</script>

<div class="cards-section" in:fly={{ y: 20, duration: 600, delay: animationDelay }}>
  {#each cards as card, i}
    <div 
      class="flip-card" 
      in:fly={{ y: 20, duration: 600, delay: animationDelay + (i * 200) }}
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <h2>
            {card.title}
            {#if card.highlight}
              <SparklingHighlight color="primary">{card.highlight}</SparklingHighlight>
            {/if}
          </h2>
          <div class="icon" transition:fade>{card.icon}</div>
        </div>
        <div class="flip-card-back">
          <p>{card.description}</p>
        </div>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .cards-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .flip-card {
    background-color: transparent;
    height: 300px;
    perspective: 1000px;
    
    &:hover .flip-card-inner {
      transform: rotateY(180deg);
    }
    
    // Añadimos animación al hover
    &:hover .icon {
      transform: scale(1.1);
    }
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--color--card-background);
    border: 1px solid var(--color--border);
    box-shadow: var(--card-shadow);
    
    // Añadimos transición suave al hover
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: var(--card-shadow-hover, 0 8px 30px rgba(0, 0, 0, 0.12));
    }
  }

  .flip-card-front {
    .icon {
      font-size: 4rem;
      margin: 1rem 0;
      transition: transform 0.3s ease;
    }
  }

  .flip-card-back {
    transform: rotateY(180deg);
    background: var(--color--primary);
    color: rgb(1, 1, 1);

    p {
      line-height: 1.6;
      font-size: 1.1rem;
      max-width: 90%;
      margin: 0 auto;
    }
  }

  h2 {
    font-family: var(--font--title);
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color--text);
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  // Añadimos media queries para mejor responsividad
  @media (max-width: 768px) {
    .cards-section {
      gap: 1.5rem;
    }
    
    .flip-card {
      height: 250px;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .flip-card-front .icon {
      font-size: 3rem;
    }
  }
</style> 