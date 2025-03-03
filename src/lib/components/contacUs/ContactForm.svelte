<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import Button from '$lib/components/atoms/Button.svelte';
    import Sparkles from '$lib/components/atoms/Sparkles.svelte';
  
    let formData = {
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    };
  
    let enviado = false;
    let error = false;
  
    const handleSubmit = () => {
      // Aquí iría la lógica de envío del formulario
      enviado = true;
      formData = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      };
    };
  </script>
  
  <div class="contact-container" in:fade>
    <div class="contact-info" in:fly={{ y: 20, duration: 600 }}>
      <h2>Contáctanos</h2>
      <p>
        Somos estudiantes de la Facultad de Ingeniería y Ciencias Aplicadas de la Universidad Central del Ecuador, 
        carrera de Sistemas de Información. Estamos comprometidos con el desarrollo de soluciones tecnológicas 
        innovadoras para la Comunidad <b>Ecuatoriana.</b>
      </p>
      
      <div class="info-details">
        <div class="info-item">
          <span class="icon">📍</span>
          <div>
            <h3>Ubicación</h3>
            <p>Facultad de Ingeniería y Ciencias Aplicadas - UCE</p>
            <p>Ciudadela Universitaria, Quito - Ecuador</p>
          </div>
        </div>
  
        <div class="info-item">
          <span class="icon">📧</span>
          <div>
            <h3>Email</h3>
            <p>renriquez@uce.edu.ec</p>
          </div>
        </div>
  
        <div class="info-item">
          <span class="icon">🎓</span>
          <div>
            <h3>Facultad</h3>
            <p>Ingeniería y Ciencias Aplicadas</p>
            <p>Carrera de Sistemas de Información</p>
          </div>
        </div>
      </div>
    </div>
  
    <form 
      class="contact-form" 
      on:submit|preventDefault={handleSubmit}
      in:fly={{ y: 20, duration: 600, delay: 200 }}
    >
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input 
          type="text" 
          id="nombre"
          bind:value={formData.nombre}
          required
        />
      </div>
  
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email"
          bind:value={formData.email}
          required
        />
      </div>
  
      <div class="form-group">
        <label for="asunto">Asunto:</label>
        <input 
          type="text" 
          id="asunto"
          bind:value={formData.asunto}
          required
        />
      </div>
  
      <div class="form-group">
        <label for="mensaje">Mensaje:</label>
        <textarea 
          id="mensaje"
          bind:value={formData.mensaje}
          rows="5"
          required
        />
      </div>
  
      <div class="button-group">
        <Sparkles>
          <Button type="submit" color="primary">
            Enviar Mensaje
          </Button>
        </Sparkles>
      </div>
  
      {#if enviado}
        <div class="message success" transition:fade>
          ¡Mensaje enviado con éxito!
        </div>
      {/if}
  
      {#if error}
        <div class="message error" transition:fade>
          Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
        </div>
      {/if}
    </form>
  </div>
  
  <style lang="scss">
    @import '$lib/scss/breakpoints.scss';
  
    .contact-container {
      display: grid;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
  
      @include for-tablet-landscape-up {
        grid-template-columns: 1fr 1fr;
      }
    }
  
    .contact-info {
      h2 {
        font-family: var(--font--title);
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--color--text);
      }
  
      p {
        color: var(--color--text-shade);
        line-height: 1.6;
        margin-bottom: 2rem;
      }
    }
  
    .info-details {
      display: grid;
      gap: 1.5rem;
    }
  
    .info-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
  
      .icon {
        font-size: 1.5rem;
        background: var(--color--background);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color--border);
      }
  
      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--color--text);
      }
  
      p {
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
      }
    }
  
    .contact-form {
      background: var(--color--card-background);
      padding: 2rem;
      border-radius: 1rem;
      border: 2px solid var(--color--text);
      box-shadow: var(--card-shadow);
    }
  
    .form-group {
      margin-bottom: 1.5rem;
  
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color--text);
      }
  
      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--color--text);
        border-radius: 0.5rem;
        background: var(--color--background);
        color: var(--color--text);
        font-size: 1rem;
        transition: all 0.3s ease;
  
        &:focus {
          outline: none;
          border-color: var(--color--primary, #6200ea);
          box-shadow: 0 0 0 4px var(--color--primary-transparent, rgba(98, 0, 234, 0.5));
        }
      }
    }
  
    .button-group {
      display: flex;
      justify-content: flex-end;
    }
  
    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      text-align: center;
  
      &.success {
        background: var(--callout-background--success);
        color: var(--callout-accent--success);
      }
  
      &.error {
        background: var(--callout-background--error);
        color: var(--callout-accent--error);
      }
    }
  
    @include for-phone-only {
      .contact-container {
        padding: 1rem;
      }
  
      .contact-form {
        padding: 1.5rem;
      }
    }

  </style>