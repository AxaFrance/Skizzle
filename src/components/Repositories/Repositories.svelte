<script>
  import { updateRepository, isOffline } from '../../shared/store';
  export let repositories = [];
</script>

<style src="./Repositories.scss"></style>

{#if repositories && repositories.length > 0}
  <ul class="skz-repos">
    {#each repositories as repository (repository.id)}
      <li class="skz-repo">
        <input
          disabled={$isOffline}
          type="checkbox"
          id={repository.id}
          on:change={e => updateRepository(e, repository)}
          checked={repository.checked}
        />
        <label class="skz-repo__name" for={repository.id}>{repository.name}</label>
      </li>
    {/each}
  </ul>
{:else}
  <div class="skz-repos">
    <p>Aucun repository pour ce projet.</p>
  </div>
{/if}
