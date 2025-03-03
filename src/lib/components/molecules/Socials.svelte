<script>
	import TelegramIcon from '$lib/icons/socials/telegram.svelte';
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
	import EmailIcon from '$lib/icons/socials/email.svelte';
	import RssIcon from '$lib/icons/rss.svelte';
	import MastodonIcon from '$lib/icons/socials/mastodon.svelte';
</script>

<div class="socials">
	<a
		href="https://www.uce.edu.ec/"
		target="_blank"
		rel="noopener noreferrer"
		title="Di hola en Telegram"
	>
		<TelegramIcon />
	</a>
	<a
		href="https://www.uce.edu.ec/"
		target="_blank"
		rel="me noreferrer"
		title="Di hola en Mastodon"
	>
		<MastodonIcon />
	</a>
	<a
		href="https://www.uce.edu.ec/"
		target="_blank"
		rel="noopener noreferrer"
		title="Mira el perfil GitHub"
	>
		<GitHubIcon />
	</a>
	<a
		href="https://www.uce.edu.ec/"
		target="_blank"
		rel="noopener noreferrer"
		title="Conéctate en LinkedIn"
	>
		<LinkedInIcon />
	</a>
	<a
		href="https://www.uce.edu.ec/"
		target="_blank"
		rel="noopener noreferrer"
		title="Envia un email"
	>
		<EmailIcon />
	</a>
</div>

<style lang="scss">
	@import '../../scss/breakpoints.scss';
	.socials {
		display: flex;
		align-items: center;
		gap: 20px;

		a {
			transition: all 0.2s ease-in-out;
			width: 24px;
			color: var(--color--text);
			fill: var(--color--text);

			&:hover {
				color: var(--color--primary);
				fill: var(--color--primary);
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
