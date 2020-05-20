<script>
    export let labels = [];
</script>

<style src="./Labels.scss"></style>

{#if labels && labels.length > 0}
    <div class="skz-pullrequest__labels">
        {#each labels as label}
            <span class="skz-pullrequest__label">{label.name}</span>
        {/each}
    </div>
{/if}