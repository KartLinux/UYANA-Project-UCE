<script>
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import Image from '../atoms/Image.svelte';
</script>

<section id="about">
	<div class="info">
		<h2>
			Descubre eventos históricos en Ecuador con
			<SparklingHighlight color="secondary">mapas interactivos</SparklingHighlight>
		</h2>
		<p>
			Esta plataforma permite explorar eventos naturales en Ecuador desde 2010 hasta 2023, como
			aluviones, terremotos e inundaciones. Utiliza filtros avanzados y gráficos dinámicos para
			analizar tendencias y datos relevantes.
		</p>
		<div class="socials">
			<span>Redes Sociales:</span>
			<Socials />
		</div>
	</div>
	<div class="image">
		<Image src="/images/mapa-aluviones.png" alt="Sample for the static template" />
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#about {
		position: relative;
		display: grid;
		grid-template-columns: 500px 450px;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 10px;

		@include for-phone-only {
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 20px;
		}

		.info {
			display: flex;
			flex-direction: column;
			gap: 10px;
			h2 {
				@include for-phone-only {
					text-align: center;
				}
			}

			p {
				@include for-phone-only {
					text-align: justify;
				}
			}

			@include for-phone-only {
				gap: 20px;
			}
		}

		.socials {
			display: flex;
			align-items: center;
			gap: 15px;

			@include for-phone-only {
				justify-content: center;
				margin-bottom: 10px;
				span {
					display: none;
				}
			}
		}

		.image {
			width: 420px;
			height: 320px;
			border-radius: 50% 50% 50% 50%;
		}
	}
</style>
