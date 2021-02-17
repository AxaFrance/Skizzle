<script lang="ts">
  import marked from 'marked'
	import { Service } from 'services/Service';
	import type { CommentType } from 'models/skizzle';

	export let comment: CommentType;
</script>

<div class="comment">
	{#await Service.getAvatar(comment.provider, comment.author.avatar, comment.organizationName) then avatar}
		<div class="avatar">
			<img width="64" height="64" src={avatar} alt={comment.author.displayName} />
		</div>
	{/await}
	<div class="content">
		<h2>{comment.author.displayName} <small>{comment.date}</small></h2>
		<div>{@html marked(comment.text)}</div>
	</div>
</div>

<style>
	.avatar {
		margin-right: 1rem;
	}

	.avatar img {
		overflow: hidden;
		border-radius: 50%;
	}

	.comment {
		display: flex;
	}

	.comment:not(:last-child) {
		margin-bottom: 1rem;
	}

	.content {
		position: relative;
		padding: 1rem;
		border-radius: 8px;
		background-color: #4c4c4c;
	}

	.content:before {
		content: '';
		position: absolute;
		left: -0.5rem;
		top: calc(32px - 0.5rem);
		width: 0;
		height: 0;
		border-right: 0.5rem solid #4c4c4c;
		border-left: 0;
		border-top: 0.5rem solid transparent;
		border-bottom: 0.5rem solid transparent;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	h2 small {
		font-size: 0.8rem;
		font-weight: normal;
	}

	h2 + div {
		font-size: 0.9rem;
		line-height: 1.3;
		color: #ddd;
	}
</style>
