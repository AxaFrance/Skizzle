<script>
  import Modal from '../Modal.svelte';
  import Loader from '../../Loader';
    const { shell } = require('electron');

  import {
    getTime,
    getFile,
    getAvatarUrl,
    updateCommentsWithUsername,
  } from './PullRequestModal.utils';

  import { othersProfile } from '../../../shared/store';

  export let commentsGroup;
  export let organizationName;
  export let pullRequest;

    const openUrl = () => shell.openExternal(pullRequest.url);

</script>

<style src="./PullRequestModal.scss">

</style>

<Modal>
<div slot="header" >
  <h1 class="skz-PrModal__title">{pullRequest.title}</h1>
  <p class="skz-PrModal__link"on:click={openUrl}>Voir sur Azure</p>
</div>
  <div class="skz-PrModal">
    {#await updateCommentsWithUsername(commentsGroup, othersProfile)}
      <Loader />
    {:then}
      {#each commentsGroup as commentGroup}
        <h2 class="skz-PrModal__title">{getFile(commentGroup)}</h2>
        {#each commentGroup.comments as comment, index}
          <div class="skz-PrModal-section">
            <div class="skz-PrModal-section-comments">
              <div class="skz-PrModal-section-comments__avatar">
                {#await getAvatarUrl(comment.author, organizationName)}
                  <img
                    class="skz-PrModal-section-comments__avatar"
                    alt={comment.author.displayName}
                    src="./assets/user.svg" />
                {:then avatar}
                  <img
                    class="skz-PrModal-section-comments__avatar"
                    alt={comment.author.displayName}
                    src="data:image/jpeg;base64,{avatar.value}" />
                {:catch error}
                  <img
                    class="skz-PrModal-section-comments__avatar"
                    alt={comment.author.displayName}
                    src="./assets/user.svg" />
                {/await}
              </div>
              <div class="skz-PrModal-section-comments__details">
                <h2 class="skz-PrModal-section-comments__author">
                  {comment.author.displayName} - {getTime(comment.lastUpdatedDate)}
                </h2>
                <p class="skz-PrModal-section-comments__repo">
                  {comment.content}
                </p>
              </div>

            </div>
            <div
              class={`skz-PrModal-section__separator${commentGroup.comments.length === 0 || index === commentGroup.comments.length - 1 ? '--hide' : ''}`} />
          </div>
        {/each}
        {:else}
          <p class="skz-PrModal__title">Pas de commentaire disponible sur cette pull request</p>
      {/each}
    {/await}
  </div>
</Modal>
