<script lang="ts">
	export let title;
	export let intro;
	export let outro;
</script>

<style>
	legend {
		font-family: 'roboto slab', serif;
	}

	fieldset {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #555;
	}

	fieldset:not(:last-child) {
		margin-bottom: 2rem;
	}

	p {
		font-size: 0.8rem;
	}

	p:not(:last-child) {
		margin-bottom: 1rem;
	}
</style>

<fieldset>
	<legend>{title}</legend>
	{#if intro}
		<p>{intro}</p>
	{/if}
	<slot />
	{#if outro}
		<p>{outro}</p>
	{/if}
</fieldset>
