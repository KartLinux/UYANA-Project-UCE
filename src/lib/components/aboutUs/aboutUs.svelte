<script lang="ts">
  import { fade } from 'svelte/transition';
  import MissionVision from './MissionVision.svelte';
  import Values from './Values.svelte';
  import Team from './Team.svelte';
</script>

<section class="about-container" in:fade>
  <MissionVision />
  <Values />
  <Team />
</section>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    gap: 3rem;
  }

  @include for-tablet-portrait-down {
    .about-container {
      padding: 1rem;
    }
  }
</style>