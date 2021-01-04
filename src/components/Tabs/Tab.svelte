<script lang="ts">
	export let title;
	export let current: boolean = false;
	export let value: string;
	export let onChange;
</script>

<button on:click={onChange}> {title} </button>
