<script>
	import {
		isFetchingData,
		isLoading,
		projects,
		repositories,
		pullRequests,
	} from 'shared/stores/default.store';
	import {
		checkOrganization,
		checkProject,
		checkRepository,
		deleteRepository,
	} from 'utils';
	export let profile;
	$: followedRepositories = $repositories.filter(
		x => x.checked && x.provider === profile.provider,
	);
	console.log({ $repositories });
</script>

<style>
	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}
</style>

<p class="intro">
	Vous suivez actuellement <b>{followedRepositories.length}</b> repositories sur Azure
	DevOps.
</p>
{#each followedRepositories as repository}
	<label for={repository.repositoryId}>
		<strong>{repository.projectName}</strong>
		<strong>{repository.name}</strong>
		<button
			on:click={() => deleteRepository(repository)}
			disabled={$isFetchingData}>
			Delete
		</button>
	</label>
{/each}
