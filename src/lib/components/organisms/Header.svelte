<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import { slide } from 'svelte/transition';
	import Building from '../atoms/Building.svelte';

	export let showBackground = false;
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
	}
</script>

<header class:has-background={showBackground}>
	<nav class="container">
		<a class="logo" href="/" aria-label="Site logo">
			<Logo />
		</a>

		<!-- Botón hamburguesa para móvil -->
		<button class="menu-toggle" on:click={toggleMenu} aria-label="Menú">
			<span class="hamburger" />
		</button>

		<!-- Menú móvil -->
		<div class="mobile-menu" class:is-open={isMenuOpen} transition:slide>
			<div class="mobile-links">
				<a href="/monitor" on:click={toggleMenu}>Monitor</a>
				<a href="/timeline" on:click={toggleMenu}>Linea de Tiempo</a>
				<a href="/map" on:click={toggleMenu}>Mapa</a>
				<a href="/mapinvestigation" on:click={toggleMenu}>Mapa de Investigaciones</a>
				<a href="/blog" on:click={toggleMenu}>Blog</a>
				<a href="/contactUs" on:click={toggleMenu}>Contáctanos</a>
				<a href="/aboutUs" on:click={toggleMenu}>Sobre Nosotros</a>
			</div>
			<div class="mobile-tools">
				<Building />
				<ThemeToggle />
			</div>
		</div>

		<!-- Menú desktop -->
		<div class="links desktop-only">
			<a href="/monitor">Mon.</a>
		</div>
		<div class="links desktop-only">
			<a href="/timeline">Hist.</a>
		</div>
		<div class="links desktop-only">
			<a href="/map">Mapa</a>
		</div>

		<div class="links desktop-only">
			<a href="/mapinvestigation">Proy.</a>
		</div>

		<div class="links desktop-only">
			<a href="/contactUs">Cont.</a>
		</div>

		<div class="links desktop-only">
			<a href="/aboutUs">Nos.</a>
		</div>

		<div class="links desktop-only">
			<a href="/blog">Blog</a>
			<Building />
			<ThemeToggle />
		</div>

		
		
	</nav>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	header {
		position: relative;
		padding: 30px 0;

		@include for-phone-only {
			padding: 20px 0;
		}

		&.has-background {
			background: linear-gradient(
				60deg,
				var(--color--waves-start) 0%,
				var(--color--waves-end) 100%
			);
		}

		.container {
			display: flex;
			align-items: center;
			gap: 30px;

			@include for-phone-only {
				.links {
					a {
						display: none;
					}
				}
			}
		}

		.logo {
			height: 44px;
			flex: 1;
		}

		a {
			color: var(--color--text);
		}

		.links {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 30px;

			a {
				text-decoration: none;

				&:hover {
					color: var(--color--primary);
					filter: drop-shadow(0px 0px 3px var(--color--primary));
				}
			}
		}
	}

	.menu-toggle {
		display: none;
		background: none;
		border: none;
		padding: 10px;
		cursor: pointer;
		z-index: 101;

		@include for-phone-only {
			display: block;
		}

		.hamburger {
			display: block;
			width: 24px;
			height: 2px;
			background: var(--color--text);
			position: relative;
			transition: 0.3s;

			&::before,
			&::after {
				content: '';
				position: absolute;
				left: 0; // Asegura alineación
				width: 100%; // Usa el ancho completo del padre
				height: 2px;
				background: var(--color--text);
				transition: 0.3s;
			}

			&::before {
				top: -6px; // Reducido de -8px
			}

			&::after {
				bottom: -6px; // Cambiado de top a bottom
			}
		}
	}

	.mobile-menu {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100vh;
		background: var(--color--card-background);
		z-index: 100;

		@include for-phone-only {
			&.is-open {
				display: flex;
				flex-direction: column;
				padding-top: 100px; // Espacio para el header
			}
		}

		.mobile-links {
			display: flex;
			flex-direction: column;
			gap: 20px;
			padding: 20px;
			flex: 1;

			a {
				padding: 15px;
				text-decoration: none;
				color: var(--color--text);
				border-radius: 8px;
				transition: all 0.3s;
				text-align: center;
				font-size: 1.2rem;
				background: var(--color--background);

				&:hover {
					background: var(--color--primary-tint);
					color: var(--color--primary);
					transform: translateY(-2px);
				}

				&:active {
					transform: translateY(0);
				}
			}
		}

		.mobile-tools {
			padding: 20px;
			border-top: 1px solid var(--color--border);
			display: flex;
			justify-content: center;
			align-items: center; // Alineación vertical
			gap: 30px; // Aumentado el espaciado
			background: var(--color--card-background);
			position: sticky;
			bottom: 0;

			:global(button), // Asegura que los botones sean visibles
			:global(a) {
				opacity: 1 !important;
				visibility: visible !important;
				display: flex !important;
				align-items: center;
				justify-content: center;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background: var(--color--background);
				transition: all 0.3s ease;

				&:hover {
					background: var(--color--primary-tint);
					transform: translateY(-2px);
				}

				&:active {
					transform: translateY(0);
				}
			}

			:global(svg) {
				// Asegura que los íconos sean visibles
				width: 20px;
				height: 20px;
				color: var(--color--text);
			}
		}
	}

	.desktop-only {
		@include for-phone-only {
			display: none !important;
		}
	}
</style>
