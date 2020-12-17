<script lang="ts">
	import { checkProject, checkRepository } from 'utils';
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import type { ProjectType } from 'models/skizzle/ProjectType';
	
	export let projects: ProjectType[];
</script>

<ul>
	{#each projects as project}
		<li>
			<label for={project.projectId}>
				{project.name}
				<input
					type="checkbox"
					id={project.projectId}
					checked={project.checked}
					on:change={event => checkProject(event, project)}
					disabled={$isFetchingData} />
			</label>
			<ul>
				{#each $repositories.filter(x => x.projectId === project.projectId) as repository}
					<li>
						<label for={repository.repositoryId}>
							{repository.name}
							<input
								type="checkbox"
								id={repository.repositoryId}
								checked={repository.checked}
								on:change={event => checkRepository(event, repository)}
								disabled={$isFetchingData} />
						</label>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
