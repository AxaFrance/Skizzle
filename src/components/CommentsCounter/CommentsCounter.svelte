<script>
	export let comments = [];
	export let hasResponse;
	export let action;

	const isDisplayed = comments && comments.length > 0;
	const isCommentResolved = ({ status }) =>
		status && status !== 'active' && status !== 'pending';
	const commentsResolved =
		comments.filter(isCommentResolved).length === comments.length;
	const classModifier = commentsResolved
		? 'skz-comments-counter--all-resolved'
		: hasResponse
		? 'skz-comments-counter--responses'
		: '';

	const onClick = e => {
		e.preventDefault();
		action();
	};
</script>

<style src="./CommentsCounter.scss">
</style>

{#if isDisplayed}
	<p on:click={onClick} class={`skz-comments-counter ${classModifier}`}>
		{comments.length}
	</p>
{/if}
