<script lang="ts">
	import { pullRequests } from '../shared/stores/default.store';
	import PullRequest from '../components/PullRequest';
</script>

{#each $pullRequests.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as pullRequest}
    <PullRequest {pullRequest} />
{/each}