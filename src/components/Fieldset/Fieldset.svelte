<script lang="ts">
	export let title: string = undefined;
	export let intro: string = undefined;
	export let outro: string = undefined;
</script>

<fieldset>
	<legend>{title}</legend>
	<div class="content">
		{#if intro}
			<p>{intro}</p>
		{/if}
		<slot />
		{#if outro}
			<p>{outro}</p>
		{/if}
	</div>
</fieldset>

<style>
	legend {
		float: left;
		margin-bottom: 0.2rem;
		font-size: 1.3rem;
		font-family: 'roboto slab', serif;
	}

	.content {
		clear: both;
	}

	fieldset {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #444;
	}

	fieldset:not(:last-child) {
		margin-bottom: 1rem;
	}

	p {
		font-size: 1rem;
		color: #ccc;
	}

	p:not(:last-child) {
		margin-bottom: 1rem;
	}
</style>
