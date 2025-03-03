<script>
	export let animated = true;
</script>

<div class="logo" class:animated>
	<div class="icon-container">
		<!-- Icono de montaña/volcán -->
		<svg class="mountain-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<!-- Sol/círculo ahora va primero para que esté detrás de las líneas -->
			<circle
				class="sun"
				cx="50"
				cy="30"
				r="4"
				fill="var(--sun-color)"
				filter="drop-shadow(0 0 2px var(--sun-glow-color))"
			/>
			<path d="M50,10 L90,90 H10 Z" fill="none" stroke="currentColor" stroke-width="4" />
			<!-- Líneas que representan actividad/eventos -->
			<path d="M30,50 Q50,30 70,50" fill="none" stroke="currentColor" stroke-width="2" />
		</svg>
	</div>

	<svg
		id="logo-text"
		width="723.84009"
		height="116.720268"
		viewBox="0 0 723.84009 116.720269"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<text xml:space="preserve" id="text" transform="translate(-278.77228,-206.83728)">
			<tspan x="275.57227" y="292.17088">
				<tspan style="font-size:106.667px;font-family:YoungSerif;">UYANA</tspan>
			</tspan>
		</text>
	</svg>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	:global(:root) {
		--sun-color: #000000;
		--sun-glow-color: rgba(0, 0, 0, 0.5);
	}

	:global([data-theme='dark']) {
		--sun-color: #ffffff;
		--sun-glow-color: rgba(255, 255, 255, 0.5);
	}

	.logo {
		width: auto;
		height: 100%;
		display: flex;
		gap: 16px;
		align-items: center;

		@include for-phone-only {
			gap: 8px;
		}

		.icon-container {
			height: 100%;
			max-height: 40px;
			aspect-ratio: 1;

			.mountain-icon {
				width: 100%;
				height: 100%;
				color: var(--color--text);
				transition: all 0.2s ease-in-out;

				.sun {
					transition: all 0.3s ease-in-out;
					transform-origin: center;
				}
			}
		}

		#logo-text {
			width: auto;
			height: 100%;
			max-height: 44px;

			#text {
				transition: all 0.2s ease-in-out;
				fill: var(--color--text);
			}
		}

		&:hover {
			.mountain-icon {
				filter: drop-shadow(0px 0px 3px var(--color--primary));

				.sun {
					transform: scale(1.2);
					filter: drop-shadow(0px 0px 4px var(--sun-glow-color));
				}
			}
			#logo-text {
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}

	@media screen and (prefers-reduced-motion: no-preference) {
		.animated {
			.mountain-icon {
				animation: svg-text-stroke 3s;

				.sun {
					animation: sun-glow 2s infinite ease-in-out;
				}
			}

			#text {
				animation: svg-text-stroke 3s;
				stroke-width: 2;
				--text-color: var(--color--text);
			}
		}
	}

	@keyframes sun-glow {
		0% {
			filter: drop-shadow(0 0 2px var(--sun-glow-color));
			transform: scale(1);
		}
		50% {
			filter: drop-shadow(0 0 6px var(--sun-glow-color));
			transform: scale(1.1);
		}
		100% {
			filter: drop-shadow(0 0 2px var(--sun-glow-color));
			transform: scale(1);
		}
	}
</style>
