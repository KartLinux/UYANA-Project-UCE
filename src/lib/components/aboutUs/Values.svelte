<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  // Exportamos la prop para controlar el delay de la animación
  export let animationDelay = 200;

  // Iconos para cada valor
  const values = [
    {
      title: 'Sostenibilidad',
      description: 'Promulgar la proteccion del medio ambiente y reducimos la huella de carbono.',
      icon: '🌱',
      color: '#4CAF50'
    },
    {
      title: 'Innovación',
      description: '......',
      icon: '💡',
      color: '#2196F3'
    },
    {
      title: 'Orientación la comunidad',
      description: '...',
      icon: '🎯',
      color: '#9C27B0'
    },
    {
      title: 'Trabajo en equipo',
      description: 'Colaboración y aprovechamiento máximo de habilidades.',
      icon: '🤝',
      color: '#FF9800'
    },
    {
      title: 'Integridad',
      description: 'Honestidad, transparencia y ética en nuestras decisiones.',
      icon: '⚖️',
      color: '#607D8B'
    },
    {
      title: 'Excelencia',
      description: 'Calidad en proyectos y servicios.',
      icon: '🏆',
      color: '#F44336'
    },
    {
      title: 'Respeto',
      description: 'Valoramos la diversidad y la cultura.',
      icon: '🌍',
      color: '#00BCD4'
    }
  ];
</script>

<div class="values-section" in:fly={{ y: 20, duration: 600, delay: animationDelay }}>
  <h2 class="section-title" in:fade={{ duration: 400, delay: animationDelay }}>
    Nuestros Valores
  </h2>
  <div class="values-grid">
    {#each values as value, i}
      <div 
        class="value-card"
        in:fly={{ 
          y: 20, 
          duration: 600, 
          delay: animationDelay + (i * 100) 
        }}
      >
        <div class="value-content">
          <div class="icon-wrapper" style="--value-color: {value.color}">
            <span class="icon">{value.icon}</span>
          </div>
          <div class="text-content">
            <h3>{value.title}</h3>
            <p class="value-description">{value.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .values-section {
    margin: 2rem 0;
    overflow: hidden;
  }

  .section-title {
    font-family: var(--font--title);
    font-size: 2rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--color--text);
    font-weight: 700;
    letter-spacing: -0.5px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: var(--color--primary);
      border-radius: 2px;
    }
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }

  .value-card {
    background: var(--color--card-background);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--color--border);
    height: auto;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

      .icon-wrapper {
        transform: scale(1.1);
        
        .icon {
          transform: rotate(360deg);
        }
      }

      .text-content {
        transform: translateY(-2px);
      }
    }
  }

  .value-content {
    padding: 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--value-color);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
      z-index: 1;
    }

    .icon {
      font-size: 1.8rem;
      position: relative;
      z-index: 2;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .text-content {
    flex-grow: 1;
    transition: transform 0.3s ease;

    h3 {
      color: var(--color--text);
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
  }

  .value-description {
    color: var(--color--text-shade);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
    opacity: 0.9;
  }

  // Mejoras de responsividad
  @media (max-width: 768px) {
    .values-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 0.5rem;
    }

    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }

    .value-content {
      padding: 1.5rem;
      gap: 1rem;
    }

    .icon-wrapper {
      width: 50px;
      height: 50px;

      .icon {
        font-size: 1.5rem;
      }
    }

    .text-content h3 {
      font-size: 1.1rem;
    }

    .value-description {
      font-size: 0.9rem;
    }
  }

  // Optimizaciones de rendimiento
  @media (prefers-reduced-motion: reduce) {
    .value-card,
    .icon-wrapper,
    .icon,
    .text-content {
      transition: none;
    }

    .value-card:hover {
      .icon-wrapper {
        transform: none;
        
        .icon {
          transform: none;
        }
      }

      .text-content {
        transform: none;
      }
    }
  }
</style> 