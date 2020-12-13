<script lang="ts">
  import { ProviderEnum } from "../../models/skizzle/ProviderEnum";
  import type { PullRequestType } from "models/skizzle/PullRequestType";
  import { Service } from "services/Service";
  import Labels from '../Labels';

  export let pullRequest: PullRequestType;
</script>

<style src="./PullRequest.scss"></style>

<div class="skz-pullrequest">
  <div class="skz-pullrequest-avatar">
    {#await Service.getAvatar(pullRequest.provider, pullRequest.user.avatar, pullRequest.organizationName)}
      <p>Chargement...</p>
    {:then avatar}
      {#if pullRequest.provider === ProviderEnum.AzureDevOps}
        <img class="skz-pullrequest-avatar__provider" src="../assets/azure-logo.svg" alt={pullRequest.provider}>
      {:else if pullRequest.provider === ProviderEnum.Github}
        <img class="skz-pullrequest-avatar__provider" src="../assets/github-logo.svg" alt={pullRequest.provider}>
      {/if}
      <img class="skz-pullrequest-avatar__profile" width="64" height="64" src={avatar} alt={pullRequest.user.name} />
    {:catch}
      <p>Chargement...</p>
    {/await}
  </div>
  <div class="skz-pullrequest__details">
		<h2 class="skz-pullrequest__author">
      {pullRequest.user.name} - {pullRequest.dateStr}
      {#if pullRequest.projectName}
        <span>{pullRequest.projectName}</span>
      {/if}
		</h2>
		<h3 class="skz-pullrequest__title">
			{pullRequest.title}
		</h3>
    <p class="skz-pullrequest__repo">{pullRequest.repositoryName}</p>
    <div class="skz-pullrequest-infos">
      <Labels labels={pullRequest.labels} />
    </div>
	</div>
</div>
