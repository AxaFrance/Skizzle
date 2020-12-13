<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let condition: boolean;
    export let message: string;

    const dispatch = createEventDispatcher();

    const retry = () => dispatch('retry')
</script>

{#if condition}
	<h3 style="color: #ff0000">{message}</h3>
	<button on:click={retry}>Reesayer</button>
{/if}