<script>
  
  import { refreshDelay, organizations, updateOrganization, isOffline, language } from '../../../shared/store';
  import { addItem } from '../../../shared/storage';

  export let init;
  export let title;

  const getIsDisabled = organization => $isOffline || organization.isBroken;
  const getIsChecked = organization => organization.checked && !organization.isBroken;
</script>

<style src="../Settings.scss"></style>

<button class="skz-settings-back" on:click={init}>{language.getWord('Back')}</button>
<h1 class="skz-settings-title">{title}</h1>
{#if $organizations.length}
  <p class="skz-organizations__intro">{language.getWord('ProjectsOrganizations')}</p>
{/if}
<ul class="skz-organizations__list">
  {#each $organizations as organization}
    <li>
      <input disabled={getIsDisabled(organization)} type="checkbox" id={organization.accountName} on:change={e => updateOrganization(e, organization)} checked={getIsChecked(organization)} />
      <label for={organization.accountName}>{organization.accountName}</label>
    </li>
  {:else}
    <p>{language.getWord('OrganizationsEmpty')}</p>
  {/each}
</ul>

