<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import ContactForm from '$lib/components/contacUs/ContactForm.svelte';
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
</script>

<div class="container">
	<ContentSection title="Contacto">
		<br />
		<br />
		<div class="card-overlay">
			<div class="header">
				<h2>
					¿Tienes alguna pregunta sobre
					<SparklingHighlight color="primary">UYANA!</SparklingHighlight>?
				</h2>
				<p>Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.</p>
			</div>
			<ContactForm />
		</div>
	</ContentSection>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

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
