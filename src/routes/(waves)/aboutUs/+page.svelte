<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import AboutUs from '$lib/components/aboutUs/aboutUs.svelte';
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
</script>

<div class="container">
	<ContentSection title="Sobre Nosotros">
		<br />
		<br />
		<div class="card-overlay">
			<div class="header">
				<h2>
					Explora nuestra misión, visión y valores
					<SparklingHighlight color="primary">UYANA!</SparklingHighlight>
				</h2>
				<p>Descubre cómo estamos transformando el futuro con inovvación en Ecuador</p>
			</div>
			<AboutUs />
		</div>
	</ContentSection>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.card-overlay {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		transform: translateY(-2rem);

		// Efecto de elevación
		filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));

		// Responsive
		@include for-tablet-portrait-down {
			transform: translateY(-1rem);
			padding: 0 1rem;
		}

		@include for-phone-only {
			transform: translateY(0);
		}

		// Animación al cargar
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
