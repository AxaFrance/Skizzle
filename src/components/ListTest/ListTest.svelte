<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
  import { getDateStr, getLabelsFrom } from 'shared/utils';
  import AccountTitle from "components/AccountTitle";
  import type { CustomListType, PullRequestType } from "models/skizzle";
  import { customLists, pullRequests, repositories, settings } from 'shared/stores/default.store';
  import Icons from 'components/icons';
  import TagInput from 'components/TagInput';
  import { onMount,  } from 'svelte';
  import { client } from 'shared/stores/authentication.store';

  let resetSettings = {
    name : '',
    tags: []
  } as CustomListType;

	export let onDone: () => void;
  export let customList: CustomListType = resetSettings;

  onMount(() => {
    if (!customList) {
      updateSettings(customList);
    }
  })

  const saveSettings = () => {
    updateSettings({
      ...customList,
      id: uuidv4(),
      hiddenPullRequestsIds: hiddenPullRequestsIds
    });

    onDone();
  }

  const updateSettings = (list: CustomListType) => {
    customLists.update(x => {
      const exist = ({ id }: CustomListType) => list.id === id;

      if (!x.some(exist)) {
        x = [...x, list];
      } else {
        x[x.indexOf(x.find(exist))] = list;
      }

      console.log({ x });

      return x;
    })
  }

  const toggle = (pullRequest: PullRequestType) => {
    if (hiddenPullRequestsIds.includes(pullRequest.pullRequestId)) {
      hiddenPullRequestsIds = hiddenPullRequestsIds
        .filter(pullRequestId => pullRequestId !== pullRequest.pullRequestId)
    } else {
      hiddenPullRequestsIds = [...hiddenPullRequestsIds, pullRequest.pullRequestId]
    }
  }

  const getTags = (event: CustomEvent<{ tags: string[] }>) => {
    customList.tags = event.detail.tags;
  }

  $: hiddenPullRequestsIds = [] as string[];
  $: pullRequestsList = $pullRequests
  .filter(pr => !customList.provider || customList.provider === pr.provider)
  .filter(pr => !customList.repositoryId || customList.repositoryId === pr.repositoryId)
  .filter(pr => customList.tags.length === 0 || customList.tags.some(x => (pr.labels ?? []).some(y => y.name === x))) as PullRequestType[];
</script>

<div class="list">
  <div class="form">
    <div>
      <AccountTitle>
        <p class="title">
          {customList?.id ? 'Création d\'une nouvelle liste' : 'Modification de la liste'}
        </p>
      </AccountTitle>
      <div class="fields">
        <div class="left">
          <label>
            <span>Nom :</span>
            <input type="text" bind:value={customList.name}/>
          </label>
          <TagInput 
            id="tags" 
            label="Afficher les pull request contenant les tags :" 
            suggestions={getLabelsFrom(pullRequestsList)}
            on:tags={event => getTags(event)}
          />
          <label>
            <span>Afficher les pull requests de ce provider :</span>
            <select bind:value={customList.provider} id="providers">
              <option value="">-- Selectionner un service de provider --</option>
              {#each Object.keys($client) as key}
                <option value={key}>
                  {key}
                </option>
              {/each}
            </select>
          </label>
          <label>
            <span>Afficher les pull requests de ce repository :</span>
            <select bind:value={customList.repositoryId} id="repositories">
              <option value="">-- Selectionner un repository --</option>
              {#each $repositories as repository}
                <option value={repository.repositoryId}>
                  {repository.name}
                </option>
              {/each}
            </select>
          </label>
          <span>Masquer les pull requests :</span>
          <label>
            <input type="checkbox" bind:checked={customList.withoutOwnedByUserPR}/>
            <span>Que j’ai créé</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutOldPR}/>
            <span>Datant de plus de 30 jours</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutConflict}/>
            <span>En conflit</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutDraft}/>
            <span>En brouillon</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutCheckedByOwner}/>
            <span>Sur lesquelle je suis déjà intervenu(e)</span>
          </label>
        </div>
        <div class="right">
          <span>Pull Requests masquées manuellement</span>
          <ul>
            {#each pullRequestsList as pullRequest}
              <li>
                <button on:click={() => toggle(pullRequest)} title="{pullRequest.title} - {getDateStr(new Date(pullRequest.date))}">
                  {#if pullRequestsList.some(({ pullRequestId }) => pullRequestId === pullRequest.pullRequestId)}
                    <Icons.Visibility color={$settings.theme}/>
                  {:else}
                    <Icons.VisibilityOff color={$settings.theme}/>
                  {/if}
                  <span> {pullRequest.title} <small>- {getDateStr(new Date(pullRequest.date))}</small></span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <div class="action">
      <button>Annuler</button>
      <button type="submit" on:click={() => saveSettings()}>Enregistrer</button>
    </div>
  </div>
</div>

<style>
  .title {
    display: flex;
    flex-direction: column;
  }

  .list {
    height: 100%;
    overflow: auto;
  }

  .list > .form {
    background-color: #6B6B6B;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    border-radius: 4px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }

  span {
    line-height: 1.5rem;
  }

  .form > div {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .fields {
    display: flex;

    .left {
      display: flex;
      padding-right: 1rem;
      flex-direction: column;
      width: 100%;
    }

    .right {
      width: 50%;
      display: flex;
      flex-direction: column;
      flex: 0 1 auto;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    background-color: #5C5C5C;
    padding: 1rem;
    flex-direction: row !important;
    flex: 0 1 auto;
  }
  

  label {
    display: flex;
    padding-bottom: 1rem;
    flex-direction: column;
  }

  select {
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
    background: #848484;
    color: #fff;
	}

  button {
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
    color: #fff;
    margin-right: 0.5rem;
	}

	button:hover {
		opacity: 0.5;
	}

  ul {
    list-style: none;
    background-color: #848484;
    border-radius: 4px;
    padding: 1rem;
  }

  ul li {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  li > button {
    display: flex;
    align-items: center;

    > span {
      margin-left: 0.5rem;
    }
  }

  [type='text'] {
    background: #848484;
    border-radius: 4px;
    border: 0;
    padding: 0.5rem;
    color: #fff;
  }

  [type='submit'] {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	[type='submit']:disabled {
		opacity: 0.5;
	}
</style>