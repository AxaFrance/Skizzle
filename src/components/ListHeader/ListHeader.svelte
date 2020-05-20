<script>
  import { pullRequests, refreshDelay, organizations, isFetchingPullRequests, profile, listIsFiltered, isOffline } from '../../shared/store';
  import { getPullRequests } from '../../shared/requester';

  const toggleFilter = () => {
    listIsFiltered.update(isFiltered => !isFiltered);
    getPullRequests({ isFiltered: $listIsFiltered, organizations: $organizations, profileId: $profile.id })
  };

  const onClick = () => getPullRequests({ organizations: $organizations, shouldNotify: true, isFiltered: $listIsFiltered, profileId: $profile.id });
</script>

<style src="./ListHeader.scss"></style>

<header class="skz-pullrequests-header">
  <h1 class="skz-pullrequests-title">
    {$pullRequests.length} Pull request{$pullRequests.length > 1 ? 's' : ''}
    {#if !$isOffline}
      {#if !$refreshDelay && !$isFetchingPullRequests}
        <button class="skz-refresh-button" on:click={onClick}>
          Rafraîchir
        </button>
      {/if}
      {#if $isFetchingPullRequests}
        <small class="skz-fetching-status">Mise à jour...</small>
      {/if}
    {/if}
  </h1>
  <button disabled={$isOffline} class="skz-pullrequests-filters" on:click={toggleFilter}>{$listIsFiltered ? 'Afficher la liste complète' : 'Filtrer la liste'}</button>
</header>