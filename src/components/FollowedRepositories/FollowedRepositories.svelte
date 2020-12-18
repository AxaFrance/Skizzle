<script>
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import { deleteRepository } from 'utils';
	import Icons from 'components/icons';
	export let profile;

	$: followedRepositories = $repositories.filter(
		({ checked, provider }) => checked && provider === profile.provider,
	);
</script>

<style>
	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}

	b {
		color: #ff8a00;
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.project {
		margin-right: 0.5rem;
	}

	.project:after {
		content: '/';
		margin-left: 0.5rem;
		color: #ccc;
	}

	.repository {
		margin-right: auto;
	}

	button {
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.5;
	}
</style>

<p class="intro">
	Vous suivez actuellement <b>{followedRepositories.length}</b> repositories sur Azure
	DevOps.
</p>
<ul>
	{#each followedRepositories as repository}
		<li>
			<span class="project">{repository.projectName}</span>
			<span class="repository">{repository.name}</span>
			<button
				on:click={() => deleteRepository(repository)}
				disabled={$isFetchingData}>
				<Icons.Delete />
			</button>
		</li>
	{/each}
</ul>
