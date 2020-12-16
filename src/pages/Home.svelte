<script lang="ts">
	import { pullRequests } from '../shared/stores/default.store';
	import PullRequest from '../components/PullRequest';
	import type { CommentType } from 'models/skizzle/CommentType';
import { Service } from 'services/Service';

	$: fetchedComments = Promise.resolve<CommentType[]>([])
</script>

{#each $pullRequests.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as pullRequest}
    <PullRequest {pullRequest} on:comments={(event) => fetchedComments = event.detail.fetchedComment}/>
{/each}

<div style="color: white;">
	{#await fetchedComments then comments}
		{#each comments as comment}
			{#await Service.getAvatar(comment.provider, comment.author.avatar, comment.organizationName) then avatar}
				<img width="64" height="64" src={avatar} alt={comment.author.displayName} />
			{/await}
			<p>Name: {comment.author.displayName}</p>
			<p>Date: {comment.date}</p>
			<p>Text: {comment.text}</p>
			<p>Provider: {comment.provider}</p>
		{:else}
			<p>Aucun commentaire</p>
		{/each}
	{/await}
</div>
