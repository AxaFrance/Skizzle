<script>
	import { organizations } from '../../shared/store';
	export let init;
	import { updateOrganization, isOffline } from '../../shared/store';

	const getIsDisabled = organization => $isOffline || organization.isBroken;
	const getIsChecked = organization =>
		organization.checked && !organization.isBroken;
</script>

<style src="./Settings.scss">

</style>

<button class="skz-settings-back" on:click={init}>Retour</button>
{#if $organizations.length}
	<p class="skz-organizations__intro">
		Sélectionnez les organisations pour lesquelles vous voulez voir les projets.
	</p>
{/if}
<ul class="skz-organizations__list">
	{#each $organizations as organization}
		<li>
			<input
				disabled={getIsDisabled(organization)}
				type="checkbox"
				id={organization.accountName}
				on:change={e => updateOrganization(e, organization)}
				checked={getIsChecked(organization)} />
			<label for={organization.accountName}>{organization.accountName}</label>
		</li>
	{:else}
		<p>Il n'y a aucune organisation valide sur votre compte.</p>
	{/each}
</ul>
