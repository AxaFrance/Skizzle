<script lang="ts">
  import type { LabelType } from "models/skizzle/PullRequestType";

  export let labels: LabelType[] = [];
</script>

<style src="./Labels.scss"></style>

{#if labels && labels.length > 0}
  <div class="skz-pullrequest__labels">
      {#each labels as label}
          <span class="skz-pullrequest__label">{label.name}</span>
      {/each}
  </div>
{/if}