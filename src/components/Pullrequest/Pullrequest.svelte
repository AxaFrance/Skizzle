<script lang="ts">
	const { shell } = require('electron');
	import type { PullRequestType } from 'models/skizzle/PullRequestType';
	import { isFetchingData } from '../../shared/stores/default.store';
	import Labels from 'components/Labels';
	import Modale from 'components/Modale';
	import Avatar from 'components/Avatar';
	import Reviews from 'components/Reviews';
	import Icons from 'components/icons';
	import Comment from 'components/Comment';
	
	export let pullRequest: PullRequestType;

	let detailsModal = false;

	const openLink = () => shell.openExternal(pullRequest.url);
	const openModale = () => detailsModal = true;
	const closeModale = () => detailsModal = false;
</script>

<style>
	.pr {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 1rem;
		color: #fff;
		border-radius: 8px;
		background-color: #444;
		transition: opacity linear 0.2s;
	}

	.pr:hover {
		opacity: 0.8;
	}

	:global(.pr__avatar) {
		margin-right: 1rem;
	}

	.details {
		flex: 1 0 auto;
	}

	header {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		color: #aaa;
	}

	.author {
		margin-right: auto;
		font-size: 0.8rem;
		line-height: 1;
	}

	.title {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		line-height: 1;
		font-weight: normal;
	}

	.repo {
		font-size: 0.8rem;
		color: #aaa;
		line-height: 1;
	}

	footer {
		display: flex;
		align-items: center;
		width: calc(100% + 2rem);
		margin: 1rem -1rem -1rem;
		padding: 0.5rem 1rem;
		border-radius: 0 0 8px 8px;
		background-color: #3e3e3e;
	}

	.more {
		position: relative;
		z-index: 1;
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		margin-left: auto;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.more:hover {
		background-color: #333;
	}

	.link {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.no-comment {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		text-align: center;
		transform: translateY(-50%);
	}
</style>

<div class="pr">
	<button class="link" on:click={openLink} />
	<Avatar className="pr__avatar" {pullRequest} />
	<div class="details">
		<header>
			<h2 class="author">{pullRequest.user.name} - {pullRequest.dateStr}</h2>
			{#if pullRequest.projectName}
				<span class="project">{pullRequest.projectName}</span>
			{/if}
		</header>
		<h3 class="title">{pullRequest.title}</h3>
		<p class="repo">{pullRequest.repositoryName}</p>
	</div>
	<footer>
		{#if pullRequest.reviewers}
			<Reviews reviews={pullRequest.reviewers} />
		{/if}
		<Labels labels={pullRequest.labels} />
		<button
			class="more"
			on:click={openModale}
			disabled={$isFetchingData}>
			<Icons.Ellipsis />
		</button>
	</footer>
</div>
{#if detailsModal}
	<Modale onClose={closeModale}>
		{#each pullRequest.comments as comment}
			<Comment {comment} />
		{:else}
			<p class="no-comment">Il n'y a aucun commentaire sur cette pull request.</p>
		{/each}
	</Modale>
{/if}
