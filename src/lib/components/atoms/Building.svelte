<script lang="ts">
	import BuildingIcon from '$lib/icons/building.svelte';
</script>

<a
	href="https://www.uce.edu.ec/"
	target="_blank"
	rel="noopener noreferrer"
	title="Universidad Central del Ecuador"
>
	<BuildingIcon />
</a>

<style lang="scss">
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
</style>
