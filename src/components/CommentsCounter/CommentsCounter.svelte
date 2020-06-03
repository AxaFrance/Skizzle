<script>
  export let comments = [];
  export let hasResponse;

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
</script>

<style src="./CommentsCounter.scss">

</style>

{#if isDisplayed}
  <p class={`skz-comments-counter ${classModifier}`}>{comments.length}</p>
{/if}
