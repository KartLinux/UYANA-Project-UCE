<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import AluvionesMap from '$lib/components/map/AluvionesMap.svelte';
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
</script>

<div class="container">
	<ContentSection>
		<div class="card-overlay">
			<div class="header">
				<h2>
					<SparklingHighlight color="primary">MAPA</SparklingHighlight>
					DE ALUVIONES
				</h2>
				<p>Periodo 2010-2023</p>
			</div>
			<AluvionesMap />
		</div>
	</ContentSection>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.container {
		max-width: var(--size-content-width);
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.card-overlay {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		transform: translateY(-2rem);
		filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));

		@include for-tablet-portrait-down {
			transform: translateY(-1rem);
			padding: 0 1rem;
		}

		@include for-phone-only {
			transform: translateY(0);
		}

		animation: float 6s ease-in-out infinite;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;

		h2 {
			font-family: var(--font--title);
			font-size: 1.8rem;
			margin-bottom: 1rem;
			color: var(--color--text);
		}

		p {
			color: var(--color--text-shade);
			font-size: 1.1rem;
		}
	}

	@keyframes float {
		0% {
			transform: translateY(-2rem);
		}
		50% {
			transform: translateY(-2.5rem);
		}
		100% {
			transform: translateY(-2rem);
		}
	}

</style>
